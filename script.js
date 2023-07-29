import {recipes} from "./recipes.js";
import {
    orderStringList,
    capitalizeFirstLetter,
    getComparativeString,
    displayMatchingRecipes,
} from "./utils.js";
import {computeMatchingRecipes} from "./rechercheNative.js";


//script général, il importe les données neccessaires et gère la navigation
//les fichiers importés correspondront aux différents algorithme de recherche

//set des listes
let listeIngredients = [];
let listeAppareils = [];
let listeUstensiles = [];
let conditionsRecherche = [];
conditionsRecherche["texte"] = "";
conditionsRecherche["ingredients"] = [];
conditionsRecherche["ustensiles"] = [];
conditionsRecherche["appareil"] = "";
let matchingRecipes = recipes;
let startDate = null;
let duree = null;

//remplissage des variables de listes
function fillInVarListes() {
    let newListeUstensiles = JSON.parse(JSON.stringify(conditionsRecherche['ustensiles']));
    let newListeIngredients = JSON.parse(JSON.stringify(conditionsRecherche['ingredients']));
    let newListeAppareils = conditionsRecherche['appareils'] ? JSON.parse(JSON.stringify(conditionsRecherche['appareils'])) : [];

    matchingRecipes.forEach(function (recipeTmp) {
        recipeTmp.ustensils.forEach(function (ustensilTmp) {
            if (!newListeUstensiles.find(trucTemp => getComparativeString(trucTemp) === getComparativeString(ustensilTmp)))
                newListeUstensiles.push(capitalizeFirstLetter(ustensilTmp));

        });
        recipeTmp.ingredients.forEach(function (ingredientTmp) {
            if (!newListeIngredients.find(trucTemp => getComparativeString(trucTemp) === getComparativeString(ingredientTmp.ingredient)))
                newListeIngredients.push(capitalizeFirstLetter(ingredientTmp.ingredient));

        });
        if (!newListeAppareils.find(trucTemp => getComparativeString(trucTemp) === getComparativeString(recipeTmp.appliance)))
            newListeAppareils.push(capitalizeFirstLetter(recipeTmp.appliance));

    });

    listeUstensiles = newListeUstensiles;
    listeIngredients = newListeIngredients;
    listeAppareils = newListeAppareils;

    //tri par ordre alphabetique des listes
    orderStringList(listeUstensiles);
    orderStringList(listeIngredients);
    orderStringList(listeAppareils);
}

//remplissage des elements html listes
function fillInHtmlListes() {
    //vidage des listes
    document.querySelector('div#listeUstensiles').querySelectorAll('ul').forEach(function (listeTmp) {
        listeTmp.innerHTML = "";
    });
    document.querySelector('div#listeIngredients').querySelectorAll('ul').forEach(function (listeTmp) {
        listeTmp.innerHTML = "";
    });
    document.querySelector('div#listeAppareils').querySelectorAll('ul').forEach(function (listeTmp) {
        listeTmp.innerHTML = "";
    });
    document.querySelector('div#tagList').innerHTML = "";

    //remplissage des unselected
    listeUstensiles.forEach(function (ustensilTmp) {
        document.querySelector('div#listeUstensiles').lastElementChild.innerHTML += "<li data-value='" + ustensilTmp + "' data-type='ustensiles' onclick='updateConditionsArray(this.dataset.type, this.innerText)'>" + ustensilTmp + "<img src='img/remove.png' alt=''></li>";
    });
    listeIngredients.forEach(function (ingredientTmp) {
        document.querySelector('div#listeIngredients').lastElementChild.innerHTML += "<li data-value='" + ingredientTmp + "' data-type='ingredients' onclick='updateConditionsArray(this.dataset.type, this.innerText)'>" + ingredientTmp + "<img src='img/remove.png' alt=''></li>";
    });
    listeAppareils.forEach(function (appareilTmp) {
        document.querySelector('div#listeAppareils').lastElementChild.innerHTML += "<li data-value='" + appareilTmp + "' data-type='appareil' onclick='updateConditionsArray(this.dataset.type, this.innerText)'>" + appareilTmp + "<img src='img/remove.png' alt=''></li>";
    });

    //remplissage des tags selectionnés (selected)
    //ingredients
    conditionsRecherche.ingredients.forEach(function (ingTmp) {
        //on recupere l element li associé a l ingredient en cours
        let matchingIngredient = document.querySelector('div#listeIngredients').querySelector('li[data-value="' + ingTmp + '"]');

        //si il est encore dans la liste des non selectionnés, on le deplace
        if (matchingIngredient.parentElement.classList.contains('unselected')) {
            document.querySelector('div#listeIngredients').querySelector('ul.selected').innerHTML += matchingIngredient.outerHTML;
            matchingIngredient.remove();
        }
        document.querySelector('div#tagList').innerHTML += `<span>${ingTmp}<img data-type="ingredients" onclick="updateConditionsArray(this.dataset.type, this.parentElement.innerText)" src="img/close.png"></span>`;
    });
    //appareil
    if (conditionsRecherche.appareil) {
        //on recupere l element li associé a l appareil
        let matchingAppareil = document.querySelector('div#listeAppareils').querySelector('li[data-value="' + conditionsRecherche.appareil + '"]');

        if(!matchingAppareil)
            return;
        //si il est encore dans la liste des non selectionnés, on le deplace
        if (matchingAppareil.parentElement.classList.contains('unselected')) {
            document.querySelector('div#listeAppareils').querySelector('ul.selected').innerHTML += matchingAppareil.outerHTML;
            matchingAppareil.remove();
        }
        document.querySelector('div#tagList').innerHTML += `<span>${conditionsRecherche.appareil}<img data-type="appareil" onclick="updateConditionsArray(this.dataset.type, this.parentElement.innerText)" src="img/close.png"></span>`;
    }
    //ustensiles
    conditionsRecherche.ustensiles.forEach(function (ustensileTmp) {
        //on recupere l element li associé a l ingredient en cours
        let matchingUstensile = document.querySelector('div#listeUstensiles').querySelector('li[data-value="' + ustensileTmp + '"]');

        //si il est encore dans la liste des non selectionnés, on le deplace
        if (matchingUstensile.parentElement.classList.contains('unselected')) {
            document.querySelector('div#listeUstensiles').querySelector('ul.selected').innerHTML += matchingUstensile.outerHTML;
            matchingUstensile.remove();
        }
        document.querySelector('div#tagList').innerHTML += `<span>${ustensileTmp}<img data-type="ustensiles" onclick="updateConditionsArray(this.dataset.type, this.parentElement.innerText)" src="img/close.png"></span>`;
    });
}

