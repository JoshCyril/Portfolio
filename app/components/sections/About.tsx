import { AboutWithTags } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import AboutAnimated from "./AboutAnimated";

export const revalidate = 30 // revalidate at most 30 sec
async function getData(){
    const query = `
    {
    "about": *[_type == "about"]{ content },
    "tags": *[_type == "tag"]{
        "tag_name": title,
        "tag_url": tagImg,
        "tag_count": count(*[_type == "project" && references(^._id)])
        } | order(tag_name asc) | order(tag_count desc)
    }
    `;

    const data = await client.fetch<AboutWithTags>(query);
    return data;
}

export default async function About(){
    const data = await getData();
    return <AboutAnimated data={data} />;
}
