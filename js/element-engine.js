function launchWizard() {
    $("#catalogue").hide();
    $("#wizard").show();
}

function layerNav(state) {
    if(state === "show"){
        $("#wizard").hide();
        $("#layertree").show();
    } else {
        $("#wizard").show();
        $("#layertree").hide();
    }
}
