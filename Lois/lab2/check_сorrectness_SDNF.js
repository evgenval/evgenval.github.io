function checkCorrectnessSDNF() {
    let formula = document.getElementById('probablySDNF').value;
    let answer = document.getElementById('answer');

    //Проверка наличия лишних символов
    if (formula.match(/(?!([A-Z]|&|\||\(|\)|!))./g)) {  //(?!) - искать любые символы, кроме заключённых в данные скобки
        answer.innerHTML = "Некорректные символы.";
    }

    if (formula.match(/\([A-Z]\)/g)){
        answer.innerHTML = "Введенная строка не является СДНФ";
    }

    else if (formula != "") {
        if (formula.length == 1) {
            let reg = /[A-Z]/g
            if (reg.test(formula)) {
                answer.innerHTML = "Формула является СДНФ.";
            } else {
                answer.innerHTML = "Введенная строка не является СДНФ";
            }
        } else {
           if (checkWithRegularExpressionFormula(formula)) {  //Проверка соответствия грамматике
                    if (checkAllConjunctions(formula, '|')) {
                        answer.innerHTML = "Формула является СДНФ.";
                    } else {
                        answer.innerHTML = "Формула не является СДНФ."
                    }
            }
            else
                answer.innerHTML = "Формула не соответствует правилам грамматики.";
        }
    }

    let isRight = (answer.innerHTML == "Формула является СДНФ.");

}


function checkAllConjunctions(expression, sep) {
    let conjunctionOperationsArray = expression.split(sep);
    if (conjunctionOperationsArray == false) return false
    let j, k;
    let conj = '&';
    let resBooltrue = false;
    let resBoolfalse = false;
    let eqResBool = false;
    for (j = 0; j < conjunctionOperationsArray.length; j++) {
        for (k = 0; k < conjunctionOperationsArray.length; k++) {
            if (j != k) {
                resBooltrue = compareConjunctions(conjunctionOperationsArray[j].split(conj), conjunctionOperationsArray[k].split(conj), true);
                resBoolfalse = compareConjunctions(conjunctionOperationsArray[j].split(conj), conjunctionOperationsArray[k].split(conj), false);
                if (resBooltrue == false || resBoolfalse == false) return false
            } else {
                eqResBool = compareSingleConjunction(conjunctionOperationsArray[j].split(conj));
                if (eqResBool == false) return false
            }
        }
    }
    return true
}


function compareConjunctions(first, second, type) {
    console.log(first, second, type)
    let x, y;
    let bool;
    if (first.length != second.length) return false
    for (x = 0; x < first.length; x++) {
        bool = false;
        for (y = 0; y < second.length; y++) {
            if (type) {
                first[x] = first[x].replace(/[!()]/g, '');
                second[y] = second[y].replace(/[!()]/g, '');
            } else {
                first[x] = first[x].replace(/[()]/g, '');
                second[y] = second[y].replace(/[()]/g, '');
            }
            if (first[x] == second[y]) {
                bool = true;
                break;
            }
        }
        if (type) {
            if (!bool) return false
        } else {
            if (bool == false) return true
        }
    }
    return type;
}


function compareSingleConjunction(first) {
    let x, y;
    let bool;
    for (x = 0; x < first.length; x++) {
        bool = true
        for (y = 0; y < first.length; y++) {
            if (x != y) {
                first[x] = first[x].replace(/[!()]/g, '');
                first[y] = first[y].replace(/[!()]/g, '');
                if (first[x] == first[y]) return false;
            }
        }
        if (bool != true) return false;
    }
    return bool;
}

function checkWithRegularExpressionFormula(formula) {
    const FORMULA_REGEXP = new RegExp('([(]([A-Z]|[0-1])((->)|(&)|(\\|)|(~))([A-Z]|[0-1])[)])|([(][!]([A-Z]|[0-1])[)])|([A-Z])|([0-1])','g');
    let form = formula;

    if (form.length == 1 && form.match(/[A-Z]|[0-1]/)) {
        return true;
    } else {
        while (true) {
            let initLength = form.length;
            form = form.replace(FORMULA_REGEXP, '1')
            if (form.length === initLength) {
                break;
            }
        }
        if ((form.length === 1) && (form.match(/1/))) {
            return true;
        } else {
            return false;
        }
    }
}
