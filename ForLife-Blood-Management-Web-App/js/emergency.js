/*var images = [
    "D:/LICENTA/WebApp/images/leaf.jpg",
    "D:/LICENTA/WebApp/images/light.jpg",
    "D:/LICENTA/WebApp/images/rose.jpg",
    "D:/LICENTA/WebApp/images/water.jpg",
    "D:/LICENTA/WebApp/images/bg-masthead.jpg"
]
var imageHead = document.getElementById("interests");

var i = 0;
setInterval(function () {
    imageHead.style.backgroundImage = "url(" + images[i] + ")";
    i = i + 1;
    if (i == images.length) {
        i = 0;
    }
}, 3000);*/

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpenTab").click();

function openPage(pageName, elmnt, color) {
    if (pageName == "Home") {
        document.getElementById("form-emergency").style.display = "none";
        document.getElementById("emergencyInfos").style.display = "block";
    }
    else if (pageName == "About") {
        document.getElementById("happyForm").style.display = "none";
        document.getElementById("happyInfos").style.display = "block";
    }
    else if (pageName == "Contact") {
        document.getElementById("formSpecialCase").style.display = "none";
        document.getElementById("specialCaseTabel").style.display = "block";
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent-em");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

function saveEmergency() {
    console.log("Document successfully written!");
    //data: firebase.firestore.Timestamp.fromDate(new Date()),
    var bloodG = document.getElementById('blood-select-em');
    var grupa = bloodG.options[bloodG.selectedIndex].value;
    if (document.getElementById('titlu').value.trim() == '' || document.getElementById('desc').value.trim() == ''
        || grupa == '') {
        alert("Vă rugăm introduceți date valide.");
    }
    else {
        console.log("A intrat");
    }
}

function addEmergency() {
    console.log("Document successfully written!");
    //data: firebase.firestore.Timestamp.fromDate(new Date()),
    var bloodG = document.getElementById('blood-select-em');
    var grupa = bloodG.options[bloodG.selectedIndex].value;
    if (document.getElementById('titlu').value.trim() == '' || document.getElementById('desc').value.trim() == ''
        || grupa == '') {
        alert("Vă rugăm introduceți date valide.");
    }
    else {
        console.log("Document successfully written!");
        db.collection('Notifications').add({
            titlu: document.getElementById('titlu').value,
            grupa: document.getElementById('blood-select-em').value,
            descriere: document.getElementById('desc').value,
            data: firebase.firestore.Timestamp.fromDate(new Date()),
            centru: document.getElementById('nume-centru').innerHTML,
            judet: document.getElementById('numeCentru').innerHTML,
        }).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            console.log("Document successfully written!")
            document.getElementById('titlu').value = "";
            document.getElementById('desc').value = "";
            document.getElementById('blood-select-em').value = "";
            alert("Date introduse cu succes!");
        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
            });
    }
}

function cancelEmergency() {
    document.getElementById('titlu').value = "";
    document.getElementById('desc').value = "";
    document.getElementById('blood-select-em').value = "";
}

function allLetter(inputtxt) {
    var letters = /^[A-Za-z]+$/;
    if (inputtxt.value.match(letters)) {
        return true;
    }
    else {
        return false;
    }
}

function addCazReusit() {
    if (document.getElementById('numePacient').value.trim() == '' || document.getElementById('cazPacient').value.trim() == ''
        || document.getElementById('parerePacient').value.trim() == '') {
        alert("Vă rugăm introduceți date valide în câmpurile afișate.");
    }
    else if (!(/^[A-Za-z\s]+$/.test(document.getElementById('numePacient').value))) {
        alert("Vă rugăm introduceți un nume valid.");
    }
    else {
        let data = {
            pacient: document.getElementById('numePacient').value,
            caz: document.getElementById('cazPacient').value,
            opinie: document.getElementById('parerePacient').value,
            centru: document.getElementById('nume-centru').innerHTML,
            judet: document.getElementById('numeCentru').innerHTML,
            data: firebase.firestore.Timestamp.fromDate(new Date())
        };
        db.collection('cases').add(data).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            console.log("Document successfully written!")
            document.getElementById('numePacient').value = "";
            document.getElementById('cazPacient').value = "";
            document.getElementById('parerePacient').value = "";
            alert("Date introduse cu succes!");
        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
            });
    }
}

function cancelCazReusit() {
    document.getElementById('numePacient').value = "";
    document.getElementById('cazPacient').value = "";
    document.getElementById('parerePacient').value = "";
}

function loadDefault() {
    document.getElementById("defaultOpenTab").click();
}