import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        d="M6 18 18 6m0 8V6h-8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowNarrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="M16.667 10H3.333M8.333 5l-5 5 5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowNarrowRightIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="M3.333 10h13.334M11.667 5l5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bold pointer that marks the hovered project on wide screens. */
export function PointerIcon(props: IconProps) {
  return (
    <svg {...base} width={36} height={25} viewBox="0 0 36 25" {...props}>
      <path
        d="M3 12.5h30m-9.5 9.5 9.5-9.5L23.5 3"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <rect x={2.5} y={4.5} width={15} height={11} rx={2} stroke="currentColor" strokeWidth={1.5} />
      <path d="m3 5.5 7 5 7-5" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="m4.5 10.5 3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pen with a scribble ("edit-04" in the Figma icon set). */
export function SignIcon(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        d="M21 18L19.9999 19.094C19.4695 19.6741 18.7502 20 18.0002 20C17.2501 20 16.5308 19.6741 16.0004 19.094C15.4692 18.5151 14.75 18.1901 14.0002 18.1901C13.2504 18.1901 12.5312 18.5151 12 19.094M3.00003 20H4.67457C5.16375 20 5.40834 20 5.63852 19.9447C5.84259 19.8957 6.03768 19.8149 6.21662 19.7053C6.41846 19.5816 6.59141 19.4086 6.93731 19.0627L19.5001 6.49999C20.3285 5.67156 20.3285 4.32842 19.5001 3.49999C18.6716 2.67156 17.3285 2.67156 16.5001 3.49999L3.93729 16.0627C3.59138 16.4086 3.41843 16.5816 3.29475 16.7834C3.18509 16.9624 3.10428 17.1575 3.05529 17.3615C3.00003 17.5917 3.00003 17.8363 3.00003 18.3255V20Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="M18.3333 8.33333C18.3333 8.33333 16.6625 6.05685 15.3051 4.69854C13.9478 3.34022 12.072 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C13.4192 17.5 16.3041 15.2119 17.2069 12.0833M13.3333 8.33333H18.3333V3.33333"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="M14.167 5.833 5.833 14.167m0-8.334 8.334 8.334"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path
        d="M7.5 12l3 3 6-6M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const line16 = { stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function ListIcon(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} viewBox="0 0 16 16" {...props}>
      <path d="M14 8H6m8-4H6m8 8H6" {...line16} />
      <circle cx={2.667} cy={4} r={0.667} {...line16} />
      <circle cx={2.667} cy={8} r={0.667} {...line16} />
      <circle cx={2.667} cy={12} r={0.667} {...line16} />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} viewBox="0 0 16 16" {...props}>
      <rect x={2} y={2} width={4.667} height={4.667} rx={1} {...line16} />
      <rect x={9.333} y={2} width={4.667} height={4.667} rx={1} {...line16} />
      <rect x={2} y={9.333} width={4.667} height={4.667} rx={1} {...line16} />
      <rect x={9.333} y={9.333} width={4.667} height={4.667} rx={1} {...line16} />
    </svg>
  );
}

/** Two overlapping squares ("copy-05" in the Figma icon set). */
export function StackIcon(props: IconProps) {
  return (
    <svg {...base} width={16} height={16} viewBox="0 0 16 16" {...props}>
      <path
        d="M5.333 10.667v1.866c0 .747 0 1.12.146 1.406.127.25.331.455.582.582.285.146.659.146 1.406.146h5.066c.747 0 1.12 0 1.406-.146.25-.127.455-.331.582-.582.146-.285.146-.659.146-1.406V7.467c0-.747 0-1.12-.146-1.406a1.333 1.333 0 0 0-.582-.582c-.285-.146-.659-.146-1.406-.146h-1.866M3.467 10.667h5.066c.747 0 1.12 0 1.406-.146.25-.127.455-.331.582-.582.146-.285.146-.659.146-1.406V3.467c0-.747 0-1.12-.146-1.406a1.333 1.333 0 0 0-.582-.582c-.285-.146-.659-.146-1.406-.146H3.467c-.747 0-1.12 0-1.406.146-.25.127-.455.331-.582.582-.146.285-.146.659-.146 1.406v5.066c0 .747 0 1.12.146 1.406.127.25.331.455.582.582.285.146.659.146 1.406.146Z"
        {...line16}
      />
    </svg>
  );
}

export function DotsIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      {[4.167, 10, 15.833].map((cx) => (
        <circle key={cx} cx={cx} cy={10} r={0.833} stroke="currentColor" strokeWidth={2} />
      ))}
    </svg>
  );
}

export function ZoomInIcon(props: IconProps) {
  return (
    <svg {...base} width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        d="m17.5 17.5-3.625-3.625M9.167 6.667v5m-2.5-2.5h5m4.166 0a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WinkIcon(props: IconProps) {
  return (
    <svg {...base} width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={12} cy={12} r={9} />
        <path d="M8.5 9.5v.5" />
        <path d="M14 10c.6-.7 1.9-.7 2.5 0" />
        <path d="M8 14.5c1 1.3 2.4 2 4 2s3-.7 4-2" />
      </g>
    </svg>
  );
}

export function BimixLogo(props: IconProps) {
  return (
    <svg {...base} width={19} height={26} viewBox="0 0 18.8186 26" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2584 4.20135H14.8203L9.63396 12.9272L14.9068 21.7985H10.3149L7.22965 16.5719L3.9337 22.5177V26H14.9068L18.8186 21.7986V4.2014L14.9068 0H3.9337V3.33675L7.35298 9.08967L10.2584 4.2014V4.20135ZM1.71985 1.95414C2.66979 1.95414 3.43976 2.7241 3.43976 3.67404C3.43976 4.62383 2.66979 5.3939 1.71985 5.3939C0.770017 5.3939 0 4.62383 0 3.67404C0 2.7241 0.770017 1.95414 1.71985 1.95414ZM0.954099 19.8408L5.06772 12.9346L0.954099 6.01366V19.8408Z"
      />
    </svg>
  );
}
