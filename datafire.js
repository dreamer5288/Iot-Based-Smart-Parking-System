// const firebase = require("firebase");
const admin = require("firebase-admin");
const firebaseConfig = {
  apiKey: "AIzaSyDyGqwsdmUca3ixP8QFDGxSKmFU14PlG1s",
  authDomain: "sps-iot-afb6d.firebaseapp.com",
  databaseURL: "https://sps-iot-afb6d-default-rtdb.firebaseio.com",
  projectId: "sps-iot-afb6d",
  storageBucket: "sps-iot-afb6d.appspot.com",
  messagingSenderId: "1057234333590",
  appId: "1:1057234333590:web:c53d82704e12015029b7b7",
  measurementId: "G-C5HWM9VV34"
};
admin.initializeApp(firebaseConfig);
const dbfire = admin.firestore();
const Datafire = dbfire.collection("test");

module.exports = Datafire;