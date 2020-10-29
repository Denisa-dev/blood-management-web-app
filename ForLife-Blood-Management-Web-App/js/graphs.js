//import Chart from 'chart.js'
var bgColor;

function openChart(evt, cityName) {
    if (cityName == 'tara') {
        loadPolarArea();
    } else if (cityName == 'judet') {
        loadBarChart();
    }
    else if (cityName == 'sex') {
        loadStackedLine();
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function loadTab() {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 1; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[0].className = tablinks[0].className.replace("active", "");
    }
    document.getElementById("tara").style.display = "block";
    evt.currentTarget.className += " active";
}

//window.chart = require('chart.js');
if (typeof window === 'undefined') {
    global.window = {};
}
//global.window.chart = require('chart.js');
Chart.defaults.polarArea.animation.animateScale = true;
Chart.defaults.global.legend = true;
Chart.defaults.global.tooltips = true;

function loadPolarArea() {
    var judet, total;

    db.collection('donationLocation').get().then((snapshot) => {
        judet = new Array(snapshot.size);
        total = new Array(snapshot.size);
        bgColor = new Array(snapshot.size);
        let i = 0;
        snapshot.forEach(doc => {
            //console.log(doc.data().name);
            judet[i] = doc.id;
            total[i] = doc.data().noBookingsM + doc.data().noBookingsF;
            bgColor[i] = getRandomRgba(0.9);
            //console.log(bgColor[i]);
            i++;
        })
        var ctx = document.getElementById('myChartPolar').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: judet,
                datasets: [{
                    label: '# of Number',
                    data: total,
                    backgroundColor: bgColor,
                    borderColor: bgColor,
                    borderWidth: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                tooltips: {
                    mode: 'index'
                },
                tooltips: {
                    titleFontSize: 20,
                    bodyFontSize: 20,
                },
                legend: {
                    display: true,
                    position: 'left',
                    align: 'start',
                    fullWidth: true,
                    labels: {
                        fontColor: 'rgb(149, 43, 69)',
                        boxWidth: 30,
                        fontSize: 15,
                    }
                },
                responsiveAnimationDuration: 700,
                title: {
                    display: true,
                    text: 'Număr total de donatori pe țară 2020',
                    fontSize: 20
                }
                /* animation: { duration: 4000, animateScale: true } */
            }
        });
    });
}

function loadBarChart() {
    var feminin, masculin;
    db.collection('donationLocation').get().then((snapshot) => {
        judet = new Array(snapshot.size);
        feminin = new Array(snapshot.size);
        masculin = new Array(snapshot.size);
        bgColor = new Array(snapshot.size);
        let i = 0;
        snapshot.forEach(doc => {
            //console.log(doc.data().name);
            judet[i] = doc.id;
            feminin[i] = doc.data().noBookingsF;
            masculin[i] = doc.data().noBookingsM;
            bgColor[i] = getRandomRgba(0.9);
            i++;
        })
        var ctx = document.getElementById('myBarChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: judet,
                datasets: [{
                    label: 'Feminin',
                    type: 'line',
                    borderColor: 'rgb(0, 0, 0)',
                    data: feminin,
                    fill: false
                }, {
                    label: 'Masculin',
                    type: 'line',
                    borderColor: 'rgb(255, 0, 0)',
                    data: masculin,
                    fill: false
                }, {
                    label: 'Feminin',
                    type: 'bar',
                    backgroundColor: 'rgb(255, 102, 102)',
                    backgroundColorHover: 'rgb(255, 102, 102)',
                    borderColor: 'rgb(255, 102, 102)',
                    data: feminin
                }, {
                    label: 'Masculin',
                    type: 'bar',
                    backgroundColor: 'rgb(51, 153, 255)',
                    backgroundColorHover: 'rgb(51, 153, 255)',
                    borderColor: 'rgb(51, 153, 255)',
                    data: masculin
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                tooltips: {
                    titleFontSize: 20,
                    bodyFontSize: 20,
                },
                legend: {
                    display: true,
                    position: 'left',
                    align: 'start',
                    fullWidth: true,
                    labels: {
                        fontColor: 'rgb(149, 43, 69)',
                        boxWidth: 30,
                        fontSize: 17,
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: 17,
                            stepSize: 500
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 17
                        }
                    }]
                },
                title: {
                    display: true,
                    text: 'Număr de donatori în țară pe sexe 2020',
                    fontSize: 20
                }
            }
        });
    });
}

function loadStackedLine() {
    var feminin, masculin, judet;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //getting data
            db.collection('medic').doc(user.uid).onSnapshot(doc => {
                judet = convertJudet(doc.data().name);
                console.log(judet);
                console.log(doc.data().name);
                db.collection('donationLocation').doc(judet).onSnapshot(doc => {
                    feminin = doc.data().noBookingsF;
                    masculin = doc.data().noBookingsM;
                    console.log(feminin);
                    console.log(masculin);
                    var ctx = document.getElementById('myStackedLine').getContext('2d');

                    var data = [{
                        label: 'Feminin',
                        type: 'horizontalBar',
                        data: [feminin],
                        backgroundColor: ["#990033"],
                        hoverBackgroundColor: ["#993366"]
                    },
                    {
                        label: 'Masculin',
                        data: [masculin],
                        type: 'horizontalBar',
                        backgroundColor: ["#006666"],
                        hoverBackgroundColor: ["#003366"]
                    }];

                    var myBarChart = new Chart(ctx, {
                        type: 'horizontalBar',
                        data: {
                            labels: [
                                "Total"
                            ],
                            datasets: data
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            tooltips: {
                                titleFontSize: 20,
                                bodyFontSize: 20,
                            },
                            legend: {
                                display: true,
                                position: 'center',
                                fullWidth: true,
                                labels: {
                                    fontColor: 'rgb(149, 43, 69)',
                                    boxWidth: 30,
                                    fontSize: 17,
                                }
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        fontSize: 20
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        fontSize: 20
                                    }

                                }]
                            },
                            title: {
                                display: true,
                                text: 'Număr de donatori în județ pe sexe 2020',
                                fontSize: 20
                            }
                        }
                    });
                });
            });
        }
    });
}

function getRandomRgba(a) {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
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