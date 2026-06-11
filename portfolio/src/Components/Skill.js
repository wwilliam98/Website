import React from 'react'
import { motion } from 'framer-motion'

function Skill({ logo, name, proficiency }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className='group relative flex flex-col items-center cursor-pointer p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#38BDF8]/60 hover:shadow-[0_0_18px_#38BDF833] hover:scale-110 transition-all duration-300 ease-in-out'
    >
      <img
        className='w-14 h-14 md:w-16 md:h-16 rounded-xl object-contain'
        src={logo}
        alt={name}
      />
      <p className='mt-2 text-[10px] md:text-xs uppercase tracking-wider text-gray-500 group-hover:text-[#38BDF8] transition-colors duration-300'>
        {name}
      </p>
      <span className='absolute top-1 right-2 text-[9px] font-bold text-gray-600 group-hover:text-[#38BDF8]/80 transition-colors duration-300'>
        {proficiency}%
      </span>
    </motion.div>
  )
}

export default Skill
