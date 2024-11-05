// Initialize Firestore (ensure Firebase app is initialized)
var db = firebase.firestore();

// HTML container for displaying the result
const resultContainer = document.getElementById('result');

async function fetchAndDisplayData() {
    try {
        // Step 1: Fetch Orders
        const ordersSnapshot = await db.collection('Orders').get();
        const ordersData = [];

        for (const orderDoc of ordersSnapshot.docs) {
            const order = orderDoc.data();
            
            // Step 2: Fetch related Customer and Employee for each order
            const customerDoc = await db.collection('Customers').doc(order.CustomerID).get();
            const employeeDoc = await db.collection('Employees').doc(order.EmployeeID).get();
            
            if (customerDoc.exists && employeeDoc.exists) {
                const customer = customerDoc.data();
                const employee = employeeDoc.data();

                // Step 3: Format the fields as per the requirements
                const formattedOrder = {
                    Cliente: customer.CompanyName,
                    Contacto: `${customer.ContactTitle} ${customer.ContactName}`,
                    Destino: `${customer.Country}, ${customer.City}, ${customer.PostalCode}`,
                    Facturada: formatDate(order.OrderDate),
                    Requerida: formatDate(order.RequiredDate),
                    Despachada: formatDate(order.ShippedDate),
                    Empleado: `${employee.FirstName} ${employee.LastName}`
                };

                // Push the formatted data to an array
                ordersData.push(formattedOrder);
            }
        }

        // Step 4: Display the data in HTML
        displayInHtml(ordersData);
    } catch (error) {
        console.error("Error fetching data from Firestore:", error);
    }
}

// Helper function to format Firestore timestamps
function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate(); // Firestore timestamps to JS Date
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Function to display data in HTML
function displayInHtml(data) {
    resultContainer.innerHTML = ''; // Clear previous content
    data.forEach(order => {
        // Create a div for each order
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order-entry');
        orderDiv.innerHTML = `
            <p><strong>Cliente:</strong> ${order.Cliente}</p>
            <p><strong>Contacto:</strong> ${order.Contacto}</p>
            <p><strong>Destino:</strong> ${order.Destino}</p>
            <p><strong>Facturada:</strong> ${order.Facturada}</p>
            <p><strong>Requerida:</strong> ${order.Requerida}</p>
            <p><strong>Despachada:</strong> ${order.Despachada}</p>
            <p><strong>Empleado:</strong> ${order.Empleado}</p>
            <hr>
        `;
        resultContainer.appendChild(orderDiv);
    });
}

// Call the function to fetch and display data
fetchAndDisplayData();
