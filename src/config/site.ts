export type HomeConfig = typeof homeConfig

export const homeConfig = {
  name: "Next.js",
  description: "Template for Next.js 13 with Tailwind CSS.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Tasks",
      href: "/tasks",
    },
  ],
  links: {
    github: "https://github.com/FelipeMiiller/nextjs-template",
  },
}
