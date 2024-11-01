import { mainNavConfig } from "@/config"

import { MainNav } from "./components/main-nav"

export function Header() {
  return (
    <header className="bg-background  w-full border-x-8 border-background ">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={mainNavConfig.mainNav} />
      </div>
    </header>
  )
}
