import { Metadata, Viewport } from "next"

export type SiteType = {
  metadata: Metadata
  language: string
  links: Record<string, string>
  viewport: Viewport
}
