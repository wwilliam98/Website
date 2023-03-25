import React, {useState} from "react";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import Alert from 'react-bootstrap/Alert';

function ContactMe() {       
    const [alertmessage, setMessage] = useState(null);

    function handleSubmit(event) {
        event.preventDefault();
        const form = document.querySelector('form')
        const name = form.name.value;
        const message = form.message.value;
        const email = form.email.value;
        const subject = form.subject.value;

        // console.log(window.location)
        // window.location.href = `mailto:wwilliam1908@gmail.com?subject=${subject}&body=Hi William, \n My name is ${name}. ${message} (${email})`

        fetch('/send_contactme_email', {
            method: "POST",
            // body: form,
            body : JSON.stringify({name, email, subject, message}),
            headers : {'Content-Type': 'application/json'},
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            if (data.success) {
                setMessage("Your message has been sent successfully!");
            } else {
                setMessage("Failed to send message. Please try again.");
            }
        })
        .catch((error) => {
            setMessage("Failed to send message. Please try again.");
            console.error(error);
        });
    }

    return (
        <div className='relative flex flex-col h-screen overflow-hidden text-center max-w-full md:text-left justify-evenly mx-auto items-center'>
            {/* <h3 className="absolute top-16 p-1 uppercase tracking-[20px] text-gray-400 text-2xl"> */}
            <h3 className="top-16 p-1 mt-10 uppercase tracking-[20px] text-gray-400 text-base font-bold">
                Contact Me
            </h3>
            
            <div className='flex flex-col space-y-10 p-10'>
                <h4 className='text-2xl sm:text-4xl font-semibold text-center'>
                    For any questions, comments, or feedback. Feel free to contact me below.
                    <span>
                    </span>
                </h4>

                <div className='space-y-10'>
                    <div className='flex items-center space-x-5 justify-center'>
                        <PhoneIcon className='text-[#F7AB0A] w-7 h-7 animate-pulse'/>
                        <p className='text-2xl'>+65 9420 0655</p>
                    </div>

                    <div className='flex items-center space-x-5 justify-center'>
                        <EnvelopeIcon className='text-[#F7AB0A] w-7 h-7 animate-pulse'/>
                        <p className='text-2xl'>wwilliam1908@gmail.com</p>
                    </div>

                    <div className='flex items-center space-x-5 justify-center'>
                        <MapPinIcon className='text-[#F7AB0A] w-7 h-7 animate-pulse'/>
                        <p className='text-2xl'>Singapore, Singapore</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} id="contactme_form" className='flex flex-col space-y-2 mx-auto px-10'>
                    <div className='flex space-x-2'>
                        <input className='contactInput' placeholder='Name' type='text' id='name' name='name' required></input>
                        <input className='contactInput' placeholder='Email' type='email' id='email' name='email' required></input>
                    </div>

                    <input className='contactInput' placeholder='Subject' type='text' id='subject' name='subject' required></input>
                    <textarea className='contactInput' placeholder='Message' id='message' name='message' required></textarea>
                    <button className='bg-[#F7AB0A] py-5 px-10 rounded-md text-black font-bold'>Submit</button>
                </form>
            </div>

            {alertmessage && <Alert variant={alertmessage.includes("success") ? "success" : "danger"}>{alertmessage}</Alert>}
        </div>
    )
}

export default ContactMe