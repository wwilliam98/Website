import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import BackgroundCircle from './BackgroundCircle'
import CoverPic from "../Images/pass-photo09Oct2022.jpeg"

function Cover() {
  const [text, count] = useTypewriter({
	words: ["Welcome to My Website!!", "My name is William", "@STMicroelectronics"],
	loop: true,
	delaySpeed: 1000
  })

  return (
	<div className='w-screen h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
		<BackgroundCircle />
		<img className='relative rounded-full h-32 w-32 mx-auto object-cover' src={CoverPic} alt="Cover Pic" />
		<div className='z-20'>
			<h2 className='text-sm uppercase text-gray-500 pb-2 tracking-[13px]'>
				Software Engineer
			</h2>
			{/* Typewriter comes in */}
			<h1 className='text-4xl md:text-5xl lg:text-6xl font-semibold px-10'>
				<span className='mr-0'>{text}</span>
				<Cursor cursorColor='gray' />
			</h1>

			<div className='pt-5'>
				<a href="/about" className='coverButton'>About</a>
				<a href="/experience" className='coverButton'>Experience</a>
				<a href="google.com" className='coverButton'>Skills</a>
				<a href="google.com" className='coverButton'>Projects</a>
			</div>
		</div>
	</div>
  )
}

export default Cover