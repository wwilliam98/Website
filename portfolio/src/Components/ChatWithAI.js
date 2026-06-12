import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
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
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const animatedRef = useRef(new Set());

    useEffect(() => {
        const openHandler = () => setOpen(true);
        window.addEventListener('open-chat', openHandler);
        return () => window.removeEventListener('open-chat', openHandler);
    }, []);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading, open]);

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
            if (!res.ok || !data.result) {
                throw new Error(data.error || `Request failed with status ${res.status}`);
            }
            setMessages((prev) => [...prev, { role: "assistant", animate: true, content: data.result }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
        }

        setLoading(false);
    };

    return (
        <div className='fixed bottom-5 right-5 z-50 flex flex-col items-end'>
            {open && (
                <div className='mb-3 w-[min(380px,calc(100vw-2.5rem))] h-[480px] flex flex-col rounded-2xl border border-[#38BDF8]/30 bg-gray-900 shadow-2xl overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-white/10'>
                        <div>
                            <p className='text-sm font-semibold'>Ask my AI twin</p>
                            <p className='text-xs text-gray-400'>Answers questions about my work</p>
                        </div>
                        <button onClick={() => setOpen(false)} aria-label="Close chat" className='p-1 text-gray-400 hover:text-white'>
                            <XMarkIcon className='w-5 h-5' />
                        </button>
                    </div>

                    <div ref={chatContainerRef} className='flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5'>
                        {messages.length === 0 && !loading && (
                            <p className="text-gray-500 text-xs text-center pt-8 px-4">
                                Ask me about my skills, experience, or projects — my AI twin will answer.
                            </p>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex p-2.5 rounded-2xl max-w-[85%] text-sm ${
                                    msg.role === "user"
                                        ? "ml-auto bg-[#38BDF8]/20 text-gray-100 rounded-br-sm"
                                        : "mr-auto bg-gray-700/60 text-gray-200 rounded-bl-sm"
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
                            <div className="mr-auto flex items-center space-x-1 p-2.5 rounded-2xl bg-gray-700/60 max-w-fit">
                                <span className="w-2 h-2 rounded-full bg-[#38BDF8]/70 animate-bounce" />
                                <span className="w-2 h-2 rounded-full bg-[#38BDF8]/70 animate-bounce [animation-delay:150ms]" />
                                <span className="w-2 h-2 rounded-full bg-[#38BDF8]/70 animate-bounce [animation-delay:300ms]" />
                            </div>
                        )}
                    </div>

                    <div className='flex items-center gap-2 p-3 border-t border-white/10'>
                        <input
                            onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && sendMessage()}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about my skills, projects..."
                            className='flex-1 outline-none bg-white/5 text-sm text-gray-200 placeholder-gray-500 px-3.5 py-2 rounded-full border border-white/10 focus:border-[#38BDF8]/50 transition-colors'
                            autoComplete="off"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            aria-label="Send message"
                            className="p-2 rounded-full bg-[#38BDF8] hover:bg-[#7dd3fc] transition-colors disabled:opacity-30"
                        >
                            <PaperAirplaneIcon className="w-4 h-4 text-gray-900" />
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close chat" : "Open chat with AI twin"}
                className='w-14 h-14 rounded-full bg-[#38BDF8] hover:bg-[#7dd3fc] flex items-center justify-center shadow-lg transition-colors duration-200'
            >
                {open
                    ? <XMarkIcon className='w-7 h-7 text-gray-900' />
                    : <ChatBubbleLeftRightIcon className='w-7 h-7 text-gray-900' />}
            </button>
        </div>
    )
}

export default ChatWithAI
