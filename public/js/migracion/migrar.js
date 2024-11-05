import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import Papa from 'papaparse';
import { db } from './firebase';  // Asegúrate de importar correctamente tu configuración de Firebase

let selectedFile; // Variable para almacenar el archivo seleccionado

// Función para migrar productos con categorías incluidas
async function migrateProductsWithCategories(file) {
    try {
        const data = await parseCSV(file);

        for (let product of data) {
            const productRef = doc(collection(db, "productos"), product.id);
            await setDoc(productRef, {
                nombre: product.ProductID,
                nombre: product.ProductName,
              
                categoria: {
                    id: product.CategoryID,  // Asegúrate de que coincida con el encabezado en tu CSV
                    nombre: product.CategoryName,
                  
                }
            });
        }
        console.log("Productos con categorías migrados con éxito");
    } catch (error) {
        console.error("Error en la migración: ", error);
    }
}

// Función para procesar el archivo CSV
function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: results => resolve(results.data),
            error: err => reject(err)
        });
    });
}

// Guardar archivo seleccionado en la variable selectedFile
document.querySelector('#inputProductosCategorias').addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
});

// Procesar el archivo seleccionado cuando se haga clic en el botón
document.querySelector('#btnProcesarCSV').addEventListener('click', () => {
    if (selectedFile) {
        migrateProductsWithCategories(selectedFile);
    } else {
        alert("Por favor, selecciona un archivo CSV primero.");
    }
});
