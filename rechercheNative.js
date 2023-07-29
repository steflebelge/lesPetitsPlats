//fonction qui calcul la nouvelle liste de recettes correspondantes
import {recipes} from "./recipes.js";
import {
    getComparativeString,
} from "./utils.js";
import {
    conditionsRecherche,
    matchingRecipes,
    setmatchingRecipes
} from "./script.js";

function computeMatchingRecipes(affinage) {
    //console.log("Debut fonction computeRecherche, affinnage : " + affinage);

    let newMatchingRecipes = [];
    let searchArray = matchingRecipes;

    if (!affinage) {
        //on réinitialise le resultat
        setmatchingRecipes(recipes);
    }

    //si un appareil est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["appareil"]) {
        //console.log("Debut de la recherche des recettes avec cet appareil " + conditionsRecherche["appareil"] + ". Taille actuelle des resultats : " + matchingRecipes.length);

        let res = [];
        for (let k = 0; k < matchingRecipes.length; k++) {
            let recipeTmp = matchingRecipes[k];
            if (getComparativeString(recipeTmp.appliance) === getComparativeString(conditionsRecherche["appareil"]))
                res[res.length] = recipeTmp;
        }
        setmatchingRecipes(res);

        //console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //si au moins un ingredient est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["ingredients"].length > 0) {
        //console.log("Debut de la recherche des recettes avec les ingrédients. Taille actuelle des resultats : " + matchingRecipes.length);
        for (let i = 0; i < matchingRecipes.length; i++) {
            let recipeTmp = matchingRecipes[i];
            let keepInMatching = true;
            for (let j = 0; j < conditionsRecherche["ingredients"].length; j++) {
                let ingredientTmp = conditionsRecherche["ingredients"][j];

                let res = [];
                for (let k = 0; k < recipeTmp.ingredients.length; k++) {
                    let ingredientRecipeTmp = recipeTmp.ingredients[k];
                    if (getComparativeString(ingredientRecipeTmp.ingredient) === getComparativeString(ingredientTmp))
                        res[res.length] = ingredientRecipeTmp.ingredient;
                }
                if (res.length === 0)
                    keepInMatching = false;
            }
            if (keepInMatching) {
                // newMatchingRecipes = [...newMatchingRecipes, recipeTmp];
                newMatchingRecipes[newMatchingRecipes.length] = recipeTmp;
            }
        }
        setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
        newMatchingRecipes = [];

        //console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //si au moins un ustensile est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["ustensiles"].length > 0) {
        //console.log("Debut de la recherche des recettes avec les ustensiles. Taille actuelle des resultats : " + matchingRecipes.length);
        for (let i = 0; i < matchingRecipes.length; i++) {
            let recipeTmp = matchingRecipes[i];
            let keepInMatching = true;
            for (let j = 0; j < conditionsRecherche["ustensiles"].length; j++) {
                let ustensileTmp = conditionsRecherche["ustensiles"][j];

                let res = [];
                for (let k = 0; k < recipeTmp.ustensils.length; k++) {
                    let ustensileRecipeTmp = recipeTmp.ustensils[k];
                    if (getComparativeString(ustensileRecipeTmp) === getComparativeString(ustensileTmp))
                        res[res.length] = ustensileRecipeTmp;
                }
                if (res.length === 0)
                    keepInMatching = false;
            }
            if (keepInMatching) {
                // newMatchingRecipes = [...newMatchingRecipes, recipeTmp];
                newMatchingRecipes[newMatchingRecipes.length] = recipeTmp;
            }
        }
        setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
        newMatchingRecipes = [];
        //console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //on verifie si on a bien le dernier etat de la barre de recherche
    if (conditionsRecherche["texte"] !== document.querySelector('input[type="text"]').value)
        conditionsRecherche["texte"] = document.querySelector('input[type="text"]').value;
    //si du texte a été rentré dans la barre de recherche, on recherche les recettes correspondantes
    if (conditionsRecherche["texte"]) {
        //on recherche les recettes dont le nom contient le texte recherché
        //console.log("Debut de la recherche textuelle. Taille actuelle des resultats : " + matchingRecipes.length);

        for (let i = 0; i < matchingRecipes.length; i++) {
            let recipeTmp = matchingRecipes[i];
            let keepInMatching = true;
            if (!getComparativeString(recipeTmp.name).includes(getComparativeString(conditionsRecherche["texte"]))
                && !getComparativeString(recipeTmp.description).includes(getComparativeString(conditionsRecherche["texte"]))){
                let res = [];
                for (let k = 0; k < recipeTmp.ingredients.length; k++) {
                    let ingredientTmp = recipeTmp.ingredients[k];
                    if (getComparativeString(ingredientTmp.ingredient).includes(getComparativeString(conditionsRecherche["texte"])))
                        res[res.length] = ingredientTmp.ingredient;
                }
                if (res.length === 0)
                    keepInMatching = false;
            }

            if (keepInMatching) {
                // newMatchingRecipes = [...newMatchingRecipes, recipeTmp];
                newMatchingRecipes[newMatchingRecipes.length] = recipeTmp;
            }
        }
        setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
        newMatchingRecipes = [];
        //console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }
}

export {computeMatchingRecipes};