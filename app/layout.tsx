import type { Metadata } from "next";
import { Geist, Geist_Mono, Sacramento } from "next/font/google";
import { ConsentimentoCookies } from "@/components/ConsentimentoCookies";
import { Footer } from "@/components/Footer";
import { COTA_GRATIS_POR_CONTA } from "@/lib/cobranca/config";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const sacramento = Sacramento({
    variable: "--font-sacramento",
    subsets: ["latin"],
    weight: "400",
});

const TITLE =
    "AvalIA Discursiva | Correção Personalizada pela Banca do Seu Concurso";
const DESCRIPTION =
    `Correção de questões discursivas com IA, seguindo os critérios da banca do seu concurso (Cebraspe, FGV, FCC, Cesgranrio e outras). Comece com ${COTA_GRATIS_POR_CONTA} correções grátis.`;

export const metadata: Metadata = {
    // Base das URLs absolutas de Open Graph/Twitter (imagem de compartilhamento).
    metadataBase: new URL("https://www.avaliadiscursiva.com.br"),
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
                  className={`${geistSans.variable} ${geistMono.variable} ${sacramento.variable} h-full scroll-smooth antialiased`}
                >
                <body className="min-h-full flex flex-col">
                  {/* Pixel da Meta só depois do consentimento (LGPD) */}
                  <ConsentimentoCookies />
                  {children}
                        <Footer />
                </body>
          </html>
        );
}
