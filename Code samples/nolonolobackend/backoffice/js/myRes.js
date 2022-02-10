let activeRes = [];
let futureRes = [];
function calculateFidelityPoints(start, end, expense) {
  let points = 0;
  let period = end.getTime() - start.getTime();
  period = period / (1000 * 3600 * 24);

  if (period > 10) {
    points = 25;
  } else if (period > 7) {
    points = 15;
  } else if (period > 3) {
    points = 10;
  } else
    points = 5;
  if (expense >= 150) {
    points += 30;
  }
  else if (expense >= 100) {
    points += 15;
  } else if (expense >= 70) {
    points += 10;
  } else if (expense >= 40) {
    points += 8;
  }

  console.log("points to add", points);
  return points;
}

function isSameDay(date, today) {
  return (date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear());

}
function calculateFinalPrice(isLate, start, end, expense) {

  let period = end.getTime() - start.getTime();
  period = period / (1000 * 3600 * 24);
  period += 1;
  //ATTENZIONE CONTA UN GIORNO IN MENO DA 22 A 26 DICE 4 GIORNI MA SONO 5
  if (isSameDay(end, start)) // se è di un giorno solo la prenotazione
  {
    period = 1;
  }
  let today = new Date();
  console.log("period", period);

  if (isLate) {
    console.log("IS LATE");
    let overPeriod = today.getTime() - end.getTime(); // tempo in +
    overPeriod = overPeriod / (1000 * 3600 * 24);
    overPeriod = Math.trunc(overPeriod);

    let medium = expense / period; // la media giornaliera
    medium = Math.trunc(medium * overPeriod);
    expense = expense + medium; //aggiungo in +
    console.log("overPeriod", overPeriod);
    console.log("medium", medium);
    console.log("expense", expense);

  } else // in anticipo quindi today < end
  {
    console.log("IS NOT LATE");
    let remaningPeriod = end.getTime() - today.getTime();
    remaningPeriod = remaningPeriod / (1000 * 3600 * 24);
    remaningPeriod += 1;
    remaningPeriod = Math.trunc(remaningPeriod);
    console.log("remaningPeriod", remaningPeriod);

    if (isSameDay(end, start)) // se è di un giorno solo la prenotazione
    {
      remaningPeriod = 1;
    }
    let medium = expense / period; // la media giornaliera
    medium = Math.trunc(medium * remaningPeriod); // quanto mancava in fatto di soldi
    expense = Math.abs(expense - medium); //vado a levare la media dei giorni rimanenti a quello che deve pagare
    console.log("medium", medium);
    console.log("expense", expense);
  }
  return expense;
}
function confirmEndOfRental(x) {
  console.log("dentro confirm", activeRes);
  let check = $('#check').val();
  console.log("check :", check);
  let employee = sessionStorage.getItem('email');
  let product = activeRes[x].product;
  let user = activeRes[x].usermail;
  let start = activeRes[x].start;
  let end = activeRes[x].end;
  let expense = activeRes[x].expense;
  console.log("old expense", expense);
  let today = new Date();
  start = new Date(start);
  end = new Date(end);
  let points = 0;
  //Se è in ritardo i punti fedeltà sono 0
  //Se l'oggetto è rotto o danneggiato allora i punti sono 0
  if (!(isSameDay(end, today))) // SE OGGI NON È QUANDO AVREBBE DOVUTO CONSEGNARE
  {

    if (today.getTime() < end.getTime()) // SONO IN ANTICIPO
    {
      if (check === 'Y') {
        points = calculateFidelityPoints(start, today, expense);
      }
      expense = calculateFinalPrice(false, start, end, expense);

    } else if (today.getTime() > end.getTime()) // SONO IN RITARDO
    {
      console.log("ENTRO QUIIII");

      expense = calculateFinalPrice(true, start, end, expense);
    }
  } else {
    console.log("È OGGI NON È NE IN RITARDO NE IN ANTICIPO")
  }

  console.log("new expense", expense);

  if (expense === 0)
    expense = 8;

  let obj = `{
      "user": "${user}", 
      "expense": "${expense}",
      "employee": "${employee}",
      "start": "${start}",
      "points": "${points}",
      "end": "${end}"
    }`;
  console.log(obj);
  $.post({
    type: 'POST',
    url: `http://localhost:8001/api/rental/${product}/restitution`,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: obj
  }, function (data) {
    $("#reservations").html(``);
    $('#content').html(`<h3>${data.message}</h3>`);
    // location.reload();
  }).fail(function (data) {
    $("#reservations").html(``);
    $('#content').html(`${data.responseJSON.message}`);
  })
}

