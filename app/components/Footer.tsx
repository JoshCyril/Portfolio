import { footerData } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import FooterAnimated from "./FooterAnimated";

export const revalidate = 30 // revalidate at most 30 sec
async function getData(){
  const query = `
  *[_type == "about"]{ copyright,udDate }[0]
  `;

  const data = await client.fetch(query);
  return data;
}

export default async function Footer() {
  const data:footerData = await getData();
  return <FooterAnimated data={data} />;
}
