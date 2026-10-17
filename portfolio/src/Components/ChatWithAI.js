import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import content from "../data/content.json";
import AvatarPic from "../Images/LinkedInPFP.png";

const STARTER_QUESTIONS = [
    "What do you work on at STMicroelectronics?",
    "What projects have you built?",
    "What are your strongest skills?",
    "How can I contact you?",
];

// Turns sent back to /generate_chat for context; the server rejects more than 6
const HISTORY_LENGTH = 6;
const STORAGE_KEY = "chat-messages";

// The assistant may only link to these; any other URL it produces renders as plain text
const projects = [...content.featuredProjects, ...content.moreProjects];
const LINK_LABELS = new Map([
    ...content.links.map(({ url, label }) => [url, label]),
    ...projects.map(({ id, title }) => [`#project-${id}`, `View ${title}`]),
    ...projects.filter(({ link }) => link).map(({ link, title }) => [link, `Open ${title}`]),
]);

const isInternal = (href) => href.startsWith("#") || href.startsWith("/");

function loadMessages() {
    try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
        // A send interrupted by a reload never finished, so offer the button again
        return saved.map((m) => (m.action?.status === "sending" ? { ...m, action: { ...m.action, status: "pending" } } : m));
    } catch {
        return [];
    }
}

function ChatLink({ href, children, onNavigate, className }) {
    return (
        <a
            href={href}
            onClick={onNavigate}
            {...(isInternal(href) || href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className={className}
        >
            {children}
        </a>
    );
}

// Minimal Markdown for replies: **bold**, [text](url) and "- " / "1. " lists.
// Builds React elements (no innerHTML), so model output can't inject markup.
function renderInline(text, onNavigate, keyPrefix) {
    const parts = [];
    const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
    let last = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));
        const key = `${keyPrefix}-${match.index}`;
        if (match[1]) {
            parts.push(<strong key={key} className="font-semibold text-white">{match[1]}</strong>);
        } else if (LINK_LABELS.has(match[3])) {
            parts.push(
                <ChatLink key={key} href={match[3]} onNavigate={onNavigate} className="text-[#38BDF8] underline underline-offset-2 hover:text-[#7dd3fc]">
                    {match[2]}
                </ChatLink>
            );
        } else {
            parts.push(match[2]);
        }
        last = pattern.lastIndex;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

function MarkdownMessage({ text, onNavigate }) {
    const blocks = [];
    let list = null;
    text.split("\n").forEach((rawLine, i) => {
        const line = rawLine.trim();
        const item = line.match(/^(?:[-*•]|\d+\.)\s+(.*)$/);
        if (item) {
            if (!list) {
                list = { ordered: /^\d/.test(line), items: [] };
                blocks.push(list);
            }
            list.items.push(renderInline(item[1], onNavigate, `li${i}`));
            return;
        }
        list = null;
        if (line) blocks.push(<p key={`p${i}`}>{renderInline(line, onNavigate, `p${i}`)}</p>);
    });

    return (
        <div className="space-y-2 leading-relaxed">
            {blocks.map((block, i) => {
                if (!block.items) return block;
                const ListTag = block.ordered ? "ol" : "ul";
                return (
                    <ListTag key={`l${i}`} className={`${block.ordered ? "list-decimal" : "list-disc"} ml-4 space-y-1`}>
                        {block.items.map((children, j) => <li key={j}>{children}</li>)}
                    </ListTag>
                );
            })}
        </div>
    );
}

// Up to 3 allowed links in a reply become buttons under it; longer lists keep inline links only
function LinkChips({ text, onNavigate }) {
    const hrefs = [...new Set([...text.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((m) => m[1]))]
        .filter((href) => LINK_LABELS.has(href));
    if (hrefs.length === 0 || hrefs.length > 3) return null;

    return (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
            {hrefs.map((href) => (
                <ChatLink
                    key={href}
                    href={href}
                    onNavigate={onNavigate}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/10 transition-colors"
                >
                    {LINK_LABELS.get(href)}
                    {!isInternal(href) && !href.startsWith("mailto:") && <ArrowTopRightOnSquareIcon className="w-3 h-3" />}
                </ChatLink>
            ))}
        </div>
    );
}

// Shown when the assistant offers to email the résumé; nothing is sent until the visitor confirms
function ResumeConfirm({ action, onConfirm, onCancel }) {
    if (action.status === "sent") return <p className="mt-2.5 text-xs text-gray-400">Résumé sent to {action.email}</p>;
    if (action.status === "cancelled") return <p className="mt-2.5 text-xs text-gray-400">Not sent</p>;

    const sending = action.status === "sending";
    return (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
            <button
                onClick={onConfirm}
                disabled={sending}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#38BDF8] text-gray-900 font-semibold hover:bg-[#7dd3fc] transition-colors disabled:opacity-50"
            >
                <EnvelopeIcon className="w-3.5 h-3.5" />
                {sending ? "Sending…" : `Send to ${action.email}`}
            </button>
            {!sending && (
                <button
                    onClick={onCancel}
                    className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-gray-300 hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
            )}
        </div>
    );
}

function ChatWithAI() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState(loadMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        const openHandler = () => setOpen(true);
        window.addEventListener('open-chat', openHandler);
        return () => window.removeEventListener('open-chat', openHandler);
    }, []);

    // Kept for the tab's session so the chat survives opening a project demo and coming back
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch {
            // Storage unavailable (private mode); the chat still works without it
        }
    }, [messages]);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading, open]);

    // On phones the panel covers the page, so close it when a link jumps to a section
    const handleNavigate = (e) => {
        const href = e.currentTarget.getAttribute("href");
        if (href.startsWith("#") && window.innerWidth < 640) setOpen(false);
    };

    const setAction = (index, status) =>
        setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, action: { ...m.action, status } } : m)));

    const sendResume = async (index, email) => {
        setAction(index, "sending");
        try {
            const res = await fetch("/send_resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.result) {
                const error = new Error(data.error);
                error.showToUser = Boolean(data.error);
                throw error;
            }
            setAction(index, "sent");
            setMessages((prev) => [...prev, { role: "assistant", content: data.result }]);
        } catch (error) {
            setAction(index, "pending");
            const content = error.showToUser ? error.message : "Sorry, I couldn't send the email. Please try again later.";
            setMessages((prev) => [...prev, { role: "assistant", error: true, content }]);
        }
    };

    const sendMessage = async (text = input) => {
        const prompt = text.trim();
        if (!prompt || loading) return;

        const history = messages
            .filter((m) => !m.error)
            .slice(-HISTORY_LENGTH)
            .map(({ role, content }) => ({ role, content }));

        setMessages((prev) => [...prev, { role: "user", content: prompt }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/generate_chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, history }),
            });

            const data = await res.json();
            if (!res.ok || !data.result) {
                const error = new Error(data.error || `Request failed with status ${res.status}`);
                // Rate-limit messages tell the visitor how long to wait; other errors stay generic
                error.showToUser = res.status === 429 && Boolean(data.error);
                throw error;
            }
            const action = data.action?.type === "send_resume" ? { ...data.action, status: "pending" } : undefined;
            setMessages((prev) => [...prev, { role: "assistant", content: data.result, ...(action && { action }) }]);
        } catch (error) {
            const content = error.showToUser ? error.message : "Sorry, something went wrong. Please try again.";
            setMessages((prev) => [...prev, { role: "assistant", error: true, content }]);
        }

        setLoading(false);
    };

    return (
        <div className='fixed bottom-5 right-5 z-50 flex flex-col items-end'>
            {open && (
                <div className='mb-3 w-[min(380px,calc(100vw-2.5rem))] h-[min(520px,calc(100dvh-7rem))] flex flex-col rounded-2xl border border-[#38BDF8]/30 bg-gray-900 shadow-2xl overflow-hidden'>
                    <div className='flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-white/10'>
                        <div className='relative flex-shrink-0'>
                            <img src={AvatarPic} alt="" className='w-9 h-9 rounded-full object-cover ring-2 ring-[#38BDF8]/40' />
                            <span className='absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-gray-800' />
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold'>William's AI assistant</p>
                            <p className='text-xs text-gray-400 truncate'>AI-generated · may make mistakes</p>
                        </div>
                        {messages.length > 0 && (
                            <button onClick={() => setMessages([])} disabled={loading} aria-label="Start a new chat" title="New chat" className='p-1 text-gray-400 hover:text-white disabled:opacity-30'>
                                <ArrowPathIcon className='w-4 h-4' />
                            </button>
                        )}
                        <button onClick={() => setOpen(false)} aria-label="Close chat" className='p-1 text-gray-400 hover:text-white'>
                            <XMarkIcon className='w-5 h-5' />
                        </button>
                    </div>

                    <div ref={chatContainerRef} className='flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5'>
                        {messages.length === 0 && !loading && (
                            <div className='pt-4 px-1 space-y-3'>
                                <div className="mr-auto max-w-[85%] p-2.5 rounded-2xl rounded-bl-sm bg-gray-700/60 text-gray-200 text-sm leading-relaxed">
                                    Hi, I'm William's AI assistant. Ask me about my experience, projects, or skills, or how to get in touch.
                                </div>
                                <div className='flex flex-col items-end gap-1.5'>
                                    {STARTER_QUESTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className='text-left text-xs px-3 py-1.5 rounded-full border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/10 transition-colors'
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`p-2.5 rounded-2xl max-w-[85%] text-sm ${
                                    msg.role === "user"
                                        ? "ml-auto bg-[#38BDF8]/20 text-gray-100 rounded-br-sm"
                                        : "mr-auto bg-gray-700/60 text-gray-200 rounded-bl-sm"
                                }`}
                            >
                                {msg.role === "assistant" && !msg.error ? (
                                    <>
                                        <MarkdownMessage text={msg.content} onNavigate={handleNavigate} />
                                        <LinkChips text={msg.content} onNavigate={handleNavigate} />
                                        {msg.action?.type === "send_resume" && (
                                            <ResumeConfirm
                                                action={msg.action}
                                                onConfirm={() => sendResume(index, msg.action.email)}
                                                onCancel={() => setAction(index, "cancelled")}
                                            />
                                        )}
                                    </>
                                ) : (
                                    msg.content
                                )}
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="mr-auto flex items-center space-x-1 p-2.5 rounded-2xl bg-gray-700/60 max-w-fit" aria-label="Assistant is typing">
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
                            maxLength={1000}
                            placeholder="Ask about my experience, projects..."
                            className='flex-1 outline-none bg-white/5 text-base sm:text-sm text-gray-200 placeholder-gray-500 px-3.5 py-2 rounded-full border border-white/10 focus:border-[#38BDF8]/50 transition-colors'
                            autoComplete="off"
                        />
                        <button
                            onClick={() => sendMessage()}
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
                aria-label={open ? "Close chat" : "Open chat with William's AI assistant"}
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
