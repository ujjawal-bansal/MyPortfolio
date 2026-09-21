"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Spotify's own player, driven from the waveform.
 *
 * This is Spotify's iFrame API: the official embed, loaded into the page and controlled
 * over its documented interface — `loadUri`, `play`, `pause`, `resume`. Nothing is
 * downloaded, proxied or decoded here. The audio comes out of Spotify's iframe exactly
 * as it would if the card were on screen; the card is simply not the interface. The
 * waveform is.
 *
 * What a visitor hears is what the embed allows them: the full track if they are signed
 * in to Spotify in this browser, a thirty-second preview if not. That is Spotify's rule,
 * not this site's, and the waveform goes still when the preview ends.
 *
 * ## When a track will not start
 *
 * Two different things can leave a click on the waveform silent, and from out here they
 * look the same.
 *
 * The browser can refuse. Audio in a cross-origin frame needs a gesture; the click on the
 * waveform is one, and the embed Spotify creates carries `allow="autoplay"`, which hands it
 * over. That is enough in Chrome (checked, with a real click) but not in every browser.
 *
 * Or Spotify can be slow. A signed-out visitor gets thirty-second previews, and the embed
 * accepts `play()` and reports buffering straight away — then, for some tracks, stays
 * buffering. Observed, not guessed: one of the three current tracks took five seconds in
 * one run and more than nine in another, with autoplay forced on, so not the browser.
 *
 * Either way a waveform that ignores a click is worse than a card. So a requested track
 * that has not made a sound within a few seconds is `stalled`, and the section reveals
 * Spotify's own player — which either wants the press the browser is waiting for, or says
 * plainly that this one needs Spotify. Only actual sound stands the timer down; buffering
 * does not, because buffering forever is the second case.
 *
 * ## Why there is one player per track
 *
 * A click has to sound like pressing play, because that is what it replaces. Measured
 * from a click, a single player loaded on demand took three to four seconds the first time
 * — the script, then the iframe, then buffering — and around one and a half to switch
 * tracks, because `loadUri` reloads the embed before it will play. Pressing play on an
 * embed that is already loaded takes well under a second, and that is only buffering.
 *
 * So each of the three tracks gets its own embed, created as the section comes into view,
 * and a click only ever says `play()` to one that is already waiting. Switching pauses one
 * and plays another; nothing reloads. The cost is three hidden iframes for a visitor who
 * scrolls to the bottom — which is why it waits for them to get there, and why a visitor
 * who has asked their browser to save data gets the old behaviour instead: nothing loads
 * until they reach for a song.
 */

const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

/**
 * How long a requested track may stay silent before the real player is offered instead.
 * A healthy first click measured ~3–4s end to end, most of it creating the iframe; a later
 * one under a second. Six leaves room for a slow network without leaving anyone waiting on
 * a track that will never start.
 */
const STALLED_AFTER_MS = 6000;

interface PlaybackUpdate {
  data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number };
}

interface EmbedController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  resume(): void;
  /** In seconds, unlike every position the embed reports, which are milliseconds. */
  seek(seconds: number): void;
  destroy(): void;
  addListener(event: "ready", listener: () => void): void;
  addListener(event: "playback_update", listener: (event: PlaybackUpdate) => void): void;
}

