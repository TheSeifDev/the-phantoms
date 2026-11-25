import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Montserrat,
  IBM_Plex_Sans_Arabic,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Footer } from "@/components/layout/Footer";
import { JP_CHARS } from "@/lib/jp";
import { site } from "@/data/site";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
});
const sub = Montserrat({
  subsets: ["latin"],
  variable: "--font-sub-src",
  display: "swap",
});
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ar-src",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Phantoms — Built in the shadows. Felt everywhere.",
    template: "%s — Phantoms",
  },
  description: site.description,
  openGraph: {
    title: "Phantoms — Product team from Alexandria",
    description: site.description,
    type: "website",
    images: ["/og.jpg"],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

// Japanese display font — tiny subset (only the glyphs the site uses)
const jpFont = `https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@700&display=swap&text=${encodeURIComponent(JP_CHARS)}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sub.variable} ${arabic.variable} ${serif.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={jpFont} />
        {/* returning visitors skip the preloader without a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('ph-seen')){document.documentElement.setAttribute('data-seen','1')}}catch(e){}",
          }}
        />
        <style>{`html[data-seen] .preloader{display:none!important}`}</style>
      </head>
      <body>
        <Providers footer={<Footer />}>{children}</Providers>
      </body>
    </html>
  );
}
