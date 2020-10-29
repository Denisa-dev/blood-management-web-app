const visibilityToggle = document.getElementById('visibility_off');
const input_pass = document.querySelector('.input-container input');

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //user is signed in
        /* document.getElementById("login_div").style.display = "none";
        document.getElementById("btnLogin_div").style.display = "none";
        document.getElementById("btnLogout_div").style.display = "block"; */
        window.location = "main.html";
    }
    //else {
    //  window.alert("Nu sunteți autentificat!");
    //}
});

function preventBack() {
    window.history.forward();
}

setTimeout("preventBack()", 0);

window.onunload = function () { null };

var images = [
    "D:/LICENTA/WebApp/images/purple.jpg",
    "D:/LICENTA/WebApp/images/pink.jpg",
    "D:/LICENTA/WebApp/images/microscope.jpg",
    "D:/LICENTA/WebApp/images/yellow.jpg",
    "D:/LICENTA/WebApp/images/hand.jpg"
]
var imageHead = document.getElementById("my-body");

var i = 0;
setInterval(function () {
    imageHead.style.backgroundImage = "url(" + images[i] + ")";
    i = i + 1;
    if (i == images.length) {
        i = 0;
    }
}, 3000);

var password = true;
visibilityToggle.addEventListener('click', function () {
    if (password) {
        input_pass.setAttribute('type', 'text');
        visibilityToggle.innerHTML = 'visibility';
    } else {
        input_pass.setAttribute('type', 'password');
        visibilityToggle.innerHTML = 'visibility_off';
    }
    password = !password;
});

function login() {
    var userEmail = document.getElementById("email_field").value;
    var userPass = document.getElementById("password_field").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert(errorCode + "\n" + "Nu ați introdus date valide: " + errorMessage);
    });
}

function resetPassword() {
    window.location = "resetpassword.html";
}

function resetPass() {
    var auth = firebase.auth();
    var email = document.getElementById("email_reset_pass").value;
    if (email != "") {
        auth.sendPasswordResetEmail(email).then(function () {
            window.alert("Trimitere reușită. Verificați-vă contul de email.")
            window.location = "index.html";
        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            window.alert("Eroare: " + errorCode + "\n" + errorMessage);
        });
    } else {
        window.alert("Vă rugăm introduceți email-ul mai întâi.")
    }
}

function back() {
    window.location = "index.html";
}

function logout() {
    firebase.auth().signOut().then(function () {
        swal({
            position: 'top-end',
            icon: 'success',
            iconColor: 'green',
            title: 'Ieșire cu succes!',
            showConfirmButton: true,
            timer: 1500
        })
    }).catch(function (error) {
        window.alert(error);
    });
}