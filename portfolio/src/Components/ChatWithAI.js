import React, {useState, useEffect, useRef} from "react";
import { PhoneIcon, MapPinIcon, EnvelopeIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import Alert from 'react-bootstrap/Alert';

function ChatWithAI() {       
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth"
        });
        // chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
        // messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const TypewriterMessage = ({ text, index }) => {
        scrollToBottom();
        const [typedText] = useTypewriter({
            words: [text],
            typeSpeed: 15,
        });
        messages[messages.length-1].shouldAnimate = false
        return <span>{typedText}</span>;
    };

    const sendMessage = async () => {
        const userMessage = { role: "user", shouldAnimate: false, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/generate_chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await res.json();
            const botMessage = { role: "assistant", shouldAnimate: true, content: data.result };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
        }

        setLoading(false);
    };

    return (
        <div className='relative flex flex-col h-screen overflow-hidden text-center max-w-full md:text-left justify-evenly mx-auto items-center'>
            {/* <h3 className="absolute top-16 p-1 uppercase tracking-[20px] text-gray-400 text-2xl"> */}
            <h3 className="top-16 p-1 mt-10 uppercase tracking-[20px] text-gray-400 text-base font-bold">
                Ask Me Anything
            </h3>

            <div ref={chatContainerRef} className="w-4/5 h-4/6 overflow-y-scroll border border-gray-600 p-3 m-3 rounded-lg space-y-2">
                {messages.map((msg, index) => (
                    <div 
                        ref={messagesEndRef}
                        key={index}
                        className={`flex p-3 rounded-lg max-w-fit ${msg.role === "user" ? "ml-auto bg-gray-900 text-gray-400 text-right" : "mr-auto bg-gray-400 text-gray-900 text-left"}`}>
                        {/* {msg.content} */}
                        {/* {msg.role !== "user" && !typedMessages.has(index)? */}
                        {msg.role !== "user" && msg.shouldAnimate ?
                            <TypewriterMessage text={msg.content} index={index} /> : msg.content}
                    </div>
                ))}
                {loading && <div className="text-gray-400">Thinking...</div>}
            </div>
            <div className="flex w-4/5 space-x-2">
                <input
                    // id='prompt'
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me about my skills, projects, etc..."
                    className='chatPrompt'
                    autoComplete="off"
                />
                <button 
                    onClick={sendMessage} 
                    className="p-2 rounded-full ml-2 md:hidden"
                >
                    <PaperAirplaneIcon className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    )
}

export default ChatWithAI