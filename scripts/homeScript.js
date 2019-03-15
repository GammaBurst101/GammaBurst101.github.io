var signupForm = document.getElementById("signup");
var loginForm = document.getElementById("login");
var signupBtn = document.getElementById("signupBtn");
var loginBtn = document.getElementById("loginBtn");

function signupClicked() {
	// Hide the login form and display the sign up form
	loginForm.style.display = "none";
	signupForm.style.display = "block";
	
	//Make the sign up button look 'active'
	signupBtn.style.opacity = "0.7";
	loginBtn.style.opacity = "0.4";
}

function loginClicked() {
	// Hide the signup form and display the login form
	signupForm.style.display = "none";
	loginForm.style.display = "block";
	
	//Make the login button look 'active'
	loginBtn.style.opacity = "0.7";
	signupBtn.style.opacity = "0.4";
}