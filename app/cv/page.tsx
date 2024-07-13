import { cvPDF } from "@/app/lib/interface";
import { client } from "@/app/lib/sanity";

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
  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-24">

        <div className="z-10 w-11/12 max-w-screen-2xl">

            <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
                <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary"></div>
                <span className="flex text-2xl font-bold md:text-3xl">Curriculum Vitae</span>
            </div>

            <div className="relative mb-2 mt-0 basis-full rounded-lg p-3">             
              <div className="relative h-full basis-full rounded-lg bg-secondary shadow-sm">
                {/* <embed src={`https://cdn.sanity.io/files/99rn9hgb/production/91c687e4c0bf04624f96ad0640888fc673cc35ba.pdf`} type="application/pdf" className="h-screen w-full rounded-lg"/> */}
                <embed src={data.fileURL} type="application/pdf" className="h-screen w-full rounded-lg"/>
                
              </div>  
            </div>
        </div>
    </div>
  );
}
