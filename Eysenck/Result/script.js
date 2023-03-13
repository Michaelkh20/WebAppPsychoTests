function onLoad() {
  let query = window.location.href.split("?")[1]; // результат - строка запроса без адреса страницы "id=someName&userMail=some@mail.com&usText=MemoText"
  let params = query.split("&"); // результат - массив строк из пар "id=someName", "userMail=some@mail.com", "usText=MemoText"
  // теперь брать по очереди
  let extraversionScore = params[0].split("=")[1];
  let neuroticismScore = params[1].split("=")[1];
  let lieScore = params[2].split("=")[1];
  showResults(extraversionScore, neuroticismScore, lieScore);
}

function showResults(extraversionScore, neuroticismScore, lieScore) {
  const xStep = 17.67,
    yStep = 18;
  const xShift = 63,
    yShift = 59;
  const imgSize = 525;

  let temperament = document.getElementById("temperament");
  if (extraversionScore < 12 && neuroticismScore < 12) {
    temperament.innerText += " Флегматик";
  } else if (extraversionScore >= 12 && neuroticismScore < 12) {
    temperament.innerText += " Сангвиник";
  } else if (extraversionScore < 12 && neuroticismScore >= 12) {
    temperament.innerText += " Меланхолик";
  } else if (extraversionScore >= 12 && neuroticismScore >= 12) {
    temperament.innerText += " Холерик";
  }

  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  let img = new Image();
  img.src = "img/eysenck_circle.png";
  img.addEventListener("load", function () {
    context.drawImage(img, 0, 0);
    const xCoord = xShift + extraversionScore * xStep;
    const yCoord = imgSize - (yShift + neuroticismScore * yStep);
    const radius = 8;
    const startAngle = 0; // Starting point on circle
    const endAngle = 2 * Math.PI; // End point on circle

    context.beginPath();
    context.arc(xCoord, yCoord, radius, startAngle, endAngle);
    context.fillStyle = "lime";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
  });

  const body = document.body;
  const diagram = document.getElementById("diagram");

  let p = document.createElement("p");
  p.className = "GCTestResult";
  p.innerHTML = "Тест завершён.";
  body.insertBefore(p, diagram);

  body.insertBefore(document.createElement("p"), diagram);

  p = document.createElement("p");
  p.className = "GCTestResult";
  let extraverResult = "Экстраверсия/Интроверсия: " + extraversionScore + " - ";
  if (extraversionScore > 19) extraverResult += "Яркий экстраверт";
  else if (extraversionScore > 15) extraverResult += "Экстраверт";
  else if (extraversionScore > 12)
    extraverResult += "Слабовыраженная экстраверсия";
  else if (extraversionScore === 12) extraverResult += "Среднее значение";
  else if (extraversionScore >= 9)
    extraverResult += "Слабовыраженная интроверсия";
  else if (extraversionScore >= 5) extraverResult += "Интроверт";
  else extraverResult += "Глубокий интроверт";
  p.innerHTML += extraverResult;
  body.insertBefore(p, diagram);

  body.insertBefore(document.createElement("p"), diagram);

  p = document.createElement("p");
  p.className = "GCTestResult";
  let neurotResult = "Нейротизм: " + neuroticismScore + " - ";
  if (neuroticismScore > 19) neurotResult += "Очень высокий уровень нейротизма";
  else if (neuroticismScore > 14) neurotResult += "Высокий уровень нейротизма";
  else if (neuroticismScore > 7) neurotResult += "Средний уровен нейротизма";
  else neurotResult += "Низкий уровень нейротизма";
  p.innerHTML += neurotResult;
  body.insertBefore(p, diagram);

  body.insertBefore(document.createElement("p"), diagram);

  p = document.createElement("p");
  p.className = "GCTestResult";
  p.innerHTML = "Шкала лжи: " + lieScore + " - ";
  if (lieScore > 4) {
    p.innerHTML +=
      "Неискренность в ответах, свидетельствующая также о некоторой демонстративности поведения и ориентированности испытуемого на социальное одобрение.<br>Попробуйте пройти тест еще раз, отвечая более откровенно, не задумываясь о возможном впечатлении, которое могли бы произвести ваши ответы";
    p.style.color = "red";
  } else {
    p.innerHTML += "Норма";
  }
  body.insertBefore(p, diagram);

  body.insertBefore(document.createElement("p"), diagram);
}

// http://127.0.0.1:8080/Result/index.html?ext=0&neur=0&lie=0
