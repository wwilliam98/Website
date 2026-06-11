import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import BackgroundCircle from './BackgroundCircle'
import CoverPic from "../Images/LinkedInPFP.png"

function Cover() {
  const [text] = useTypewriter({
    words: ["Welcome to My Portfolio!!", "My name is William", "@STMicroelectronics"],
    loop: true,
    typeSpeed: 50,
    deleteSpeed: 50,
    delaySpeed: 2500,
  })

  return (
    <div className='w-dvw h-dvh flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
      <div className='relative flex justify-center items-center'>
        <BackgroundCircle />
        <img
          className='relative rounded-full w-[250px] h-[250px] object-cover object-center border-4 border-gray-400 shadow-[0_0_40px_gray] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_80px_gray]'
          src={CoverPic}
          alt="William"
        />
      </div>

      <div className='z-20'>
        <h2 className='text-sm uppercase pb-2 tracking-[13px] text-[#38BDF8]'>
          Software Engineer
        </h2>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-semibold px-10'>
          <span>{text}</span>
          <Cursor cursorColor='#38BDF8' />
        </h1>

        <div className='pt-5 flex flex-wrap justify-center gap-2'>
          <a href="#about" className='coverButton'>About</a>
          <a href="#experience" className='coverButton'>Experience</a>
          <a href="#skills" className='coverButton'>Skills</a>
          <a href="#projects" className='coverButton'>Projects</a>
        </div>
      </div>
    </div>
  )
}

export default Cover
