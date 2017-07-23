const {ipcRenderer} = require("electron");

ipcRenderer.on("ux-auth.loggedout", (e, a) => {
    window.location.href="login.html";
});

ipcRenderer.on("ux-auth.loggedin", (e, a) => {
    console.log("Hi! Logged in as:");
    console.log(a.user);

    if(!a.user.displayName){
        window.location.href="onboarding.html";
    }
});

$(document).ready(() => {
    ipcRenderer.send("ui-auth.helloworld");
});