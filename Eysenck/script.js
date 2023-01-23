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

function checkArrayEquals(array1, array2) {
  if (array1.length !== array2.length) return false;

  for (let i = 0; i < array2.length; i++) {
    if (!array1.includes(array2[i])) return false;
  }

  return true;
}

class Test {
  static singleton;
  currQuest = -1;
  rightAnswersCount = 0;
  button;
  testSource;
  questionBlocks = [];
  extraversionYesAnsw = [
    1, 3, 8, 10, 13, 17, 22, 25, 27, 39, 44, 46, 49, 53, 56,
  ];
  extraversionNoAnsw = [5, 15, 20, 29, 32, 34, 37, 41, 51];
  neuroticismYesAnsw = [
    2, 4, 7, 9, 11, 14, 16, 19, 21, 23, 26, 28, 31, 33, 35, 38, 40, 43, 45, 47,
    50, 52, 55, 57,
  ];
  lieYesAnsw = [6, 24, 36];
  lieNoAnsw = [12, 18, 30, 42, 48, 54];
  extraversionScore = 0;
  neuroticismScore = 0;
  lieScore = 0;

  constructor() {
    if (!Test.singleton) {
      /* Только один экземпляр! */
      Test.singleton = this;
    } else {
      return Test.singleton;
    }

    this.testSource = document.getElementById("Test");
    let questions = this.testSource.innerHTML.split("~");
    let testCaption = document.createElement("p");

    testCaption.className = "TestCaption";
    testCaption.innerHTML = questions[0];
    this.testSource.innerHTML = "";
    this.testSource.appendChild(testCaption);

    for (let i = 1; i < questions.length; i++) {
      let div = document.createElement("div");
      div.className = "TestBlock";

      let questionNumber = document.createElement("p");
      questionNumber.className = "TestQNumber";
      questionNumber.innerHTML =
        "Вопрос " + i + " из " + (questions.length - 1);
      div.appendChild(questionNumber);

      let question = document.createElement("p");
      question.className = "TestQuestion";

      let pre = document.createElement("pre");
      pre.className = "TestQuestion";
      pre.innerHTML = questions[i];
      question.appendChild(pre);
      div.appendChild(question);

      let checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.id = "yes";
      checkbox.name = "Q" + i;

      let yes = document.createElement("p");
      yes.className = "TestAnswer";
      yes.appendChild(checkbox);
      yes.innerHTML += "Да";
      div.appendChild(yes);

      checkbox = document.createElement("input");
      checkbox.type = "radio";
      checkbox.id = "no";
      checkbox.name = "Q" + i;

      let no = document.createElement("p");
      no.className = "TestAnswer";
      no.appendChild(checkbox);
      no.innerHTML += "Нет";
      div.appendChild(no);

      this.questionBlocks.push(div);
    }

    this.button = document.createElement("input");
    this.button.value = "Далее";
    this.button.type = "button";
    this.button.onclick = this.analyze.bind(this);
    this.button.className = "TestButton";
    this.testSource.appendChild(this.button);
  }

  analyze() {
    if (this.currQuest === -1) {
      this.testSource.insertBefore(this.questionBlocks[0], this.button);
      this.currQuest++;
      return;
    }

    if (
      (this.extraversionYesAnsw.includes(this.currQuest + 1) && yes.checked) ||
      (this.extraversionNoAnsw.includes(this.currQuest + 1) && no.checked)
    ) {
      this.extraversionScore++;
    } else if (
      this.neuroticismYesAnsw.includes(this.currQuest + 1) &&
      yes.checked
    ) {
      this.neuroticismScore++;
    } else if (
      (this.lieYesAnsw.includes(this.currQuest + 1) && yes.checked) ||
      (this.lieNoAnsw.includes(this.currQuest + 1) && no.checked)
    ) {
      this.lieScore++;
    }

    if (this.currQuest === this.questionBlocks.length - 1) {
      document.location = `Result\\index.html?ext=${this.extraversionScore}&neur=${this.neuroticismScore}&lie=${this.lieScore}`;
    } else {
      this.testSource.removeChild(this.questionBlocks[this.currQuest]);
      this.testSource.insertBefore(
        this.questionBlocks[++this.currQuest],
        this.button
      );
    }
  }
}
