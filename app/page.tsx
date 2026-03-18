import Projects from "./components/Projects";
import Main from "./components/sections/Main";
import About from "./components/sections/About";
import E3 from "./components/sections/E3";

export default function Home() {
  return (
    <div className="">
      <div data-main>
        <Main/>
      </div>
      <div data-projects>
        <Projects/>
      </div>
      <div data-about>
        <About/>
      </div>
      <div data-e3>
        <E3/>
      </div>
    </div>
  );
}
