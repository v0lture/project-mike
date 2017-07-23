const {ipcRenderer} = require("electron");

function loading(state = true, msg = "...") {
    if(state) {
        $(".inputs").slideUp();
        $(".loader").slideDown();
        error(false);
    } else {
        $(".inputs").slideDown();
        $(".loader").slideUp();
    }
    $("#loadermsg").html(msg);
}

function error(state = false, msg = "Something happened!"){
    if(state) {
        loading(false);
        $("#errormsgwrap").slideDown();
    } else {
        $("#errormsgwrap").slideUp();
    }
    $("#errormsg").html(msg);
}

function updateUser() {
    // hide UI
    loading(true, "Processing...");

    var user = $("#username").val();
    // if empty
    if(user == ""){
        error(true, "Please set a mention name.");
        return;
    }

    // submit to ux-auth.js
    loading(true, "Updating...");
    ipcRenderer.send("ui-user.mentioname", {mentioname:user,firstime:true});
}

// check if already logged in via Keytar
function validateAuth() {
    loading(true, "Checking if you're logged in...");
    ipcRenderer.send("ui-auth.helloworld");
}

$(document).ready(() => {
    validateAuth();
});

// handle return events
ipcRenderer.on("ux-user.mentioname", (e, a) => {
    console.log(a);
    if(a.state == "error"){
        error(true, a.error);
    } else {
        window.location.href="index.html";
    }
});

ipcRenderer.on("ux-auth.loggedin", (e, a) => {
    loading(false);
});

ipcRenderer.on("ux-auth.loggedout", (e, a) => {
    window.location.href="login.html";
});