"use strict";
/* 
      Синглтон GCTester принимает в качестве аргумента один массив
  правильных ответов. В массиве должны быть номера правильных ответов,
  считая от нуля, расположенные в порядке задавания вопросов. Для 
  вопросов, где используется checkbox обязательно передаётся массив ответов,
  независимо от их (правильных ответов) количества.
      Для работы этому классу необходима форма с id = "GCTest", внутри которой
  Находится текст теста, причём каждый вопрос начинается с символа «~»,
  а каждый ответ начинается с символа «^». Вопрос, в котором может
  быть (теоретически) несколько вариантов ответа должен начинаться
  с сочетания символов «~*».
      В вопросах и ответах можно использовать: символ «*» в любом месте. 
  Использовать html-теги не получится, текст вопроса заключается в тег <pre>.
      В вопросах и ответах нельзя использовать служебные символы
  («~», «^»), кроме как в соответствующих местах, предусмотренных этой
  инструкцией.
*/

const extraversionYesAnsw = [
  1, 3, 8, 10, 13, 17, 22, 25, 27, 39, 44, 46, 49, 53, 56,
];
const extraversionNoAnsw = [5, 15, 20, 29, 32, 34, 37, 41, 51];
const neuroticismYesAnsw = [
  2, 4, 7, 9, 11, 14, 16, 19, 21, 23, 26, 28, 31, 33, 35, 38, 40, 43, 45, 47,
  50, 52, 55, 57,
];
const lieYesAnsw = [6, 24, 36];
const lieNoAnsw = [12, 18, 30, 42, 48, 54];
let extraversionScore = 0;
let neuroticismScore = 0;
let lieScore = 0;

let curQuest = 1;

if (window.location.href.includes("?")) {
  let query = window.location.href.split("?")[1]; // результат - строка запроса без адреса страницы "id=someName&userMail=some@mail.com&usText=MemoText"
  let params = query.split("&"); // результат - массив строк из пар "id=someName", "userMail=some@mail.com", "usText=MemoText"
  // теперь брать по очереди
  extraversionScore = params[0].split("=")[1];
  neuroticismScore = params[1].split("=")[1];
  lieScore = params[2].split("=")[1];
  curQuest = params[3].split("=")[1];
}

const questionsSource = document.getElementById("questions");
const frmTest = document.getElementById("test");
const caption = document.getElementById("caption");
const testBlock = document.getElementById("testBlock");
const questionNumber = document.getElementById("questionNumber");
const question = document.getElementById("question");
const answerYes = document.getElementById("answerYes");
const answerNo = document.getElementById("answerNo");
const btnNext = document.getElementById("btnNext");
const questions = questionsSource.textContent.split("~");

questionsSource.remove();

caption.textContent = questions[0];

questionNumber.textContent = `Вопрос ${curQuest} из ${questions.length - 1}`;
question.textContent = questions[curQuest];

btnNext.addEventListener("click", analyze);

window.addEventListener("beforeunload", saveProgress);
// document.body.addEventListener("onLoad", onLoad);

function analyze() {
  if (
    (extraversionYesAnsw.includes(curQuest) && answerYes.checked) ||
    (extraversionNoAnsw.includes(curQuest) && answerNo.checked)
  ) {
    extraversionScore++;
  } else if (neuroticismYesAnsw.includes(curQuest) && answerYes.checked) {
    neuroticismScore++;
  } else if (
    (lieYesAnsw.includes(curQuest) && answerYes.checked) ||
    (lieNoAnsw.includes(curQuest) && answerNo.checked)
  ) {
    lieScore++;
  }

  if (curQuest === questions.length - 1) {
    document.location = `Result/index.html?ext=${extraversionScore}&neur=${neuroticismScore}&lie=${lieScore}`;
  } else {
    curQuest++;
    questionNumber.textContent = `Вопрос ${curQuest} из ${
      questions.length - 1
    }`;
    question.textContent = questions[curQuest];
  }
}

function saveProgress() {
  let saves = [];
  if ("saves" in localStorage) {
    saves = JSON.parse(localStorage.getItem("saves"));
  }

  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timezone: "UTC+3",
    hour: "numeric",
    minute: "numeric",
  };

  let saveInfo = {
    date: new Date().toLocaleString("ru", options),
    finished: curQuest === questions.length - 1,
    extraversionScore: extraversionScore,
    neuroticismScore: neuroticismScore,
    lieScore: lieScore,
    curQuest: curQuest,
  };

  saves.push(saveInfo);

  localStorage.setItem("saves", JSON.stringify(saves));
}

// function onLoad() {
//   var query = window.location.href.split("?")[1]; // результат - строка запроса без адреса страницы "id=someName&userMail=some@mail.com&usText=MemoText"
//   var params = query.split("&"); // результат - массив строк из пар "id=someName", "userMail=some@mail.com", "usText=MemoText"
//   // теперь брать по очереди
//   extraversionScore = params[0].split("=")[1];
//   neuroticismScore = params[1].split("=")[1];
//   lieScore = params[2].split("=")[1];
//   curQuest = params[3].split("=")[1];
// }
