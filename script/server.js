//Intégration des modules
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const path = require("path");
const url = require("url");
const sql = require("mysql2");
var id;
var page;


//Routes des fichiers à ajouter dans les pages
app.get("/nnb.css", (req, res) => {res.sendFile(path.join(__dirname, "..", "/html/nnb.css"));});
app.get("/hamburger.css", (req, res) => {res.sendFile(path.join(__dirname, "..", "/html/hamburger.css"));});
app.get("/index.js", (req, res) => {res.sendFile(path.join(__dirname, "/index.js"));});
app.get("/rechercher.js", (req, res) => {res.sendFile(path.join(__dirname, "/rechercher.js"));});
app.get("/ajouter.js", (req, res) => {res.sendFile(path.join(__dirname, "/ajouter.js"));});
app.get("/modifier.js", (req, res) => {res.sendFile(path.join(__dirname, "/modifier.js"));});
app.get("/icone.ico", (req, res) => {res.sendFile(path.join(__dirname, "..", "/html/icone.ico"));});
app.get("/delete.png", (req, res) => {res.sendFile(path.join(__dirname, "..", "/html/delete.png"));});
app.get("/inserer.png", (req, res) => {res.sendFile(path.join(__dirname, "..", "/html/inserer.png"));});
//Routes des pages HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/html/index.html"));
    page = "/";
});
app.get("/rechercher", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/html/rechercher.html"));
    page = "/rechercher";
});
app.get("/ajouter", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/html/ajouter.html"));
    page = "/ajouter";
});
app.get("/modifier", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/html/modifier.html"));
    page = "/modifier";
    id = url.parse(req.url, true).query.id;
});


//Crée une connexion à la base de données
db = sql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "nnb"
});
db.connect((err) => {
	if(err){
		console.error("Problème lors de la connexion à la base de données : "+err);
	}
	console.log("Connecté à la base de données");
});


//Compte le nombre de mot dans la base de données
var tailleVoc;
db.query("SELECT COUNT(`id`) AS size FROM `voc`",
    async (err,res) => {
        if(err)
            console.error("La requête comptant le nombre de mots dans le vocabulaire n'a pas été exécuté : "+err);
        console.log("tailleVoc="+res[0].size)
        tailleVoc = await res[0].size;
    }
);

/** Envoie le qcm au client */
function emitReponse(socket) {
    console.log("Envoie du qcm à "+socket.id)
    for(var i=0; i<4; i++) {
        db.query(
            "SELECT * FROM `voc` WHERE `id` = ?",
            Math.floor(Math.random()*tailleVoc) + 1,
            async (err,res) => {
                if(err)
                    console.error("La fonction emitReponse() n'a pas été exécuté : "+err);
                else
                    await socket.emit("option", res[0]);
            }
        );
    }
}

/** Récupère et envoie les catégories au client */
function getCategorie(socket) {
    db.query(
        "SELECT * FROM `categorie`",
        async (err,res) => {
            if(err)
                console.log("Les catégories n'ont pas pu être récupéré : "+err);
            else
                await socket.emit("categorie", res);
        }
    );
}

/** Supprime un élément dans la base de donnée à partir de son id */
function supprimer(id) {
    db.query(
        "DELETE FROM `voc` WHERE `id`=?",
        id,
        (err) => {
            if(err)
                console.error("La requête de suppression n'a pas été exécuté : "+err);
            else
                console.log("Le mot en id "+id+" a été supprimé");
        }
    );
}



