"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";

// O Pixel da Meta só carrega DEPOIS que a pessoa aceita (LGPD, base legal de
// consentimento). A escolha fica no localStorage deste navegador; o link
// "Preferências de cookies" do rodapé reabre o aviso pra mudar de ideia.

const META_PIXEL_ID = "1734390967903675";
const CHAVE = "avalia-consentimento-cookies";
export const EVENTO_ABRIR_PREFERENCIAS = "avalia:abrir-preferencias-cookies";
const EVENTO_MUDOU = "avalia:consentimento-mudou";

type Escolha = "aceito" | "recusado" | null;

function lerEscolha(): Escolha {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

function gravarEscolha(escolha: Exclude<Escolha, null>): void {
  try {
    window.localStorage.setItem(CHAVE, escolha);
  } catch {
    // Armazenamento bloqueado: a escolha vale só nesta página.
  }
  window.dispatchEvent(new Event(EVENTO_MUDOU));
}

function assinar(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENTO_MUDOU, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENTO_MUDOU, callback);
  };
}

export function ConsentimentoCookies() {
  // No servidor ("servidor") não renderiza nada — nem aviso nem Pixel.
  const escolha = useSyncExternalStore<Escolha | "servidor">(assinar, lerEscolha, () => "servidor");
  const [reaberto, setReaberto] = useState(false);

  useEffect(() => {
    const abrir = () => setReaberto(true);
    window.addEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir);
  }, []);

  if (escolha === "servidor") return null;

  const aceitar = () => {
    gravarEscolha("aceito");
    setReaberto(false);
  };
  const recusar = () => {
    const tinhaAceitado = escolha === "aceito";
    gravarEscolha("recusado");
    setReaberto(false);
    // O script do Pixel já carregado não tem como ser descarregado: avisa a
    // Meta da revogação e recarrega a página, que volta sem o Pixel.
    if (tinhaAceitado) {
      const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
      fbq?.("consent", "revoke");
      window.location.reload();
    }
  };

  return (
    <>
      {escolha === "aceito" && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;
n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('consent','grant');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {(escolha === null || reaberto) && (
        <div
          role="dialog"
          aria-label="Preferências de cookies"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-lg sm:px-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">
              Usamos cookies essenciais para o login funcionar. Com a sua permissão, também usamos o
              Pixel da Meta para medir nossos anúncios.{" "}
              <Link href="/privacidade#cookies" className="text-indigo-600 underline">
                Saiba mais
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={recusar}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Recusar
              </button>
              <button
                type="button"
                onClick={aceitar}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BotaoPreferenciasCookies() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_PREFERENCIAS))}
      className="hover:text-indigo-600 hover:underline"
    >
      Preferências de cookies
    </button>
  );
}
