import ProjectDetailAnimated from "@/app/components/ProjectDetailAnimated";
import { FullProject } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import { notFound } from "next/navigation";

export const revalidate = 30; // revalidate at most 30 sec

async function getData(slug: string) {
  const query = `
    *[_type == "project" && slug.current == $slug][0]{
      title,
      proImg,
      summary,
      content,
      proDate,
      "slug": slug.current,
      "links": links[]{
        title,
        description,
        url
      },
      gallery[]{asset},
      "tags": tags[]->{
        title,
        tagImg
      } | order(title asc)
    }
  `;

  return client.fetch<FullProject | null>(query, { slug });
}

export default async function ProjectRoute({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);

  if (!data) {
    notFound();
  }

  return <ProjectDetailAnimated data={data} />;
}
