const config = {
    apiKey: "AIzaSyC-MOfHuDOZoLNv37qmCVzPtFrWTpZ317c",
    authDomain: "brandhub-c78cc.firebaseapp.com",
    databaseURL: "https://brandhub-c78cc.firebaseio.com",
    projectId: "brandhub-c78cc",
    storageBucket: "brandhub-c78cc.appspot.com",
    messagingSenderId: "921307501081",
    appId: "1:921307501081:web:b47b52812d7eb6013fd088",
    measurementId: "G-3HYVCP65ET"
};

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();