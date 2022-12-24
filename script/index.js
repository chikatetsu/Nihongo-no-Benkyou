//Éléments HTML
question = document.getElementById("question");

kanaAll = document.getElementById("kanaAll");
kanaTitle = document.getElementById("kanaTitle");
kana = document.getElementById("kana");
romaAll = document.getElementById("romaAll");
romaTitle = document.getElementById("romaTitle");
roma = document.getElementById("roma");

qcm = document.getElementsByName("qcm");
input = document.getElementsByName("input");
categorie = document.getElementsByName("categorie");
name_cat = document.getElementsByName("name_cat");
difficulty = document.getElementById("difficulty");
form = document.getElementById("form");

var socket = io();
var mots = new Array();



/** Remet à zero le formulaire */
function refresh() {
    mots = [];
    input.forEach(e => {
        e.checked = false;
    });

    kana.style.color = "#000";
    roma.style.color = "#000";
    qcm.forEach((i) => {
        i.style.color = "#fff";
        i.style.textDecoration = "none";
    });

    categorie[0].checked = true;
    categorie[0].checked = false;
}

/** Vérifie que le tableau ne contient pas l'élément donné en paramètre */
function verifDouble(element) {
    if(element == null) {
        socket.emit("suivant");
    }
    else {
        var existe = false;
        for(var i=0; i<mots.length; i++) {
            if(mots[i].id == element.id) {
                existe = true;
                socket.emit("suivant");
            }
        }
        if(!existe) {
            mots.push(element);
        }
    }
}

/** Initialise le formulaire pour le QCM Jap->Fra */
function initJapToFra() {
    //Change le mot à retrouver
    question.innerHTML = mots[0].jap;
    kana.innerHTML = mots[0].kana
    roma.innerHTML = mots[0].roma;
    romaTitle.innerHTML = "Romaji :";
    if(mots[0].kana == null)
        kanaTitle.innerHTML = "";
    else {
        kanaTitle.innerHTML = "Kana :";
    }

    //Change les options du qcm pour ce mot
    var random = Math.floor(Math.random()*3);
    var j = 1;
    for(var i=0; i<qcm.length; i++) {
        if(i == random)
            qcm[i].innerHTML = mots[0].fra;
        else {
            qcm[i].innerHTML = mots[j].fra;
            j++;
        }
    }
}

/** Initialise le formulaire pour le QCM Fra->Jap */
function initFraToJap() {
    //Change le mot à retrouver
    question.innerHTML = mots[0].fra;
    kanaTitle.innerHTML = "";
    romaTitle.innerHTML = "";

    //Change les options du qcm pour ce mot
    var random = Math.floor(Math.random()*3);
    var j = 1;
    for(var i=0; i<qcm.length; i++) {
        if(i == random)
            qcm[i].innerHTML = mots[0].jap;
        else {
            qcm[i].innerHTML = mots[j].jap;
            j++;
        }
    }
}

/** Vérifie les réponses du QCM Jap->Fra et change les styles */
function checkResponseJapToFra(choix) {
    if(choix.innerHTML != mots[0].fra) {
        choix.style.color = "red";
    }
    qcm.forEach((reponse) => {
        if(reponse.innerHTML == mots[0].fra) {
            reponse.style.color = "lime";
        }
        else {
            reponse.style.textDecoration = "line-through";
        }
    });
}

/** Vérifie les réponses du QCM Fra->Jap et change les styles */
function checkResponseFraToJap(choix) {
    if(choix.innerHTML != mots[0].jap) {
        choix.style.color = "red";
    }
    qcm.forEach((reponse) => {
        if(reponse.innerHTML == mots[0].jap) {
            reponse.style.color = "lime";
        }
        else {
            reponse.style.textDecoration = "line-through";
        }
    });
}



//Cache les kana et les romaji et les affiche lors du click
kanaAll.addEventListener("click", (event) => {
    kana.style.color = "#fff";
});
romaAll.addEventListener("click", (event) => {
    roma.style.color = "#fff";
});

//Afiche le résultat des réponses
input.forEach(i => {
    i.addEventListener("click", event => {
        var choix = event.target.nextSibling;
        checkResponseJapToFra(choix);
        //checkResponseFraToJap(choix);
    });
});

//Change la catégorie lors du clic
categorie.forEach(i => {
    i.addEventListener("click", event => {
        console.log("Changement de catégorie : "+event.target.id.substr(3));
        socket.emit("setCategorie", event.target.id.substr(3), mots[0].id);
    });
});

//Change la diffculté lors du changement de la position du curseur
difficulty.addEventListener("change", event => {
    console.log("Changement de difficulté : "+difficulty.value);
    socket.emit("setDifficulty", difficulty.value, mots[0].id);
});



//Récupère les mots choisis aléatoirement
socket.on("option", (mot) => {
    console.log(mot);
    
    if(mots.length < 4) {
        verifDouble(mot);
    }
    if(mots.length == 4) {
        initJapToFra();
        //initFraToJap();
        //Présélectionne la catégorie si elle a été enregistré
        if(mots[0].idCategorie != null) {
            categorie[mots[0].idCategorie -1].checked = true;
        }
        difficulty.value = mots[0].difficulte;
    }
});

//Lors de la réception des catégories
socket.on("categorie", (cat) => {
    for(var i=0; i<categorie.length; i++) {
        name_cat[i].innerHTML = cat[i].nom;
    }
});

/** Envoie au serveur la demande de changer de mot */
function suivant() {
    socket.emit("suivant");
    refresh();
}

window.onload = refresh();