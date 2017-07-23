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
        $("#userState").modal("open");
    } else {
        $("#appUserStatus").text(a.msg);
        $("#userStateMessage").text(a.msg);
        if(a.state <= 4 && a.state >= 0){
            $("#appUserState").attr("class", "state picture").addClass(stateClasses[a.state]);
        } else {
            $("#appUserState").attr("class", "state online picture");
        }
    }
});

ipcRenderer.on("ux-user.updateUserState", (e, a) => {
    $("#userState").modal("close");
    if(a.state == "error"){
        Materialize.toast("An error occurred while updating status, try again later.", 1500);
    } else {
        Materialize.toast("Status updated", 1000);
    }
});

$(document).ready(() => {
    ipcRenderer.send("ui-auth.helloworld");
    $('select').material_select();
    $('.modal').modal();
});

function modalUpdateUser() {
    var msg = $("#userStateMessage").val();
    var state = $("#userStatus").val();

    if(state >= 0 && state <= 4){
        ipcRenderer.send("ui-user.updateUserState", {state, msg});
    } else {
        ipcRenderer.send("ui-user.updateUserState", {state:1,msg});
    }
}