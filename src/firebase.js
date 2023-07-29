// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVSOb7ZA_5yoFPcFhq6-e0SFyfxeA8plQ",
  authDomain: "chatvibes-d3d0b.firebaseapp.com",
  projectId: "chatvibes-d3d0b",
  storageBucket: "chatvibes-d3d0b.appspot.com",
  messagingSenderId: "7683096529",
  appId: "1:7683096529:web:251a04f660382951faeaf0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();




// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }