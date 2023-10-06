// test-utils.tsx
import React, { ReactElement } from "react"
import { render, RenderOptions, RenderResult } from "@testing-library/react"
import { ThemeProvider } from "next-themes"

interface TestProviderOptions {
  theme?: string
}

interface CustomOptions extends RenderOptions, TestProviderOptions {}

/* eslint-disable */
const createTestProviders =
  ({ theme = "dark" }: TestProviderOptions): React.FC =>
  ({ children }: React.PropsWithChildren) => (
    <ThemeProvider defaultTheme={theme} enableSystem={false} attribute="class">
      {children}
    </ThemeProvider>
  )

const customRender = (
  ui: ReactElement,
  { theme, ...options }: CustomOptions = {}
): RenderResult =>
  render(ui, { wrapper: createTestProviders({ theme }), ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
