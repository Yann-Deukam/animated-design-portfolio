import AboutContent from '@/components/AboutContent'
import AboutGallery from '@/components/AboutGallery'
import React from 'react'

const About = () => {
  return (
    <div className='h-dvh bg-green-100 text-neutral-900'>
      <AboutGallery />
      <AboutContent />
    </div>
  )
}

export default About