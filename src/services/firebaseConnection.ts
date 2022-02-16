import firebase from 'firebase';
import 'firebase/firestore';

let firebaseConfig = {
  apiKey: "AIzaSyDpi23HwSOA1ZiT-siYsn2XJNxV_BMDf-s",
  authDomain: "boardyapp-ea303.firebaseapp.com",
  projectId: "boardyapp-ea303",
  storageBucket: "boardyapp-ea303.appspot.com",
  messagingSenderId: "660854342962",
  appId: "1:660854342962:web:4ba42622219e92d92e832b",
  measurementId: "G-2TVN6N7LB7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;