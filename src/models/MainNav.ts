import React from "react"

export type NavItem = {
  title: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
  external?: boolean
}

export type MainNavType = {
  mainNav: NavItem[]
}
