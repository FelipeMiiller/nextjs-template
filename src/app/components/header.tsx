import { homeConfig } from "@/config/site"

import { MainNav } from "."

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={homeConfig.mainNav} />
      </div>
    </header>
  )
}
