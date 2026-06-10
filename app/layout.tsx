import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnalyticsTracker from "./components/AnalyticsTracker";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moncv.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MonCV - Créateur de CV professionnel en ligne",
    template: "%s | MonCV",
  },
  description:
    "Créez un CV professionnel en ligne avec des modèles gratuits, premium et une génération par prompt IA. Export PDF rapide, moderne et prêt à envoyer.",
  applicationName: "MonCV",
  keywords: [
    "créateur de CV",
    "CV en ligne",
    "modèle CV gratuit",
    "CV professionnel",
    "générateur de CV IA",
    "faire un CV PDF",
    "CV Côte d'Ivoire",
    "CV Afrique francophone",
  ],
  authors: [{ name: "MonCV" }],
  creator: "MonCV",
  publisher: "MonCV",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "MonCV",
    title: "MonCV - Créateur de CV professionnel en ligne",
    description:
      "Générez, personnalisez et téléchargez un CV professionnel en PDF avec des modèles gratuits, premium et IA.",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "MonCV - Créateur de CV professionnel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MonCV - Créateur de CV professionnel en ligne",
    description:
      "Créez un CV moderne en quelques minutes avec modèles gratuits, premium et génération IA.",
    images: ["/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="sunset">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
