import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import BackgroundCircle from './BackgroundCircle'
import CoverPic from "../Images/LinkedInPFP.png"

function Cover() {
    const [text] = useTypewriter({
        words: ["computer vision", "AI for manufacturing", "full-stack apps", "IoT systems"],
        loop: true,
        typeSpeed: 60,
        deleteSpeed: 40,
        delaySpeed: 2200,
    })

    const openChat = () => {
        window.dispatchEvent(new CustomEvent('open-chat'))
    }

    return (
        <div className='relative min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center text-center overflow-hidden px-6'>
            <div className='relative flex justify-center items-center mb-8'>
                <BackgroundCircle />
                <img
                    className='relative rounded-full w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-cover object-center ring-4 ring-[#38BDF8]/30 shadow-[0_0_40px_rgba(56,189,248,0.15)]'
                    src={CoverPic}
                    alt="William"
                />
            </div>

            <div className='z-20 max-w-2xl'>
                <h1 className='text-4xl sm:text-5xl font-bold'>
                    Hi, I'm William
                </h1>
                <h2 className='text-xl sm:text-2xl mt-3 text-gray-300'>
                    Software engineer building{' '}
                    <span className='text-[#38BDF8] font-semibold'>{text}</span>
                    <Cursor cursorColor='#38BDF8' />
                </h2>
                <p className='mt-4 text-gray-400 text-sm sm:text-base leading-relaxed'>
                    I build AI and computer-vision systems for semiconductor manufacturing at
                    STMicroelectronics — including an automated wafer inspection pipeline that
                    saves S$1M a year.
                </p>

                <div className='mt-8 flex flex-wrap justify-center gap-3'>
                    <a
                        href="#projects"
                        className='px-6 py-3 rounded-full bg-[#38BDF8] text-gray-900 text-sm font-semibold hover:bg-[#7dd3fc] transition-colors duration-200'
                    >
                        View projects
                    </a>
                    <button
                        onClick={openChat}
                        className='px-6 py-3 rounded-full border border-[#38BDF8]/50 text-[#38BDF8] text-sm font-semibold hover:bg-[#38BDF8]/10 transition-colors duration-200'
                    >
                        Ask my AI twin
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cover
