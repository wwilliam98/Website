import React, { useState } from 'react';
import { motion } from "framer-motion";
import DMT_Presentation from "../Images/DMT_Presentation.jpg";
import DMTSS from "../Images/DMTSS.png";
import LightProjectSS from "../Images/LightProjectSS.jpeg"
import coverImage from "../Images/coverImage2.jpeg";

function DareMightyThings() {
	const images = [DMT_Presentation, DMTSS];

	return (
		<div className='w-screen flex-shrink-0 snap-center flex flex-col space-y-10 items-center justify-start p-5 md:pd-20'>
			<div className='overflow-x-scroll no-scrollbar w-[400px] h-[200px] sm:w-[600px] sm:h-[300px] md:w-[800px] md:h-[400px] rounded-lg'>
			<motion.div
					className="flex gap-4"
					initial={{ x: '50%' }}
					animate={{ x: '-100%' }}
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
					<span>Project 3 of 6:</span>{" "}
					<a href="https://techchallenge.withgoogle.com/" className='underline decoration-[#F7Ab0A]/50 transition-all duration-300 opacity-50 hover:opacity-100'>DareMightyThings Hackaton 2019</a>
				</h4>

				<p className='text-sm sm:text-lg text-center md:text-left'>
					• Won 1st place to implement a generated text application for a multi-billion dollar real estate company (JLL)<br></br>
					• Successfully created an application that takes an address and write a paragraph long generally about the property and location<br></br>
					• Utilized Python, Java, HTML, CSS, and Javascript with support of Flask as the framework, Google Cloud, and NarrativeGenerator API
				</p>
			</div>
		</div>
	)
}

export default DareMightyThings