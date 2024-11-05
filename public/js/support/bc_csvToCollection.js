// JavaScript Document
var db = firebase.apps[0].firestore();
const txtCSV = document.querySelector('#txtCSV');
const btnLoad = document.querySelector('#btnLoad');

btnLoad.addEventListener('click', function() {
    lecturaCSV(txtCSV.files[0]).then(r => {
        txtCSV.value = '';
    });
});

async function lecturaCSV(archivo) {
    const nomarch = archivo.name.split('.')[0];
    const lector = new FileReader();
    lector.readAsText(archivo);
    await esperarSegundos();
    
    if (lector.result != null) {
        let data = lector.result.split('\n');
        let etiquetas = data[0].split(';');
        
        for (let index = 1; index < data.length; index++) {
            const valores = data[index].split(';');
            let salida = {};
            
            for (let index2 = 0; index2 < etiquetas.length; index2++) {
                let rawValue = valores[index2].replace(/"/g, '').trim(); // Remove quotes and trim spaces
                salida[etiquetas[index2]] = detectType(rawValue);
            }
            
            db.collection(nomarch).add(salida).then(function(docRef) {
                console.log("ID del registro: " + docRef.id);
            }).catch(function(FirebaseError) {
                console.log("Error al registrar el dato: " + FirebaseError);
            });
        }
    }
}

// Function to detect and convert the type of a value
function detectType(value) {
    // Check for integer
    if (!isNaN(value) && Number.isInteger(parseFloat(value))) {
        return parseInt(value, 10);
    }
    // Check for float
    if (!isNaN(value) && !Number.isInteger(parseFloat(value))) {
        return parseFloat(value);
    }
    // Check for date (attempt parsing with Date object)
    let dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
        return dateValue;  // Return as Date object
    }
    // Otherwise, treat as a string
    return value;
}

function esperarSegundos() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('resolved');
        }, 5000);
    });
}
