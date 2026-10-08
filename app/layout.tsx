import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";

const kumbhSans = Kumbh_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-kumbh-sans", display: "swap" });

const siteName = "FAQ accordion card";
const siteUrl = "https://faq-accordion-card-fm.royeradames.com/";
const title = "FAQ accordion card | Royer Adames";
const description = "Five account and billing questions in an accordion card, rebuilt from the Frontend Mentor FAQ accordion card design.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/images/favicon-32x32.png" },
  openGraph: { type: "website", siteName, title, description, url: siteUrl },
};

const webSite = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={kumbhSans.variable}><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }} /></body></html>;
}
