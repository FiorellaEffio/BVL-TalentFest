const myFunction = () => {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
}
firebase.database().ref('notificaciones/').on('value', (snapshot)=> {
    let notificationData = JSON.stringify(snapshot.val(),null,3);
    notificationData = JSON.parse(notificationData);
    document.getElementById('snackbar').innerHTML = notificationData.title;
    myFunction();
})