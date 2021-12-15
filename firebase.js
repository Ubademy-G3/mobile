import * as firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'

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