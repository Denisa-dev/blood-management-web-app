const urgentaList = document.querySelector('#table-body-urg');
var idEmergency;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        db.collection('medic').doc(user.uid).onSnapshot(doc => {
            db.collection('Notifications').orderBy('data', 'desc').where("centru", "==", doc.data().name).onSnapshot((snapshot) => {
                if (snapshot.docs.length > 0) {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                        if (change.type == 'added') {
                            renderNot(change.doc);
                        } else if (change.type == 'removed') {
                            let tr = urgentaList.querySelector('[data-id=' + change.doc.id + ']');
                            urgentaList.removeChild(tr);
                        }
                        else if (change.type == 'modified') {
                            let tr = urgentaList.querySelector('[data-id=' + change.doc.id + ']');
                            // tr.cells[0].textContent = change.doc.data().titlu;
                            // tr.cells[1].textContent = change.doc.data().grupa;
                            // tr.cells[2].textContent = change.doc.data().descriere;

                            urgentaList.removeChild(tr);
                            renderNot(change.doc)
                        }
                    });
                }
                else {
                    var tb = document.getElementById('table-body-urg');
                    // while tb has children, remove the first one
                    while (tb.childNodes.length) {
                        tb.removeChild(tb.childNodes[0]);
                    }
                }
            });
        })
    }
});

function loadEmergencies() {
    document.getElementById("form-emergency").style.display = "none";
    document.getElementById("emergencyInfos").style.display = "block";
}

function renderNot(doc) {

    let tr = document.createElement('tr');
    let titlu = document.createElement('td');
    let grupa = document.createElement('td');
    let desc = document.createElement('td');
    let edit = document.createElement('td');
    let cross = document.createElement('td');
    let div = document.createElement('button');
    //let editDiv = document.createElement('button');
    div.style = 'background : #ff3c3c; color : white; width: 50px;outline:none !important';
    div.textContent = 'x';
    edit.className = "fas fa-edit";
    edit.style = "font-size:40px;color: #ff3c3c; width: 50px; cursor:pointer";
    let elementDiv = document.createElement('div');
    elementDiv.style = 'overflow: auto; width: 300px;margin-left: 50px; white-space: nowrap;';
    cross.appendChild(div);
    //edit.appendChild(editDiv);

    elementDiv.textContent = doc.data().descriere;
    desc.appendChild(elementDiv);
    //cross.className = 'button-case';

    tr.setAttribute('data-id', doc.id);
    console.log(doc.id);
    titlu.textContent = doc.data().titlu;
    grupa.textContent = doc.data().grupa;
    console.log(titlu + grupa + desc);

    tr.appendChild(titlu);
    tr.appendChild(grupa);
    tr.appendChild(desc);
    tr.appendChild(edit);
    tr.appendChild(cross);

    urgentaList.appendChild(tr);

    div.addEventListener('click', (e) => {
        var result = confirm("Sigur doriți să ștergeți urgența?");
        if (result) {
            e.stopPropagation();
            let id = tr.getAttribute('data-id');
            db.collection('Notifications').doc(id).delete().then(function () {
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
        var modal = document.getElementById("myFormUpdateEmergency");
        let id = tr.getAttribute('data-id');
        idEmergency = id;
        db.collection('Notifications').doc(id).onSnapshot(doc => {
            document.getElementById("titluUrg").value = doc.data().titlu;
            document.getElementById("blood-select-urg").value = doc.data().grupa;
            document.getElementById("descUrg").value = doc.data().descriere;
            document.getElementById("myFormUpdateEmergency").style.display = "block";
        });

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    });
}

function backEmergency() {
    document.getElementById("emergencyInfos").style.display = "none";
    document.getElementById("form-emergency").style.display = "block";
}

function closeEmergency() {
    document.getElementById("myFormUpdateEmergency").style.display = "none";
}

function updateEmergency() {
    console.log(idEmergency);
    //data: firebase.firestore.Timestamp.fromDate(new Date()),
    var bloodG = document.getElementById('blood-select-urg');
    var grupa = bloodG.options[bloodG.selectedIndex].value;
    if (document.getElementById('titluUrg').value.trim() == '' || document.getElementById('descUrg').value.trim() == ''
        || grupa == '') {
        alert("Vă rugăm introduceți date valide.");
    }
    else {
        db.collection('Notifications').doc(idEmergency).update({
            titlu: document.getElementById('titluUrg').value,
            grupa: document.getElementById('blood-select-urg').value,
            descriere: document.getElementById('descUrg').value
        }).then(function () {
            console.log("Document successfully updated!")
            alert("Date actualizate cu succes!");
            document.getElementById("myFormUpdateEmergency").style.display = "none";
        })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
            });
    }
}
