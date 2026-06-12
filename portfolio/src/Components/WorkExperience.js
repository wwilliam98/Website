import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'

import STLogo from "../Images/STMicroelectronicLogo.png"
import OpenSlotPic from "../Images/OpenSlot.png"

const experiences = [
  {
    logo: STLogo,
    company: 'STMicroelectronics',
    title: 'Software Engineer II',
    period: 'May 2024 – Present',
    tags: ['Python', 'OpenCV', 'YOLO', 'LSTM'],
    bullets: [
      'Designed and deployed AI applications for cross-functional teams using CNN architectures.',
      'Built AI-driven computer vision solutions with Raspberry Pi, Python, and YOLO, automating defect detection.',
      'Developed LSTM predictive models for Epitaxy gas flow planning, improving process efficiency and scheduling accuracy.',
      'Lead a 100-person AI community, running quarterly training on Python, ML, and computer vision.',
    ],
  },
  {
    logo: STLogo,
    company: 'STMicroelectronics',
    title: 'Software Engineer',
    period: 'May 2022 – April 2024',
    tags: ['Python', 'PHP', 'JavaScript', 'Perl', 'MySQL'],
    bullets: [
      'Designed RESTful APIs to integrate data across teams, improving system interoperability.',
      'Built and maintained PHP/MySQL websites for the Reticle Assembly Team.',
      'Migrated Excel data to MySQL with Python Pandas, streamlining data management.',
      'Visualized production statistics on internal websites using Pandas and Matplotlib.',
    ],
  },
  {
    logo: OpenSlotPic,
    company: 'OpenSlot Inc.',
    title: 'Quality Assurance',
    period: 'Summer 2018 & 2019',
    tags: ['JavaScript', 'HTML', 'Testing'],
    bullets: [
      'Identified and documented application faults, reducing defects by 50%.',
      'Designed test plans with doctors and dentists to align functionality with business needs.',
      'Provided usability and functionality recommendations that improved application features.',
    ],
  },
]

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
