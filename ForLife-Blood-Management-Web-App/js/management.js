const casesList = document.querySelector('#table-body');
var idCases, imageRefUpdate;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        db.collection('medic').doc(user.uid).onSnapshot(doc => {
            db.collection('specialCases').orderBy('data', 'desc').where("centru", "==", doc.data().name).onSnapshot((snapshot) => {
                if (snapshot.docs.length > 0) {
                    let changes = snapshot.docChanges();
                    changes.forEach(change => {
                        if (change.type == 'added') {
                            renderCases(change.doc);
                        } else if (change.type == 'removed') {
                            let tr = casesList.querySelector('[data-id=' + change.doc.id + ']');
                            casesList.removeChild(tr);
                        }
                        else if (change.type == 'modified') {
                            let tr = casesList.querySelector('[data-id=' + change.doc.id + ']');
                            casesList.removeChild(tr);
                            renderCases(change.doc)
                        }
                    });
                }
                else {
                    var tb = document.getElementById('table-body');
                    // while tb has children, remove the first one
                    while (tb.childNodes.length) {
                        tb.removeChild(tb.childNodes[0]);
                    }
                }
            });
        })
    }
});

function renderCases(doc) {

    let tr = document.createElement('tr');
    let name = document.createElement('td');
    let grupa = document.createElement('td');
    let telefon = document.createElement('td');
    let noBooks = document.createElement('td');
    let desc = document.createElement('td');
    let poza = document.createElement('td');
    let cross = document.createElement('td');
    let edit = document.createElement('td');
    edit.className = "fas fa-edit";
    edit.style = "font-size:40px;color: rgb(221, 172, 94); width: 50px; cursor:pointer";

    let div = document.createElement('button');
    div.style = 'background : rgb(221, 172, 94); color : white; width: 50px;outline:none !important';
    div.textContent = 'x';
    cross.appendChild(div);
    //cross.className = 'button-case';
    let elementDiv = document.createElement('div');
    elementDiv.style = 'overflow: auto; width: 200px;margin-left: 50px; white-space: nowrap;';
    elementDiv.textContent = doc.data().descriere;
    desc.appendChild(elementDiv);

    telefon.style = "width: 20%";

    tr.setAttribute('data-id', doc.id);
    console.log(doc.id);
    name.textContent = doc.data().nume;
    grupa.textContent = doc.data().grupa;
    telefon.textContent = doc.data().telefon;
    noBooks.textContent = doc.data().nrBookings;


    var path = doc.data().imageUrl;
    var filename = path.split('/').pop().split('#')[0].split('?')[0];
    var res = filename.replace("cases%2F", "");

    var imageRef = firebase.storage().refFromURL(doc.data().imageUrl);
    imageRefUpdate = imageRef;

    let hrefElement = document.createElement('a');
    hrefElement.href = doc.data().imageUrl;
    hrefElement.textContent = res;
    hrefElement.target = "_blank";
    poza.appendChild(hrefElement);

    tr.appendChild(name);
    tr.appendChild(grupa);
    tr.appendChild(telefon);
    tr.appendChild(noBooks);
    tr.appendChild(desc);
    tr.appendChild(poza);
    tr.appendChild(edit);
    tr.appendChild(cross);

    casesList.appendChild(tr);

    div.addEventListener('click', (e) => {
        var result = confirm("Sigur doriți să ștergeți cazul?");
        if (result) {
            e.stopPropagation();
            let id = tr.getAttribute('data-id');
            // Delete the file
            imageRef.delete().then(function () {
                // File deleted successfully
            }).catch(function (error) {
                // Uh-oh, an error occurred!
            });
            db.collection('specialCases').doc(id).delete().then(function () {
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
        var modal1 = document.getElementById("myUpdateSpecialForm");
        let id = tr.getAttribute('data-id');
        idCases = id;
        db.collection('specialCases').doc(id).onSnapshot(doc => {
            document.getElementById("persoanaSpecialUpdate").value = doc.data().nume;
            document.getElementById("blood-special-updateForm").value = doc.data().grupa;
            document.getElementById("tel-update-special").value = doc.data().telefon;
            document.getElementById("desc-update-special").value = doc.data().descriere;
            document.getElementById("myUpdateSpecialForm").style.display = "block";
        });

        window.onclick = function (event) {
            if (event.target == modal1) {
                modal1.style.display = "none";
            }
        }
    });
}


function loadSpecialCases() {
    document.getElementById("formSpecialCase").style.display = "none";
    document.getElementById("specialCaseTabel").style.display = "block";
}

function backSpecialCase() {
    document.getElementById("formSpecialCase").style.display = "block";
    document.getElementById("specialCaseTabel").style.display = "none";
}

function cancelSpecialCase() {
    document.getElementById("myUpdateSpecialForm").style.display = "none";
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

function updateSpecialCase() {
    var bloodG = document.getElementById('blood-special-updateForm');
    var grupa = bloodG.options[bloodG.selectedIndex].value;
    if (document.getElementById('persoanaSpecialUpdate').value.trim() == '' || document.getElementById('tel-update-special').value.trim() == '' || document.getElementById('desc-update-special').value.trim() == ''
        || grupa == '') {
        alert("Vă rugăm introduceți/selectați date valide.");
    } else if (!(/^[A-Za-z\s]+$/.test(document.getElementById('persoanaSpecialUpdate').value))) {
        alert("Vă rugăm introduceți un nume valid.");
    }
    else if (!phonenumber(document.getElementById('tel-update-special'))) {
        alert("Vă rugăm introduceți un număr de telefon în formatul afișat.");
    }
    else {
        if (document.getElementById('photo-special-update').files.length == 0) {
            db.collection('specialCases').doc(idCases).update({
                nume: document.getElementById('persoanaSpecialUpdate').value,
                grupa: document.getElementById('blood-special-updateForm').value,
                descriere: document.getElementById('desc-update-special').value,
                telefon: document.getElementById('tel-update-special').value
            }).then(function () {
                console.log("Document successfully updated!")
                alert("Date actualizate cu succes!");
                document.getElementById("myUpdateSpecialForm").style.display = "none";
            })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                    alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
                });
        }
        else {
            imageRefUpdate.delete().then(function () {
                // File deleted successfully
            }).catch(function (error) {
                console.error("Error deleting image: ", error);
            });

            const storageRef = firebase.storage().ref();

            // File or Blob named mountains.jpg
            const file = document.querySelector("#photo-special-update").files[0];

            // Create the file metadata
            var metadata = {
                contentType: file.type
            };
            var d = new Date();
            // Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('cases/' + file.name + "-" + d.getTime()).put(file, metadata);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function () {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        db.collection('specialCases').doc(idCases).update({
                            nume: document.getElementById('persoanaSpecialUpdate').value,
                            grupa: document.getElementById('blood-special-updateForm').value,
                            descriere: document.getElementById('desc-update-special').value,
                            telefon: document.getElementById('tel-update-special').value,
                            imageUrl: downloadURL
                        }).then(function () {
                            console.log("Document successfully updated!")
                            alert("Date actualizate cu succes!");
                            document.getElementById("myUpdateSpecialForm").style.display = "none";
                        })
                            .catch(function (error) {
                                console.error("Error adding document: ", error);
                                alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
                            });
                    });
                });
        }
    }
}