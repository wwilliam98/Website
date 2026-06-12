import React from 'react'
import { motion } from "framer-motion";
import SectionHeading from './SectionHeading';
import coverImage from "../Images/coverImage2.jpeg";

function AboutMe() {
    return (
        <div className='max-w-4xl mx-auto px-6 py-24 text-center'>
            <SectionHeading>About me</SectionHeading>

            <div className='flex flex-col md:flex-row items-center gap-10 text-left'>
                <motion.img
                    initial={{ x: -80, opacity: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    src={coverImage}
                    alt="William sitting on a cobblestone street"
                    loading="lazy"
                    className="flex-shrink-0 w-40 h-40 md:w-56 md:h-72 rounded-2xl object-cover shadow-lg"
                />

                <div className='space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed max-w-prose'>
                    <p>
                        My name is William and I'm a full-time Software Engineer at
                        STMicroelectronics with 5 years of programming experience. I earned my
                        bachelor's degree in Computer Engineering from Illinois Institute of
                        Technology. I discovered my passion for programming after realizing how
                        many problems can be solved with technology. Outside of work I like
                        going for walks and playing badminton — it clears my mind and recharges
                        me for the next challenge.
                    </p>
                    <p>
                        I was a <b className='text-white'>Top 10 finalist in the Google Tech Challenge</b> held
                        at Google's Chicago headquarters, and my team won <b className='text-white'>1st place
                        at the Dare Mighty Things hackathon</b> in 2019. I'm skilled in Python,
                        JavaScript, and PHP, with experience in MySQL and Pandas. My long-term
                        goal is to become a technical lead and mentor junior developers to help
                        them reach their full potential.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AboutMe
