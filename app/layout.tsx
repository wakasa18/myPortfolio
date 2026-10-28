import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./profile-update.css";
import "./premium-polish.css";
import "./mobile-polish.css";
import "./header-cta.css";
import "./work-showcase.css";
import "./about-editorial.css";
import { IntroLoader } from "@/components/ui/intro-loader";

export const metadata: Metadata = {
  metadataBase: new URL("https://sean-villanueva-portfolio.capstones2026.chatgpt.site"),
  title: "Sean Villanueva — Web Developer",
  description: "Sean Villanueva, a junior web developer and BSIS student in Santa Maria, Bulacan, Philippines. View his Pharxmaco pharmacy system project, PHP and CodeIgniter 4 experience, education, and contact details.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: { title: "Sean Villanueva — Web Developer", description: "Junior web developer in Santa Maria, Bulacan, Philippines. PHP, CodeIgniter 4, MySQL, and the Pharxmaco pharmacy system project.", type: "website" },
  twitter: { card: "summary", title: "Sean Villanueva — Web Developer", description: "Junior web developer. PHP, CodeIgniter 4, MySQL, and practical web applications." },
};

export const viewport: Viewport = { themeColor: "#0b1120", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /></head><body><noscript><style>{".intro{display:none!important}"}</style></noscript><IntroLoader />{children}</body></html>;
}
