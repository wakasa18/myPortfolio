import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sean-villanueva-portfolio.brave-pond-7782.chatgpt.site"),
  title: "Sean Villanueva — Web Developer",
  description: "Thoughtful design. Clean code. A little unexpected. Explore Sean Villanueva’s web development portfolio, interface concepts, and creative experiments.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: { title: "Sean Villanueva — Web Developer", description: "A little logic. A lot of possibility. Thoughtful digital experiences by Sean Villanueva.", type: "website" },
  twitter: { card: "summary", title: "Sean Villanueva — Web Developer", description: "A little logic. A lot of possibility." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
