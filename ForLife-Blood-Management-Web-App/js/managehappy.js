const happyList = document.querySelector('#table-body-happy');
var idHappyCase;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        db.collection('medic').doc(user.uid).onSnapshot(doc => {
            db.collection('cases').orderBy('data', 'desc').where("centru", "==", doc.data().name).onSnapshot((snapshot) => {
                if (snapshot.docs.length > 0) {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                        if (change.type == 'added') {
                            renderHappy(change.doc);
                        } else if (change.type == 'removed') {
                            let tr = happyList.querySelector('[data-id=' + change.doc.id + ']');
                            happyList.removeChild(tr);
                        }
                        else if (change.type == 'modified') {
                            let tr = happyList.querySelector('[data-id=' + change.doc.id + ']');
                            // tr.cells[1].removeChild();
                            // tr.cells[2].removeChild;
                            // let elementDiv = document.createElement('div');
                            // elementDiv.style = 'overflow: auto; width: 350px;margin-left: 50px; white-space: nowrap;';
                            // elementDiv.textContent = change.doc.data().opinie;
                            // //cross.className = 'button-case';

                            // let cazDiv = document.createElement('div');
                            // cazDiv.style = 'overflow: auto; width: 350px;margin-left: 50px; white-space: nowrap;';
                            // cazDiv.textContent = change.doc.data().caz;

                            // tr.cells[0].textContent = change.doc.data().pacient;
                            // tr.cells[2].appendChild(elementDiv);
                            // tr.cells[1].appendChild(cazDiv);

                            happyList.removeChild(tr);
                            renderHappy(change.doc)
                        }
                    });
                }
                else {
                    var tb = document.getElementById('table-body-happy');
                    // while tb has children, remove the first one
                    while (tb.childNodes.length) {
                        tb.removeChild(tb.childNodes[0]);
                    }
                }
            });
        })
    }
});

function renderHappy(doc) {

    let tr = document.createElement('tr');
    let persoana = document.createElement('td');
    let caz = document.createElement('td');
    let opinie = document.createElement('td');
    let edit = document.createElement('td');
    let cross = document.createElement('td');
    let div = document.createElement('button');

    div.style = 'background : rgb(0, 204, 102); color : white; width: 50px; outline:none !important';
    div.textContent = 'x';
    cross.appendChild(div);

    edit.className = "fas fa-edit";
    edit.style = "font-size:40px;color: rgb(0, 204, 102); width: 50px; cursor:pointer";

    let elementDiv = document.createElement('div');
    elementDiv.style = 'overflow: auto; width: 350px;margin-left: 50px; white-space: nowrap;';
    elementDiv.textContent = doc.data().opinie;
    opinie.appendChild(elementDiv);
    //cross.className = 'button-case';

    let cazDiv = document.createElement('div');
    cazDiv.style = 'overflow: auto; width: 350px;margin-left: 50px; white-space: nowrap;';
    cazDiv.textContent = doc.data().caz;
    caz.appendChild(cazDiv);

    tr.setAttribute('data-id', doc.id);
    console.log(doc.id);
    persoana.textContent = doc.data().pacient;

    tr.appendChild(persoana);
    tr.appendChild(caz);
    tr.appendChild(opinie);
    tr.appendChild(edit);
    tr.appendChild(cross);

    happyList.appendChild(tr);

    div.addEventListener('click', (e) => {
        var result = confirm("Sigur doriți să ștergeți acest caz?");
        if (result) {
            e.stopPropagation();
            let id = tr.getAttribute('data-id');
            db.collection('cases').doc(id).delete().then(function () {
                console.log("Document deleted with ID: ", id);
                alert("Date șterse cu succes!");
            })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                    alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
                });
        }
    });

    edit.addEventListener('click', (e) => {
        var modal2 = document.getElementById("myFormUpdateHappy");
        let id = tr.getAttribute('data-id');
        idHappyCase = id;
        db.collection('cases').doc(id).onSnapshot(doc => {
            document.getElementById("updatePacient").value = doc.data().pacient;
            document.getElementById("updateCaz").value = doc.data().caz;
            document.getElementById("updateOpinie").value = doc.data().opinie;
            document.getElementById("myFormUpdateHappy").style.display = "block";
        });

        window.onclick = function (event) {
            if (event.target == modal2) {
                modal2.style.display = "none";
            }
        }
    });
}

function loadHappyCases() {
    document.getElementById("happyForm").style.display = "none";
    document.getElementById("happyInfos").style.display = "block";
}

function backHappyCase() {
    document.getElementById("happyInfos").style.display = "none";
    document.getElementById("happyForm").style.display = "block";
}

function cancelHappyCase() {
    document.getElementById("myFormUpdateHappy").style.display = "none";
}

function editHappyCase() {
    if (document.getElementById('updatePacient').value.trim() == '' || document.getElementById('updateCaz').value.trim() == ''
        || document.getElementById('updateOpinie').value.trim() == '') {
        alert("Vă rugăm introduceți date valide în câmpurile afișate.");
    }
    else if (!(/^[A-Za-z\s]+$/.test(document.getElementById('updatePacient').value))) {
        alert("Vă rugăm introduceți un nume valid.");
    }
    else {
        db.collection('cases').doc(idHappyCase).update({
            pacient: document.getElementById('updatePacient').value,
            caz: document.getElementById('updateCaz').value,
            opinie: document.getElementById('updateOpinie').value
        }).then(function () {
            console.log("Document successfully updated!")
            alert("Date actualizate cu succes!");
            document.getElementById("myFormUpdateHappy").style.display = "none";
        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
            });
    }
}