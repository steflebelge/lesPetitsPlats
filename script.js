import {recipes} from "./recipes.js";
import {orderStringList, capitalizeFirstLetter, getComparativeString, displayMatchingRecipes, getNewRecetteCarte} from "./utils.js";
import {computeMatchingRecipes} from "./rechercheObjet.js";

//log de la date time du debut
console.log("Debut du script de chargement de la page");

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
let unMatchingRecipes = [];

//remplissage des variables de listes
function fillInVarListes() {
    matchingRecipes.forEach(function (recipeTmp) {
        recipeTmp.ustensils.forEach(function (ustensilTmp) {
            if (!listeUstensiles.find(trucTemp => getComparativeString(trucTemp) === getComparativeString(ustensilTmp))) {
                listeUstensiles.push(capitalizeFirstLetter(ustensilTmp));
            }
        });
        recipeTmp.ingredients.forEach(function (ingredientTmp) {
            if (!listeIngredients.find(trucTemp => getComparativeString(trucTemp) === getComparativeString(ingredientTmp.ingredient))) {
                listeIngredients.push(capitalizeFirstLetter(ingredientTmp.ingredient));
            }
        });

        if (!listeAppareils.find(trucTemp => getComparativeString(trucTemp) === getComparativeString(recipeTmp.appliance))) {
            listeAppareils.push(capitalizeFirstLetter(recipeTmp.appliance));
        }
    });

    //tri par ordre alphabetique des listes
    orderStringList(listeUstensiles);
    orderStringList(listeIngredients);
    orderStringList(listeAppareils);
}

//remplissage des elements html listes
function fillInHtmlListes() {
    //remplissage des unselected restants
    document.querySelector('span#listeUstensiles').lastElementChild.innerHTML = "";
    document.querySelector('span#listeIngredients').lastElementChild.innerHTML = "";
    document.querySelector('span#listeAppareils').lastElementChild.innerHTML = "";
    listeUstensiles.forEach(function (ustensilTmp) {
        document.querySelector('span#listeUstensiles').lastElementChild.innerHTML += "<li data-value='" + ustensilTmp + "' data-type='ustensiles' onclick='updateConditionsArray(this.dataset.type, this.innerText)'>" + ustensilTmp + "</li>";
    });
    listeIngredients.forEach(function (ingredientTmp) {
        document.querySelector('span#listeIngredients').lastElementChild.innerHTML += "<li data-value='" + ingredientTmp + "' data-type='ingredients' onclick='updateConditionsArray(this.dataset.type, this.innerText)'>" + ingredientTmp + "</li>";
    });
    listeAppareils.forEach(function (appareilTmp) {
        document.querySelector('span#listeAppareils').lastElementChild.innerHTML += "<li data-value='" + appareilTmp + "' data-type='appareil' onclick='updateConditionsArray(this.dataset.type, this.innerText)'>" + appareilTmp + "</li>";
    });

    //remplissage des tags selectionnés (selected)

}

//fonction qui met a jour les liste déroulantes avec les element restants selon les recettes correspondantes
function updateHtmlUnselectedListeElements() {
    debugger
}

//fonction appelée sur changement des conditions de recherche
function updateConditionsArray(type, value) {
    console.log("Debut de l'ajout d'un filtre");
    let affinage = false;

    switch (type) {
        case "texte" :
            if(value.includes(conditionsRecherche[type]))
                affinage = true;
            conditionsRecherche[type] = value;
            //si la recherche fais moins de 3 char, on retourne
            if (value.length > 0 && value.length < 3)
                return
            break;
        case "appareil" :
            conditionsRecherche[type] = value;
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
    displayMatchingRecipes();

    console.log("Fin de l'ajout d'un filtre");
}

// setter de matchingRecipes, pour accès depuis fonction de recherche
function setmatchingRecipes(matchingR) {
    matchingRecipes = matchingR;
}

//au chargement on remplit les listes et affiche les recettes
fillInVarListes();
fillInHtmlListes();
displayMatchingRecipes();

//log de la date time de fin
console.log("Fin du script de chargement de la page");

//rend ces fonctions accessible depuis le DOM
window.updateConditionsArray = updateConditionsArray;

//export des variables neccessaires dans les fonctions importées
export {listeIngredients, listeUstensiles, listeAppareils, conditionsRecherche, matchingRecipes, unMatchingRecipes, setmatchingRecipes}

//A FAIRE :

//  - recuperation d'affinage ou non
//  - savoir si la modification est un affinage :
//      si oui => recherche dans matchingRecipes
//      si non => recherche dans unMatchingRecipes

// - Pb de recherche :
//      - test puis pat, pates manquant
//      - vide l input texte -> recherche si tags sur unmatching, sinon aff. toutes recipes ca serais bien !

// - Ré organisation des fonctions : utils, Fnatives, Farray
// - creation d'une branche par import selon Fonctions utilisées
