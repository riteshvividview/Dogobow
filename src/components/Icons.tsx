import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({
  size = 20,
  children,
  strokeWidth = 1.5,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const PawIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <ellipse cx="5.5" cy="11" rx="1.9" ry="2.5" />
    <ellipse cx="10" cy="6.6" rx="1.9" ry="2.6" />
    <ellipse cx="15.2" cy="6.6" rx="1.9" ry="2.6" />
    <ellipse cx="19.4" cy="11" rx="1.9" ry="2.5" />
    <path d="M12.6 11.5c-3.3 0-6.6 2.6-6.6 5.6 0 2 1.7 3.2 3.6 3.2 1.4 0 2.1-.6 3-.6s1.6.6 3 .6c1.9 0 3.6-1.2 3.6-3.2 0-3-3.3-5.6-6.6-5.6z" />
  </svg>
)

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)
export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
)
export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
)
export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
)
export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </Svg>
)
export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.35-9.5-8.8C.8 8 2 4.5 5.5 4c2-.28 3.7.8 4.9 2.4C11.6 4.8 13.3 3.72 15.3 4c3.5.5 4.7 4 3 7.2C19 15.65 12 20 12 20Z" />
  </Svg>
)
export const BagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 8h12l1 12H5L6 8Z" />
    <path d="M9 8V6.500a3 3 0 0 1 6 0V8" />
  </Svg>
)
export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)
export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const PlayIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M8 5.500v13a.6.6 0 0 0 .9.5l10.500-6.500a.6.6 0 0 0 0-1L8.900 5a.6.6 0 0 0-.9.500Z" />
  </svg>
)
export const StarIcon = ({ size = 16, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M12 2.500l2.900 6 6.600.9-4.800 4.600 1.200 6.500L12 17.400l-5.900 3.100 1.200-6.500L2.500 9.400l6.600-.9L12 2.500Z" />
  </svg>
)
export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.500 4.500 4.500L19 7.500" />
  </Svg>
)
export const ShieldCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.500c0 4.400 3 7.700 7 9.500 4-1.800 7-5.100 7-9.500V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)
export const TruckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 6.500h11v10H2zM13 10h4l3.500 3v3.500H13" />
    <circle cx="6.500" cy="18" r="1.800" />
    <circle cx="17" cy="18" r="1.800" />
  </Svg>
)
export const HeadsetIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <path d="M4 14h3v5H4zM17 14h3v5h-3z" />
    <path d="M20 19c0 1.500-2 2-4 2h-2" />
  </Svg>
)
export const ScissorsIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M20 4 8.100 15.900M14.500 14.500 20 20M8.100 8.100 12 12" />
  </Svg>
)
export const RulerIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3 17 14-14 4 4L7 21l-4-4Z" />
    <path d="m7 13 2 2M10 10l2 2M13 7l2 2" />
  </Svg>
)
export const ShirtIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 3 3.500 6 5.500 9.500 8 8.500V21h8V8.500l2.500 1L20.500 6 16 3c-.6 1.600-2 2.500-4 2.500S8.600 4.600 8 3Z" />
  </Svg>
)
export const CollarIcon = (p: IconProps) => (
  <Svg {...p}>
    <ellipse cx="12" cy="9.500" rx="8" ry="4" />
    <path d="M12 13.500V16" />
    <circle cx="12" cy="18.500" r="2.300" />
  </Svg>
)
export const LeashIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="17.500" r="3" />
    <path d="M8.500 15.500C12 12 11 8 16.500 6.500l3.500.5" />
    <path d="M17 4v5" />
  </Svg>
)
export const BowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 12 3.500 7v10L12 12Zm0 0 8.500-5v10L12 12Z" />
    <circle cx="12" cy="12" r="1.800" />
  </Svg>
)
export const BedIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18" />
    <path d="M6 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
  </Svg>
)
export const BowlIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 11h18a9 9 0 0 1-18 0Z" />
    <path d="M8 20.500h8M8 8l.5-1.500M12 7V5M16 8l-.5-1.500" />
  </Svg>
)
export const SparkleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3 1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3ZM19 14l.8 2.200L22 17l-2.200.8L19 20l-.8-2.200L16 17l2.200-.8L19 14Z" />
  </Svg>
)
export const GiftIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M5 12v8h14v-8M12 8v12" />
    <path d="M12 8C10 8 8 7 8 5.500S9.500 3.500 10.500 4.500 12 8 12 8Zm0 0c2 0 4-1 4-2.500s-1.500-2-2.500-1S12 8 12 8Z" />
  </Svg>
)
export const QuoteIcon = ({ size = 28, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path d="M9.500 6C6.500 7 4 9.500 4 13.500V18h6v-6H7c0-2 1-3.500 3-4.200L9.500 6Zm10 0c-3 1-5.500 3.500-5.500 7.500V18h6v-6h-3c0-2 1-3.500 3-4.200L19.500 6Z" />
  </svg>
)
export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-6 7-11.500a7 7 0 0 0-14 0C5 15 12 21 12 21Z" />
    <circle cx="12" cy="9.500" r="2.500" />
  </Svg>
)
export const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.500" y="3.500" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.200" cy="6.800" r=".6" fill="currentColor" />
  </Svg>
)
export const FacebookIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.500 8.500H17V5h-2.800A3.700 3.700 0 0 0 10.500 8.700V11H8v3.500h2.500V21H14v-6.500h2.800l.5-3.500H14V9.200c0-.5.300-.7.500-.7Z" />
  </Svg>
)
export const YoutubeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.500" y="5.500" width="19" height="13" rx="4" />
    <path d="m10.500 9.500 4 2.500-4 2.500v-5Z" />
  </Svg>
)
export const PinterestIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10.800 17.500 12 11a2.200 2.200 0 1 1 2 3" />
  </Svg>
)
export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Svg>
)
export const PauseIcon = ({ size = 20, ...rest }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <rect x="6" y="5" width="4.2" height="14" rx="1.2" />
    <rect x="13.8" y="5" width="4.2" height="14" rx="1.2" />
  </svg>
)
export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </Svg>
)
export const ListIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="4.5" width="18" height="3.5" rx="1" />
    <rect x="3" y="10.25" width="18" height="3.5" rx="1" />
    <rect x="3" y="16" width="18" height="3.5" rx="1" />
  </Svg>
)
export const SlidersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 6h10M18 6h2M4 18h2M10 18h10" />
    <circle cx="16" cy="6" r="2.2" />
    <circle cx="8" cy="18" r="2.2" />
  </Svg>
)
export const PercentIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 5 5 19" />
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="17" cy="17" r="2.5" />
  </Svg>
)
