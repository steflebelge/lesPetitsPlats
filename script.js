import {recipes} from "./recipes.js";

//log de la date time du debut
console.log("Debut du script de chargement de la page");

//script général, il importe les données neccessaires et gère la navigation
//les fichiers importés correspondront aux différents algorithme de recherche

//set des listes
let listeIngredients = [];
let listeUstensiles = [];
let listeAppareils = [];
let conditionsRecherche = [];
conditionsRecherche["texte"] = "";
conditionsRecherche["ingredients"] = [];
conditionsRecherche["ustensiles"] = [];
conditionsRecherche["appareil"] = "";
let matchingRecipes = recipes;

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

//remplissage des variables de listes
function fillInVarListes() {
    matchingRecipes.forEach(function (recipeTmp) {
        recipeTmp.ustensils.forEach(function (ustensilTmp) {
            if (!listeUstensiles.find(trucTemp => trucTemp.toLowerCase().trim() === ustensilTmp.toLowerCase().trim())) {
                listeUstensiles.push(capitalizeFirstLetter(ustensilTmp));
            }
        });
        recipeTmp.ingredients.forEach(function (ingredientTmp) {
            if (!listeIngredients.find(trucTemp => trucTemp.toLowerCase().toLowerCase().trim() === ingredientTmp.ingredient.toLowerCase().trim())) {
                listeIngredients.push(capitalizeFirstLetter(ingredientTmp.ingredient));
            }
        });

        if (!listeAppareils.find(trucTemp => trucTemp.toLowerCase().trim() === recipeTmp.appliance.toLowerCase().trim())) {
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

//fonction appelée sur changement des conditions de recherche
function updateConditionsArray(type, value) {
    console.log("Debut de l'ajout d'un filtre");

    switch (type) {
        case "texte" :
            conditionsRecherche[type] = value;
            //si la recherche fais moins de 3 char, on retourne
            if (value.length < 3)
                return
            break;
        case "appareil" :
            conditionsRecherche[type] = value;
            break;
        case "ingredients" :
        case "ustensiles" :
            if (!conditionsRecherche[type].find(conditionTmp => conditionTmp.toLowerCase() === value.toLowerCase()))
                conditionsRecherche[type].push(value);
            else
                conditionsRecherche[type] = conditionsRecherche[type].filter(conditionTmp => {
                    return (conditionTmp.toLowerCase() !== value.toLowerCase())
                });
            break;
    }

    //on calcul la nouvelle liste de recettes correspondantes
    computeMatchingRecipes();
    //on met a jour nos variables de listes
    fillInVarListes();
    //on met a jour nos listes HTML
    fillInHtmlListes();
    //on affiche les recettes correspondantes
    displayMatchingRecipes();

    console.log("Fin de l'ajout d'un filtre");
}

//fonction qui affiche la liste des recettes correspondantes
function displayMatchingRecipes() {
    // debugger
}

//fonction qui met a jour les liste déroulantes avec les element restants selon les recettes correspondantes
function updateHtmlUnselectedListeElements() {
    debugger
}

//fonction qui calcul la nouvelle liste de recettes correspondantes
function computeMatchingRecipes() {
    //on réinitialise le resultat
    matchingRecipes = recipes;
    let newMatchingRecipes = [];

    //on verifie si on a bien le dernier etat de la barre de recherche
    if (conditionsRecherche["texte"] !== document.querySelector('input[type="text"]').value)
        conditionsRecherche["texte"] = document.querySelector('input[type="text"]').value;

    //si du texte a été rentré dans la barre de recherche, on recherche les recettes correspondantes
    if (conditionsRecherche["texte"]) {
        //on recherche les recettes dont le nom contient le texte recherché
        console.log("Debut de la recherche textuelle sur : nom. Taille actuelle des resultats : " + matchingRecipes.length);
        matchingRecipes = recipes.filter(recipeTmp => {
            return (recipeTmp.name.toLowerCase().includes(conditionsRecherche["texte"].toLowerCase()))
        });
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);

        //on ajoute celles dont la description contient le texte recherché
        console.log("Debut de la recherche textuelle sur : description. Taille actuelle des resultats : " + matchingRecipes.length);
        recipes.filter(recipeTmp => {
            return (recipeTmp.description.toLowerCase().includes(conditionsRecherche["texte"].toLowerCase()))
        }).forEach(function (matchingRecipe) {
            //si elles ne sont pas deja dans le tableaux des resultats
            if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                newMatchingRecipes.push(matchingRecipe);
        });
        debugger
        if(newMatchingRecipes.length > 0) {
            matchingRecipes = JSON.parse(JSON.stringify(newMatchingRecipes));
            newMatchingRecipes = [];
        }
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);

        //on ajoute celles dont au moins 1 ingrédient contient le texte recherché
        console.log("Debut de la recherche textuelle sur : ingrédient. Taille actuelle des resultats : " + matchingRecipes.length);
        recipes.filter(recipeTmp => {
            return (recipeTmp.ingredients.filter(ingredientTmp => ingredientTmp.ingredient.toLowerCase().includes(conditionsRecherche["texte"].toLowerCase())).length > 0);
        }).forEach(function (matchingRecipe) {
            //si elles ne sont pas deja dans le tableaux des resultats
            if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                newMatchingRecipes.push(matchingRecipe);
        });
        debugger
        if(newMatchingRecipes.length > 0) {
            matchingRecipes = JSON.parse(JSON.stringify(newMatchingRecipes));
            newMatchingRecipes = [];
        }
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    //si un appareil est selectionné, on recherche les recettes correspondantes
    if (conditionsRecherche["appareil"]) {
        console.log("Debut de la recherche des recettes avec cet appareil " + conditionsRecherche["appareil"] + ". Taille actuelle des resultats : " + matchingRecipes.length);
        matchingRecipes = matchingRecipes.filter(recipeTmp => {
            return (recipeTmp.appliance.toLowerCase() === conditionsRecherche["appareil"].toLowerCase())
        });
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }

    if (conditionsRecherche["ingredients"].length > 0) {
        console.log("Debut de la recherche des recettes avec les ingrédients. Taille actuelle des resultats : " + matchingRecipes.length);
        conditionsRecherche["ingredients"].forEach(function (ingredientTmp) {
            debugger
            matchingRecipes.filter(recipeTmp => {
                return (recipeTmp.ingredients.filter(ingredientRecipeTmp => ingredientRecipeTmp.ingredient.toLowerCase() === ingredientTmp.toLowerCase()).length > 0);
            }).forEach(function (matchingRecipe) {
                //si elles ne sont pas deja dans le tableaux des resultats
                if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                    newMatchingRecipes.push(matchingRecipe);
            });
            debugger
            if(newMatchingRecipes.length > 0) {
                matchingRecipes = JSON.parse(JSON.stringify(newMatchingRecipes));
                newMatchingRecipes = [];
            }
        });
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }
    if (conditionsRecherche["ustensiles"].length > 0) {
        console.log("Debut de la recherche des recettes avec les ustensiles. Taille actuelle des resultats : " + matchingRecipes.length);
        conditionsRecherche["ustensiles"].forEach(function (ustensileTmp) {
            debugger
            matchingRecipes.filter(recipeTmp => {
                return (recipeTmp.ustensils.toLowerCase() === ustensileTmp.toLowerCase())
            }).forEach(function (matchingRecipe) {
                //si elles ne sont pas deja dans le tableaux des resultats
                if (!matchingRecipes.find(recipeTmp => recipeTmp.id === matchingRecipe.id))
                    newMatchingRecipes.push(matchingRecipe);
            });
            debugger
            if(newMatchingRecipes.length > 0) {
                matchingRecipes = JSON.parse(JSON.stringify(newMatchingRecipes));
                newMatchingRecipes = [];
            }
        });
        console.log("Nouvelle taille des resultats : " + matchingRecipes.length);
    }
}


//au chargement on remplit les listes et affiche les recettes
fillInVarListes();
fillInHtmlListes();
displayMatchingRecipes();

//log de la date time de fin
console.log("Fin du script de chargement de la page");

//rend ces fonctions accessible depuis le DOM
window.updateConditionsArray = updateConditionsArray;