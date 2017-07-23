const {ipcRenderer} = require("electron");
let stateClasses = {
    0: "offline",
    1: "online",
    2: "away",
    3: "busy"
};

ipcRenderer.on("ux-auth.loggedout", (e, a) => {
    window.location.href="login.html";
});

ipcRenderer.on("ux-auth.loggedin", (e, a) => {
    console.log("Hi! Logged in as:");
    console.log(a.user);

    if(!a.user.displayName){
        window.location.href="onboarding.html";
    } else {
        ipcRenderer.send("ui-user.listenUser");
        $("#titleBarUser").text(a.user.displayName);
        $("#appUserMentioname").text(a.user.displayName);
    }
});

ipcRenderer.on("ux-user.userUpdate", (e, a) => {
    console.log(a);

    if(!a){
        // Account doesn't have a status set

    } else {
        $("#appUserStatus").text(a.msg);
        if(a.state <= 4 && a.state >= 0){
            $("#appUserState").attr("class", "state picture").addClass(stateClasses[a.state]);
        } else {
            $("#appUserState").attr("class", "state online picture");
        }
    }
});

$(document).ready(() => {
    ipcRenderer.send("ui-auth.helloworld");
});