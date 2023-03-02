import React from 'react'
import { motion } from 'framer-motion'
import CoverPic from "../Images/pass-photo09Oct2022.jpeg"
import OpenSlotPic from "../Images/OpenSlot.png"

function ExperienceCard() {
  return (
    // <article className='flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-screen md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 hover:opacity-100 opacity-40 cursor-pointer transition-opacity duration-200 overflow-hidden'>
    <article className='flex flex-col rounded-lg items-center space-y-7 flex-shrink-0 w-screen md:w-[600px] xl:w-[900px] snap-center bg-[#292929] p-10 hover:opacity-100 opacity-40 cursor-pointer transition-opacity duration-200 overflow-x-scroll'>
        <motion.img
            initial={{
                y: -100,
                opactity: 0,
            }} 
            transition={{ duration: 1.2 }}
            whileInView={{ opacity: 1, y: 0}}
            viewport={{ once:true }}
            className='w-32 h-32 rounded-full object-cover object-center xl:w-[200px] xl:h-[200px]'
            src={OpenSlotPic}
        />

        <div className='px-5 md:px-10'>
            <h4 className='text-4xl font-light'>Quality Assurance</h4>
            <p className='font-bold text-2xl mt-1'>OpenSlot Inc.</p>
            <div className='flex space-x-2 my-1'>
                <img 
                    className='h-10 w-10 rounded-full'
                    src={CoverPic}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={CoverPic}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={CoverPic}
                    alt="Tech Used"
                />
                <img 
                    className='h-10 w-10 rounded-full'
                    src={CoverPic}
                    alt="Tech Used"
                />
            </div>
            <p className='uppercase py-5 text-gray-300'>Summer 2018, Summer 2019</p>
            <ul className='list-disc space-y-2 ml-5 text-lg text-justify'>
                <li>Collaborated with a team of developers to identify and document faults in the OpenSlot application, resulting in a 50% reduction in faults.</li>
                <li>Participate in code reviews and provide feedback on the quality of the code.</li>
                <li>Identified and documented problems with program function, output, and content to improve quality of product.</li>
                <li>Designed test plans and procedures with end users which are doctors and dentists by understanding and analyzing functionality of applications to fit business needs.</li>
                <li>Proposed feedbacks and recommendations to software developers on usability and functionality to improve application features.</li>
            </ul>
        </div>
    </article>
  )
}

export default ExperienceCard