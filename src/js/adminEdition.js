let acciones = document.getElementById('acciones');
var sectorDatabase = firebase.database().ref('sectores/');
sectorDatabase.on('value', function(snapshot) {
  console.log(snapshot)
});
