"use strcit";

if (!"saves" in localStorage) {
  exit();
}

const saves = JSON.parse(localStorage.getItem("saves"));
const tableBody = document.getElementById("tableBody");

for (let i = 0; i < saves.length; i++) {
  tableBody.appendChild(createRowForSave(saves[i], i));
}

function createRowForSave(save, index) {
  const tr = document.createElement("tr");
  const date = document.createElement("td");
  const finished = document.createElement("td");
  const lastQuestion = document.createElement("td");
  const btnCell = document.createElement("td");

  tr.appendChild(date);
  tr.appendChild(finished);
  tr.appendChild(lastQuestion);
  tr.appendChild(btnCell);

  date.textContent = save.date;
  lastQuestion.textContent = save.curQuest;

  const span = document.createElement("span");
  if (save.finished) {
    span.classList.add("badge", "bg-success");
    span.textContent = "Завершён";
  } else {
    span.classList.add("badge", "bg-warning");
    span.textContent = "Не завершён";
  }
  finished.appendChild(span);

  const btn = document.createElement("button");
  btn.id = `btnSave_${index}`;
  btn.setAttribute("type", "button");

  if (save.finished) {
    btn.classList.add("btn", "btn-success");
    btn.textContent = "К результатам";
    btn.addEventListener("click", function () {
      location.href = `../Result/index.html?ext=${save.extraversionScore}&neur=${save.neuroticismScore}&lie=${save.lieScore}`;
    });
  } else {
    btn.classList.add("btn", "btn-primary");
    btn.textContent = "Продолжить";
    btn.addEventListener("click", function (e) {
      removeSave(Number(e.target.id.split("_")[1]));
      location.href = `../index.html?ext=${save.extraversionScore}&neur=${save.neuroticismScore}&lie=${save.lieScore}&curQuest=${save.curQuest}`;
    });
  }
  btnCell.appendChild(btn);

  return tr;
}

function removeSave(index) {
  saves.splice(index, 1);
  localStorage.setItem("saves", JSON.stringify(saves));
}
