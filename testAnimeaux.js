'use strict'

//jeu de test
let ageAnimeaux = [0.5, 1, 2, 3, 7, 9, 11, 13, 15];

//calcul l age d'un animal en age humain
function computeHumainAge(animalAge) {
    if(animalAge <= 2 ){
        //console.log('ageAnimal : ' + animalAge + " => age Humain : " + 2 * animalAge);
        return 2 * animalAge;
    }else{
        //console.log('ageAnimal : ' + animalAge + " => age Humain : " + 4 * (animalAge + 16));
        animalAge += 16;
        return 4 * animalAge;
    }
}

//exclut tout les animeaux qui ont -18ans H
const firstExo = ageAnimeaux.filter(
    ageTmp => computeHumainAge(ageTmp) > 18
);
//console.log("Animeaux qui ont + 18 ans H : " + firstExo);
//console.log(" ");


//Calcul de l'age moyen Humain des animeaux de + 18ans
let diviseur = 0;
const moyenneAdulte = ageAnimeaux.reduce(function (acc, cur, i, arr){
    //console.log(" ");
    //console.log("acc : " + acc + " | cur : " + cur + " | i : " + i);
    let ageHTmp = computeHumainAge(cur);
    let res = acc;

    if(ageHTmp > 18) {
        res += ageHTmp;
        diviseur += 1;
    }

    if(i === arr.length - 1) {
        // //console.log("division : " + res + " / " + diviseur);
        res = res / diviseur;
    }

    return res;
}, 0);

//console.log(" ");
//console.log("moyenneAdulte : " + moyenneAdulte);