io.on("connection", (socket) => {
    //PAGE D'EXERCICE
    if(page == "/") {
        //Dès la connexion d'un utilisateur
        emitReponse(socket);
        getCategorie(socket);

        //Lorsque le client appuie sur "suivant", on renvoie d'autres mots
        socket.on("suivant", () => {
            emitReponse(socket);
        });

        socket.on("setCategorie", (idCategorie, idVoc) => {
            db.query(
                "UPDATE `voc` SET `idCategorie`=? WHERE `id`=?",
                [idCategorie, idVoc], 
                (err) => {
                    if(err)
                        console.error("La modification de la catégorie n'a pas été exécuté pour l'id "+idVoc+" : "+err);
                    console.log("id="+idVoc+" new catégorie="+idCategorie);
                }
            );
        });

        socket.on("setDifficulty", (value, idVoc) => {
            db.query(
                "UPDATE `voc` SET `difficulte`=? WHERE `id`=?",
                [value, idVoc],
                (err) => {
                    if(err)
                        console.error("La modification de la difficulté n'a pas été exécuté pour l'id "+idVoc+" : "+err);
                    console.log("id="+idVoc+" new difficulté="+value);
                }
            );
        });
    }
    
    //PAGE DE RECHERCHE
    if(page == "/rechercher") {
        //Permet d'éviter l'exécution de la requête en répétition
        socket.dern = "";
        socket.on("recherche", (recherche) => {
            if(recherche != socket.dern && recherche != "%%") {
                console.log(socket.id+" recherche : "+recherche);
                socket.dern = recherche;
                db.query(
                    "SELECT * FROM `voc` WHERE `fra` LIKE ? OR `jap` LIKE ? OR `kana` LIKE ? OR `roma` LIKE ? ORDER BY `fra` ASC LIMIT 100",
                    [recherche, recherche, recherche, recherche],
                    async (err,res) => {
                        if(err)
                            console.error("La requête de recherche n'a pas été exécuté : "+err);
                        await res.forEach((i) => {
                            socket.emit("result", i);
                        });
                    }
                );
            }
        });
    }

    //PAGE D'AJOUT
    if(page == "/ajouter") {
        getCategorie(socket);

        socket.on("ajouter", (res) => {
            db.query(
                "INSERT INTO `voc` (`fra`, `jap`, `kana`, `roma`, `difficulte`, `idCategorie`) VALUES (?,?,?,?,?,?)",
                [res.fra, res.jap, res.kana, res.roma, res.difficulte, res.categorie],
                (err) => {
                    if(err) {
                        socket.emit("success", false);
                        console.error("La requête d'insertion n'a pas été exécuté : "+err);
                    }
                    else {
                        socket.emit("success", true);
                        console.log(res);
                    }
                }
            );
        });
    }

    //PAGE DE MODIFICATION
    if(page == "/modifier") {
        if(id != undefined) {
            getCategorie(socket);
            console.log("id du mot cliqué : "+id);
            db.query(
                "SELECT * FROM `voc` WHERE `id`=?",
                id,
                async (err,res) => {
                    if(err)
                        console.error("La requête de recherche par id n'a pas été exécuté : "+err);
                    await socket.emit("affMot", res[0]);
                }
            );
        
            socket.dern = "";
            socket.on("modification", (res) => {
                if(socket.dern != res) {
                    socket.dern = res;
                    if(res.id!=null && res.fra!=null && res.roma!=null) {
                        console.log(res);
                        db.query(
                            "UPDATE `voc` SET `fra`=?, `jap`=?, `kana`=?, `roma`=?, `difficulte`=?, `idCategorie`=? WHERE `id`=?",
                            [res.fra, res.jap, res.kana, res.roma, res.difficulte, res.categorie, res.id],
                            (err) => {
                                if(err)
                                    console.error("La requête de modification n'a pas été exécuté : "+err);
                                console.log("La modification a bien été enregistré");
                            }
                        );
                    } else {
                        console.error("Une des valeurs à modifier est null (sauf kana)");
                    }
                }
            });

            socket.on("delete", (idDelete) => {
                console.log("Le mot est prêt à etre supprimé");
                supprimer(idDelete);
            });
        } else {
            console.error("La page de modification ne possède pas l'id du mot à modifier");
        }
    }
});


//Port d'écoute
var port = "8080";
server.listen(port, () => {
    console.log("Serveur démarré sur le port "+port);
});