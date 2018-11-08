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
       chargeMyStock();
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
// PASAR DEL NIVEL 2 AL NIVEL 3
document.getElementById('to3').addEventListener('click', ()=> {
    let userRef = firebase.database().ref('usuarios/'+userUID);
    // escribimos en la base de datos el nickname y aumentamos el nivel
    userRef.update({
        "nivel": 3
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
            case 3:
              //Sentencias ejecutadas cuando el resultado de expresion coincide con valorN
              console.log('estas en el nivel 2')
              level0.setAttribute('class', 'hiden')
              level1.setAttribute('class','hiden')
              level2.setAttribute('class', 'hiden')
              level3.setAttribute('class','show')
              showStocks();
              break;
            default:
              //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
              break;
           }
    })
}
const showStocks = () => {
    // stocks.innerHTML = '';

}
let stocks = document.getElementById('stock');
let myStock = document.getElementById('myStock');
// acciones generales
firebase.database().ref('sectores').on('value',(snapshot)=> {
    stocks.innerHTML = '';
    let stocksData = JSON.stringify(snapshot.val(),null,3);
    stocksData = JSON.parse(stocksData);
    sectorsName = Object.keys(stocksData);
    sectorsName.forEach(sector => {
      stocks.innerHTML += `<h1>${sector}</h1>`;
      companiesName = Object.keys(stocksData[sector])
      companiesName.forEach(company => {
          console.log(typeof(sector))
          stocks.innerHTML += `<p>${company}</p>`;
          stocks.innerHTML += `<li>${stocksData[sector][company].vfundamental}</li>`;
          stocks.innerHTML += `<li>${stocksData[sector][company].vmercado}</li>`;
          stocks.innerHTML += `<li>${stocksData[sector][company].cantidad}</li>
          <input type="text" id="${sector}${company}"/>
          <button onclick="buyStock('${sector}','${company}', '${sector}'+'${company}', '${stocksData[sector][company].vmercado}')">Compra</button>`;
      });
    }); 
    chargeMyStock();
})
// mis acciones
const chargeMyStock = () => {
    firebase.database().ref('usuarios/'+userUID+'/acciones').on('value',(snapshot)=> {
        myStock.innerHTML = '';
        let myStockData = JSON.stringify(snapshot.val(),null,3);
        myStockData = JSON.parse(myStockData);
        
        stocksUID = Object.keys(myStockData);
        console.log(stocksUID)
        let resumen = 0;
        stocksUID.forEach(stockUID => {
            console.log(myStockData[stockUID])
            myStock.innerHTML += `<p>Empresa: ${myStockData[stockUID].company}</p>
            <p>Cantidad: ${myStockData[stockUID].cantidad}</p>
            `;
            let vmercadostock;
            firebase.database().ref('sectores/'+myStockData[stockUID].sector +'/'+ myStockData[stockUID].company).once('value',(snapa)=> {
                let stockdata = JSON.stringify(snapa.val(),null,3);
                stockdata = JSON.parse(stockdata);
                console.log(stockdata)
                vmercadostock = stockdata.vmercado
                resumen += stockdata.vmercado*myStockData[stockUID].cantidad;
            })
        });
        console.log(resumen)
        firebase.database().ref('usuarios/'+userUID).once('value', (snap)=> {
            let userData = JSON.stringify(snap.val(),null,3);
            userData = JSON.parse(userData);
            document.getElementById('monto').innerHTML = userData.monto;
            let inversion = 500000 - parseInt(userData.monto);
            document.getElementById('inversion').innerHTML = inversion;
            document.getElementById('resumen').innerHTML = resumen;
        })
    })
}

const buyStock = (sector, company, id, vmercado) => {
    console.log(sector);
    console.log(company);
    let stockCount=(document.getElementById(id).value);
    let userRef = firebase.database().ref('usuarios/'+userUID);
    // escribimos en la base de dnicknameatos el nickname y aumentamos el nivel
    userRef.once('value', (snapshot) => {
        let userData = JSON.stringify(snapshot.val(),null,3);
        userData = JSON.parse(userData);
        let lastMonto = userData.monto;
        userRef.update({
            "monto": lastMonto - stockCount*vmercado,
        })
        firebase.database().ref('usuarios/'+userUID+'/acciones').push({
            sector: sector,
            company: company,
            cantidad: stockCount
        })
    })    
    let stockRef = firebase.database().ref('sectores/'+sector+'/'+company);
    stockRef.once('value', (snapshot) => {
        let stockData = JSON.stringify(snapshot.val(),null,3);
        stockData = JSON.parse(stockData);
        let lastCantidad = stockData.cantidad;
        stockRef.update({
            "cantidad": lastCantidad - stockCount,
        })
    })    
}