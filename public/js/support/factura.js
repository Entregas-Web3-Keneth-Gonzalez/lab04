const db = firebase.firestore();

async function fetchInvoiceData(orderID) {
    console.log("Fetching invoice data...");
    const ordersCollection = db.collection("Orders");
    const orderQuery = ordersCollection.where("OrderID", "==", orderID);
    const orderSnapshot = await orderQuery.get();

    if (orderSnapshot.empty) {
        alert("No se encontró la factura.");
        return;
    }

    const orderData = orderSnapshot.docs[0].data();
    const customerRef = db.collection("Customers").doc(orderData.CustomerID);
    const customerSnapshot = await customerRef.get();
    const customerData = customerSnapshot.exists ? customerSnapshot.data() : {};

    const employeeRef = db.collection("Employees").doc(orderData.EmployeeID.toString());
    const employeeSnapshot = await employeeRef.get();
    const employeeData = employeeSnapshot.exists ? employeeSnapshot.data() : {};

    const orderDetailsCollection = db.collection("OrderDetails");
    const orderDetailsQuery = orderDetailsCollection.where("OrderID", "==", orderID);
    const orderDetailsSnapshot = await orderDetailsQuery.get();
    const orderDetails = orderDetailsSnapshot.docs.map(doc => doc.data());

    displayInvoice(orderData, customerData, employeeData, orderDetails);
}

function displayInvoice(orderData, customerData, employeeData, orderDetails) {
    const mainContent = document.querySelector('main.row');
    const formatDate = (date) => new Date(date).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' });

    mainContent.innerHTML = `
        <h2>Factura #: ${orderData.OrderID}</h2>
        <p>Cliente: ${customerData.CompanyName}</p>
        <p>Contacto: ${customerData.ContactTitle} ${customerData.ContactName}</p>
        <p>Destino: ${orderData.ShipCountry}, ${orderData.ShipCity}, ${orderData.ShipPostalCode}</p>
        <p>Facturada: ${formatDate(orderData.OrderDate)}</p>
        <p>Requerida: ${formatDate(orderData.RequiredDate)}</p>
        <p>Despachada: ${formatDate(orderData.ShippedDate)}</p>
        <p>Empleado: ${employeeData.FirstName} ${employeeData.LastName}</p>
        
        <table class="table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Descuento</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${orderDetails.map(detail => `
                    <tr>
                        <td>${detail.ProductID}</td>
                        <td>${detail.ProductName}</td>
                        <td>${detail.Quantity}</td>
                        <td>${detail.UnitPrice}</td>
                        <td>${detail.Discount}</td>
                        <td>${(detail.Quantity * detail.UnitPrice * (1 - detail.Discount)).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <p><strong>Total: ${orderDetails.reduce((sum, detail) => sum + (detail.Quantity * detail.UnitPrice * (1 - detail.Discount)), 0).toFixed(2)}</strong></p>
    `;
}

// Call this function passing the orderID you want to fetch
fetchInvoiceData(10382);
