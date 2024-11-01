//import { JetBrains_Mono as FontMono } from "next/font/google"
import { JetBrains_Mono as FontMono, Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export { geistSans, geistMono, fontMono, fontSans }