function confirmLending(x) {
  let employee = sessionStorage.getItem('email');
  let product = futureRes[x].product;
  let user = futureRes[x].usermail;
  let start = new Date(futureRes[x].start);
  let end = futureRes[x].end;
  let today = new Date();
  if (today.getTime() >= start.getTime()) {

    let obj = `{
      "user": "${user}", 
      "product": "${product}",
      "employee": "${employee}",
      "start": "${start}",
      "end": "${end}"
    }`;
    console.log(obj);
    $.post({
      type: 'POST',
      url: 'http://localhost:8001/api/rental/active/confirm',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function (data) {
      $('#content').html(`<h3>${data.message}</h3>`);
      getMyReservations();
    }).fail(function (data) {
      $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
    })
  } else {
    $('#futureError').html("Can't confirm a lending before the start of the reservation");
  }
}

function showMyReservations(emp) {
  activeRes = activeRes.concat(emp.activeReservations);
  console.log(activeRes);
  futureRes = futureRes.concat(emp.futureReservations);
  let active = '';
  let future = '';
  let past = '';
  for (x in emp.activeReservations) {
    let start = new Date(emp.activeReservations[x].start);
    let end = new Date(emp.activeReservations[x].end)
    let today = new Date();
    active += `
    <div class="card">
        <h5 class="card-header">${x} ${(end.getTime() < today.getTime()) ? '<h3><b>LATE</b></h3>' : (isSameDay(end, today) ? ' <h3><b>TODAY</b></h3>' : '')}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.activeReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.activeReservations[x].product}</p>
        <p class="card-text">From: ${start.toDateString()}</p>
        <p class="card-text">To: ${end.toDateString()} </p>
        <p class="card-text">Expense: ${emp.activeReservations[x].expense} </p>
        <label for="check"><b>Is the product ok?</b></label>
        <select class="form-select" id="check">
          <option selected value="Y">Y</option>
          <option value="notok">N</option>
        </select>
        <a href="#" class="btn btn-primary" onclick="confirmEndOfRental(${x})">Confirm restitution</a>
        </div>
        </div>

    `
  }
  for (x in emp.futureReservations) {
    let start = new Date(emp.futureReservations[x].start);
    let end = new Date(emp.futureReservations[x].end)
    let today = new Date();
    let isToday = false;
    if (start.getDate() == today.getDate() &&
      start.getMonth() == today.getMonth() &&
      start.getFullYear() == today.getFullYear()) {
      isToday = true;

    }
    future += `
    <div class="card">
        <h5 class="card-header">${x} ${isToday ? ' <b>TODAY</b>' : ''}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.futureReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.futureReservations[x].product}</p>
        <p class="card-text">From: ${start.toDateString()}</p>
        <p class="card-text">To: ${end.toDateString()} </p>
        <p class="card-text">Expense: ${emp.futureReservations[x].expense} </p>
        <span id="futureError"></span><br>
        <a href="#" class="btn btn-primary" onclick="confirmLending(${x})">Confirm lending</a>

        </div>
        </div>
    `
  }
  for (x in emp.pastReservations) {
    let start = new Date(emp.pastReservations[x].start);
    let end = new Date(emp.pastReservations[x].end)
    past += `
    <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.pastReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.pastReservations[x].product}</p>
        <p class="card-text">From: ${start.toDateString()}</p>
        <p class="card-text">To: ${end.toDateString()} </p>
        <p class="card-text">Expense: ${emp.pastReservations[x].expense} </p>
        </div>
        </div>

    `
  }
  let toInsert = `
  <div id="active">
  <h3>Active</h3>
  ${active}
  </div>
  <div id="future">
  <h3>Future</h3>
  ${future}
  </div>
  <div id="past">
  <h3>Past</h3>
  ${past}

  </div>
  `
  $('#reservations').html(toInsert);
}

function getMyReservations() {
  $('#reservations').html('');

  $('#title').html('');
  $('#content').html('');

  let email = sessionStorage.getItem('email');

  $.post({
    type: 'GET',
    url: `http://localhost:8001/api/employee/${email}`
  }, function (data) {
    showMyReservations(data.emp);
  }).fail(function (err) {
    $('#content').html("Try again later please");
  })
}