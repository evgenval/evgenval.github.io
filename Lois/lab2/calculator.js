//////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 2 по дисциплине ЛОИС
// Выполнена студентом группы 721701 БГУИР Шамруком Евгением Валерьевичем
//
// Файл содержит логику подсчёта значений таблицы истинности для заданной формулы.
//

function findVariables(formula) {
    let varSet = new Set();

    let varArr = formula.match(/[A-Z]/g);
    if (varArr != null) {
        varArr.forEach(item => varSet.add(item));
    }

    return varSet;
}

function genTruthTable(varArr) {
    let len = varArr.length;
    let rowNum = 2 ** len;
    let truthArr = new Array();

    for (let i = 0; i < rowNum; i++) {
        let shift = len - (i).toString(2).length;
        if (shift < 0) {
            let err = "Unexpected error! Got binary number shift < 0!";
            throw err;
        }

        let str = (i).toString(2);

        let arr = new Array();
        for (let j = 0; j < shift; j++) {
            arr.push(0);
        }

        truthArr.push(arr.concat(...str));
    }

    return truthArr;
}

function prepareFormula(formula, varArr, truthArr) {
    let pfArr = new Array();

    for (let i = 0; i < truthArr.length; i++) {
        let pf = "";
        [...formula].forEach(el => {
            index = varArr.indexOf(el);
            if (index > -1) {
                pf += Number(truthArr[i][index] == true);
            } else {
                pf += el
            }
        })

        pfArr.push(pf);
    }

    return pfArr;
}

// findFormulaEnding returns index of the last character in
// the first found formula.
function findFormulaEnding(formula) {
    // beginning of the formula
    let fbeg = formula[1] === '!' ? 2 : 1;
    if (formula[fbeg] !== '(') {
        return fbeg;
    }

    let len = formula.length;
    let bcount = 0; // braces counter
    for (i = fbeg; i < len; i++) {
        switch (formula[i]) {
            case '(':
                bcount++;
                continue;
            case ')':
                bcount--;
                if (bcount === 0) {
                    return i;
                }
        }
    }

    let err = "Incorrect formula! Lack of" + bcount + " closing braces.";
    throw err;
}

// implication is realisation of implication logic function
function implication(a, b) {
    if (a) {
        return b == true
    }
    return true
}

/**
    @author Клюев А. А.
    @group 721702
**/
function calculateFormula(formula) {
    let len = formula.length;

    if (formula[0] !== '(') {
        if (formula[0].match(/[01]/g) == null || len > 1) {
            let err = "Incorrect formula! Missing opening brace or set a wrong atom!";
            throw err;
        }

        return formula[0] == true;
    }

    if (formula[len - 1] !== ')') {
        let err = "Incorrect formula! Closing brace missing!";
        throw err;
    }

    if (formula[1] === '!') {
        let end = findFormulaEnding(formula);
        return calculateFormula(formula.slice(2, end + 1)) == false;
    }

    let bincon = findFormulaEnding(formula) + 1; // binary connector
    if (formula[bincon].search(`\&|\||\~`) !== 0 &&
        formula.slice(bincon, bincon + 2) !== '->') {
        let err = "Incorrect formula! Wrong binary connector at symbol " + bincon;
        throw err;
    }

    let sf1 = calculateFormula(formula.slice(1, bincon));

    let conlen = formula[bincon] === '-' ? 2 : 1; // connector length
    let sf2 = calculateFormula(formula.slice(bincon + conlen, len - 1));

    switch (formula.slice(bincon, bincon + conlen)) {
        case "->":
            return implication(sf1, sf2);
        case "&":
            return sf1 & sf2;
        case "|":
            return sf1 | sf2;
        case "~":
            return sf1 == sf2;
    }
}

function calculateFormulaTable(formula) {
    let varSet = findVariables(formula);
    let varArr = new Array().concat(...varSet).sort();
    console.log(varArr);

    if (varArr.length == 0) {
        varArr.push(["Result"]);
        varArr.push([calculateFormula(formula)]);

        return varArr;
    }

    let truthArr = genTruthTable(varArr);
    console.log(truthArr);

    pfArr = prepareFormula(formula, varArr, truthArr);
    console.log(pfArr);

    for (let i = 0; i < pfArr.length; i++) {
        let res = calculateFormula(pfArr[i]);
        truthArr[i].push(Number(res));
    }
    console.log(truthArr);

    varArr.push("Result");
    let res = new Array();
    res.push(varArr);
    truthArr.forEach(el => res.push(el));

    console.log(res);

    return res;
}

function processInput(inputStr) {
    if (inputStr.search(/^([A-Z]( ?)=( ?)[01],( ?))*([\(\)A-Z01!\->&\|~])+$/g) == -1) {
        let err = "Incorrect input! Example of correct input string: A = 1, B = 0, ((!B)->(C&A)).";
        throw err;
    }
    let arr = inputStr.split(",");
    let len = arr.length;
    let formula = arr[len - 1];

    for (let i = 0; i < len - 1; i++) {
        let vstr = arr[i];

        if (vstr.search(/[A-Z]/g) < 0) {
            let err = "Incorrect input! Incorrect variables set.";
            throw err;
        }

        let vname = vstr.match(/[A-Z]/g)[0];
        let vval = vstr.match(/[01]/g)[0];

        let vpos = formula.search(vname);
        while (vpos >= 0) {
            formula = formula.replace(vname, vval);
            vpos = formula.search(vname);
        }
    }

    let pos = formula.search(" ");
    while (pos >= 0) {
        formula = formula.replace(" ", "");
        pos = formula.search(" ");
    }

    return formula;
}