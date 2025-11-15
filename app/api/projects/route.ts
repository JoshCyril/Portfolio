import { NextRequest, NextResponse } from "next/server";

import { SimpleProject } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";

export const revalidate = 30; // revalidate at most 30 sec

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 24;

const sanitizeNumber = (value: string | null, fallback: number, min = 0) => {
  const parsed = value === null ? NaN : Number(value);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(min, parsed);
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = sanitizeNumber(searchParams.get("offset"), 0, 0);
    const requestedLimit = sanitizeNumber(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      1
    );
    const limit = Math.min(requestedLimit, MAX_LIMIT);
    const rangeEnd = offset + limit;

    const query = `
      *[_type == "project"] | order(pDate desc) [$start...$end]{
        title,
        proImg,
        "link": links[0]{title,url},
        "slug": slug.current,
        description,
        proDate,
        featured,
        "tags": tags[]->{
          title,
          tagImg
        },
        "tagCount": select(count(tags) > 3 => count(tags) - 3, 0)
      }
    `;

    const projects = await client.fetch<SimpleProject[]>(query, {
      start: offset,
      end: rangeEnd,
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
