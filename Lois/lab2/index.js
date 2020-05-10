//////////////////////////////////////////////////////////////////////////////////////
// Лабораторная работа 2 по дисциплине ЛОИС
// Выполнена студентом группы 721701 БГУИР Шамруком Евгением Валерьевичем
//
// Файл содержит функции, выполняющие посреднические функции между пользовательским
// интерфейсом и реализациями различных алгоритмов, требуемых по заданию лабораторной
// работы.
//

function generateTable() {
    try {
        let inputStr = document.forms["form"]["formula-input"].value;
        let formula = processInput(inputStr);
        let data = calculateFormulaTable(formula);

        var perrow = data[0].length, // 3 cells per row
            count = 0, // Flag for current cell
            table = document.createElement("table"),
            row = table.insertRow();

        let d = new Array().concat(...data)

        for (var i of d) {
            var cell = row.insertCell();
            cell.innerHTML = i;

            // Break into next row
            count++;
            if (count % perrow == 0) {
                row = table.insertRow();
            }
        }

        document.getElementById("result").innerHTML = "";
        document.getElementById("result").appendChild(table);
        event.preventDefault()
    } catch (err) {
        document.getElementById("result").innerHTML = err;
        event.preventDefault()
    }
}