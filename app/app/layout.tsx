import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const anton = localFont({
  src: "../public/fonts/Anton-Regular.woff2",
  variable: "--font-anton",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

const nunito = localFont({
  src: "../public/fonts/NunitoSans-Variable.woff2",
  variable: "--font-nunito",
  weight: "200 900",
  style: "normal",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Roamy — ton voyage, planifié pour toi",
    template: "%s · Roamy",
  },
  description:
    "Réponds à 6 questions, laisse Roamy faire le reste. Un itinéraire de voyage sur mesure, jour par jour, dans ta boîte mail en quelques minutes.",
  applicationName: "Roamy",
  authors: [{ name: "Roamy" }],
  keywords: [
    "voyage",
    "itinéraire",
    "roadbook",
    "planificateur de voyage",
    "IA",
    "vacances",
    "city trip",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: appUrl,
    siteName: "Roamy",
    title: "Roamy — ton voyage, planifié pour toi",
    description:
      "Un roadbook sur mesure, jour par jour, généré pour toi. Prêt à partir en 3 minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Roamy — ton voyage, planifié pour toi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Roamy — ton voyage, planifié pour toi",
    description: "Ton copilote vacances, 100 % sur-mesure.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${nunito.variable}`}>
      <body>
        <a
          href="#contenu"
          className="bg-prune text-cream sr-only z-[100] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
