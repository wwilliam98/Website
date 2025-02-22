import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";
import GoogleTechSS from "../Images/GoogleTechSS.png"
import GoogleTech_Team from "../Images/GoogleTech_Team.png"
import GoogleTech_Solo from "../Images/GoogleTech_Solo.png"

function GoogleTechProject() {
    const images = [GoogleTech_Team, GoogleTech_Solo, GoogleTechSS];

    return (
        <div className='w-dvw flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
            <div className='overflow-x-scroll no-scrollbar w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] rounded-lg'>
				<motion.div
					className="flex gap-4"
					initial={{ x: '33%' }}
					animate={{ x: '-133%' }}
					viewport={{ once: true }}
					transition={{
						repeat: Infinity,
						repeatType: 'loop',
						duration: 30,
						ease: 'linear',
					}}
				>
					{images.map((src, index) => (
					<img
						key={index}
						src={src}
						alt={`Slide ${index}`}
						className="w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] rounded-lg"
					/>
					))}
				</motion.div>
			</div>

            <div className='space-y-10 px-0 md:pd-10 max-w-6xl'>
                <h4 className='text-4xl font-semibold text-center'> 
                    <span>Project 4 of 6:</span>{" "}
                    <a href="https://techchallenge.withgoogle.com/" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>Google Tech Challenge</a>
                </h4>

                <p className='text-sm sm:text-lg text-center md:text-left'>
                    • Built a team of 5 students in a national tech game competition to solve 5 levels of difficulties of puzzles which include 3 coding challenges and 2 riddle challenges in 2 hours <br></br>
                    • Solved coding and logical problems, algorithm puzzles, and riddles as much as possible in a given time
                </p>
            </div>
        </div>
    )
}

export default GoogleTechProject