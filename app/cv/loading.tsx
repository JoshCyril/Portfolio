export default function LoadingCVPage() {
  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-24">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary/40 animate-pulse" />
          <div className="h-8 w-56 rounded-lg bg-muted/40 animate-pulse" />
        </div>

        <div className="relative mb-2 mt-0 basis-full rounded-lg p-3">
          <div className="relative h-[75vh] w-full rounded-lg bg-secondary/60">
            <div className="absolute inset-0 flex flex-col gap-4 p-6">
              <div className="h-6 w-1/3 rounded-md bg-muted/30 animate-pulse" />
              <div className="flex-1 rounded-xl bg-muted/40 animate-pulse" />
              <div className="h-10 rounded-md bg-muted/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
