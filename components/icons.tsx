type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function TargetIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v4.8l3 2" />
    </svg>
  );
}

export function ChartBarIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M5 19V11" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
    </svg>
  );
}

export function TrendingUpIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 16.5 10 10.5 13.5 14 20 7" />
      <path d="M14.5 7h5.5v5.5" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 4.5 13.4 9.6 18.5 11 13.4 12.4 12 17.5 10.6 12.4 5.5 11 10.6 9.6z" />
    </svg>
  );
}

export function ReportIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="5.5" y="3.5" width="13" height="17" rx="2" />
      <path d="M9 8h6" />
      <path d="M9 12h6" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 9 4.1-1.6 7-4.8 7-9V6z" />
      <path d="m9.2 12.2 2 2 3.6-4" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12.5 3 5.5 13.5h4.8L11 21l7-10.5h-4.8z" />
    </svg>
  );
}

export function ListChecksIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m4 6.5 1.5 1.5L8 5.5" />
      <path d="M11 6.5h9" />
      <path d="m4 12.5 1.5 1.5 2.5-2.5" />
      <path d="M11 12.5h9" />
      <path d="m4 18.5 1.5 1.5 2.5-2.5" />
      <path d="M11 18.5h9" />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5" />
    </svg>
  );
}

export function AlertCircleIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
