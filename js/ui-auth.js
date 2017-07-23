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

function register() {
    // hide UI
    loading(true, "Processing...");

    var email = $("#email").val();
    var pass = $("#password").val();
    // if empty
    if(email == "" || pass == ""){
        error(true, "Email and/or password cannot be blank.");
        return;
    }

    // submit to ux-auth.js
    loading(true, "Registering...");
    ipcRenderer.send("ui-auth.register", {email, pass});
}

function login() {
    // hide UI
    loading(true, "Processing...");

    var email = $("#email").val();
    var pass = $("#password").val();
    // if empty
    if(email == "" || pass == ""){
        error(true, "Email and/or password cannot be blank.");
        return;
    }

    // submit to ux-auth.js
    loading(true, "Logging in...");
    ipcRenderer.send("ui-auth.login", {email, pass});
}

// check if already logged in via Keytar
function validateAuth() {
    loading(true, "Checking if you're logged in...");
    ipcRenderer.send("ui-auth.helloworld");
}

// handle return events
ipcRenderer.on("ux-auth.register", (e, a) => {
    if(a.state == "error"){
        error(true, a.error);
    } else {
        validateAuth();
    }
});

ipcRenderer.on("ux-auth.login", (e, a) => {
    if(a.state == "error"){
        error(true, a.error);
    } else {
        validateAuth();
    }
});

ipcRenderer.on("ux-auth.loggedin", (e, a) => {
    if(a.user.displayName){
        window.location.href = "index.html";
    } else {
        window.location.href = "onboarding.html";
    }
});

ipcRenderer.on("ux-auth.loggedout", (e, a) => {
    loading(false);
});