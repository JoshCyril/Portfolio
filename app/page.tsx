import Projects from "./components/Projects";
import Main from "./components/sections/Main";
import About from "./components/sections/About";
import E3 from "./components/sections/E3";

export default function Home() {
  return (
    <div className="">
      <Main/>
      <Projects/>
      <About/>
      <E3/>
    </div>
  );
}
