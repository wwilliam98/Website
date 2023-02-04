import React from 'react'
import { motion } from 'framer-motion'
import Cover from "../Images/pass-photo09Oct2022.jpeg"

function Skill() {
  return (
    <div className='group relative flex cursor-pointer'>
        <motion.img
            initial={{
                x: -200,
                opacity: 0
            }}
            transition={{ duration: 1}}
            whileInView={{ opacity: 1, x: 0}}
            viewport={{ once:true }}
            className="rounded-full border border-gray-500 object-cover w-20 h-20 md:w-24 md:h-24 xl:w-28 xl:h-28 filter group-hover:grayscale duration-300 ease-in-out"
            src={Cover}            
        />
        <div className='absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white w-20 h-20 md:w-24 md:h-24 xl:w-28 xl:h-28 rounded-full z-0'>
            <div className='flex items-center justify-center h-full'>
                <p className='text-3xl font-bold text-black opacity-100'>100%</p>
            </div>
        </div>
    </div>
  )
}

export default Skill