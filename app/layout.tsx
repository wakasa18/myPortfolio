import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./profile-update.css";
import "./premium-polish.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sean-villanueva-portfolio.capstones2026.chatgpt.site"),
  title: "Sean Villanueva — Web Developer",
  description: "Sean Villanueva, a junior web developer and BSIS student in Bulacan, Philippines. View his Pharxmaco pharmacy system project, PHP and CodeIgniter 3 experience, education, and contact details.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: { title: "Sean Villanueva — Web Developer", description: "Junior web developer in Bulacan. PHP, CodeIgniter 3, MySQL, and the Pharxmaco pharmacy system project.", type: "website" },
  twitter: { card: "summary", title: "Sean Villanueva — Web Developer", description: "Junior web developer. PHP, CodeIgniter 3, MySQL, and practical web applications." },
};

export const viewport: Viewport = { themeColor: "#0b1120", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
