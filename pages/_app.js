import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Firebase
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Styles
import '../styles/globals.css'

// Components
import Login from './login';
import Loading from '../components/Loading';


function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  
  useEffect(() => {
    if (user) {
      setDoc(doc(db, "users", user.uid), { 
        email: user.email,
        photoURL: user.photoURL,
        timestamp: serverTimestamp(),
      }, { merge: true })
    }
  }, [user])
  
  if (loading) return <Loading />;
  if (!user) return <Login />
  
  // We can do things before. ^^
  return <Component {...pageProps} /> // Everything after routing.
}

export default MyApp
