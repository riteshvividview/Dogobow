import { useRef } from 'react'
import Navbar from '../components/Navbar'
import { useSiteAnimations } from '../hooks/useSiteAnimations'
import Hero from '../sections/Hero'
import Atelier from '../sections/Atelier'
import FeaturedProducts from '../sections/FeaturedProducts'
import CategoryShowcase from '../sections/CategoryShowcase'
import OccasionEdit from '../sections/OccasionEdit'
import BrandStory from '../sections/BrandStory'
import Stories from '../sections/Stories'
import NewsletterFooter from '../sections/NewsletterFooter'

export default function Home() {
  const main = useRef<HTMLElement>(null)
  useSiteAnimations(main)

  return (
    <>
      <Navbar />
      <main ref={main}>
        <Hero />
        <Atelier />
        <FeaturedProducts />
        <CategoryShowcase />
        <OccasionEdit />
        <BrandStory />
        <Stories />
        <NewsletterFooter />
      </main>
    </>
  )
}
