import React from 'react'
import {motion} from "framer-motion";

function BackgroundCircle() {
  return (
    <motion.div 
		initial={{
			opacity: 0
		}}
		animate={{
			scale: [1,2,2,3,1],
			opacity: [0.1, 0.2, 0.4, 0.8, 0.1, 1.0],
			borderRadius: ["20%", "20%", "50%", "80%", "20%"]
		}}
		transition={{
			duration: 2.5
		}}
		className='absolute flex justify-center items-center'>
		<div className='absolute border border-[#333333] rounded-full h-[300px] w-[300px] animate-ping'/>
		<div className='absolute border border-[#333333] rounded-full h-[450px] w-[450px]'/>
		<div className='absolute border border-[#333333] rounded-full h-[600px] w-[600px]'/>
		<div className='absolute border border-[#777777] rounded-full opacity-20 h-[750px] w-[750px] animate-pulse'/>
		<div className='absolute border border-[#333333] rounded-full h-[900px] w-[900px]'/>
	</motion.div>
  )
}

export default BackgroundCircle