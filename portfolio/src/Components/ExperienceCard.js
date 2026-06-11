import React from 'react'
import { motion } from 'framer-motion'

function ExperienceCard({ logo, company, title, period, techStack, bullets }) {
  return (
    <article className='flex flex-shrink-0 flex-col max-w-xs md:max-w-3xl items-center justify-center bg-[#292929] rounded-2xl shadow-[0_0_10px_gray] px-10 py-5 md:p-16 border-t-2 border-[#38BDF8]/40'>
      <motion.img
        initial={{ y: -100, opacity: 0 }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='m-3 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover object-center ring-2 ring-[#38BDF8]/30'
        src={logo}
        alt={company}
      />

      <div className='max-w-2xl'>
        <h4 className='text-3xl sm:text-4xl font-light text-center'>{company}</h4>
        <p className='font-bold text-xl sm:text-2xl mt-1 text-center'>{title}</p>
        <div className='flex space-x-2 my-2 justify-center'>
          {techStack.map((tech, i) => (
            <img
              key={i}
              className='h-10 w-10 md:h-12 md:w-12 rounded-full hover:scale-110 transition-transform duration-200'
              src={tech.src}
              alt={tech.alt}
            />
          ))}
        </div>
        <p className='uppercase py-3 sm:py-4 text-[#38BDF8] text-sm tracking-wider text-center'>{period}</p>
        <ul className='list-disc space-y-2 ml-5 text-xs md:text-base text-justify text-gray-400'>
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    </article>
  )
}

export default ExperienceCard
