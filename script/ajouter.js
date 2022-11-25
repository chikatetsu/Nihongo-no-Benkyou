//Éléments HTML
var fra  = document.getElementById("fra");
var jap  = document.getElementById("jap");
var kana = document.getElementById("kana");
var roma = document.getElementById("roma");
var result = document.getElementById("result");
var socket = io();
var ajouted = {};

//Permet de ne pas envoyer le formulaire
document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    if(fra.value != "") {
        ajouted.fra = fra.value;
        if(jap.value != "") {
            ajouted.jap = jap.value;
            if(roma.value != "") {
                ajouted.roma = roma.value;
                if(kana.value == "")
                    ajouted.kana = null;
                else
                    ajouted.kana = kana.value;
                socket.emit("ajouter", ajouted);
            } else
                alert("Votre mot ne possède pas de transcription en romaji");
        } else
            alert("Votre mot ne possède pas de traduction japonaise");
    } else
        alert("Votre mot ne possède pas de traduction française");
    fra.value = "";
    jap.value = "";
    kana.value= "";
    roma.value= "";
});

socket.on("success", (retour) => {
    if(retour)
        result.innerHTML = "Le mot "+ajouted.fra+" : "+ajouted.jap+" ("+ajouted.kana+") "+ajouted.roma+" a été ajouté";
    else
        result.innerHTML = "Un problème est survenu lors de l'ajout du mot";
});