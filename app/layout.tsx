import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider"
import { AnimationProvider } from "./lib/animations-context";
import LoadingScreen from "./components/LoadingScreen";
import ScrollProgress from "./components/animations/ScrollProgress";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Line from "./components/Line";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JoshCyril | Portfolio",
  description: "Joshua Prem Cyril's personal portfolio created in nextjs, tailwindcss, and sanity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <AnimationProvider>
      <LoadingScreen/>
      <ScrollProgress/>
      <div data-navbar>
        <Navbar/>
      </div>
      <PageTransition>
        {children}
      </PageTransition>
      <Line/>
      <div data-footer>
        <Footer/>
      </div>
      </AnimationProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
