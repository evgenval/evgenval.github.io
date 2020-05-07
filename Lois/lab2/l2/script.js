//ЛР 2. Вариант 1. Вычислить возможные значения формулы при частично заданной интерпретации формулы
//      (частично заданных значениях пропозициональных переменных).
//      Результат оформить в виде таблицы.

//Автор: Шамрук Е. В. Гр. 721701


//Проверка является ли строка формулой логики высказываний
function verificate(){
	//var isCorrect = false;
	
    var inputStringVar = document.getElementById('inputString').value;

	if(formulaCheck(inputStringVar)){
		alert("Строка является формулой логики высказываний.");
	} else {
		alert("Строка НЕ является формулой логики высказываний или не содержит символов.");
	}
}

function formulaCheck(inputStringVar){
	if(inputStringVar.length == 1){
		if(inputStringVar.match(/([0-1]|[A-Z])/)){
			return true;
		} else {
			return false;
		}
	//унарная формула
	} else if(inputStringVar.match(/^\(!([A-Z]|[0-1]|(\((\(|\)|[A-Z]|[0-1]|!|&|~|\||(->))+\)))\)$/)){
		/*if(formulaCheck(inputStringVar.substring(2, inputStringVar.length - 1))){
			return true;
		} else {
			return false;*/
			return (formulaCheck(inputStringVar.substring(2, inputStringVar.length - 1)));
		//}
	//бинарная формула                 (первая подформула __________________________________)(связка_____)(вторая подформула __________________________________)
	} else if(inputStringVar.match(/^\(([A-Z]|[0-1]|(\((\(|\)|[A-Z]|[0-1]|!|&|~|\||(->))+\)))(&|~|\||(->))([A-Z]|[0-1]|(\((\(|\)|[A-Z]|[0-1]|!|&|~|\||(->))+\)))\)$/)){
		var subformulaStart = 0;
		var lev = 0;//уровень вложенности
		var max = inputStringVar.length - 2;
		var subformualsCheckResults = [false, false];
		var subformulaInd = 0;
		var subformulaIndex = 0;
		for(var i = 1; i <= max; i++){
			if(inputStringVar.charAt(i) == '('){
				if(lev == 0){
					subformulaStart = i;
				}
				lev++
			} else if (inputStringVar.charAt(i) == ')'){
				lev--;
				if(lev == 0){
					subformualsCheckResults[subformulaInd] = formulaCheck(inputStringVar.substring(subformulaStart, i + 1));//крайний символ НЕ включается
					subformulaInd++;					
				}
			} else if(lev == 0) {
				if(inputStringVar.charAt(i).match(/([0-1]|[A-Z])/)){
					subformualsCheckResults[subformulaInd] = true;
					subformulaInd++;
				}
			}
		}
		if(subformualsCheckResults[0]&&subformualsCheckResults[0]){
			return true;
		} else return false;
	}
}

function calculate(){
	document.getElementById('TableBody').innerHTML = '';
	document.getElementById('continueButtonDiv').innerHTML = '';
	var inputStringVar = document.getElementById('inputString').value;
	if(!formulaCheck(inputStringVar)){
		alert("Строка НЕ является формулой логики высказываний или не содержит символов.");
	} else {
	var variablesArr = searchVariables(inputStringVar);
	drawInputTable(variablesArr, inputStringVar);
	//drawVariablesTable(variablesArr);//таблица для указания значений некоторых пееменных, добавить кнопку для продолжения
	//var valueMatrix;//размерность зависит от количества заданных переменных
	
	//составить таблицу с возможными значениями переменных
	//calculateFormulaValue, результат добавить в таблицу
	}
}

function searchVariables(inputStringVar){
	var variablesArr = [];
	var stringLength = inputStringVar.length;
	for(var i = 0; i < stringLength; i++){
		if(inputStringVar[i].match(/([A-Z])/)){
			if(variablesArr.indexOf(inputStringVar[i]) == -1){
				variablesArr.push(inputStringVar[i]);
			}
		}
	}
	return variablesArr;
}

