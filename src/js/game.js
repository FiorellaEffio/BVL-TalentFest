const username= document.getElementById('username');
const userImage= document.getElementById('userImage');
const database = firebase.database();
window.onload = () =>{
   firebase.auth().onAuthStateChanged((user)=>{
       if(user) {
           username.innerHTML=`${user.displayName}`;
           userImage.innerHTML=`<img src="${user.photoURL}" width="90px" alt="user" class="profile-photo">`;
       }
       console.log(user.uid)
   })
}

document.getElementById('to1').addEventListener('click', ()=> {
    let nickname = document.getElementById('nickname').value;
    firebase.auth().onAuthStateChanged((user)=>{
        let userRef = firebase.database().ref('usuarios/'+user.uid).update({
            "nickname" : nickname
        })
    })
})
