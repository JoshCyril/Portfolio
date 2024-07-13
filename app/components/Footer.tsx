import { Copyright } from "lucide-react";
import { footerData } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
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
  const timeAgo = new TimeAgo('en-US')
    return (
      <div className="relative grid h-fit place-items-center">
        <div className="sticky bottom-0 left-0 z-10 w-11/12 max-w-screen-2xl">
          <div className="flex h-20 w-full flex-wrap items-center justify-around gap-4 rounded-t-xl bg-background bg-gradient-to-r from-primary/10 to-primary/20 p-4 text-base md:flex-col">
            <div className="font-regular flex items-center gap-1 text-sm font-bold tracking-wide"><Copyright size={16}/>
            {data.copyright}
            </div>

            <div className="font-regular text-sm font-semibold">Updated: <span className="font-normal">
            {timeAgo.format(new Date(data.udDate))}
              </span> </div>
          </div>
          <div className="h-24 w-full bg-background bg-gradient-to-r from-primary/10 to-primary/20 sm:h-24 md:h-0"></div>
        </div>
      </div>
    );
  }