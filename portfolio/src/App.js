import React from "react";
import Header from './Components/Header';
import Cover from "./Components/Cover";
import AboutMe from './Components/AboutMe.js';
import WorkExperience from './Components/WorkExperience.js';
import Skills from "./Components/Skills";
import Projects from "./Components/Projects";
import ContactMe from "./Components/ContactMe";
import ChatWithAI from "./Components/ChatWithAI.js";
// import Footer from "./Components/Footer";

function App(){
    return (
        // <div className="bg-gray-50 h-screen snap-y snap-mandatory overflow-y-scroll scrollbar-hide z-0">
        <div className="bg-gray-800 text-white h-screen snap-y snap-mandatory overflow-y-scroll overflow-x-hidden z-0 no-scrollbar">
            <Header/>
            <section id="hero" className="snap-center">
                <Cover/>
            </section>
            <section id="about" className="snap-center">
                <AboutMe/>
            </section>
            <section id="experience" className="snap-center">
                <WorkExperience/>
            </section>
            <section id="skills" className="snap-center">
                <Skills/>
            </section>
            <section id="projects" className="snap-center">
                <Projects/>
            </section>
            <section id="chatwithai" className="snap-center">
                <ChatWithAI/>
            </section>
            <section id="contact" className="snap-center">
                <ContactMe/>
            </section>
            

            {/* work exp */}
            {/* projects */}

            {/* Footer */}
                {/* contact me */}

            {/* <Footer /> */}

        </div>
    )
}

export default App;