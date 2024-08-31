document.getElementById('signin-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const Username = document.getElementById('username').value;
    const Password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:4000/api/v1/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username, Password }),
            // credentials: 'include' // Important to include cookies

        });

        const result = await response.json();
        if (result.success) {
            // Redirect to the "Create Invoice" page
            window.location.href = "../Dashboard/dash.html"; // Make sure index.html is in the correct path
        } else {
            alert(result.message || "Sign in failed.");
        }
    } catch (error) {
        console.error("Error during sign in:", error);
        alert("An error occurred. Please try again later.");
    }
});
