import { cvPDF } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import CVPageAnimated from "../components/CVPageAnimated";

export const revalidate = 30 // revalidate at most 30 sec

async function getData(){
    const query = `
    *[_type == "about"]{
      "fileURL":pdfFile.asset->url
    }[0]
    `;

    const data = await client.fetch(query);
    return data;
}

export default async function Home() {
  const data:cvPDF = await getData();
  return <CVPageAnimated fileURL={data.fileURL} />;
}
