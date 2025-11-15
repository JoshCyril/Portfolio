import { AboutContent } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import MainAnimated from "./MainAnimated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    *[_type == "about"]{
        tagline
      }[0]
    `;

    const data = await client.fetch<AboutContent | null>(query);
    return data;
}

export default async function Main() {
    const data = await getData();
    return <MainAnimated tagline={data?.tagline ?? ''} />;
  }
