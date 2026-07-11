import { AlertCircleIcon, CheckCircleIcon } from "@/components/icons";

type Competency = {
  label: string;
  score: number;
  max: number;
};

type RaioXReportCardProps = {
  variant: "compact" | "full";
  score: number;
  maxScore: number;
  competencies: Competency[];
  strengths?: string[];
  weaknesses?: string[];
  suggestion?: string;
};

export function RaioXReportCard({
  variant,
  score,
  maxScore,
  competencies,
  strengths = [],
  weaknesses = [],
  suggestion,
}: RaioXReportCardProps) {
  const visibleCompetencies =
    variant === "compact" ? competencies.slice(0, 3) : competencies;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-xl sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          Exemplo ilustrativo
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
          Raio-X da Banca
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-indigo-600 sm:text-5xl">
          {score}
        </span>
        <span className="text-slate-500">
          / {maxScore} pontos (nota estimada)
        </span>
      </div>

      <div
        className={
          variant === "full"
            ? "mt-8 grid gap-8 sm:grid-cols-2"
            : "mt-8"
        }
      >
        <ul className="space-y-5">
          {visibleCompetencies.map((competency) => (
            <li key={competency.label}>
              <div className="flex items-center justify-between gap-4 text-sm sm:text-base">
                <span className="text-slate-700">{competency.label}</span>
                <span className="whitespace-nowrap font-semibold text-slate-900">
                  {competency.score}/{competency.max}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{
                    width: `${(competency.score / competency.max) * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        {variant === "full" && (
          <div className="space-y-5">
            {strengths.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Pontos fortes
                </p>
                <ul className="mt-2 space-y-2">
                  {strengths.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-slate-700 sm:text-base"
                    >
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {weaknesses.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  Pontos de atenção
                </p>
                <ul className="mt-2 space-y-2">
                  {weaknesses.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-slate-700 sm:text-base"
                    >
                      <AlertCircleIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {variant === "full" && suggestion && (
        <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Sugestão prática:</strong> {suggestion}
        </div>
      )}
    </div>
  );
}
