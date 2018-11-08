const loginGoogle = document.getElementById('loginGoogle');
loginGoogle.addEventListener('click', () => {
   var provider = new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider)
   .then(function (result) {
       console.log("inicio sesion");
       writeDatabase(result.user);
   })
   .catch(function (error) {
       console.log(error.code);
       console.log(error.message);
       console.log(error.email);
       console.log(error.credential);
   })
})
//Escribiendo en la base de datos el profile del usuario
const writeDatabase = (user) => {
//muestrame si existe el usuario
var profile = firebase.database().ref().child('usuarios/' + user.uid);
profile.on('value', snap => {
    let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
    userData = JSON.parse(userData);
    if(userData == null) {
    
    var usuario = {
        uid : user.uid,
        monto: 500000,
        nivel: 0
    }
    firebase.database().ref("usuarios/" + usuario.uid)
    .set(usuario)
    console.log(usuario);
    document.location.href = 'src/game.html';
    } else {
    console.log('ya existia el usuario');
    document.location.href = 'src/game.html';
    }
})
}

