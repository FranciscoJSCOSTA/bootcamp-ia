import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const caveat = Caveat({
    variable: "--font-caveat",
    subsets: ["latin"],
});

const TITLE =
    "AvalIA Discursiva | Correção Personalizada pela Banca do Seu Concurso";
const DESCRIPTION =
    "IA treinada nos critérios exatos da banca do seu concurso (Cebraspe, FGV, Cesgranrio e outras). Descubra os pontos que sua redação está perdendo, em minutos.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
          title: TITLE,
          description: DESCRIPTION,
          type: "website",
          locale: "pt_BR",
    },
    twitter: {
          card: "summary_large_image",
          title: TITLE,
          description: DESCRIPTION,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
          <html
                  lang="pt-BR"
                  className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full scroll-smooth antialiased`}
                >
                <body className="min-h-full flex flex-col">
                  {/* Meta Pixel Code */}
                        <Script id="meta-pixel" strategy="afterInteractive">
                          {`
                                      !function(f,b,e,v,n,t,s)
                                                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                                              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                                                          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                                                                      n.queue=[];t=b.createElement(e);t.async=!0;
                                                                                                  t.src=v;s=b.getElementsByTagName(e)[0];
                                                                                                              s.parentNode.insertBefore(t,s)}(window, document,'script',
                                                                                                                          'https://connect.facebook.net/en_US/fbevents.js');
                                                                                                                                      fbq('init', '1734390967903675');
                                                                                                                                                  fbq('track', 'PageView');
                                                                                                                                                            `}
                        </Script>
                        <noscript>
                                  <img
                                                height="1"
                                                width="1"
                                                style={{ display: "none" }}
                                                src="https://www.facebook.com/tr?id=1734390967903675&ev=PageView&noscript=1"
                                                alt=""
                                              />
                        </noscript>
                  {/* End Meta Pixel Code */}
                  {children}
                        <Footer />
                </body>
          </html>
        );
}
