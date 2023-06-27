//fonction qui calcul la nouvelle liste de recettes correspondantes
import {recipes} from "./recipes.js";
import {
    getComparativeString,
    getNewRecetteCarte,
    capitalizeFirstLetter,
    displayMatchingRecipes,
    orderStringList
} from "./utils.js";
import {
    conditionsRecherche,
    listeAppareils,
    listeIngredients,
    listeUstensiles,
    unMatchingRecipes,
    matchingRecipes,
    setmatchingRecipes
} from "./script.js";

function computeMatchingRecipes(affinage) {
    console.log("Debut fonction computeRecherche, affinnage : " + affinage);

    let newMatchingRecipes = [];
    let searchArray = matchingRecipes;

    if (!affinage) {
        //on réinitialise le resultat
        setmatchingRecipes(recipes);
    }

    //si un appareil est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["appareil"]) {
        console.log("Debut de la recherche des recettes avec cet appareil " + conditionsRecherche["appareil"] + ". Taille actuelle des resultats : " + matchingRecipes.length);
        setmatchingRecipes(matchingRecipes.filter(recipeTmp => {
            return (getComparativeString(recipeTmp.appliance) === getComparativeString(conditionsRecherche["appareil"]))
        }));
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //si au moins un ingredient est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["ingredients"].length > 0) {
        console.log("Debut de la recherche des recettes avec les ingrédients. Taille actuelle des resultats : " + matchingRecipes.length);
        matchingRecipes.forEach(function (recipeTmp) {
            let keepInMatching = true;
            conditionsRecherche["ingredients"].forEach(function (ingredientTmp) {
                if (recipeTmp.ingredients.filter(ingredientRecipeTmp => getComparativeString(ingredientRecipeTmp.ingredient) === getComparativeString(ingredientTmp)).length === 0)
                    keepInMatching = false;
            });
            if (keepInMatching)
                newMatchingRecipes.push(recipeTmp);
        });
        setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
        newMatchingRecipes = [];

        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //si au moins un ustensile est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["ustensiles"].length > 0) {
        console.log("Debut de la recherche des recettes avec les ustensiles. Taille actuelle des resultats : " + matchingRecipes.length);
        matchingRecipes.forEach(function (recipeTmp) {
            let keepInMatching = true;
            conditionsRecherche["ustensiles"].forEach(function (ustensileTmp) {
                if (recipeTmp.ustensils.filter(ustensileRecipeTmp => getComparativeString(ustensileRecipeTmp) === getComparativeString(ustensileTmp)).length === 0)
                    keepInMatching = false;
            });
            if (keepInMatching)
                newMatchingRecipes.push(recipeTmp);
        });
        setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
        newMatchingRecipes = [];
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //on verifie si on a bien le dernier etat de la barre de recherche
    if (conditionsRecherche["texte"] !== document.querySelector('input[type="text"]').value)
        conditionsRecherche["texte"] = document.querySelector('input[type="text"]').value;
    //si du texte a été rentré dans la barre de recherche, on recherche les recettes correspondantes
    if (conditionsRecherche["texte"]) {
        //on recherche les recettes dont le nom contient le texte recherché
        console.log("Debut de la recherche textuelle. Taille actuelle des resultats : " + matchingRecipes.length);

        matchingRecipes.forEach(function (recipeTmp) {
            let keepInMatching = true;
            if (!getComparativeString(recipeTmp.name).includes(getComparativeString(conditionsRecherche["texte"]))
                && !getComparativeString(recipeTmp.description).includes(getComparativeString(conditionsRecherche["texte"]))
                && recipeTmp.ingredients.filter(ingredientTmp => getComparativeString(ingredientTmp.ingredient).includes(getComparativeString(conditionsRecherche["texte"]))).length === 0)
                keepInMatching = false;
            if (keepInMatching)
                newMatchingRecipes.push(recipeTmp);
        });
        setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
        newMatchingRecipes = [];
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }
}


export {computeMatchingRecipes};