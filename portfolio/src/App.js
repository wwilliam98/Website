import React from "react";
import Header from './Components/Header';
import Cover from "./Components/Cover";
import AboutMe from './Components/AboutMe.js';
import WorkExperience from './Components/WorkExperience.js';
import Skills from "./Components/Skills";
import Projects from "./Components/Projects";
import ContactMe from "./Components/ContactMe";
import ChatWithAI from "./Components/ChatWithAI.js";

function App(){
    return (
        <div className="bg-gray-800 text-white">
            <Header/>
            <main>
                <section id="hero">
                    <Cover/>
                </section>
                <section id="about" className="scroll-mt-20">
                    <AboutMe/>
                </section>
                <section id="experience" className="scroll-mt-20">
                    <WorkExperience/>
                </section>
                <section id="skills" className="scroll-mt-20">
                    <Skills/>
                </section>
                <section id="projects" className="scroll-mt-20">
                    <Projects/>
                </section>
                <section id="contact" className="scroll-mt-20">
                    <ContactMe/>
                </section>
            </main>
            <ChatWithAI/>
        </div>
    )
}

export default App;
