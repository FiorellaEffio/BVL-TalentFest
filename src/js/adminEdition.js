let stocks = document.getElementById('stocks');
document.getElementById('changeStock').addEventListener('click', () => {
    let sectorName = selectSector.options[selectSector.selectedIndex].value;
    let companyName = sectorOptions.options[sectorOptions.selectedIndex].value;
    let porcentaje = document.getElementById('percent').value;
    let companyPath = 'sectores/' + sectorName + '/' + companyName;
    getData(companyPath).then(values => {
        console.log(values)
        let lastVMercado = values.vmercado;
        let companyRef = firebase.database().ref(companyPath).update({
            "vmercado" : lastVMercado*porcentaje/100
        })
        console.log(values)
    })
})



const getData = (path) => {
    return new Promise((resolved, reject) => {
        firebase.database().ref(path).on('value', function(snapshot) {
            let data = JSON.stringify(snapshot.val(),null,3);
            data = JSON.parse(data);
            resolved(data);
        })
    })
}
const updateData = (path) => {

}


// Cambiando sectores
const changeSector = () => {
    console.log('cambiando')
    let sectorName = selectSector.options[selectSector.selectedIndex].value;
    let sectorOptions = document.getElementById("sectorOptions");
    sectorOptions.innerHTML = '';
    getData('sectores/'+sectorName).then(sector => {
        let companiesName = Object.keys(sector);
        companiesName.forEach(function(element) {
            let nameOfCompany = document.createElement('option');
            nameOfCompany.innerText = element;
            let sectorOptions = document.getElementById('sectorOptions');
            sectorOptions.appendChild(nameOfCompany);
        })
    })
}
document.getElementById('selectSector').addEventListener("change", changeSector);
changeSector();
