import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

import { Header } from "./components/index"

export default function IndexPage() {
  return (
    <>
      <Header />

      <section className=" h-1/2 flex  justify-center flex-col items-center gap-3  my-auto ">
        <div className=" max-w-[980px] grid content-center  gap-3  ">
          <div className="text-3xl font-extrabold text-center leading-tight tracking-tighter md:text-4xl ">
            <h1>A Template for Next.js</h1>
            <h1>Built with Radix UI and Tailwind CSS.</h1>
          </div>
          <p className="max-w-[700px] text-lg text-center text-muted-foreground">
            For agile developers .
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center ">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </section>
    </>
  )
}
