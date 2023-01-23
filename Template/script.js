"use strict";

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
  rightAnswers;

  constructor(rightAnswers) {
    if (!Test.singleton) {
      Test.singleton = this;
    } else {
      return Test.singleton;
    }

    this.rightAnswers = rightAnswers;

    this.testSource = document.getElementById("Test");
    let questions = this.testSource.innerHTML.split("~");
    let testCaption = document.createElement("p");

    testCaption.className = "TestCaption";
    testCaption.innerHTML = questions[0];
    this.testSource.innerHTML = "";
    this.testSource.appendChild(testCaption);

    for (let i = 1; i < questions.length; i++) {
      questions[i] = questions[i].split("^");

      let div = document.createElement("div");
      div.className = "TestBlock";

      let questionNumber = document.createElement("p");
      questionNumber.className = "TestQNumber";
      questionNumber.innerHTML =
        "Вопрос " + i + " из " + (questions.length - 1);
      div.appendChild(questionNumber);

      let question = document.createElement("p");
      question.className = "TestQuestion";

      let isMultiple;
      if (questions[i][0].substr(0, 1) === "*") {
        isMultiple = true;
        questions[i][0] = questions[i][0].substr(1);
      } else {
        isMultiple = false;
      }

      let pre = document.createElement("pre");
      pre.className = "TestQuestion";
      pre.innerHTML = questions[i][0];
      question.appendChild(pre);
      div.appendChild(question);

      for (let j = 1; j < questions[i].length; j++) {
        let checkbox = document.createElement("input");
        checkbox.type = isMultiple ? "checkbox" : "radio";
        checkbox.name = "q" + i;

        let answer = document.createElement("p");
        answer.className = "TestAnswer";
        answer.appendChild(checkbox);
        answer.innerHTML += j + ". " + questions[i][j];
        div.appendChild(answer);
      }

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

    let isMultiple, checkboxes;
    if (this.rightAnswers[this.currQuest] instanceof Array) {
      checkboxes = this.testSource.querySelectorAll("input[type=checkbox]");
      isMultiple = true;
    } else {
      checkboxes = this.testSource.querySelectorAll("input[type=radio]");
      isMultiple = false;
    }

    let isCurrRight;
    if (isMultiple) {
      let currentAnswers = [];

      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) currentAnswers.push(i);
      }

      isCurrRight = checkArrayEquals(
        this.rightAnswers[this.currQuest],
        currentAnswers
      );
    } else {
      isCurrRight = checkboxes[this.rightAnswers[this.currQuest]].checked;
    }

    if (isCurrRight) {
      this.rightAnswersCount++;
    }

    if (this.currQuest === this.questionBlocks.length - 1) {
      this.testSource.removeChild(this.questionBlocks[this.currQuest]);
      this.testSource.removeChild(this.button);

      let p = document.createElement("p");
      p.className = "TestResult";
      p.innerHTML = "Тест завершён.";
      this.testSource.appendChild(p);

      this.testSource.appendChild(document.createElement("p"));

      p = document.createElement("p");
      p.className = "TestResult";
      p.innerHTML = "Вы дали верных ответов: " + this.rightAnswersCount;
      this.testSource.appendChild(p);

      this.testSource.appendChild(document.createElement("p"));

      p = document.createElement("p");
      p.className = "TestResult";
      p.innerHTML =
        "Вы набрали процентов: " +
        ((this.rightAnswersCount / this.questionBlocks.length) * 100).toFixed(
          1
        ) +
        "%";
      this.testSource.appendChild(p);
    } else {
      this.testSource.removeChild(this.questionBlocks[this.currQuest]);
      this.testSource.insertBefore(
        this.questionBlocks[++this.currQuest],
        this.button
      );
    }
  }
}
