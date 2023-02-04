import React, { useEffect } from "react";
import {SocialIcon} from 'react-social-icons';

function Footer(){
    const footer = React.useRef();

    return (
        // for links to be put in
        <footer className="bg-black font-serif sticky flex items-start justify-between mx-auto xl:items-center">
            <div className="hidden md:inline-block">
                <SocialIcon url="https://instagram.com/wwilliam_98"
                fgColor="gray"
                bgColor="transparent"/>
                
                <SocialIcon url="https://instagram.com/wwilliam_98"
                fgColor="gray"
                bgColor="transparent"/>

                <SocialIcon url="https://instagram.com/wwilliam_98"
                fgColor="gray"
                bgColor="transparent"/>

                <SocialIcon url="https://instagram.com/wwilliam_98"
                fgColor="gray"
                bgColor="transparent"/>
            </div>

            <div className="flex flex-row items-center text-gray-300 cursor-pointer">
                <SocialIcon
                className="cursor-pointer"
                network="email"
                fgColor="gray"
                bgColor="transparent"/>
                <p className="hidden md:inline-flex text-gray-400">Contact Me</p>
            </div>
        </footer>
    )
}

export default Footer