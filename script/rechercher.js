//Éléments HTML
var form = document.getElementById("form");
var rechercher = document.getElementById("rechercher");
var result = document.getElementById("result");
var socket = io();
var cmpt = 0;

/**Transforme le mot recherché afin de faciliter la requête SQL dans le serveur puis l'envoie*/
async function emitRecherche(mot) {
	//Remplace les espaces par des %
	var mot = rechercher.value;
	var trans = mot.replace(" ", "%");
	while(mot != trans) {
		mot = trans;
		trans = trans.replace(" ", "%");
	}
	console.log("On recherche : "+mot);
	//Dès que la modification du mot est terminé, envoie le mot au serveur
	await socket.emit("recherche", "%"+mot+"%");
}

//Lors de la réception du résultat de la recherche
socket.on("result", res => {
	if(cmpt < 100) {
		console.log(res);
		cmpt++;
		var aff = res.fra+" : "+res.jap+" ";
		if(res.kana != null)
			aff += "("+res.kana+") ";
		result.innerHTML += "<p><a href=\"modifier?id="+res.id+"\">"+aff+res.roma+"</a></p>";
		if(cmpt == 100)
			result.innerHTML += "<b>La recherche donne plus de 100 résultats</b>";
	}
});

//Fait une recherche lors de chaque entrée de caractère dans le champs de saisie
rechercher.addEventListener("input", event => {
	//Ne fait pas de recherche si le dernier caractère est un espace
    if(rechercher.value[rechercher.value.length -1] != " ") {
		//Efface les résultats si le champs est vide
		if(rechercher.value != "") {
			emitRecherche(rechercher.value);
		}
		result.innerHTML = "";
		cmpt = 0;
    }
});