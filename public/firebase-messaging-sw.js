importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-messaging.js');

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDMNvLMaZmjfbLREOwCeHWp4DTYtXM8SgI",
    authDomain: "olxapp-125.firebaseapp.com",
    databaseURL: "https://olxapp-125.firebaseio.com",
    projectId: "olxapp-125",
    storageBucket: "olxapp-125.appspot.com",
    messagingSenderId: "339015271560"
  };
  firebase.initializeApp(config);

  const messaging = firebase.messaging();
