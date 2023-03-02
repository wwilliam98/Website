import React, {useEffect} from "react";
import {SocialIcon} from 'react-social-icons';
import {motion} from "framer-motion";

function smoothScroll(target) {
	document.querySelector(target).scrollIntoView({
	  behavior: 'smooth'
	});
}

function Header(){
	useEffect(() => {
		document.querySelector('a[href="#contact"]').addEventListener('click', function(e) {
			e.preventDefault(); // Prevent the default behavior of the link
			smoothScroll('#contact'); // Call the smoothScroll function with the target section ID
		});
	}, []);

	return (
		<header className="sticky top-0 flex p-3 items-start justify-between max-w-7xl mx-auto z-20 xl:items-center">
			<motion.div
				initial={{
					x:-500,
					opacity: 0,
					scale: 0.5
				}}
				animate={{
					x: 0,
					opacity: 1,
					scale: 1
				}} 
				transition={{
					duration: 2
				}}
				className="flex flex-row items-center">

				<span className="rounded-full hover:bg-[#F7AB0A]/40">
				<SocialIcon
					url="https://www.facebook.com/wwilliam1908"
					fgColor="gray"
					bgColor="transparent"
				/>
				</span>

				<span className="rounded-full hover:bg-[#F7AB0A]/40">
				<SocialIcon
					url="https://instagram.com/wwilliam_98"
					fgColor="gray"
					bgColor="transparent"
				/>
				</span>

				<span className="rounded-full hover:bg-[#F7AB0A]/40">
				<SocialIcon
					url="https://www.linkedin.com/in/wwilliam1908"
					fgColor="gray"
					bgColor="transparent"
				/>
				</span>

				<span className="rounded-full hover:bg-[#F7AB0A]/40">
				<SocialIcon
					url="https://github.com/wwilliam98"
					fgColor="gray"
					bgColor="transparent"
				/>
				</span>

				<span className="rounded-full hover:bg-[#F7AB0A]/40">
				<SocialIcon
					url="https://leetcode.com/IamCookie/"
					fgColor="gray"
					bgColor="transparent"
				/>
				</span>
			</motion.div>

			<motion.div
				initial={{
					x: 500,
					opacity: 0,
					scale: 0.5
				}}
				animate={{
					x: 0,
					opacity: 1,
					scale: 1
				}} 
				transition={{
					duration: 2
				}}
				className="flex flex-row items-center text-gray-300 cursor-pointer">

				<span className="md:pr-3 rounded-full hover:bg-[#F7AB0A]/40">
				<SocialIcon
					className="cursor-pointer"
					url="#contact"
					network="email"
					fgColor="gray"
					bgColor="transparent"
				/>
				<a href="#contact" className="uppercase hidden md:inline-flex text-sm text-gray-400">Contact Me</a>
				</span>
			</motion.div>

		</header>
	)
}

export default Header