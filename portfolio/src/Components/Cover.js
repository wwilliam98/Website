import React, {useEffect} from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import BackgroundCircle from './BackgroundCircle'
// import CoverPic from "../Images/CoverImage1Large.jpeg"
import CoverPic from "../Images/IMG_2932.jpg"

function smoothScroll(target) {
  document.querySelector(target).scrollIntoView({
    behavior: 'smooth'
  });
}

function Cover() {
	const [text, count] = useTypewriter({
		words: ["Welcome to My Portfolio!!", "My name is William", "@STMicroelectronics"],
		loop: true,
		typeSpeed: 50,
		deleteSpeed: 50,
		delaySpeed: 2500
	})

	useEffect(() => {
		document.querySelector('a[href="#about"]').addEventListener('click', function(e) {
			e.preventDefault(); // Prevent the default behavior of the link
			smoothScroll('#about'); // Call the smoothScroll function with the target section ID
		});
		document.querySelector('a[href="#experience"]').addEventListener('click', function(e) {
			e.preventDefault(); // Prevent the default behavior of the link
			smoothScroll('#experience'); // Call the smoothScroll function with the target section ID
		});
		document.querySelector('a[href="#skills"]').addEventListener('click', function(e) {
			e.preventDefault(); // Prevent the default behavior of the link
			smoothScroll('#skills'); // Call the smoothScroll function with the target section ID
		});
		document.querySelector('a[href="#projects"]').addEventListener('click', function(e) {
			e.preventDefault(); // Prevent the default behavior of the link
			smoothScroll('#projects'); // Call the smoothScroll function with the target section ID
		});
	}, []);

	return (
		<div className='w-screen h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
			<div className='relative flex justify-center items-center'>
				<BackgroundCircle />
				{/* <img className='relative rounded-full h-32 w-32 mx-auto object-cover' src={CoverPic} alt="Cover Pic" /> */}
				<img className='relative rounded-full w-[250px] h-[250px] object-cover object-center border-4 border-gray-400 shadow-[0_0_40px_gray] cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_80px_gray]' src={CoverPic} alt="Cover Pic" />
			</div>
			
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