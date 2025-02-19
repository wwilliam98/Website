import React from 'react'
import { motion } from 'framer-motion'
import OpenSlotPic from "../Images/OpenSlot.png"
import JavascriptLogo from "../Images/jslogo.png"
import HTMLLogo from "../Images/HTMLlogo.jpeg"


function ExperienceCard() {
  return (
        <article className='w-screen flex-shrink-0 snap-center flex flex-col space-y-7 items-center justify-start p-10 md:pd-20'>
            <div className='w-screen max-w-md md:max-w-3xl flex-shrink-0 flex flex-col items-center justify-center p-10 bg-[#292929] rounded-2xl shadow-[0_0_10px_gray] md:pd-20'>
                <motion.img
                    initial={{
                        y: -100,
                        opactity: 0,
                    }} 
                    transition={{ duration: 1.2 }}
                    whileInView={{ opacity: 1, y: 0}}
                    viewport={{ once:true }}
                    className='m-5  w-24 h-24 sm:w-32 sm:h-32 lg:w-32 lg:h-32 rounded-full object-cover object-center'
                    src={OpenSlotPic}
                />

                <div className='max-w-2xl px-5 md:px-10'>
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
                    <ul className='list-disc space-y-2 ml-5 text-sm sm:text-lg text-justify text-gray-400'>
                        <li>Collaborated with a team of developers to identify and document faults in the OpenSlot application, resulting in a 50% reduction in faults.</li>
                        <li>Participate in code reviews and provide feedback on the quality of the code.</li>
                        <li>Identified and documented problems with program function, output, and content to improve quality of product.</li>
                        <li>Designed test plans and procedures with end users which are doctors and dentists by understanding and analyzing functionality of applications to fit business needs.</li>
                        <li>Proposed feedbacks and recommendations to software developers on usability and functionality to improve application features.</li>
                    </ul>
                </div>
            </div>
        </article>
  )
}

export default ExperienceCard