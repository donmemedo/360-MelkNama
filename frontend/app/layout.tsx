import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "ملک‌نما ۳۶۰ | MelkNama 360",
  description:
    "پلتفرم معامله‌محور املاک: قیمت شفاف محله، آگهی تاییدشده، بازدید ۳۶۰ درجه و مشاور دارای مجوز.",
  manifest: "/manifest.webmanifest",
  applicationName: "MelkNama 360",
  appleWebApp: { capable: true, title: "MelkNama 360", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07080f" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const noFlash = `(function(){try{var t=localStorage.getItem('mn-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var l=localStorage.getItem('mn-locale')||'fa';var e=document.documentElement;e.dataset.theme=t;e.lang=l;e.dir=l==='fa'?'rtl':'ltr';}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="grain min-h-screen antialiased">
        <div className="mesh" />
        <Providers>
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
