import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useTypewriter } from 'react-simple-typewriter'

function TypewriterMessage({ text, onDone }) {
    const [typedText] = useTypewriter({
        words: [text],
        typeSpeed: 15,
    });

    useEffect(() => {
        if (typedText === text) onDone();
    }, [typedText, text, onDone]);

    return <span>{typedText}</span>;
}

function ChatWithAI() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const animatedRef = useRef(new Set());

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sendMessage = async () => {
        const prompt = input.trim();
        if (!prompt || loading) return;

        setMessages((prev) => [...prev, { role: "user", content: prompt }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/generate_chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", animate: true, content: data.result }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
        }

        setLoading(false);
    };

    return (
        <div className='relative flex flex-col h-dvh overflow-hidden text-center max-w-full md:text-left justify-evenly mx-auto items-center'>
            <div className='text-center mt-6'>
                <h3 className='text-2xl font-bold uppercase tracking-[8px] text-[#38BDF8]'>
                    Ask Me Anything
                </h3>
                <div className='w-full h-[2px] bg-[#38BDF8]/60 mt-2 rounded-full' />
            </div>

            <div
                ref={chatContainerRef}
                className="w-4/5 max-w-3xl h-4/6 overflow-y-auto no-scrollbar border border-[#38BDF8]/30 bg-white/5 p-4 m-3 rounded-2xl space-y-3"
            >
                {messages.length === 0 && !loading && (
                    <p className="text-gray-500 text-sm text-center pt-10">
                        Ask me about my skills, experience, or projects — my AI twin will answer.
                    </p>
                )}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex p-3 rounded-2xl max-w-[80%] text-sm sm:text-base ${
                            msg.role === "user"
                                ? "ml-auto bg-[#38BDF8]/20 text-gray-100 text-right rounded-br-sm"
                                : "mr-auto bg-gray-700/60 text-gray-200 text-left rounded-bl-sm"
                        }`}
                    >
                        {msg.role === "assistant" && msg.animate && !animatedRef.current.has(index) ? (
                            <TypewriterMessage
                                text={msg.content}
                                onDone={() => animatedRef.current.add(index)}
                            />
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="mr-auto flex items-center space-x-1 p-3 rounded-2xl bg-gray-700/60 max-w-fit">
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8]/70 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8]/70 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8]/70 animate-bounce [animation-delay:300ms]" />
                    </div>
                )}
            </div>

            <div className="flex w-4/5 max-w-3xl items-center space-x-2">
                <input
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
                    disabled={loading || !input.trim()}
                    className="p-3 rounded-full border border-[#38BDF8]/40 hover:bg-[#38BDF8]/20 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <PaperAirplaneIcon className="w-5 h-5 text-[#38BDF8]" />
                </button>
            </div>
        </div>
    )
}

export default ChatWithAI
