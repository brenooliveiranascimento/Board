import firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDATgEGOqBgsbVgGYdBhyDd6Zck4uR696g",
    authDomain: "board-72dba.firebaseapp.com",
    projectId: "board-72dba",
    storageBucket: "board-72dba.appspot.com",
    messagingSenderId: "686924682142",
    appId: "1:686924682142:web:f45668085d1979364fbc8f",
    measurementId: "G-3LG3MM0RCH"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase