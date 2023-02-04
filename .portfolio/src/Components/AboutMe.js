import React from 'react'
import {motion} from "framer-motion";
import CoverPic from "../Images/pass-photo09Oct2022.jpeg"

function AboutMe() {
return (
    // When on mobile, text is below pic. when on med, text is on the side
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView= {{ opacity: 1 }}
        transition={{ duration: 3 }}
        className='flex flex-col relative h-screen text-center max-w-7xl px-10 justify-evenly mx-auto items-center md:text-left md:flex-row'
    >
        {/* <h3 className='absolute top-16 uppercase tracking-[20px] text-gray-400 text-2xl'> */}
        <h3 className='top-16 p-1 mt-10 uppercase tracking-[20px] text-gray-400 text-base md:absolute'>
            About Me
        </h3>
        
        <motion.img 
        initial={{
            x: -200,
            opacity: 0
        }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} //So it doesnt keep looping when entering view 
        src={CoverPic}
        className="flex-shrink-0 w-56 h-56 rounded-full object-cover mb-0 md:mb-0 md:rounded-lg md:w-64 md:h-95 xl:w-[500px] xl:h-[500px]"
        /> 

        <div className='space-y-5 px-0 md:px-10'>
            <h4 className='text-4xl font-semibold'>Here is a{" "}
            <span className='underline decoration-slate-500'> little</span> Background
            </h4>
            <p className='text-base text-justify md:text-2xl'>
            Hello everyone!! My name is William. I graduated from the Illinois Institute of Technology, majoring in Computer Engineering. I am currently a full-time Software Engineer at STMicroelectronics. I became interested in computer engineering because of the ability to combine computer software and hardware to create real-world solutions. I discovered my passion for this field after realizing that there are many problems that can be solved through computer software. In my programming experience, I won the Dare Mighty Things hackathon in 2019 with five of my friends, and I also participated in the Google Tech Challenge at their headquarters in Chicago.
            </p>
        </div>
    </motion.div>
)
}

export default AboutMe