interface IFrameAPI {
  createController(
    element: HTMLElement,
    options: { uri: string; width?: number | string; height?: number | string },
    callback: (controller: EmbedController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

/** One script tag per page, however many times it is asked for. */
let api: Promise<IFrameAPI> | null = null;

function loadApi(): Promise<IFrameAPI> {
  api ??= new Promise<IFrameAPI>((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => {
      // Forget the failure, so the next intent can try again rather than inheriting it.
      api = null;
      reject(new Error("Spotify iFrame API failed to load"));
    };
    document.body.appendChild(script);
  });
  return api;
}

const uriOf = (id: string) => `spotify:track:${id}`;

export interface PlayerState {
  /** The track being played, or last played. */
  current: string | null;
  playing: boolean;
  /** Asked to play and not yet sounding. */
  waiting: boolean;
  /** A requested track stayed silent too long; Spotify's own player should be shown. */
  stalled: boolean;
  /** Where the current track is, in ms, as of `reportedAt` (a `performance.now()` stamp). */
  position: number;
  /** Zero until Spotify has said — its first report of a track does not know yet. */
  duration: number;
  reportedAt: number;
}

const IDLE: PlayerState = {
  current: null,
  playing: false,
  waiting: false,
  stalled: false,
  position: 0,
  duration: 0,
  reportedAt: 0,
};

/** Within this of the end, pressing play again starts the track over rather than resuming nothing. */
const AT_END_MS = 1000;

/**
 * After a seek, how long a report that disagrees with it is treated as stale. Measured: a
 * position Spotify sent *before* it handled the seek can land after it, and drawing that
 * yanks the playhead back to where it was, then forward again a second later. A report
 * close to the target ends the window early; a real failure shows once it lapses.
 */
const SEEK_SETTLE_MS = 2000;
const SEEK_AGREES_MS = 1500;

/**
 * A report this close to the duration means the track has finished. Measured: at the end
 * of a preview Spotify reports `position === duration` and still says `isPaused: false`,
 * then goes quiet — it never announces a stop. The last report before that can be up to
 * a second early, so the margin is small enough not to mistake it for the end.
 */
const ENDED_WITHIN_MS = 250;

/** Fixed by the embed. Only matters on the rare occasion the player is shown. */
const EMBED_HEIGHT = 80;

interface Slot {
  embed: EmbedController | null;
  /** Wraps the embed, so it can be given height when it is the one being shown. */
  frame: HTMLDivElement;
}

function savingData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

export function useSpotifyPlayer(ids: readonly string[]) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const slots = useRef(new Map<string, Slot>());
  /** The visitor wants sound from `live.current.current`. Survives loading-time pauses. */
  const wantPlay = useRef(false);
  const stallTimer = useRef(0);
  /** The last seek, until Spotify's reports agree with it. See `SEEK_SETTLE_MS`. */
  const seeking = useRef<{ to: number; at: number } | null>(null);
  /**
   * True from the visitor pausing until they play again. A pause they did not make — the
   * track stopped by Spotify, or by the same account starting playback somewhere else —
   * means the song is over as far as this page is concerned, not merely paused.
   */
  const pausedByVisitor = useRef(false);
  const trackIds = useRef(ids);
  useEffect(() => {
    trackIds.current = ids;
  }, [ids]);

  const [state, setState] = useState<PlayerState>(IDLE);
  // Decisions in `toggle` need the state as it is now, not as of the last render.
  const live = useRef(state);
  const update = useCallback((patch: Partial<PlayerState>) => {
    live.current = { ...live.current, ...patch };
    setState(live.current);
  }, []);

  /**
   * Only the current track's embed has any height, so if the host is ever shown it shows
   * that one. The others stay loaded at zero height rather than `display: none`, which is
   * the state already proven to play.
   */
  const layout = useCallback(() => {
    for (const [id, slot] of slots.current) {
      slot.frame.style.height = id === live.current.current ? `${EMBED_HEIGHT}px` : "0px";
    }
  }, []);

  const clearStallTimer = useCallback(() => {
    window.clearTimeout(stallTimer.current);
    stallTimer.current = 0;
  }, []);

  const armStallTimer = useCallback(() => {
    clearStallTimer();
    stallTimer.current = window.setTimeout(() => {
      if (wantPlay.current && !live.current.playing) update({ stalled: true });
    }, STALLED_AFTER_MS);
  }, [clearStallTimer, update]);

  /**
   * Returns the section to rest after a track is over. The embed is rewound and paused
   * as well, so choosing the same song again starts it from the top rather than asking
   * a player that believes it is still at the end to play.
   */
  const finish = useCallback(
    (id: string) => {
      wantPlay.current = false;
      pausedByVisitor.current = false;
      seeking.current = null;
      clearStallTimer();

      const embed = slots.current.get(id)?.embed;
      embed?.pause();
      embed?.seek(0);

      update({
        current: null,
        playing: false,
        waiting: false,
        stalled: false,
        position: 0,
        duration: 0,
        reportedAt: performance.now(),
      });
      layout();
    },
    [clearStallTimer, layout, update],
  );

  /** Creates the embed for one track, once. Safe to call as often as intent is shown. */
  const ensure = useCallback(
    (id: string) => {
      const host = hostRef.current;
      if (!host || slots.current.has(id)) return;

      const frame = document.createElement("div");
      frame.style.height = "0px";
      frame.style.overflow = "hidden";
      host.appendChild(frame);
      const slot: Slot = { embed: null, frame };
      slots.current.set(id, slot);

      loadApi()
        .then((iframe) => {
          // createController *replaces* the element it is handed, so it gets a fresh child
          // rather than the frame, which this hook still needs to size.
          const mount = document.createElement("div");
          frame.appendChild(mount);

          iframe.createController(mount, { uri: uriOf(id), width: "100%", height: EMBED_HEIGHT }, (embed) => {
            slot.embed = embed;
            const isCurrent = () => live.current.current === id;

            embed.addListener("ready", () => {
              if (wantPlay.current && isCurrent()) embed.play();
            });

            embed.addListener("playback_update", ({ data }) => {
              // A paused neighbour reporting that it is paused is not news.
              if (!isCurrent()) return;

              // Finished, or stopped from outside: back to rest, not "paused". A paused
              // stretch stays lit with its cover and its scrubber so it can be resumed; a
              // finished one should look like the other two again.
              const ended = data.duration > 0 && data.position >= data.duration - ENDED_WITHIN_MS;
              const stoppedElsewhere = data.isPaused && !wantPlay.current && !pausedByVisitor.current;
              if (ended || stoppedElsewhere) {
                finish(id);
                return;
              }

              // Every report carries the position, so the scrubber is always as current
              // as Spotify is. Reports come about once a second while playing; the
              // scrubber carries itself forward between them.
              const stamp = performance.now();
              const pending = seeking.current;
              const stale =
                pending !== null &&
                stamp - pending.at < SEEK_SETTLE_MS &&
                Math.abs(data.position - pending.to) > SEEK_AGREES_MS;
              if (pending && !stale) seeking.current = null;
              // A stale report still says whether it is playing; only its position is wrong.
              const progress = stale
                ? { duration: data.duration }
                : { position: data.position, duration: data.duration, reportedAt: stamp };

              if (!data.isPaused) {
                // Unpaused-and-buffering arrives before any sound, and a waveform that
                // moves before the music does is lying about the one thing it shows. So it
                // counts as starting — and does not stand the stall timer down, because
                // some tracks stay buffering for a long time.
                if (data.isBuffering) {
                  update({ ...progress, waiting: true });
                  return;
                }
                clearStallTimer();
                wantPlay.current = false;
                update({ ...progress, playing: true, waiting: false, stalled: false });
                return;
              }
              // Paused while a start is still wanted is the embed loading, not stopping.
              update(
                wantPlay.current
                  ? { ...progress, playing: false }
                  : { ...progress, playing: false, waiting: false },
              );
            });

            // Clicked before it existed: it was created because of that click.
            if (wantPlay.current && isCurrent()) embed.play();
          });
        })
        .catch(() => {
          // Let a later intent try again, rather than inheriting the failure.
          slots.current.delete(id);
          frame.remove();
          if (live.current.current === id) {
            wantPlay.current = false;
            clearStallTimer();
            update({ waiting: false, playing: false });
          }
        });
    },
    [clearStallTimer, finish, update],
  );

  /** Called when the section is near: every track gets a player that is ready to play. */
  const preload = useCallback(() => {
    if (savingData()) return;
    for (const id of trackIds.current) ensure(id);
  }, [ensure]);

  /** Called on hover, focus or touch. Covers data-saver visitors, and anything missed. */
  const warm = useCallback((id: string) => ensure(id), [ensure]);

  /** Play a track, pause it if it is the one playing, resume it if it is the one paused. */
  const toggle = useCallback(
    (id: string) => {
      const now = live.current;

      if (now.current === id && (now.playing || now.waiting)) {
        wantPlay.current = false;
        pausedByVisitor.current = true;
        clearStallTimer();
        slots.current.get(id)?.embed?.pause();
        // Stopping also withdraws the fallback player: the visitor has changed their mind.
        update({ playing: false, waiting: false, stalled: false });
        return;
      }

      // One sound at a time. The neighbour's own "paused" report is ignored above.
      if (now.current && now.current !== id) slots.current.get(now.current)?.embed?.pause();

      pausedByVisitor.current = false;
      const resuming = now.current === id;
      // A different track starts with an unknown position; the same one keeps its place.
      const reset = resuming ? {} : { position: 0, duration: 0, reportedAt: performance.now() };
      wantPlay.current = true;
      update({ current: id, waiting: true, playing: false, stalled: false, ...reset });
      layout();
      armStallTimer();

      ensure(id);
      const embed = slots.current.get(id)?.embed;
      if (!embed) return; // still being created; its callback plays it

      if (resuming) {
        // A preview that ran out sits paused at its last frame; resuming that is silence.
        if (now.duration > 0 && now.position >= now.duration - AT_END_MS) {
          embed.seek(0);
          update({ position: 0, reportedAt: performance.now() });
        }
        embed.resume();
      } else {
        embed.play();
      }
    },
    [armStallTimer, clearStallTimer, ensure, layout, update],
  );

  /**
   * Moves the current track to `ms`. The position is updated here rather than waiting
   * for Spotify to confirm it, because — measured — a seek while paused produces no
   * report at all until playback resumes. Waiting would leave the playhead where it was.
   */
  const seek = useCallback(
    (id: string, ms: number) => {
      const now = live.current;
      if (now.current !== id) return;
      const embed = slots.current.get(id)?.embed;
      if (!embed) return;

      const to = Math.max(0, Math.min(ms, now.duration || ms));
      const stamp = performance.now();
      seeking.current = { to, at: stamp };
      embed.seek(to / 1000);
      update({ position: to, reportedAt: stamp });
    },
    [update],
  );

  useEffect(() => {
    const owned = slots.current;
    return () => {
      window.clearTimeout(stallTimer.current);
      for (const slot of owned.values()) slot.embed?.destroy();
      owned.clear();
    };
  }, []);

  return { hostRef, state, toggle, warm, preload, seek };
}
