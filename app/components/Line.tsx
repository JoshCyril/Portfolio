export default function Line() {
    return (
      <div className="grid place-items-center">
          <div className="fixed top-0 z-0 grid h-screen w-11/12 max-w-screen-2xl grid-cols-1 place-items-center border-x-2 border-solid border-sky-500 border-opacity-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="custom-border h-full w-full"></div>
              <div className="custom-border hidden h-full w-full sm:hidden md:hidden lg:block"></div>
              <div className="custom-border hidden h-full w-full sm:hidden md:block lg:block"></div>
              <div className="hidden h-full w-full sm:block md:block lg:block"></div>
          </div>
      </div>
    );
  }