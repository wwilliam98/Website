import React from 'react'
import { motion } from 'framer-motion'
import OpenSlotPic from "../Images/OpenSlot.png"
import JavascriptLogo from "../Images/jslogo.png"
import HTMLLogo from "../Images/HTMLlogo.jpeg"


function ExperienceCard() {
  return (
        <article className='flex flex-shrink-0 flex-col max-w-xs md:max-w-3xl items-center justify-center bg-[#292929] rounded-2xl shadow-[0_0_10px_gray] px-10 py-5 md:p-20'>
            <motion.img
                initial={{
                    y: -100,
                    opactity: 0,
                }} 
                transition={{ duration: 1.2 }}
                whileInView={{ opacity: 1, y: 0}}
                viewport={{ once:true }}
                className='m-3 w-24 h-24 sm:w-32 sm:h-32 lg:w-32 lg:h-32 rounded-full object-cover object-center'
                src={OpenSlotPic}
            />

            <div className='max-w-2xl'>
                <h4 className='text-3xl sm:text-4xl font-light text-center'>OpenSlot Inc.</h4>
                <p className='font-bold text-xl sm:text-2xl mt-1 text-center'>Quality Assurance</p>
                <div className='flex space-x-2 my-1 justify-center'>
                    <img 
                        className='h-10 w-10 rounded-full'
                        src={JavascriptLogo}
                        alt="Tech Used"
                    />
                    <img 
                        className='h-10 w-10 rounded-full'
                        src={HTMLLogo}
                        alt="Tech Used"
                    />
                </div>
                <p className='uppercase py-3 sm:py-5 text-gray-300'>Summer 2018, Summer 2019</p>
                <ul className='list-disc space-y-2 ml-5 text-xs md:text-lg text-justify text-gray-400'>
                    <li>Collaborated to identify and document faults in the OpenSlot application, reducing faults by 50%.</li>
                    <li>Participated in code reviews, providing quality feedback.</li>
                    <li>Identified and documented program issues to enhance product quality.</li>
                    <li>Designed test plans with doctors and dentists, aligning application functionality with business needs.</li>
                    <li>Offered usability and functionality recommendations to developers, improving application features.</li>
                </ul>
            </div>
        </article>
  )
}

export default ExperienceCard