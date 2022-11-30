import { initializeApp, getApp, getApps } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
// import {...} from "firebase/database";
import
{
    getDoc, updateDoc, arrayRemove, where, getFirestore, serverTimestamp, collection, addDoc, getDocs, setDoc, doc, onSnapshot, orderBy, query
} from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyB8irfrKmg63JkzAjvZkQm9y42BrbJIIFc",
    authDomain: "signal-clone-bc36a.firebaseapp.com",
    projectId: "signal-clone-bc36a",
    storageBucket: "signal-clone-bc36a.appspot.com",
    messagingSenderId: "770562048381",
    appId: "1:770562048381:web:f091eba4a856f711dd4c14"
};
let app;
if (getApps().length === 0)
{
    app = initializeApp(firebaseConfig)
} else
{
    app = getApp()
}

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { db, auth, collection, addDoc, getDocs, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, serverTimestamp, setDoc, doc, onSnapshot, orderBy, query, getStorage, ref, uploadBytes, getDownloadURL, where, updateDoc, arrayRemove, getDoc }

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase