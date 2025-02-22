import React from 'react'
import {motion} from "framer-motion";
import coverImage from "../Images/coverImage2.jpeg";

function AboutMe() {
return (
    // When on mobile, text is below pic. when on med, text is on the side
    <motion.div 
        initial={{ opacity: 0 }}
        whileInView= {{ opacity: 1 }}
        transition={{ duration: 3 }}
        className='flex flex-col relative h-dvh text-center max-w-7xl px-10 justify-evenly mx-auto items-center md:text-left md:flex-row'
    >
        {/* <h3 className='absolute top-16 uppercase tracking-[20px] text-gray-400 text-2xl'> */}
        <h3 className='top-16 p-1 mt-10 uppercase tracking-[20px] text-gray-400 text-base font-bold md:absolute'>
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
        src={coverImage}
        className="flex-shrink-0 w-40 h-40 sm:w-56 sm:h-56 rounded-full object-cover border-white border-4 mb-0 bg-[#292929] shadow-[0_0_40px_gray] md:mb-0 md:rounded-lg md:w-64 md:h-95"
        /> 

        <div className='space-y-5 px-0 md:px-10'>
            <h4 className='text-4xl font-semibold'>Hello Everyone!!
            {/* <span className='underline decoration-slate-500'>little</span> Background */}
            </h4>
            <p className='text-sm sm:text-base text-justify md:text-xl overflow-scroll no-scrollbar'>
            Hello Everyone!! My name is William and I'm currently a full-time Software Engineer at STMicroelectronics with 5 years of experience in Programming. I took my bachelor degree in Illinois Institute of Technology in Computer Engineering. I first discovered my passion in Programming after realizing that there are many problems that can be solved using the current advanced technology. While I'm not working, I like to go for a walk or hike and look for beautiful spots. I find that exploring nature helps me clear my mind and recharge for the next challenge.

            {/* If you're interested in working together, please feel free to reach out to me at +1(312)788-7357 or +65 9420 0655. I'd love to hear from you and discuss how we can work together to achieve your goals. */}
            <br></br>
            <br></br>
            In my programming accomplishments, I was a top 10 finalist in the Google Tech Challenge held at their headquarters in Chicago, and I'm proud to have won 1st place the Dare Mighty Things hackathon in 2019 with my team. These experiences have been invaluable in helping me grow as a programmer and a problem solver.

            I'm skilled in Python, Javascript, and PHP, and I have experience working with databases such as MySQL using Pandas. My long-term goal is to become a technical lead and mentor for junior developers to help them reach their full potential.
            </p>

        </div>
    </motion.div>
)
}

export default AboutMe