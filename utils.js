import {matchingRecipes} from "./script.js";
import {listeIngredients, listeUstensiles, listeAppareils} from "./script.js";

//Met en majuscules la 1ere letttre d'une string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//tri par ordre alphabetique des listes
function orderStringList(list) {
    list.sort(function (a, b) {
        return a.localeCompare(b);
    });
}

//fonction qui supprimer les espaces, passe tout les chars en minuscules, supprime les accents
function getComparativeString(str) {
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

//fonction qui crée une carte a partir d'une recette passée en paramètre
function getNewRecetteCarte(recipeTmp) {
    let carteTmp = document.createElement('div');
    carteTmp.classList.add('carteRecette');

    let imgTmp = document.createElement('img');
    imgTmp.src = "img/" + recipeTmp.image;

    let divTmp = document.createElement('div');

    let time = document.createElement('p');
    time.classList.add('time');
    time.innerText = recipeTmp.time + " min";

    let titreRecette = document.createElement('h2');
    titreRecette.innerText = recipeTmp.name;

    let recette = document.createElement('h3');
    recette.innerText = "RECETTE";

    let description = document.createElement('p');
    description.classList.add('description');
    description.innerText = recipeTmp.description;

    let ingredients = document.createElement('h3');
    ingredients.innerText = "INGREDIENTS";

    let listeIngredientsTmp = document.createElement('span');
    listeIngredientsTmp.classList.add('listeIngredients');

    recipeTmp.ingredients.forEach(ingredientTmp => {
        let divTmp = document.createElement('div');

        let nom = document.createElement('h4');
        nom.innerText = ingredientTmp.ingredient;

        let infos = document.createElement('p');
        infos.innerText = ingredientTmp.quantity ? ingredientTmp.quantity : "-";
        infos.innerText += ingredientTmp.unit ? " " + ingredientTmp.unit : "";

        divTmp.appendChild(nom);
        divTmp.appendChild(infos);

        listeIngredientsTmp.appendChild(divTmp);
    });

    carteTmp.appendChild(imgTmp);
    carteTmp.appendChild(time);

    divTmp.appendChild(titreRecette);
    divTmp.appendChild(recette);
    divTmp.appendChild(description);
    divTmp.appendChild(ingredients);
    divTmp.appendChild(listeIngredientsTmp);

    carteTmp.appendChild(divTmp);

    return carteTmp;
}

//fonction qui affiche la liste des recettes correspondantes
function displayMatchingRecipes() {
    let sectionResultats = document.querySelector('section#resultats');
    sectionResultats.innerHTML = "";

    matchingRecipes.forEach(recipeTmp => {
        let newCarteRecette = getNewRecetteCarte(recipeTmp);
        sectionResultats.appendChild(newCarteRecette);
    });

    document.querySelector('section#filtres').querySelector('p#nbResultats').innerText = matchingRecipes.length + " recettes";
}

//Fonction de filtre des listes de tag
function filterTagList(inputTmp, nomListe) {
    if(inputTmp.value !== "") {
        document.querySelector('span#' + nomListe).lastElementChild.querySelectorAll('li').forEach(function (eltTmp) {
            debugger
            if (getComparativeString(eltTmp.dataset.value).includes(getComparativeString(inputTmp.value))) {
                if (eltTmp.classList.contains('hyde'))
                    eltTmp.classList.remove('hyde');
            }else
                eltTmp.classList.add('hyde');
        });
    }else{
        document.querySelector('span#' + nomListe).lastElementChild.querySelectorAll('li.hyde').forEach(function (eltTmp) {
                eltTmp.classList.remove('hyde');
        });
    }
}

//rend ces fonctions accessible depuis le DOM
window.filterTagList = filterTagList;

export {getComparativeString, capitalizeFirstLetter, orderStringList, displayMatchingRecipes, getNewRecetteCarte};