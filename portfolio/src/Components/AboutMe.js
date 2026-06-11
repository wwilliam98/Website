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
        className='flex flex-col relative h-dvh max-h-dvh text-center max-w-7xl px-10 justify-evenly mx-auto items-center md:text-left md:flex-row'
    >
        <div className='text-center md:absolute md:top-8'>
          <h3 className='text-2xl font-bold uppercase tracking-[8px] text-[#38BDF8]'>
            About Me
          </h3>
          <div className='w-full h-[2px] bg-[#38BDF8]/60 mt-2 rounded-full' />
        </div>
        
        <motion.img 
        initial={{
            x: -200,
            opacity: 0
        }}
        transition={{ duration: 1.2 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} //So it doesnt keep looping when entering view 
        src={coverImage}
        className="flex-shrink-0 w-32 h-32 sm:w-56 sm:h-56 rounded-full object-cover border-white border-4 mb-0 bg-[#292929] shadow-[0_0_40px_gray] md:mb-0 md:rounded-lg md:w-64 md:h-95 lg:w-auto lg:h-auto"
        /> 

        <div className='space-y-2 px-0 md:px-10'>
            <h4 className='text-3xl font-semibold'>Hello Everyone!!
            {/* <span className='underline decoration-slate-500'>little</span> Background */}
            </h4>
            <p className='text-sm sm:text-base text-justify md:text-xl overflow-scroll no-scrollbar'>
            Hello Everyone!! My name is William and I'm currently a full-time Software Engineer at STMicroelectronics with 5 years of experience in Programming. I took my bachelor degree in Illinois Institute of Technology in Computer Engineering. I first discovered my passion in Programming after realizing that there are many problems that can be solved using the current advanced technology. While I'm not working, I like to go for a walk or play badminton. I find playing badminton helps me clear my mind and recharge for the next challenge.

            {/* If you're interested in working together, please feel free to reach out to me at +1(312)788-7357 or +65 9420 0655. I'd love to hear from you and discuss how we can work together to achieve your goals. */}
            <br></br>
            <br></br>
            In my programming accomplishments, <b>I was a Top 10 finalist in the Google Tech Challenge</b> held at their headquarters in Chicago, and I'm proud to have won <b>1st place at the Dare Mighty Things hackathon</b> in 2019 with my team. These experiences have been invaluable in helping me grow as a programmer and a problem solver.

            I'm skilled in Python, Javascript, and PHP, and I have experience working with databases such as MySQL using Pandas. My long-term goal is to become a technical lead and mentor for junior developers to help them reach their full potential.
            </p>

        </div>
    </motion.div>
)
}

export default AboutMe