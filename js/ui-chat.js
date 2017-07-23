const {ipcRenderer} = require("electron");

ipcRenderer.on("ux-auth.loggedout", (e, a) => {
    window.location.href="login.html";
});

ipcRenderer.on("ux-auth.loggedin", (e, a) => {
    console.log("Hi! Logged in as:");
    console.log(a.user);
});

$(document).ready(() => {
    ipcRenderer.send("ui-auth.helloworld");
});