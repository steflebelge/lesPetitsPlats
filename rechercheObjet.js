//fonction qui calcul la nouvelle liste de recettes correspondantes
import {recipes} from "./recipes.js";
import {getComparativeString, getNewRecetteCarte, capitalizeFirstLetter, displayMatchingRecipes, orderStringList} from "./utils.js";
import {conditionsRecherche, listeAppareils, listeIngredients, listeUstensiles, unMatchingRecipes, matchingRecipes, setmatchingRecipes} from "./script.js";

function computeMatchingRecipes(affinage) {
    console.log("Debut fonction computeRecherche, affinnage : " + affinage);

    let newMatchingRecipes = [];
    let searchArray = matchingRecipes;

    if(!affinage) {
        //on réinitialise le resultat
        setmatchingRecipes(recipes);
    }

    //on verifie si on a bien le dernier etat de la barre de recherche
    if (conditionsRecherche["texte"] !== document.querySelector('input[type="text"]').value)
        conditionsRecherche["texte"] = document.querySelector('input[type="text"]').value;

    //si du texte a été rentré dans la barre de recherche, on recherche les recettes correspondantes
    if (conditionsRecherche["texte"]) {
        //on recherche les recettes dont le nom contient le texte recherché
        console.log("Debut de la recherche textuelle sur : nom. Taille actuelle des resultats : " + matchingRecipes.length);
        setmatchingRecipes(searchArray.filter(recipeTmp => {
            return (getComparativeString(recipeTmp.name).includes(getComparativeString(conditionsRecherche["texte"])))
        }));
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);

        //on ajoute celles dont la description contient le texte recherché
        console.log("Debut de la recherche textuelle sur : description. Taille actuelle des resultats : " + matchingRecipes.length);
        searchArray.filter(recipeTmp => {
            return (getComparativeString(recipeTmp.description).includes(getComparativeString(conditionsRecherche["texte"])))
        }).forEach(function (matchingRecipe) {
            //si elles ne sont pas deja dans le tableaux des resultats
            if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                newMatchingRecipes.push(matchingRecipe);
        });
        if (newMatchingRecipes.length > 0) {
            setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
            newMatchingRecipes = [];
        }
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);

        //on ajoute celles dont au moins 1 ingrédient contient le texte recherché
        console.log("Debut de la recherche textuelle sur : ingrédient. Taille actuelle des resultats : " + matchingRecipes.length);
        searchArray.filter(recipeTmp => {
            return (recipeTmp.ingredients.filter(ingredientTmp => getComparativeString(ingredientTmp.ingredient).includes(getComparativeString(conditionsRecherche["texte"]))).length > 0);
        }).forEach(function (matchingRecipe) {
            //si elles ne sont pas deja dans le tableaux des resultats
            if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                newMatchingRecipes.push(matchingRecipe);
        });
        if (newMatchingRecipes.length > 0) {
            setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
            newMatchingRecipes = [];
        }
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //si un appareil est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["appareil"]) {
        console.log("Debut de la recherche des recettes avec cet appareil " + conditionsRecherche["appareil"] + ". Taille actuelle des resultats : " + matchingRecipes.length);
        setmatchingRecipes(matchingRecipes.filter(recipeTmp => {
            return (getComparativeString(recipeTmp.appliance) === getComparativeString(conditionsRecherche["appareil"]))
        }));
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    if (conditionsRecherche["ingredients"].length > 0) {
        console.log("Debut de la recherche des recettes avec les ingrédients. Taille actuelle des resultats : " + matchingRecipes.length);
        conditionsRecherche["ingredients"].forEach(function (ingredientTmp) {
            matchingRecipes.filter(recipeTmp => {
                return (recipeTmp.ingredients.filter(ingredientRecipeTmp => getComparativeString(ingredientRecipeTmp.ingredient) === getComparativeString(ingredientTmp)).length > 0);
            }).forEach(function (matchingRecipe) {
                //si elles ne sont pas deja dans le tableaux des resultats
                if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                    newMatchingRecipes.push(matchingRecipe);
            });
            if (newMatchingRecipes.length > 0) {
                setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
                newMatchingRecipes = [];
            }
        });
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }
    if (conditionsRecherche["ustensiles"].length > 0) {
        console.log("Debut de la recherche des recettes avec les ustensiles. Taille actuelle des resultats : " + matchingRecipes.length);
        conditionsRecherche["ustensiles"].forEach(function (ustensileTmp) {
            matchingRecipes.filter(recipeTmp => {
                return (getComparativeString(recipeTmp.ustensils) === getComparativeString(ustensileTmp))
            }).forEach(function (matchingRecipe) {
                //si elles ne sont pas deja dans le tableaux des resultats
                if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                    newMatchingRecipes.push(matchingRecipe);
            });
            if (newMatchingRecipes.length > 0) {
                setmatchingRecipes(JSON.parse(JSON.stringify(newMatchingRecipes)));
                newMatchingRecipes = [];
            }
        });
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }
}


export {computeMatchingRecipes};