const username= document.getElementById('username');
const userImage= document.getElementById('userImage');
const database = firebase.database();
let userUID; 
window.onload = () =>{
   firebase.auth().onAuthStateChanged((user)=>{
       if(user) {
           username.innerHTML=`${user.displayName}`;
           userImage.innerHTML=`<img src="${user.photoURL}" width="90px" alt="user" class="profile-photo">`;
       }
       userUID = user.uid;
       switchLevel();
   })
}
// termina de mostrarme la data del usuario y almacena el uid
let level0 = document.getElementById('level0');
let level1 = document.getElementById('level1');
let level2 = document.getElementById('level2');
let level3 = document.getElementById('level3');
// PASAR DEL NIVEL 0 AL 1
document.getElementById('to1').addEventListener('click', ()=> {
    let nickname = document.getElementById('nickname').value;
    let userRef = firebase.database().ref('usuarios/'+userUID);
    // escribimos en la base de datos el nickname y aumentamos el nivel
    userRef.update({
        "nickname" : nickname,
        "nivel": 1
    })
    // deberiamos leer el nivel y avanzar
    switchLevel();
})
// PASAR DEL NIVEL 1 AL NIVEL 2
document.getElementById('to2').addEventListener('click', ()=> {
    let sabChoosen = sabOptions.options[sabOptions.selectedIndex].value;
    let userRef = firebase.database().ref('usuarios/'+userUID);
    // escribimos en la base de datos el nickname y aumentamos el nivel
    userRef.update({
        "sab" : sabChoosen,
        "nivel": 2
    })
    switchLevel();
})
const evaluateLevel = (path) => {
    return new Promise((resolved, reject) => {
        firebase.database().ref(path).on('value', function(snapshot) {
            let data = JSON.stringify(snapshot.val(),null,3);
            data = JSON.parse(data);
            resolved(data.nivel);
        })
    })
}
const switchLevel = () => {
    evaluateLevel('usuarios/'+userUID).then(level => {
        switch (level) {
            case 0:
              //Sentencias ejecutadas cuando el resultado de expresion coincide con valor1
              console.log('estas en el nivel 0');
              level0.setAttribute('class', 'show')
              level1.setAttribute('class','hiden')
              level2.setAttribute('class', 'hiden')
              level3.setAttribute('class','hiden')
              break;
            case 1:
              //Sentencias ejecutadas cuando el resultado de expresion coincide con valor2
              console.log('estas en el nivel 1');
              level0.setAttribute('class', 'hiden')
              level1.setAttribute('class','show')
              level2.setAttribute('class', 'hiden')
              level3.setAttribute('class','hiden')
              break;
            case 2:
              //Sentencias ejecutadas cuando el resultado de expresion coincide con valorN
              console.log('estas en el nivel 2')
              level0.setAttribute('class', 'hiden')
              level1.setAttribute('class','hiden')
              level2.setAttribute('class', 'show')
              level3.setAttribute('class','hiden')
              break;
            default:
              //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
              break;
           }
    })
}
