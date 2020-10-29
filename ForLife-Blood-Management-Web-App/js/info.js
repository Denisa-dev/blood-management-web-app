var name, judet;
var tele1, tele2;

document.getElementById("defaultOpenInfo").click();

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        db.collection('medic').doc(user.uid).onSnapshot(doc => {
            document.getElementById('centruId').value = doc.data().name;
            name = (doc.data().name).toString();
            //judet = convertJudet(name);
            judet = doc.data().judet;
            document.getElementById('judetUpdate').value = judet;
            console.log(name + judet);

            db.collection('donationLocation').doc(judet).collection('NewBranch')
                .doc(name).onSnapshot(doc2 => {
                    document.getElementById('emailUpdate').value = doc.data().email;
                    document.getElementById('address').value = doc2.data().adresa;
                    document.getElementById('tel1').value = doc2.data().telefon[0];
                    document.getElementById('tel2').value = doc2.data().telefon[1];
                    console.log(doc2.data().email + doc2.data().adresa + doc2.data().telefon[0] + doc2.data().telefon[1]);
                    tele1 = document.getElementById('tel1').value;
                    tele2 = document.getElementById('tel2').value
                });
        });
    }
});


function openPageInfo(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent-info");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink-info");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

function updateInfo() {
    var adresa, tel1, tel2, name;
    if (document.getElementById('tel1').value.trim() == '' || document.getElementById('tel2').value.trim() == '') {
        alert("Vă rugăm introduceți date valide în câmpurile Telefon.");
    }
    else {
        name = document.getElementById('centruId').value;
        tel1 = document.getElementById('tel1').value;
        tel2 = document.getElementById('tel2').value;

        let data = {
            telefon: [tel1, tel2]
        };
        db.collection('donationLocation').doc(judet).collection('NewBranch')
            .doc(name).update(data).then(function () {
                alert("Date introduse cu succes!");
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
            });
    }
}
function cancelUpdateInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('medic').doc(user.uid).onSnapshot(doc => {
                document.getElementById('centruId').value = doc.data().name;
                name = (doc.data().name).toString();
                judet = convertJudet(name);
                document.getElementById('judetUpdate').value = judet;
                console.log(name + judet);

                db.collection('donationLocation').doc(convertJudet(name)).collection('NewBranch')
                    .doc(name).onSnapshot(doc2 => {
                        document.getElementById('emailUpdate').value = doc2.data().email;
                        document.getElementById('address').value = doc2.data().adresa;
                        document.getElementById('tel1').value = doc2.data().telefon[0];
                        document.getElementById('tel2').value = doc2.data().telefon[1];
                        console.log(doc2.data().email + doc2.data().adresa + doc2.data().telefon[0] + doc2.data().telefon[1]);
                        tele1 = document.getElementById('tel1').value;
                        tele2 = document.getElementById('tel2').value
                    });
            });
        }
    });
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

        case "CTS Timişoara":
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
            return "București";
    }
}