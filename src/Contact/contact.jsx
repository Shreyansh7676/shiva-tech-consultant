import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useEffect } from 'react';

import AOS from "aos"
import LogIn from './Login'
import "aos/dist/aos.css"
import usePageContent from '../content/usePageContent';
import RichContent from '../content/RichContent';

export function Contact() {
  const sections = usePageContent('contact');
  useEffect(() => {
    AOS.init({ duration: 1200 })
  })
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, form.current, {
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          alert('Your message has been sent! We would revert back to you soon.')

        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };
  

  return (
    <>

      <div className="relative w-full h-4/5 scroll-smooth">
        <div className="relative isolate z-0 bg-gradient-to-t from-green-400 to-sky-500 px-6 py-6 lg:px-8">
          <div className="relative mx-auto max-w-2xl py-24">
            <div className="absolute inset-x-0 -top-[4rem] -z-10 transform-gpu overflow-hidden blur-3xl md:-top-[10rem]">

            </div>
            <div className="text-center" data-aos="fade-up">
              <RichContent html={sections.introduction.html} className="text-md leading-8 text-gray-600 text-justify" />
              <div className="mt-3">
                <LogIn />
              </div>


              <div className="flex items-center justify-center gap-x-2">
                <div className="space-y-2 items-center justify-center md:flex-row md:space-x-2 md:space-y-0  ">
                  <p className="text-lg text-gray-600 mt-12">-------------------or-------------------</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/20 mx-auto max-w-7xl px-4 items-center rounded-3xl place-items-center justify-center scroll-smooth" data-aos="fade-up">

            <div className="mx-auto max-w-7xl py-8 md:py-24">
              <div className="grid items-center justify-items-center gap-x-4 gap-y-2  lg:grid-cols-2">
                {/* contact from */}
                <div className="flex items-center justify-center">
                  <div className="px-2 md:px-12">
                    <RichContent html={sections.formIntro.html} className="text-sm leading-8 text-gray-600 text-justify" />
                    <form action="" className="mt-8 space-y-4" ref={form} onSubmit={sendEmail} >
                      <div className="grid w-full gap-y-4 md:gap-x-4 lg:grid-cols-2">
                        <div className="grid w-full items-center gap-1.5">
                          <label
                            className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="first_name"
                          >
                            Your Name
                          </label>
                          <input
                            className="flex max-w-full h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-900 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                            type="text"
                            id="first_name"
                            placeholder="First Name"
                            name="user_name"
                            required
                          />
                        </div>

                      </div>
                      <div className="grid w-full  items-center gap-1.5">
                        <label
                          className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-900 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                          type="text"
                          id="email"
                          name="user_mail"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div className="grid w-full  items-center gap-1.5">
                        <label
                          className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="phone_number"
                        >
                          Phone number
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-900 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                          type="tel"
                          id="phone_number"
                          placeholder="Phone number"
                          name="user_phone"
                          required
                        />
                      </div>
                      <div className="grid w-full  items-center gap-1.5">
                        <label
                          className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="phone_number"
                        >
                          Select Query Type
                        </label>
                        <select name="user_query" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-900 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900">
                          <option>Consultancy</option>
                          <option>Services</option>
                          <option>Manufacturing</option>
                          <option>Sales</option>
                          <option>Others</option>
                        </select>
                      </div>
                      <div className="grid w-full  items-center gap-1.5">
                        <label
                          className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="message"
                          required
                        >
                          Message
                        </label>
                        <textarea
                          className="flex h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-900 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                          id="message"
                          placeholder="Leave us a message"
                          cols={3}
                          name="user_msg"
                        />
                        <input type="submit" value="Send" className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 w-1/4 mt-2" />
                      </div>
                      
                    </form>
                  </div>
                </div>
                <img
                  alt="Contact us"
                  className="hidden max-h-80 w-full rounded-lg object-cover lg:block"
                  src="https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&h=800&q=80"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </>
  )
}

export default Contact;
