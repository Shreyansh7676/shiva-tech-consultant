import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Contact from './contact';
import { ArrowRight } from 'lucide-react'

export default function CtaOne() {
  const [user, , error] = useAuthState(auth);
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('successfully logged out');
      navigate('/contact');
    }).catch((err) => {
      console.log(err);
    })
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const UserContent = () => (
    <>
      <section className="bg-gradient-to-t from-green-400 to-sky-500 py-48">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full text-center md:max-w-4xl backdrop-blur-sm bg-white/30 py-4 rounded-lg">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl w-full">
              You can contact us at our email:
            </h2>
            <p className="mx-auto mt-4 font-bold max-w-4xl text-base leading-relaxed text-gray-600 px-4">
              shivatechconsultants@gmail.com
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/80"
            >
              Go Back To Contact Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>

      </section>
    </>
  );
  return (
    <div className='box'>
      {user ? <UserContent /> : <Contact />}
    </div>
  )
}
