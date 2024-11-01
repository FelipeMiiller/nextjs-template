/* eslint-disable react/no-unknown-property */
import "@/styles/globals.css"

import React from "react"
import type { Metadata, Viewport } from "next"
import { fontSans, geistMono, geistSans } from "@/assets/fonts"
import { Analytics, TailwindIndicator, ThemeProvider } from "@/components"
import { siteConfig } from "@/config"
import { cn } from "@/utils/utils"

import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = siteConfig.metadata
export const viewport: Viewport = siteConfig.viewport

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <body
        className={cn(
          " antialiased",
          fontSans.variable,
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div vaul-drawer-wrapper="">
            <div className=" flex-1 flex min-h-screen flex-col  bg-background font-sans">
              {children}
            </div>
          </div>
          <TailwindIndicator />

          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
