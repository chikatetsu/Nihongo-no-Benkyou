//Éléments HTML
var fra  = document.getElementById("fra");
var jap  = document.getElementById("jap");
var kana = document.getElementById("kana");
var roma = document.getElementById("roma");
var categorie = document.getElementsByName("categorie");
var name_cat = document.getElementsByName("name_cat");
var difficulty = document.getElementById("difficulty");

var result = document.getElementById("result");
var socket = io();
var ajout = {};

//Affiche les catégories
socket.on("categorie", (cat) => {
    for(var i=0; i<categorie.length; i++) {
        name_cat[i].innerHTML = cat[i].nom;
    }
});

//Permet de ne pas envoyer le formulaire
document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();

    //Vérifie que le formulaire possède assez de champs rempli pour être envoyer
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
        ajout.fra = fra.value;
        ajout.jap = jap.value;
        ajout.roma= roma.value;
        if(kana.value == "")
            ajout.kana = null;
        else
            ajout.kana = kana.value;

        ajout.difficulte = difficulty.value;
        for(var i=0; i<categorie.length; i++) {
            if(categorie[i].checked) {
                ajout.categorie = i+1;
            }
        }

        socket.emit("ajouter", ajout);

        fra.value = "";
        jap.value = "";
        kana.value= "";
        roma.value= "";
        difficulty.value = "";
        categorie[0].checked = true;
        categorie[0].checked = false;
    }
});

socket.on("success", (retour) => {
    if(retour)
        result.innerHTML = "Le mot "+ajout.fra+" : "+ajout.jap+" ("+ajout.kana+") "+ajout.roma+" a été ajouté";
    else
        result.innerHTML = "Un problème est survenu lors de l'ajout du mot";
});