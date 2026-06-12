import React, { useState } from "react";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import SectionHeading from './SectionHeading';

function ContactMe() {
    const [alertmessage, setMessage] = useState(null);
    const [sending, setSending] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const message = form.message.value;
        const email = form.email.value;
        const subject = form.subject.value;

        setSending(true);
        fetch('/send_contactme_email', {
            method: "POST",
            body: JSON.stringify({ name, email, subject, message }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setMessage("Your message has been sent successfully!");
                    form.reset();
                } else {
                    setMessage("Failed to send message. Please try again.");
                }
            })
            .catch(() => {
                setMessage("Failed to send message. Please try again.");
            })
            .finally(() => setSending(false));
    }

    const success = alertmessage?.includes("success");

    return (
        <div className='max-w-3xl mx-auto px-6 py-24 text-center'>
            <SectionHeading>Contact me</SectionHeading>

            <p className='text-gray-300 mb-10'>
                Have a question, a project, or just want to say hi? My inbox is always open.
            </p>

            <div className='flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mb-12 text-sm text-gray-300'>
                <div className='flex items-center justify-center gap-2'>
                    <PhoneIcon className='text-[#38BDF8] w-5 h-5' />
                    <p>+65 8131 3189</p>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <EnvelopeIcon className='text-[#38BDF8] w-5 h-5' />
                    <a href="mailto:wwilliam1908@gmail.com" className='hover:text-[#38BDF8] transition-colors'>wwilliam1908@gmail.com</a>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <MapPinIcon className='text-[#38BDF8] w-5 h-5' />
                    <p>Singapore</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} id="contactme_form" className='flex flex-col space-y-3 max-w-xl mx-auto'>
                <div className='flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3'>
                    <input className='contactInput flex-1' placeholder='Name' type='text' id='name' name='name' required />
                    <input className='contactInput flex-1' placeholder='Email' type='email' id='email' name='email' required />
                </div>

                <input className='contactInput' placeholder='Subject' type='text' id='subject' name='subject' required />
                <textarea className='contactInput' placeholder='Message' rows='5' id='message' name='message' required />
                <button
                    disabled={sending}
                    className='bg-[#38BDF8] py-3.5 px-10 rounded-full text-gray-900 font-semibold hover:bg-[#7dd3fc] transition-colors duration-200 disabled:opacity-50'
                >
                    {sending ? 'Sending…' : 'Send message'}
                </button>
            </form>

            {alertmessage && (
                <p className={`mt-6 text-sm ${success ? 'text-green-400' : 'text-red-400'}`}>
                    {alertmessage}
                </p>
            )}
        </div>
    )
}

export default ContactMe
