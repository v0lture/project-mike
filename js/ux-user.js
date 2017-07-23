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