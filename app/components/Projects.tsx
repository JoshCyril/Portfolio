import ProjectsAnimated from "./ProjectsAnimated";
import { SimpleProject } from "../lib/interface";
import { client } from "../lib/sanity";

export const revalidate = 30; // revalidate at most 30 sec

async function getData() {
  const query = `
    *[_type == "project" && featured == true]{
      title,
      proImg,
      "link": links[0]{title,url},
      "slug": slug.current,
      description,
      proDate,
      "tags": tags[0...3]->{
        title,
        tagImg
      } | order(title asc),
      "tagCount": select(count(tags) > 3 => count(tags) - 3, 0)
    }
  `;

  return client.fetch<SimpleProject[]>(query);
}

export default async function Projects() {
  const data = await getData();
  return <ProjectsAnimated projects={data} />;
}
