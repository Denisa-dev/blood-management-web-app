
/*document.getElementById("defaultOpenSpecial").click();

function openPageSpecial(pageName, elmnt, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent-info-sp");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink-info-sp");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}*/

function phonenumber(inputtxt) {
    var phoneno = /^\+?(40)\)?[ ]?([1-9]{3})[ ]?([0-9]{3})[ ]?([0-9]{3})$/;
    if (inputtxt.value.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}

function uploadPhoto() {
    var bloodG = document.getElementById('blood-special');
    var grupa = bloodG.options[bloodG.selectedIndex].value;
    if (document.getElementById('persoana').value.trim() == '' || document.getElementById('telSpecial').value.trim() == '' || document.getElementById('descPersoana').value.trim() == ''
        || grupa == '' || document.getElementById('photo').files.length == 0) {
        alert("Vă rugăm introduceți/selectați date valide.");
    } else if (!(/^[A-Za-z\s]+$/.test(document.getElementById('persoana').value))) {
        alert("Vă rugăm introduceți un nume valid.");
    }
    else if (!phonenumber(document.getElementById('telSpecial'))) {
        alert("Vă rugăm introduceți un număr de telefon în formatul afișat.");
    }
    else {
        const storageRef = firebase.storage().ref();

        // File or Blob named mountains.jpg
        const file = document.querySelector("#photo").files[0];

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
                    db.collection('specialCases').add({
                        nume: document.getElementById('persoana').value,
                        grupa: document.getElementById('blood-special').value,
                        descriere: document.getElementById('descPersoana').value,
                        data: firebase.firestore.Timestamp.fromDate(new Date()),
                        centru: document.getElementById('nume-centru').innerHTML,
                        judet: document.getElementById('numeCentru').innerHTML,
                        nrBookings: 0,
                        imageUrl: downloadURL,
                        telefon: document.getElementById('telSpecial').value
                    }).then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        console.log("Document successfully written!")
                        document.getElementById('persoana').value = "";
                        document.getElementById('descPersoana').value = "";
                        document.getElementById('blood-special').value = "";
                        document.getElementById('photo').value = "";
                        document.getElementById('telSpecial').value = "";
                        alert("Date introduse cu succes!");
                    })
                        .catch(function (error) {
                            console.error("Error adding document: ", error);
                            alert("A apărut o eroare. Vă rugăm încercați mai târziu.");
                        });
                    console.log('File available at', downloadURL);
                });
            });
    }
}

function cancelSpecial() {
    document.getElementById('persoana').value = "";
    document.getElementById('descPersoana').value = "";
    document.getElementById('blood-special').value = "";
    document.getElementById('photo').value = "";
    document.getElementById('telSpecial').value = "";
}