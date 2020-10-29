const bookList = document.querySelector('#booking-list');
var flag = false;
var name, judet;
const containerHeight = 720;
const containerWidth = 1101;
var slot, time;
var datePicker;
createEvent();
createEvent2();
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //getting data
        db.collection('medic').doc(user.uid).onSnapshot(doc => {
            document.getElementById('nume-centru').innerHTML = doc.data().name;
            document.getElementById('centruId').innerHTML = doc.data().name;
            name = (doc.data().name).toString();
            console.log(name);
            judet = doc.data().judet;
            document.getElementById('numeCentru').innerHTML = judet;
            db.collection('donationLocation').doc(judet).collection('NewBranch')
                .doc(name).onSnapshot(doc2 => {
                    document.getElementById('adresaData').innerHTML = doc2.data().adresa;
                    document.getElementById('emailCentru').innerHTML = doc.data().email;
                });
            datePicker = document.getElementById('datepicker').value;
            bookingInfo(datePicker);
            for (let i = 0; i < 12; i++) {
                document.getElementById("event" + i).onclick = function () {
                    slot = i;
                    editData(i);
                };
            }
        });

    } else {
        console.log("Nu sunteti autentificat!");
    }
});


function insert() {
    //data: firebase.firestore.Timestamp.fromDate(new Date()),
    var size;
    db.collection("donationLocation").get().then(doc =>
        console.log(doc.size));

    /*  db.collection("donationLocation").get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
              doc.ref.set({
                  noBookingsF: 0,
                  noBookingsM: 0
              }).then(function () {
                  console.log("Document successfully written!");
              });
          });
      });*/
    db.collection("donationLocation").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.update({
                noBookingsF: Math.floor(Math.random() * 10000),
                noBookingsM: Math.floor(Math.random() * 10000)
            }).then(function () {
                console.log("Document successfully written!");
            });
        });
    });
}

function createEvent() {
    var space = 0;
    for (let i = 0; i < 6; i++) {
        let node = document.createElement("DIV");
        node.className = "event";
        node.id = "event" + i;
        node.innerHTML =
            "<span class='title' id='" + i + "'> Liber </span>";
        node.style.marginTop = space + "px";
        document.getElementById("slots").appendChild(node);
        space += 124;
    }
}
function createEvent2() {
    var space2 = 0;
    for (let i = 6; i < 12; i++) {
        let node = document.createElement("DIV");
        node.className = "event";
        node.id = "event" + i;
        node.innerHTML =
            "<span class='title' id='" + i + "'> Liber </span>";
        node.style.marginTop = space2 + "px";
        document.getElementById("slots2").appendChild(node);
        space2 += 124;
    }
}

function cancelBooking() {
    var sex, noF, noM;
    var datePicker = document.getElementById('datepicker').value;
    var modal = document.getElementById("myModal");
    var modal2 = document.getElementById("insertBooking");
    modal2.style.display = "none";
    console.log(slot + " " + datePicker + " " + judet + " " + name);
    var r = confirm("Sunteți sigur că vreți să ștergeți rezervarea?");
    if (r == true) {
        //closeModel();
        modal2.style.display = "none";
        modal.style.display = "none";
        document.getElementById(slot.toString()).innerHTML = 'Liber';
        document.getElementsByClassName("event")[slot].style.borderLeftColor = "#1eb54b";

        db.collection('donationLocation').doc(judet).collection("NewBranch")
            .doc(name).collection(datePicker).doc(slot.toString()).get()
            .then(doc => {
                if (doc.get('sex') != null) {
                    sex = doc.data().sex;
                    db.collection('donationLocation').doc(judet).get()
                        .then(doc2 => {
                            if (sex == "Feminin") {
                                var bookings = doc2.data().noBookingsF;
                                bookings = bookings - 1;
                                console.log(bookings);
                                db.collection('donationLocation').doc(judet).update({
                                    noBookingsF: bookings
                                });
                                console.log("updated");
                            }
                            else if (sex == "Masculin") {
                                var bookings = doc2.data().noBookingsM;
                                bookings = bookings - 1;
                                db.collection('donationLocation').doc(judet).update({
                                    noBookingsM: bookings
                                });
                                console.log("updated");
                            }
                        });
                }
                if (doc.get('identificator') != null) {
                    db.collection('specialCases').doc(doc.data().docIDPacient).get()
                        .then(doc2 => {
                            var bookings = doc2.data().nrBookings;
                            bookings = bookings - 1;
                            console.log(bookings);
                            db.collection('specialCases').doc(doc.data().docIDPacient).update({
                                nrBookings: bookings
                            });
                            console.log("updated");
                        });
                }
            });

        db.collection('donationLocation').doc(judet).collection("NewBranch")
            .doc(name).collection(datePicker).doc(slot.toString()).delete();
    } else {
        console.log("no");
    }
}

function closeModel() {
    var modal = document.getElementById("myModal");
    var modal2 = document.getElementById("insertBooking");
    modal.style.display = "none";
    modal2.style.display = "none";
}

