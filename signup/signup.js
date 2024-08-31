document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const Username = document.getElementById('username').value;
    const Email = document.getElementById('email').value;
    const Password = document.getElementById('password').value;
    const ConfirmPassword = document.getElementById('confirm-password').value;

    if (Password !== ConfirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch('http://localhost:4000/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username, Email, Password, ConfirmPassword })
        });

        const result = await response.json();
        if (result.success) {
            // Redirect to the sign-in page after successful signup
            window.location.href = '../signin/signin.html';
        } else {
            alert(result.message || "Sign up failed.");
        }
    } catch (error) {
        console.error("Error during sign up:", error);
        alert("An error occurred. Please try again later.");
    }
});
