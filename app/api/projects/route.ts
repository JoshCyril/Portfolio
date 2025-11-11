import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/lib/sanity';
import { simpleProject } from '@/app/lib/interface';

export const revalidate = 30; // revalidate at most 30 sec

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    const query = `
      *[_type == "project"]|order(pDate desc)[${offset}...${offset + limit}]{
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
        "tagCount": 0
      }
    `;

    const data: simpleProject[] = await client.fetch(query);

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
