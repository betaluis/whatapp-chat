import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAkTTMM1oxRn-ePwtcscjiFnq0n6L8hSpY",
    authDomain: "whatsapp-5ad5e.firebaseapp.com",
    projectId: "whatsapp-5ad5e",
    storageBucket: "whatsapp-5ad5e.appspot.com",
    messagingSenderId: "846527593978",
    appId: "1:846527593978:web:b3838f727b8673d5073843"
  };

const app = !getApps().length ?
  initializeApp(firebaseConfig) :
  getApp(); 

//----------------------------------------------------------------
// This wasn't working because I installed firebase@9 
// and Sonny was using v.8. 
//----------------------------------------------------------------
// const app = !firebase.apps.length 
//     ? firebase.initializeApp(firebaseConfig) 
//     : firebase.app();
//----------------------------------------------------------------

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Access to the provider.

export { db, auth, googleProvider };