function drawInputTable(variablesArr, inputStringVar){
	var tbody = document.getElementById('TableBody');
	var row1 = document.createElement("tr");
	var row2 = document.createElement("tr");
	for(var i = 0; i < variablesArr.length; i++){
		//tbody.append('<tr><td>' + variablesArr[i] + '</td><td><input type="number" id="' + i + '"></td></tr>');
		var cell = document.createElement("td");
        cell.innerHTML = variablesArr[i];
		row1.appendChild(cell);
	}
	for(var i = 0; i < variablesArr.length; i++){
		var cell = document.createElement("td");
        cell.innerHTML = '<input type="number" min=0 max=1 id="input' + i + '">';
		row2.appendChild(cell);
	}
	tbody.appendChild(row1);
	tbody.appendChild(row2);
	
	continueButton = document.createElement("button");
	continueButton.innerHTML = 'Рассчитать возможные значения формулы';
	document.getElementById('continueButtonDiv').appendChild(continueButton);
	var stringWithPartialValues = inputStringVar;
	continueButton.onclick = function() {
		
		
		var redusedVarArr = [];
		for(var i = 0; i < variablesArr.length; i++){
		var inputValue = document.getElementById('input' + i).value;
		if(inputValue){
			inputValue = parseInt(inputValue);
			//stringWithPartialValues.replace("A", '1');
			stringWithPartialValues = stringWithPartialValues.replace(variablesArr[i], inputValue);
			} else {
				redusedVarArr.push(variablesArr[i]);
			}
		}
		
		var tbody = document.getElementById('TableBody');
		tbody.innerHTML = '';
		document.getElementById('continueButtonDiv').innerHTML = '';
		createHeadline(tbody, redusedVarArr);
		var numOfCombinations = Math.pow(2, redusedVarArr.length);
		for(var i = 0; i < numOfCombinations; i++){
			var values = i.toString(2);
			while(values.length < redusedVarArr.length){
				values = '0' + values;
			}
			var stringWithValues = stringWithPartialValues;
			for(j = 0; j < redusedVarArr.length; j++){
				stringWithValues = stringWithValues.replace(redusedVarArr[j], values[j]);
			}
			var value = calculateValue(stringWithValues);
			addInResult(tbody, values, value, redusedVarArr);
		}
	};
}

function addInResult(tbody, values, value, redusedVarArr){
	var row = document.createElement("tr");
	for(var i = 0; i < redusedVarArr.length; i++){
		var cell = document.createElement("td");
		cell.innerHTML = values[i];
		row.appendChild(cell);
		//tbody.appendChild(row);
	}
	var cell = document.createElement("td");
    cell.innerHTML = value;
	row.appendChild(cell);
	tbody.appendChild(row);
}

function createHeadline(tbody, redusedVarArr){
	var row = document.createElement("tr");
	for(var i = 0; i < redusedVarArr.length; i++){
		var cell = document.createElement("td");
        cell.innerHTML = redusedVarArr[i];
		row.appendChild(cell);
		//tbody.appendChild(row);
	}
	var cell = document.createElement("td");
    cell.innerHTML = 'Результат';
	row.appendChild(cell);
	tbody.appendChild(row);
}

function calculateValue(stringWithValues){
	var unary_formula = /\(\!([01])\)/g;
    var binary_formula = /\(([01])([\&\|\~]|(\-\>))([01])\)/g;
	var conjunction = /\(([01])(\&)([01])\)/g;
	var disjunction = /\(([01])(\|)([01])\)/g;
	var implication = /\(([01])(\-\>)([01])\)/g;
	var equivalence = /\(([01])(\~)([01])\)/g;

    while(stringWithValues.match(unary_formula) || stringWithValues.match(binary_formula)){
        if(stringWithValues.match(unary_formula)){
			var match = stringWithValues.match(unary_formula);
			for(var i = 0; i < match.length; i++){
				stringWithValues = stringWithValues.replace(match[i], unary_formula_result(match[i]));
			}
		} else if(stringWithValues.match(conjunction)){
			var match = stringWithValues.match(conjunction);
			for(var i = 0; i < match.length; i++){
				stringWithValues = stringWithValues.replace(match[i], conjunction_result(match[i]));
			}
		} else if(stringWithValues.match(disjunction)){
			var match = stringWithValues.match(disjunction);
			for(var i = 0; i < match.length; i++){
				stringWithValues = stringWithValues.replace(match[i], disjunction_result(match[i]));
			}
		} else if(stringWithValues.match(implication)){
			var match = stringWithValues.match(implication);
			for(var i = 0; i < match.length; i++){
				stringWithValues = stringWithValues.replace(match[i], implication_result(match[i]));
			}
		} else if(stringWithValues.match(equivalence)){
			var match = stringWithValues.match(equivalence);
			for(var i = 0; i < match.length; i++){
				stringWithValues = stringWithValues.replace(match[i], equivalence_result(match[i]));
			}
		}
    }
	
	return stringWithValues;
}

function unary_formula_result(match){
	if(match.match(/\(\!([1])\)/g)){
		return 0;
	} else {
		return 1;
	}
}

function conjunction_result(match){
	if(match.match(/\(([1])(\&)([1])\)/g)){
		return 1;
	} else {
		return 0;
	}
}

function disjunction_result(match){
	if(match.match(/\(([0])(\|)([0])\)/g)){
		return 0;
	} else {
		return 1;
	}
}

function implication_result(match){
	if((match.match(/\(([0])(\-\>)([01])\)/g))||(match.match(/\(([1])(\-\>)([1])\)/g))){
		return 1;
	} else {
		return 0;
	}
}

function equivalence_result(match){
	if((match.match(/\(([0])(\~)([0])\)/g))||(match.match(/\(([1])(\~)([1])\)/g))){
		return 1;
	} else {
		return 0;
	}
}