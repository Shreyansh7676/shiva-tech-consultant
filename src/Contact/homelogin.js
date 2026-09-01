
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
export const Home = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('Successfully logged out');
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };
  const UserContent = () => (
    <>
      <button className='btn btn-secondary btn-md' onClick={handleLogout}>
        LOGOUT
      </button>
      <h3>Welcome {user.displayName}</h3>
      <p>{user.email}</p>
      <div className='photo'>
        <img src={user.photoURL} alt="User avatar" referrerPolicy='no-referrer' />
      </div>
    </>
  );
  const LoginButton = () => (
    <button className='btn btn-primary btn-md' onClick={() => navigate('/contact')}>
      LOGIN
    </button>
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className='box'>
      {user ? <UserContent /> : <LoginButton />}
    </div>
  );
};

export default Home
