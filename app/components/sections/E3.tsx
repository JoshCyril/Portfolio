import { Ee3 } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import E3Animated from "./E3Animated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    {
        "exp":*[_type == "experience"]{
            title,
            yoe,
            content,
            company{
            name,
            location,
            url,
            Img
            }
        },
        "edu":*[_type == "education"]{
        title,
        uni{
            name,
            location,
            url,
            Img
            }
        }

    }
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function E3(){
    const data:Ee3 = await getData();
    return <E3Animated data={data} />;
}
