import type { ComponentType, SVGProps } from 'react'
import {
  BedIcon,
  BowIcon,
  BowlIcon,
  GiftIcon,
  ShieldCheck,
  LeashIcon,
  RulerIcon,
  ScissorsIcon,
  ShirtIcon,
  SparkleIcon,
  TruckIcon,
} from '../components/Icons'
import type { SlotName } from '../components/Media'

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

export const navLinks = [
  { label: 'Home', active: true },
  { label: 'Shop', chevron: true, menu: 'shop' as const },
  { label: 'Collections', chevron: true, menu: 'collections' as const },
  { label: 'Occasions' },
  { label: 'Our Story' },
  { label: 'Journal' },
]

export interface Category {
  slug: string
  title: string
  lines: [string, string?]
  blurb: string
  icon: Icon
  heroSlot: SlotName
  showcaseSlot: SlotName
  tint: string
}

export const categories: Category[] = [
  {
    slug: 'couture-clothing',
    title: 'Couture & Clothing',
    lines: ['Couture &', 'Clothing'],
    blurb: 'Tuxedos, sherwanis, hoodies & raincoats cut for swagger.',
    icon: ShirtIcon,
    heroSlot: 'Couture-and-Clothing',
    showcaseSlot: 'couture-clothing',
    tint: 'from-ember/25',
  },
  {
    slug: 'walking-essentials',
    title: 'Walking Essentials',
    lines: ['Walking', 'Essentials'],
    blurb: 'Collars, leashes & harnesses built for every adventure.',
    icon: LeashIcon,
    heroSlot: 'Walking-Essentials',
    showcaseSlot: 'Walking-ess',
    tint: 'from-gold/25',
  },
  {
    slug: 'bandanas-bows',
    title: 'Bandanas & Bows',
    lines: ['Bandanas', '& Bows'],
    blurb: 'The finishing flourish, knotted just right.',
    icon: BowIcon,
    heroSlot: 'Bandanas-and-Bows',
    showcaseSlot: 'bandanas-bows',
    tint: 'from-moss/60',
  },
  {
    slug: 'beds-lounge',
    title: 'Beds & Lounge',
    lines: ['Beds &', 'Lounge'],
    blurb: 'Crown beds to sofa beds — sleep like royalty.',
    icon: BedIcon,
    heroSlot: 'Beds-and-Lounge',
    showcaseSlot: 'Beds-Lounge',
    tint: 'from-gold-soft/20',
  },
  {
    slug: 'pet-food',
    title: 'Pet Food',
    lines: ['Pet Food', undefined],
    blurb: 'Wholesome bowls for stronger, happier dogs.',
    icon: BowlIcon,
    heroSlot: 'Pet-food',
    showcaseSlot: 'food-pet',
    tint: 'from-ember/20',
  },
  {
    slug: 'personalize-me',
    title: 'Personalize Me',
    lines: ['Personalize', 'Me'],
    blurb: 'Their name, stitched into every last detail.',
    icon: SparkleIcon,
    heroSlot: 'Personalize-me-image',
    showcaseSlot: 'personalize',
    tint: 'from-gold/30',
  },
]

export const showcaseCategories = [
  ...categories.map((c) => ({
    title: c.title,
    blurb: c.blurb,
    icon: c.icon,
    slot: c.showcaseSlot,
    slug: c.slug as string | undefined,
  })),
  {
    title: 'The Festive Edit',
    blurb: 'Diwali, Rakhi, Christmas — every celebration covered.',
    icon: GiftIcon,
    slot: 'festive-edit' as SlotName,
    slug: undefined,
  },
]

export const garments = [
  'Sherwani & Kurta',
  'Tuxedos',
  'Polo Tees',
  'Dungarees',
  'Hoodies',
  'Neck Tutus',
  'Raincoats',
  'Winter Wear',
]

export const promises: Array<{ label: string; icon: Icon }> = [
  { label: 'Handcrafted in Hyderabad', icon: ScissorsIcon },
  { label: 'Breed-perfect size charts', icon: RulerIcon },
  { label: 'Fast & reliable shipping', icon: TruckIcon },
]

export interface Product {
  slot: SlotName
  hoverSlot: SlotName
  category: string
  name: string
  price: number
  was?: number
  badge?: string
  sizes: string
}

export const products: Product[] = [
  {
    slot: 'collar-product',
    hoverSlot: 'collar-product-onhover',
    category: 'Walking Essentials',
    name: 'Aztec Print Collar',
    price: 699,
    badge: 'Bestseller',
    sizes: 'S · M · L',
  },
  {
    slot: 'Aqua Strip Tuxedo Vest Bandana',
    hoverSlot: 'Aqua Strip Tuxedo Vest Bandana onhover',
    category: 'Bandanas & Bows',
    name: 'Aqua Strip Tuxedo Vest Bandana',
    price: 449,
    badge: 'New',
    sizes: 'XS · S · M',
  },
  {
    slot: 'Army Green Body Suit Raincoat',
    hoverSlot: 'Army Green Body Suit Raincoat onhover',
    category: 'Couture & Clothing',
    name: 'Army Green Body Suit Raincoat',
    price: 1599,
    was: 2285,
    badge: '30% Off',
    sizes: 'S · M · L · XL',
  },
  {
    slot: 'Aztec Print H-Harness',
    hoverSlot: 'Aztec Print H-Harness onhover',
    category: 'Walking Essentials',
    name: 'Aztec Print H-Harness',
    price: 1200,
    sizes: 'S · M · L',
  },
]