//fonction appelée sur changement des conditions de recherche
function updateConditionsArray(type, value) {
    //console.log("Debut de l'ajout d'un filtre");
    startDate = new Date().getTime();
    let affinage = false;

    switch (type) {
        case "texte" :
            if (value.includes(conditionsRecherche[type]))
                affinage = true;
            conditionsRecherche[type] = value;
            //si la recherche fais moins de 3 char, on retourne
            if (value.length > 0 && value.length < 3)
                return
            break;
        case "appareil" :
            if (value === conditionsRecherche[type])
                conditionsRecherche[type] = "";
            else {
                conditionsRecherche[type] = value;
                affinage = true;
            }
            document.querySelector('div#listeAppareils').parentElement.classList.add('hyde');
            break;
        case "ingredients" :
        case "ustensiles" :
            if (!conditionsRecherche[type].find(conditionTmp => getComparativeString(conditionTmp) === getComparativeString(value))) {
                conditionsRecherche[type].push(value);
                affinage = true;
            } else
                conditionsRecherche[type] = conditionsRecherche[type].filter(conditionTmp => {
                    return (getComparativeString(conditionTmp) !== getComparativeString(value))
                });
            break;
    }

    //on calcul la nouvelle liste de recettes correspondantes
    computeMatchingRecipes(affinage);
    //on met a jour nos variables de listes
    fillInVarListes();
    //on met a jour nos listes HTML
    fillInHtmlListes();
    //on affiche les recettes correspondantes
    displayMatchingRecipes(conditionsRecherche['texte']);

    duree = ((new Date().getTime()) - startDate);
    document.querySelector('section#filtres').querySelector('p#nbResultats').innerHTML += "<span>en " + duree + " ms</span>";
    console.log("Fin de l'ajout d'un filtre, durée de la recherche : " + duree + "ms");
}

// setter de matchingRecipes, pour accès depuis fonction de recherche
function setmatchingRecipes(matchingR) {
    matchingRecipes = matchingR;
}

function emptyInputs() {
    document.querySelectorAll('input').forEach(function (inputTmp) {
        inputTmp.value = "";
    });
}

//au chargement on remplit les listes et affiche les recettes
emptyInputs()
fillInVarListes();
fillInHtmlListes();
displayMatchingRecipes();

//log de la date time de fin
//console.log("Fin du script de chargement de la page");

//rend ces fonctions accessible depuis le DOM
window.updateConditionsArray = updateConditionsArray;

//export des variables neccessaires dans les fonctions importées
export {
    listeIngredients,
    listeUstensiles,
    listeAppareils,
    conditionsRecherche,
    matchingRecipes,
    setmatchingRecipes
}

//A FAIRE :
// - fiche fonctionnalité
// - test version en ligne