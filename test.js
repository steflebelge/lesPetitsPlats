'use strict'

//euros
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//taux de change
const eurosToUsd = 1.1;

//via une fonction anonyme
const movementsUsd = movements.map(function (mov){
    return mov * eurosToUsd;
});

//par fonction flechées
const movementsUsdFlechee = movements.map(
    mov => mov * eurosToUsd
);

//par for ... of
const movementsUsdForOf = [];
for (const movBis of movements) {
    movementsUsdForOf.push(movBis * eurosToUsd);
}

console.log(movements);

const depots = movements.map(
    (movTris, i) => `movement ${i + 1} : vous avez ${movTris > 0 ? 'deposé' : 'retiré'} ${Math.abs(movTris)} euros`
);

//via une fonction anonyme
const deposit = movements.filter(mov => mov > 0);


const balance = movements.reduce(function (acc, cur, i, arr){
    // console.log(`Iteration num.${i} : ${acc}`);
    return acc + cur;
}, 0);

const max = movements.reduce(function (acc, cur){
    if(acc > cur)
        return acc;
    return cur;
}, movements[0]);

console.log(max);