export const occasions = [
  {
    name: 'Diwali Essentials',
    tag: 'Festival Ready',
    blurb: 'Zari, silk & sparkle for the festival of lights.',
    slot: 'Diwali-essentials' as SlotName,
  },
  {
    name: 'Rakhi Collection',
    tag: 'Sibling Love',
    blurb: 'Because siblings come with paws too.',
    slot: 'rakhi-collection' as SlotName,
  },
  {
    name: 'Christmas Cheer',
    tag: 'Merry & Bright',
    blurb: 'Red, green & endlessly merry.',
    slot: 'christmas-collection' as SlotName,
  },
  {
    name: 'Halloween Howl',
    tag: 'Spooky Cute',
    blurb: 'Spooky-cute looks for the howliest night.',
    slot: 'halloween-collection' as SlotName,
  },
  {
    name: 'Birthday Bash',
    tag: 'Party Mode',
    blurb: 'Bark-day outfits worthy of a party hat.',
    slot: 'Birthday-essentials' as SlotName,
  },
  {
    name: 'IPL Fever',
    tag: 'Match Ready',
    blurb: 'Team colours for the loudest fan in the house.',
    slot: 'IPL-collection' as SlotName,
  },
]

export const chapters = [
  {
    no: '01',
    word: 'Trust',
    title: 'Built on Trust',
    body: 'Every seam is hand-checked and every fabric dog-tested. When you choose Dogobow, you get peace of mind stitched right in.',
    slot: '1st-card' as SlotName,
  },
  {
    no: '02',
    word: 'Adventure',
    title: 'Made for Adventure',
    body: 'Monsoon puddles, festival nights or a weekend trail — our gear is cut to move with the dogs who love to explore.',
    slot: '2nd-card' as SlotName,
  },
  {
    no: '03',
    word: 'Happiness',
    title: 'Measured in Happiness',
    body: 'We don’t count sales. We count wagging tails, midnight zoomies and the tiny victory dance at the front door.',
    slot: '3rd-card' as SlotName,
  },
]

export const reviews = [
  {
    name: 'Priya S.',
    dog: 'Bruno’s mom',
    text: 'Bruno wore the sherwani to Diwali and stole every single photo. The stitching is unreal.',
    slot: 'testinomial' as SlotName,
  },
  {
    name: 'Rahul K.',
    dog: 'Cooper’s dad',
    text: 'The crown bed is his new throne. He hasn’t left it in three days. Best purchase, ever.',
    slot: 'testinomial (1)' as SlotName,
  },
  {
    name: 'Ananya M.',
    dog: 'Mocha’s mom',
    text: 'That Aztec collar and leash combo is gorgeous — and it survived our monsoon walks.',
    slot: 'testinomial (2)' as SlotName,
  },
  {
    name: 'Vikram T.',
    dog: 'Zeus’s dad',
    text: 'Ordered the raincoat on Monday, was puddle-jumping in style by Thursday.',
    slot: 'review-4' as SlotName,
  },
]

export const stats = [
  { value: 10, suffix: 'K+', label: 'Happy customers' },
  { value: 6, suffix: '+', label: 'Festive collections' },
  { value: 5, suffix: '-day', label: 'Easy returns' },
  { value: 10, suffix: '-day', label: 'Exchange window' },
]

export const trust: Array<{ title: string; body: string; icon: Icon }> = [
  {
    title: 'Handcrafted Quality',
    body: 'Cut and stitched by hand, finished with care.',
    icon: ScissorsIcon,
  },
  {
    title: 'Breed-Perfect Fit',
    body: 'Detailed size charts with breed examples.',
    icon: RulerIcon,
  },
  {
    title: 'Fast & Reliable Shipping',
    body: 'Free shipping over ₹799, delivered worldwide.',
    icon: TruckIcon,
  },
  {
    title: 'Easy Returns',
    body: '5-day returns and 10-day exchange, no fuss.',
    icon: ShieldCheck,
  },
]

export const footerColumns = [
  {
    heading: 'Shop',
    links: [
      'All Products',
      'Best Sellers',
      'Couture & Clothing',
      'Walking Essentials',
      'Beds & Lounge',
      'Personalize Me',
    ],
  },
  {
    heading: 'Company',
    links: ['About Us', 'Our Story', 'Our Stores', 'Journal', 'Careers', 'Contact'],
  },
  {
    heading: 'Support',
    links: [
      'Help Center',
      'Shipping & Delivery',
      'Returns & Exchanges',
      'Size Guide',
      'Track Your Order',
      'FAQs',
    ],
  },
]

export const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`
