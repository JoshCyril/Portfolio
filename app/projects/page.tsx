import ProjectsPageAnimated from "../components/ProjectsPageAnimated";
import { SimpleProject, SkillTag } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import { cache } from "react";

export const revalidate = 30; // revalidate at most 30 sec

const PAGE_SIZE = 6;

const getProjects = cache(async (limit: number = PAGE_SIZE, offset: number = 0) => {
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

  return client.fetch<SimpleProject[]>(query, {
    start: offset,
    end: offset + limit,
  });
});

const getTags = cache(async () => {
  const query = `
    *[_type == "tag"]{
      "tag_name": title,
      "tag_url": tagImg,
      "tag_count": count(*[_type == "project" && references(^._id)])
    } | order(tag_count desc)
  `;
  const data = await client.fetch<SkillTag[]>(query);
  return data.filter((tag) => tag.tag_count > 0);
});

const getTotalCount = cache(async (): Promise<number> => {
  const query = `count(*[_type == "project"])`;
  return client.fetch<number>(query);
});

export default async function ProjectsPage() {
  const [initialProjects, totalCount, tags] = await Promise.all([
    getProjects(PAGE_SIZE, 0),
    getTotalCount(),
    getTags(),
  ]);

  return (
    <ProjectsPageAnimated
      initialProjects={initialProjects}
      totalCount={totalCount}
      tags={tags}
    />
  );
}
