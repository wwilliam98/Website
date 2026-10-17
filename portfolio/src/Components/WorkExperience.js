import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import content from '../data/content.json'

import STLogo from "../Images/STMicroelectronicLogo.png"
import OpenSlotPic from "../Images/OpenSlot.png"

// Experience text lives in data/content.json (shared with the chat assistant)
const logos = { st: STLogo, openslot: OpenSlotPic }
const experiences = content.experiences.map((exp) => ({ ...exp, logo: logos[exp.logo] }))

function WorkExperience() {
  return (
    <div className='max-w-3xl mx-auto px-6 py-24 text-center'>
      <SectionHeading>Experience</SectionHeading>

      <div className='text-left border-l-2 border-[#38BDF8]/30 ml-4 md:ml-0'>
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='relative pl-8 pb-12 last:pb-0'
          >
            <span className='absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#38BDF8] ring-4 ring-gray-800' />

            <div className='flex items-center gap-3 flex-wrap'>
              <img
                src={exp.logo}
                alt={exp.company}
                loading="lazy"
                className='w-10 h-10 rounded-full object-cover bg-white'
              />
              <div>
                <h4 className='text-lg font-semibold leading-tight'>
                  {exp.title} <span className='text-gray-400 font-normal'>· {exp.company}</span>
                </h4>
                <p className='text-[#38BDF8] text-sm'>{exp.period}</p>
              </div>
            </div>

            <ul className='list-disc ml-5 mt-3 space-y-1.5 text-sm text-gray-300 leading-relaxed'>
              {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>

            <div className='flex flex-wrap gap-2 mt-3'>
              {exp.tags.map((tag) => (
                <span key={tag} className='text-xs px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20'>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WorkExperience
