Ceci est un projet personnel réalisé dans le but de me familiariser avec NodeJs.

Le but de ce projet est de créer une application web qui génère un QCM de vocabulaire en japonais.
Elle utilise une base de donnée SQL contenant tout le vocabulaire japonais que j'ai pu accumuler depuis le début de mon apprentissage.

Dans la version actuelle :
  - la page "/"
     Affiche un QCM sur tout le vocabulaire contenu dans la base de données
     Le mot à deviner est affiché en japonais, le plus souvent en kanji
     Pour avoir de l'aide, il est possible de cliquer sur "kana" pour afficher le kanji en kana, ou encore "romaji" pour afficher la prononciation du mot avec l'alphabet français
     Le QCM contient 4 propositions de traduction en français pour le mot affiché
     Si la réponse donné est bonne, affiche le mot sélectionné en vert et barre les autres option
     Si la réponse donné est mauvaise, affiche la réponse sélectionné en rouge, la bonne réponse en vert et barre toutes les mauvaises options
     Afin de supporter les versions suivantes, une option "catégorie" et "difficulté" est ajouté en bas du QCM pour caractériser le mot actuel
     
  - la page "/rechercher"
    Permet de rechercher du vocabulaire sur toute la base de données dynamiquement peut importe la langue
    Un clic sur l'un des mots affiché permet d'entrer dans la page de modification
    
  - la page "/modifier"
    Permet de modifier un mot et d'avoir également toutes ses caractéristiques actuelles
    
  - la page "/ajouter"
    Permet d'ajouter du vocabulaire dans la base de données
    Tout les champs sont obligatoires sauf le champs "kana" dans le cas ou le mot japonais n'a pas d'écriture en kanji
    La version actuelle ne supporte pas la catégorie du mot ni sa difficulté
    
Prévu pour les versions futures :
  - Ajout de paramètres pour le QCM
    La version actuelle donne du vocabulaire peut importe la catégorie du mot, ce qui facilite le QCM dans le cas ou le mot est un verbe ou un adjectif car ils sont facilement remarquable
    Les paramètres permettront de choisir les catégories dont on souhaite un QCM
    Il sera également possible de passer de jap->fra à fra->jap pour deviner une traduction japonaise d'un mot français
    
  - Ajout de compte utilisateur
    Afin d'avoir une vraie progression et de permettre à plus de gens d'apprendre sur l'application web, une difficulté a été mis en place pour chaque mots dans la base de données
    Chaque utilisateur aura un grade qui lui débloquera des mots de plus en plus difficile dans le QCM
    Cela permettra aussi de controler qui peut ajouter et modifier du vocabulaire
    Si l'utilisateur n'a pas les droits pour modifier ou ajouter du vocabulaire, il pourra faire des propositions qui seront évalués et ajoutés si pertinentes
    
  - Plus tard, si possible, ajouter un autre jeu en parallèle du QCM pour apprendre les kana (l'alphabet japonais)
  
Nouveaux modes de jeu à venir :
- QCM fra->jap
- QCM jap->fra
- Traduction fra->jap
- Traduction jap->fra
- Prononciation d'un mot en kanji
- Hiragana et Katakana