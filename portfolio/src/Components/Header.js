import React from "react";
import {SocialIcon} from 'react-social-icons';
import {motion} from "framer-motion";

function Header(){
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

				<SocialIcon
					url="https://www.facebook.com/wwilliam1908"
					fgColor="gray"
					bgColor="transparent"
				/>
				<SocialIcon
					url="https://instagram.com/wwilliam_98"
					fgColor="gray"
					bgColor="transparent"
				/>
				<SocialIcon
					url="https://www.linkedin.com/in/wwilliam1908"
					fgColor="gray"
					bgColor="transparent"
				/>
				<SocialIcon
					url="https://github.com/wwilliam98"
					fgColor="gray"
					bgColor="transparent"
				/>

				<SocialIcon
					url="https://leetcode.com/IamCookie/"
					fgColor="gray"
					bgColor="transparent"
				/>
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

				<SocialIcon
					className="cursor-pointer"
					url="mailto: wwilliam1908@gmail.com"
					network="email"
					fgColor="gray"
					bgColor="transparent"
				/>

				<p className="uppercase hidden md:inline-flex text-sm text-gray-400">Contact Me</p>
			</motion.div>

		</header>
	)
}

export default Header