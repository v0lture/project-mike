const {ipcMain} = require("electron");

let firebase;
let window;

exports.setWindow = (w) => {
    window = w;
}

exports.setFirebase = (fb) => {
    firebase = fb;
}

ipcMain.on("ui-user.mentioname", (e, a) => {
    // strip out any spaces
    mentioname = a.mentioname.replace(/\s+/g, '');

    console.log("Updating...");

    var user = firebase.auth().currentUser;
    var uid;
    if(user){
        uid = user.uid;
        // update profile on firebase
        user.updateProfile({
            displayName: mentioname
        }).then(() => {
            // successful, now push to realtime
            firebase.database().ref('users/' + uid).set(mentioname);

            if(a.firstime){
                firebase.database().ref("states/" + uid).set({
                    state: 1,
                    msg: "Chatting on Project Mike!"
                });
            }
            e.sender.send("ux-user.mentioname", {state:"success"});
        }, (err) => {
            // error
            e.sender.send("ux-user.mentioname", {state:"error",error:err});
        });
    } else {
        e.sender.send("ux-user.mentioname", {state:"error",error:"Authentication failed"});
    }
});


ipcMain.on("ui-user.listenUser", (e,a) => {
    var user = firebase.auth().currentUser;
    var userState = firebase.database().ref("states/"+user.uid);

    userState.on("value", (data) => {
        window.webContents.send("ux-user.userUpdate", data.val());
    });
});

ipcMain.on("ui-user.updateUserState", (e, a) => {
    var uid = firebase.auth().currentUser.uid;    

    if(a.state >= 0 && a.state <= 4){
        firebase.database().ref("states/" + uid).set({
            state: a.state,
            msg: a.msg
        });

        e.sender.send("ux-user.updateUserState", {state:"success"});
    } else {
        e.sender.send("ux-user.updateUserState", {state:"error","error":"State value must be within 0-4."});
    }
});