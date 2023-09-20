import "@testing-library/jest-dom"

import React from "react"
import { render, screen } from "@testing-library/react"

import { MainNav } from "../main-nav"

describe("MainNav", () => {
  it("renders the logo and name", () => {
    render(<MainNav />)

    const links = screen.queryAllByRole("link")

    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe("Next.js")
    expect(links[0]).toBeInTheDocument()
  })

  it("renders navigation items", () => {
    const items = [
      { title: "Item 1", href: "/item1" },
      { title: "Item 2", href: "/item2" },
      { title: "Item 3", href: "/item3" },
    ]
    render(<MainNav items={items} />)

    items.forEach((item) => {
      const link = screen.getByText(item.title)
      expect(link).toBeInTheDocument()
      expect(link.textContent).toBe(item.title)
    })
  })
  it("disables disabled navigation items", () => {
    const items = [
      { title: "Item 1", href: "/item1" },
      { title: "Item 2", href: "/item2", disabled: true },
      { title: "Item 3", href: "/item3" },
    ]
    render(<MainNav items={items} />)

    const disabledLink = screen.getByText("Item 2")
    expect(disabledLink).toBeInTheDocument()
    expect(disabledLink.textContent).toBe("Item 2")
    expect(disabledLink).toHaveClass(
      "flex items-center text-sm font-medium text-muted-foreground"
    )
  })

  it("does not render navigation when items prop is empty", () => {
    render(<MainNav items={[]} />)

    const links = screen.queryAllByRole("link")

    expect(links).toHaveLength(1)
    expect(links[0].textContent).toBe("Next.js")
  })
})
