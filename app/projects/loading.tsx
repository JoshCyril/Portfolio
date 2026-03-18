export default function LoadingProjectsPage() {
  return (
    <div className="mb-10 grid h-fit place-items-center py-6 md:mt-28">
      <div className="z-10 w-11/12 max-w-screen-2xl">
        <div className="relative col-span-4 mb-4 ml-3 flex w-full basis-full items-center py-2">
          <div className="absolute -ml-[13px] h-full w-1 rounded-3xl bg-primary/40 animate-pulse" />
          <div className="h-8 w-48 rounded-lg bg-muted/40 animate-pulse" />
        </div>

        <div className="px-3">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="h-10 flex-1 min-w-[200px] rounded-lg bg-muted/30 animate-pulse" />
            <div className="h-10 w-32 rounded-lg bg-muted/30 animate-pulse" />
            <div className="h-10 w-32 rounded-lg bg-muted/30 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-wrap py-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="basis-full p-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <div className="rounded-lg border border-border/40 bg-background/80 p-4 shadow-sm">
                <div className="h-40 w-full rounded-lg bg-muted/40 animate-pulse" />
                <div className="mt-6 space-y-3">
                  <div className="h-5 w-3/4 rounded-full bg-muted/50 animate-pulse" />
                  <div className="h-4 w-full rounded-full bg-muted/40 animate-pulse" />
                  <div className="h-4 w-5/6 rounded-full bg-muted/30 animate-pulse" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="h-10 rounded-md bg-muted/40 animate-pulse" />
                  <div className="h-10 rounded-md bg-muted/30 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