function slots() {
    switch (slot) {
        case 0:
            time = "8:00 - 8:30";
            break;
        case 1:
            time = "8:30 - 9:00";
            break;
        case 2:
            time = "9:00 - 9:30";
            break;
        case 3:
            time = "9:30 - 10:00";
            break;
        case 4:
            time = "10:00 - 10:30";
            break;
        case 5:
            time = "10:30 - 11:00";
            break;
        case 6:
            time = "11:00 - 11:30";
            break;
        case 7:
            time = "11:30 - 12:00";
            break;
        case 8:
            time = "12:00 - 12:30";
            break;
        case 9:
            time = "12:30 - 13:00";
            break;
        case 10:
            time = "13:00 - 13:30";
            break;
        case 11:
            time = "13:30 - 14:00";
            break;
        default:
            time = "00:00-00:00";
    }
    return time;
}

function allLetter(inputtxt) {
    var letters = /^[a-zA-Z'-\s]+$/;
    if (inputtxt.value.match(letters)) {
        return true;
    }
    else {
        return false;
    }
}

function phonenumber(inputtxt) {
    var phoneno = /^\+?(40)\)?[ ]?([1-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{3})$/;
    if (inputtxt.value.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}

function validateemail(email) {
    var x = email.value;
    var atposition = x.indexOf("@");
    var dotposition = x.lastIndexOf(".");
    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
        return false;
    }
    else {
        return true;
    }
}

function saveBooking() {
    var modal = document.getElementById("myModal");
    var modal2 = document.getElementById("insertBooking");
    var bloodG = document.getElementById('blood-select');
    var grupa = bloodG.options[bloodG.selectedIndex].value;
    var datePicker = document.getElementById('datepicker').value;
    if (document.getElementById('insertName').value.trim() == '' || document.getElementById('insertTelefon').value.trim() == ''
        || document.getElementById('insertEmail').value.trim() == '' || grupa == '') {
        alert("Vă rugăm introduceți date valide.");
    }
    else if (!(/^[A-Za-z\s]+$/.test(document.getElementById('insertName').value))) {
        alert("Vă rugăm introduceți un nume valid.");
    }
    else if (!phonenumber(document.getElementById('insertTelefon'))) {
        alert("Vă rugăm introduceți un număr de telefon în formatul afișat.");
    }
    else if (!validateemail(document.getElementById('insertEmail'))) {
        alert("Vă rugăm introduceți un email valid.");
    }
    else {
        modal2.style.display = "none";
        let data = {
            name: document.getElementById('insertName').value,
            telefon: document.getElementById('insertTelefon').value,
            slot: slot,
            time: slots(),
            date: datePicker,
            centreId: name,
            customeName: name,
            email: document.getElementById('insertEmail').value,
            grupa: bloodG.options[bloodG.selectedIndex].text
        };
        db.collection('donationLocation').doc(judet).collection("NewBranch")
            .doc(name).collection(datePicker).doc(slot.toString()).set(data);
        bookingInfo(datePicker);
        document.getElementById('insertName').value = "";
        document.getElementById('insertTelefon').value = "";
        document.getElementById('insertEmail').value = "";
        document.getElementById('blood-select').value = "";
    }
}

function editData(i) {
    //bookingInfo(datePicker);
    var datePicker = document.getElementById('datepicker').value;
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close2")[0];
    // When the user clicks on <span> (x), close the modal

    var modal2 = document.getElementById("insertBooking");
    // Get the <span> element that closes the modal
    var span2 = document.getElementsByClassName("close3")[0];

    db.collection('donationLocation').doc(judet).collection("NewBranch")
        .doc(name).collection(datePicker).doc(i.toString()).onSnapshot(doc => {
            if (doc.exists) {
                document.getElementById("editName").innerHTML = doc.data().name;
                document.getElementById("editEmail").innerHTML = doc.data().email;
                document.getElementById("editTelefon").innerHTML = doc.data().telefon;
                document.getElementById("editBlood").innerHTML = doc.data().grupa;
                modal.style.display = "block";
                span.onclick = function () {
                    modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            } else {
                modal2.style.display = "block";
                span2.onclick = function () {
                    document.getElementById("insertEmail").value = "";
                    document.getElementById("insertName").value = "";
                    document.getElementById("insertTelefon").value = "";
                    document.getElementById("blood-select").value = "";
                    modal2.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function (event) {
                    if (event.target == modal2) {
                        document.getElementById("insertEmail").value = "";
                        document.getElementById("insertName").value = "";
                        document.getElementById("insertTelefon").value = "";
                        document.getElementById("blood-select").value = "";
                        modal2.style.display = "none";
                    }
                }
            }
        });
    /*.catch(err => {
        console.log('Error getting document', err);
    });*/
}

function removedBooked(data) {
    db.collection('donationLocation').doc(judet).collection("NewBranch")
        .doc(name).collection(data).onSnapshot((snapshot) => {
            if (snapshot.docs.length > 0) {
                let changes = snapshot.docChanges();
                changes.forEach(change => {
                    if (change.type == 'removed') {
                        document.getElementById(change.doc.id).innerHTML = 'Liber';
                        document.getElementsByClassName("event")[change.doc.id].style.borderLeftColor = "#1eb54b";
                    }
                });
            }
        });
}

function bookingInfo(data) {
    for (let step = 0; step < 12; step++) {
        document.getElementById(step).innerHTML = 'Liber';
        document.getElementsByClassName("event")[step].style.borderLeftColor = "#1eb54b";
    }
    console.log(judet);
    db.collection('donationLocation').doc(judet).collection("NewBranch")
        .doc(name).collection(data).onSnapshot((snapshot) => {
            if (snapshot.docs.length > 0) {
                snapshot.docs.forEach(doc2 => {
                    if (doc2.get('identificator') != null) {
                        db.collection('specialCases').doc(doc2.data().docIDPacient).get().
                            then(doc => {
                                document.getElementById(doc2.id).innerHTML = doc2.data().name + " &nbsp  <b> / </b>  &nbsp " + doc2.data().grupa + "  &nbsp    " + "<br>" +
                                    doc2.data().telefon + "<br>" +
                                    doc2.data().email + "<br>" + "<b>  *** Donează pentru: " + "<i>" +
                                    doc2.data().patientName + " - " + doc.data().telefon + "</i>" + "  *** </b>";
                                //document.getElementById('tel' + doc2.id).innerHTML = "<b>" + doc2.data().telefon + "</b>";
                                document.getElementsByClassName("event")[doc2.id].style.borderLeftColor = "red";
                            });
                    }
                    else {
                        document.getElementById(doc2.id).innerHTML = doc2.data().name + "<br>" +
                            doc2.data().telefon + "<br>" +
                            doc2.data().email + "<br>" +
                            doc2.data().grupa;
                        //document.getElementById('tel' + doc2.id).innerHTML = "<b>" + doc2.data().telefon + "</b>";
                        document.getElementsByClassName("event")[doc2.id].style.borderLeftColor = "red";
                    }
                });
            } else {
                //alert("Nu există programări în această zi!");
                for (let i = 0; i < 12; i++) {
                    document.getElementById(i).innerHTML = 'Liber';
                    document.getElementsByClassName("event")[i].style.borderLeftColor = "#1eb54b";
                }
            }
        });
    removedBooked(data);
}

function convertJudet(centru) {
    switch (centru) {
        case "CTS Alba":
            return "Alba";

        case "CTS Alexandria":
            return "Teleorman";

        case "CTS Arad":
            return "Arad";

        case "CTS Bacău":
            return "Bacău";

        case "CTS Baia Mare":
            return "Maramureș";

        case "CTS Bârlad":
            return "Vaslui";

        case "CTS Bistriţa":
            return "Bistrița-Năsăud";

        case "CTS Botoşani":
            return "Botoșani";

        case "CTS Braşov":
            return "Brașov";

        case "CTS Brăila":
            return "Brăila";

        case "CTS Buzău":
            return "Buzău";

        case "CTS Călăraşi":
            return "Călărași";

        case "CTS Cluj":
            return "Cluj";

        case "CTS Constanţa":
            return "Constanța";

        case "CTS Craiova":
            return "Dolj";

        case "CTS Târgovişte":
            return "Dâmbovița";

        case "CTS Deva":
            return "Hunedoara";

        case "CTS Petroșani":
            return "Hunedoara";

        case "CTS Dr.Tr. Severin":
            return "Mehedinți";

        case "CTS Focşani":
            return "Vrancea";

        case "CTS Galaţi":
            return "Galați";

        case "CTS Giurgiu":
            return "Giurgiu";

        case "CTS Iaşi":
            return "Iași";

        case "CTS Mc. Ciuc":
            return "Harghita";

        case "CTS Oradea":
            return "Bihor";

        case "CTS Piatra Neamţ":
            return "Neamț";

        case "CTS Piteşti":
            return "Argeș";

        case "CTS Câmpulung Muscel":
            return "Argeș";

        case "CTS Ploieşti":
            return "Prahova";

        case "CTS Reşiţa":
            return "Caraș-Severin";

        case "CTS Rm. Vâlcea":
            return "Vâlcea";

        case "CTS Satu Mare":
            return "Satu Mare";

        case "CTS Sf. Gheorghe":
            return "Covasna";

        case "CTS Sibiu":
            return "Sibiu";

        case "CTS Slatina":
            return "Olt";

        case "CTS Slobozia":
            return "Ialomița";

        case "CTS Suceava":
            return "Suceava";

        case "CTS Tg. Jiu":
            return "Gorj";

        case "CTS Tg. Mureş":
            return "Mureș";

        case "CTS Timișoara":
            return "Timiș";

        case "CTS Tulcea":
            return "Tulcea";

        case "CTS Zalău":
            return "Sălaj";

        case "CTSM Bucureşti":
            return "București";

        case "PRS Spitalul de Urgență Floreasca":
            return "București";

        case "PRS Institutul Clinic Fundeni":
            return "București";

        case "PRS Spitalul Militar":
            return "București";

        case "PRS Spitalul Universitar de Urgență":
            return "București";

        default:
            return "Timiș";
    }
}