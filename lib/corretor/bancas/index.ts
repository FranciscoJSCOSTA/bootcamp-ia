import type { BancaConfig } from "../types";
import { accessConfig } from "./access";
import { aocpConfig } from "./aocp";
import { cebraspeConfig } from "./cebraspe";
import { cesgranrioConfig } from "./cesgranrio";
import { consulpamConfig } from "./consulpam";
import { consulplanConfig } from "./consulplan";
import { faurgsConfig } from "./faurgs";
import { fccConfig } from "./fcc";
import { fepeseConfig } from "./fepese";
import { fgvConfig } from "./fgv";
import { fundatecConfig } from "./fundatec";
import { iadesConfig } from "./iades";
import { ibadeConfig } from "./ibade";
import { ibamConfig } from "./ibam";
import { ibfcConfig } from "./ibfc";
import { idecanConfig } from "./idecan";
import { idibConfig } from "./idib";
import { nossorumoConfig } from "./nossorumo";
import { quadrixConfig } from "./quadrix";
import { vunespConfig } from "./vunesp";

// Novas bancas entram aqui, cada uma com seu próprio arquivo de config,
// seguindo o padrão de cebraspe.ts / fgv.ts / fcc.ts / cesgranrio.ts / vunesp.ts / aocp.ts / ibfc.ts / idecan.ts / consulplan.ts / quadrix.ts / iades.ts / access.ts / fundatec.ts / ibade.ts / fepese.ts / faurgs.ts / idib.ts / consulpam.ts / ibam.ts / nossorumo.ts.
const BANCAS: Record<string, BancaConfig> = {
  cebraspe: cebraspeConfig,
  fgv: fgvConfig,
  fcc: fccConfig,
  cesgranrio: cesgranrioConfig,
  vunesp: vunespConfig,
  aocp: aocpConfig,
  ibfc: ibfcConfig,
  idecan: idecanConfig,
  consulplan: consulplanConfig,
  quadrix: quadrixConfig,
  iades: iadesConfig,
  access: accessConfig,
  fundatec: fundatecConfig,
  ibade: ibadeConfig,
  fepese: fepeseConfig,
  faurgs: faurgsConfig,
  idib: idibConfig,
  consulpam: consulpamConfig,
  ibam: ibamConfig,
  nossorumo: nossorumoConfig,
};

export function getBancaConfig(id: string): BancaConfig {
  const banca = BANCAS[id];
  if (!banca) {
    throw new Error(`Banca "${id}" não configurada.`);
  }
  return banca;
}

// Pra popular o seletor de banca na UI.
export const BANCAS_DISPONIVEIS: { id: string; nome: string }[] = Object.values(
  BANCAS,
).map((b) => ({ id: b.id, nome: b.nome }));
