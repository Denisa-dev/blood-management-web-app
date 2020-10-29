function logoutHere() {
    var modal = document.getElementById("myModalOut");
    modal.style.display = "block";
    // Get the button that opens the modal

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close-out")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function logout2() {
    firebase.auth().signOut().then(function () {
        window.location = "index.html";
    }).catch(function (error) {
        window.alert(error);
    });
}