import { SiteType } from "@/models"

export const siteConfig: SiteType = {
  language: "pt-br",
  links: {
    github: "https://github.com/FelipeMiiller/nextjs-template",
    docs: "https://nextjs.org/docs",
  },
  metadata: {
    title: {
      default: "Felipe Miiller - Next.js 14 Template",
      template: "%s | Next.js",
    },
    description: "Template for Next.js 14 with Tailwind CSS.",
    keywords: ["Next.js", "Tailwind CSS", "TypeScript", "React", "Shadcn UI"],
    authors: [
      {
        name: "Felipe Miiller",
        url: "https://github.com/FelipeMiiller",
      },
    ],
    creator: "Felipe Miiller",
    applicationName: "Next.js Template",
  },
  viewport: {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
  },
}
