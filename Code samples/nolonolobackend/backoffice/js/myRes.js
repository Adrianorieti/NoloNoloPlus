let activeRes = [];
let futureRes = [];

function confirmLending(x)
{
  console.log("entro qui");
  let employee = sessionStorage.getItem('email');
  let product = futureRes[x].product;
  let user = futureRes[x].usermail;
  let start = futureRes[x].start;
  let end = futureRes[x].end;

  let obj = `{
    "user": "${user}", 
    "product": "${product}",
    "employee": "${employee}",
    "start": "${start}",
    "end": "${end}"
  }`;
  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/rental/active/confirm',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(data){
        $('#content').html(data.message);
        location.reload();
    }).fail(function(data){
        $('#content').html(data.message);
    })
}

function showMyReservations(emp)
{
  activeRes = activeRes.concat(emp.activeReservations);
  futureRes = futureRes.concat(emp.futureReservations);
  let active = '';
  let future = '';
  let past = '';
  for(x in emp.activeReservations)
  {
    let start = new Date(emp.activeReservations[x].start);
    let end = new Date(emp.activeReservations[x].end)
    active += `
    <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.activeReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.activeReservations[x].product}</p>
        <p class="card-text">From: ${start.toDateString()}</p>
        <p class="card-text">To: ${end.toDateString()} </p>
        <p class="card-text">Expense: ${emp.activeReservations[x].expense} </p>
        label class="input-group-text" for="points">Insert points</label>
        <input type="text" class="form-control" id="points" aria-label="Insert the points to add or subtract">
        <span id="pointsError></span>
        <a href="#" class="btn btn-primary" onclick="confirmEndOfRental(${x})">Confirm restitution</a>

        </div>
        </div>

    `
  }
  for(x in emp.futureReservations)
  {
    let start = new Date(emp.futureReservations[x].start);
    let end = new Date(emp.futureReservations[x].end)
    future += `
    <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.futureReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.futureReservations[x].product}</p>
        <p class="card-text">From: ${start.toDateString()}</p>
        <p class="card-text">To: ${end.toDateString()} </p>
        <p class="card-text">Expense: ${emp.futureReservations[x].expense} </p>
        <a href="#" class="btn btn-primary" onclick="confirmLending(${x})">Confirm lending</a>

        </div>
        </div>
    `
  }
  for(x in emp.pastReservations)
  {
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
  let toInsert =`
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

function getMyReservations()
{
  $('#reservations').html('');

  $('#title').html('');
  $('#content').html('');

  let email = sessionStorage.getItem('email');
  
  $.post({
    type: 'GET',
      url: `http://localhost:8001/api/employee/${email}` 
    }, function(data){
      console.log(data.emp);
      showMyReservations(data.emp);
    }).fail(function(err)
    {
        $('#content').html("Try again later please");
    })
}