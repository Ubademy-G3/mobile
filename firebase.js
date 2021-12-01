// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRUanGZYpuMBy5BjydmRAEVgoDHT-Nv5E",
    authDomain: "ubademy-mobile.firebaseapp.com",
    projectId: "ubademy-mobile",
    storageBucket: "ubademy-mobile.appspot.com",
    messagingSenderId: "241878143297",
    appId: "1:241878143297:web:73b561df646333256511c0",
    measurementId: "G-233TRRELBZ"
};

export const app = initializeApp(firebaseConfig);
//export const storage = getStorage(app);

// Initialize Firebase
/*let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}
const auth = firebase.auth()
export { auth };*/

import * as firebase from 'firebase/app'
//import "firebase/auth"
//import "firebase/firestore"
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDRUanGZYpuMBy5BjydmRAEVgoDHT-Nv5E",
  authDomain: "ubademy-mobile.firebaseapp.com",
  projectId: "ubademy-mobile",
  storageBucket: "ubademy-mobile.appspot.com",
  messagingSenderId: "241878143297",
  appId: "1:241878143297:web:73b561df646333256511c0",
  measurementId: "G-233TRRELBZ"
};

if (!firebase.default.apps.length) {
  firebase.default.initializeApp(firebaseConfig);
}

export { firebase };