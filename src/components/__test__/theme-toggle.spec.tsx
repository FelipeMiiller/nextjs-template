import "@testing-library/jest-dom"

import React from "react"
import { render, screen } from "@testing-library/react"
import { useTheme } from "next-themes"

import {
  fireEvent as fireEventProvider,
  render as renderProvider,
} from "@/components/__test__/test-utils"

import { ThemeToggle } from "../theme-toggle"

// test for  theme toggle  https://github.com/pacocoursey/next-themes/issues/21

describe("ThemeToggle", () => {
  let localStorageMock: { [key: string]: string } = {}

  beforeEach(() => {
    global.matchMedia = jest.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    global.Storage.prototype.getItem = jest.fn(
      (key: string) => localStorageMock[key]
    )
    global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value
    })

    localStorageMock = {}
  })

  const ThemeSpy: React.FC = () => {
    const { theme } = useTheme()
    return <span data-testid="theme-spy">{theme}</span>
  }

  it("should render a button", () => {
    render(<ThemeToggle />)

    const button = screen.getByRole("button")
    const svgs = button.querySelectorAll("svg")
    const span = button.querySelector("span")

    expect(button).toBeInTheDocument()
    expect(svgs).toHaveLength(2)
    expect(svgs[0]).toBeInTheDocument()
    expect(svgs[1]).toBeInTheDocument()
    expect(span).toBeInTheDocument()
  })
  it("toggles the theme", async () => {
    const { getByRole, getByTestId } = renderProvider(
      <>
        <ThemeToggle />
        <ThemeSpy />
      </>,
      { theme: "dark" }
    )
    const button = getByRole("button")
    const spy = getByTestId("theme-spy")

    fireEventProvider.click(button)

    expect(spy).toHaveTextContent("light")
  })
})
