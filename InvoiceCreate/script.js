// Calculate the price, GST, and total price
function calculateValues() {
  const quantity = parseFloat(document.getElementById('quantity').value) || 0;
  const rate = parseFloat(document.getElementById('rate').value) || 0;
  const price = quantity * rate;
  const gst = price * 0.18;
  const totalPrice = price + gst;

  document.getElementById('price').value = price.toFixed(2);
  document.getElementById('gst').value = gst.toFixed(2);
  document.getElementById('totalPrice').value = totalPrice.toFixed(2);
}

// Print the form
function printForm() {
  window.print();
}

// Handle form submission
document.getElementById('invoiceForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission

  // Create a new FormData object to hold the form data
  const formData = new FormData();
  formData.append('customerName', document.getElementById('customerName').value);
  formData.append('invoiceId', document.getElementById('invoiceId').value);
  formData.append('orderNumber', document.getElementById('orderNumber').value);
  formData.append('invoiceDate', document.getElementById('invoiceDate').value);
  formData.append('terms', document.getElementById('terms').value);
  formData.append('dueDate', document.getElementById('dueDate').value);
  formData.append('salesperson', document.getElementById('salesperson').value);
  formData.append('material', document.getElementById('material').value);
  formData.append('quantity', document.getElementById('quantity').value);
  formData.append('rate', document.getElementById('rate').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('gst', document.getElementById('gst').value);
  formData.append('totalPrice', document.getElementById('totalPrice').value);

  const fileInput = document.getElementById('attachment');
  if (fileInput.files.length > 0) {
      formData.append('attachment', fileInput.files[0]);
  }

  try {
      const response = await fetch('http://localhost:4000/api/v1/Invoice/createInvoice', {
          method: 'POST',
          body: formData
      });

      const result = await response.json();
      if (result.success) {
          alert('Invoice created successfully and emailed.');
      } else {
          alert(result.message || 'Failed to create invoice.');
      }
  } catch (error) {
      console.error('Error during invoice submission:', error);
      alert('An error occurred. Please try again later.');
  }
});
