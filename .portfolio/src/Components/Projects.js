import { motion } from 'framer-motion'
import React from 'react'
import Cover from "../Images/pass-photo09Oct2022.jpeg"

function Projects() {
    const projects = [1,2,3,4,5]
  return (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1}}
        transition={{ duration: 1.5}}
        // className='h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0'>
        className='flex flex-col w-full h-screen relative text-left overflow-hidden px-10 max-w-full items-center md:flex-col justify-evenly mx-auto'
    >
        <h3 className='top-16 uppercase tracking-[20px] text-gray-500 text-2xl'>
            Projects
        </h3>

        <div className='relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20'>
            {projects.map((project, i) => (
                // flex shrink 0 makes everything in one screen
                <div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-20 md:pd-44 h-screen'>
                    <img
                    src={Cover}
                    alt='testing'
                    />

                    <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
                        <h4 className='text-4xl font-semibold text-center'> 
                            <span className='underline decoration-[#F7Ab0A]/50'>Case Study {i+1} of {projects.length}:</span> UPS Clone
                        </h4>

                        <p className='text-lg text-center md:text-left'>
                            ajhsdlkjashdashdakshdalkshdjakshdlajshdlakdhaslkdhasdasdasdaaskldjhaskdkalsdhak
                        </p>
                    </div>
                </div>
            ))}
            {/* Projects */}
            {/* Projects */}
            {/* Projects */}
        </div>

        <div className='w-full absolute top-[30%] bg-[#030303]/10 left-0 h-[500px] -skew-y-12' />

    </motion.div>
  )
}

export default Projects