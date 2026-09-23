
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import { isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from 'firebase/auth';
export const LoggedIn = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const { search } = useLocation();
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  useEffect(() => {
    const authenticateUser = async () => {
      if (user) {
        navigate('/emailauth');
        return;
      }
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let emailFromStorage = localStorage.getItem('email');
        if (!emailFromStorage) {
          emailFromStorage = window.prompt('Please provide your email');
        }
        setIsLoading(true);
        try {
          await signInWithEmailLink(auth, emailFromStorage, window.location.href);
          localStorage.removeItem('email');
          navigate('/emailauth');
        } catch (error) {
          setErrorMessage(error.message);
          navigate('/contact');
        } finally {
          setIsLoading(false);
        }
      }
    };
    authenticateUser();
  }, [user, search, navigate]);
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await sendSignInLinkToEmail(auth, userEmail, {
        url: 'http://consultantmanish.in/emailauth',
        handleCodeInApp: true,
      });
      localStorage.setItem('email', userEmail);
      setInfoMessage('We have sent you an email with a link to sign in');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const LoginForm = () => (
    <form className='form-group custom-form' onSubmit={handleLogin}>
      <label className="mt-2">Email</label>
      <input
        type='email'
        required
        placeholder='Enter Email'
        className='form-control mt-2'
        value={userEmail}
        autoFocus="autofocus"
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <button type='submit' className='btn btn-success btn-md mt-3'>
        {isLoading ? 'Logging you in' : 'Login'}
      </button>
      {errorMessage && <div className='error-msg'>{errorMessage}</div>}
      {infoMessage && <div className='info-msg'>{infoMessage}</div>}
    </form>
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='box'>
      {user ? <div>Please wait...</div> : <LoginForm />}
    </div>
  );
};

export default LoggedIn;