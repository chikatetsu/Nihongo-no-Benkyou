//Éléments HTML
var fraAff  = document.getElementById("fraAff");
var japAff  = document.getElementById("japAff");
var kanaAff = document.getElementById("kanaAff");
var romaAff = document.getElementById("romaAff");

var fra  = document.getElementById("fra");
var jap  = document.getElementById("jap");
var kana = document.getElementById("kana");
var roma = document.getElementById("roma");
var categorie = document.getElementsByName("categorie");
var name_cat = document.getElementsByName("name_cat");
var difficulty = document.getElementById("difficulty");

var form = document.getElementById("form");
var socket = io();
var modif = {};

/** Dès que le bouton a été cliqué, envoie une demande de suppression au serveur */
function supprimer() {
    if(confirm("Êtes-vous sûr de vouloir supprimer ce mot du vocabulaire?")) {
        socket.emit("delete", modif.id);
        document.location = "/rechercher";
    }
}

//Affiche les catégories
socket.on("categorie", (cat) => {
    for(var i=0; i<categorie.length; i++) {
        name_cat[i].innerHTML = cat[i].nom;
    }
});

//Affiche le mot dès qu'il est reçu par le client
socket.on("affMot", (res) => {
    console.log(res);
    modif.id = res.id;
    fra.value = res.fra;
    jap.value = res.jap;
    kana.value= res.kana;
    roma.value= res.roma;
    fraAff.innerHTML = res.fra;
    japAff.innerHTML = res.jap;
    kanaAff.innerHTML= res.kana;
    romaAff.innerHTML= res.roma;

    //Présélectionne la catégorie si elle a été enregistré
    if(res.idCategorie != null) {
        categorie[res.idCategorie-1].checked = true;
    }

    difficulty.value = res.difficulte;

    form.setAttribute("action", "/modifier?id="+res.id);
});

form.addEventListener("submit", (event) => {
    //Empèche l'envoie du formulaire
    event.preventDefault();
    
    if(fra.value == "") {
        alert("Votre mot ne possède pas de traduction française");
    }
    else if(jap.value == "") {
        alert("Votre mot ne possède pas de traduction japonaise");
    }
    else if(roma.value == "") {
        alert("Votre mot ne possède pas de transcription en romaji");
    }
    else {
        modif.fra = fra.value;
        modif.jap = jap.value;
        modif.roma= roma.value;
        if(kana.value == "")
            modif.kana = null;
        else
            modif.kana = kana.value;

        modif.difficulte = difficulty.value;
        for(var i=0; i<categorie.length; i++) {
            if(categorie[i].checked) {
                modif.categorie = i+1;
            }
        }
        
        if(confirm("Êtes-vous sûr de vouloir enregistrer les modifications? L'ancienne version du mot ne sera pas sauvegardé")) {
            socket.emit("modification", modif);
            document.location = "/modifier?id="+modif.id;
        }
    }
});