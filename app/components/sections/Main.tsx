import { about } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import MainAnimated from "./MainAnimated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    *[_type == "about"]{
        tagline
      }[0]
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function Main() {
    const data:about = await getData();
    return <MainAnimated tagline={data.tagline} />;
  }
