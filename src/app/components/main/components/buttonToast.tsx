"use client"

import { useTheme } from "next-themes"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function ButtonToast() {
  const { setTheme, theme } = useTheme()
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Hello", {
          description: "Go to the settings to change the theme.",
          action: {
            label: "Dark Mode",
            onClick: () => setTheme(theme === "light" ? "dark" : "light"),
          },
        })
      }
    >
      Hi
    </Button>
  )
}
