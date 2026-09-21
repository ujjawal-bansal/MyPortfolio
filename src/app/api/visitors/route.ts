import { recordVisit } from "@/lib/visitors";

/**
 * POST /api/visitors — record this visitor, return the all-time unique total.
 *
 * POST rather than GET on purpose. A GET with a side effect gets fetched by link
 * previewers, prefetchers and anything that crawls the page, every one of which would
 * count as a visitor. POST is not speculatively fetched.
 *
 * `force-dynamic` because everything else on this site is statically prerendered, and a
 * route that reads request headers must not be.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const { count, skipped } = await recordVisit(request.headers);

  return Response.json(
    { count, skipped },
    {
      headers: {
        // Never cached anywhere: the response depends on who is asking.
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}
