const {ipcMain} = require("electron");
const firebase = require("firebase");
const uxuser = require("./ux-user.js");

var config = {
    apiKey: "AIzaSyAvPKG4Mz6cpdDXCQvDOrhii-znaOFjHlk",
    authDomain: "project-mike-dad31.firebaseapp.com",
    databaseURL: "https://project-mike-dad31.firebaseio.com",
    projectId: "project-mike-dad31",
    storageBucket: "project-mike-dad31.appspot.com",
    messagingSenderId: "1023242420371"
};
firebase.initializeApp(config);

let window;
let user;

exports.setWindow = (bw) => {
     window = bw;
     uxuser.setFirebase(firebase);
    uxuser.setWindow(window);
}

// register
ipcMain.on("ui-auth.register", (e, a) => {
    errhap = false;
    console.log("Registering...");
    firebase.auth().createUserWithEmailAndPassword(a.email, a.pass).catch((err) => {
        errhap = true;
        e.sender.send("ux-auth.register", {state:"error", error:err.message});
    });
            
    e.sender.send("ux-auth.register", {state:"success"});
});

// login
ipcMain.on("ui-auth.login", (e, a) => {
    console.log("Logging in...");
    firebase.auth().signInWithEmailAndPassword(a.email, a.pass).catch((err) => {
        e.sender.send("ux-auth.login", {state:"error", error:err.message});
        return;
    });
    e.sender.send("ux-auth.login", {state:"success"});
});

ipcMain.on("ui-auth.helloworld", (e, a) => {
    var luser = firebase.auth().currentUser;
    if(luser){
        e.sender.send("ux-auth.loggedin", {user:luser});
    } else {
        e.sender.send("ux-auth.loggedout");
    }
});

// onAuthState
firebase.auth().onAuthStateChanged((user) => {
    if(user){
        window.webContents.send("ux-auth.loggedin", {user});
        user = user;
    } else {
        window.webContents.send("ux-auth.loggedout");
        user = null;
    }
});