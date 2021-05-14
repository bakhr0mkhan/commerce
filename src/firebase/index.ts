import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
    apiKey: 'AIzaSyAzCFJLETtKyDUvNnDWF-K22zXhoD_8vHY',
    authDomain: 'ecommerce-4ffa0.firebaseapp.com',
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: "ecommerce-4ffa0",
    storageBucket: "ecommerce-4ffa0.appspot.com",
    messagingSenderId:"147742177751",
    appId: "1:147742177751:web:1440849a208f1cc6603392"
};

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
};


firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();