let allReservations = [];

function isSameDay(date1, date2)
{
  return(date1.getDate() == date2.getDate() &&
  date1.getMonth() == date2.getMonth() &&
  date1.getFullYear() == date2.getFullYear());
}

function sendModifyRental(x)
{
  let oldStart = allReservations[x].start;
  let oldEnd = allReservations[x].end;
  let oldProduct = allReservations[x].product;
  let email = $('#user').val(); // la mail giusta dovrebbe essere questa, ma non nel caso di maintenace
  let employee = sessionStorage.getItem('email');
  let product = $('#products').val(); // nome del prodotto
  let start = new Date($('#start').val());
  let end = new Date($('#end').val());
  // devo comunque mandare i vecchi dati

 
  if((start != "" && end != "") && (start.getTime() <= end.getTime()) )
  {
    
    let obj = `{
      "user": "${email}", 
      "employee": "${employee}",
        "product": "${product}",
        "oldStart": "${oldStart}",
        "oldEnd": "${oldEnd}",
        "start": "${start}",
        "end": "${end}"
      }`;
      
      console.log(obj);

      $.ajax({
        method: 'PATCH',
          url: `http://localhost:8001/api/rental/${oldProduct}/modify`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: obj
        }).done(function(data){
          $('#content').html(`<h3>${data.message}</h3>`);
          allReservations[x].start = start;
          allReservations[x].end = end;
          getAllReservations();
        }).fail(function(data)
        {
            $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
        })
  }
}

function showModify(x)
{

  let start = new Date(allReservations[x].start); // faccio concat in showRes
    let today = new Date();
    if(start.getDate() == today.getDate() &&
    start.getMonth() == today.getMonth() &&
    start.getFullYear() == today.getFullYear())
    {
      $('#error').html("Can't modify reservation anymore");
      return;
    }
  let allProducts = [];
    $.get({
        type: 'GET',
          url: 'http://localhost:8001/api/products/',
        }, function(data){

            allProducts = allProducts.concat(data.productList);     
            let productsMenu = ` <div class="input-group mb-3">
            <label class="input-group-text" for="changeInfo">Select product</label>
            <select class="form-select" id="products"> `;
            for(let x in allProducts)
            {
          console.log(allProducts[x]);
          productsMenu += `<option value="${allProducts[x].name}">${allProducts[x].name}</option>`;
        }
        productsMenu += '</select>'
        let start = new Date(allReservations[x].start);
        let end = new Date(allReservations[x].end);
        let toInsert = `
        <form onsubmit="sendProduct(event)" class="needs-validation">
        <div class="mb-3">
        <input class="form-control" type="text" id="user" value="${allReservations[x].usermail}" aria-label="readonly input example" readonly>
        </div>
        ${productsMenu}
        <div class="input-group mb-3">
        <label class="input-group-text" for="start">Start</label>
        <input type="date" id="start" >
        </div>
        <div class="input-group mb-3">
        <label class="input-group-text" for="end">End</label>
        <input type="date" id="end">
        </div>
        <span id="error"></span> <br>
        <button type="submit" class="btn btn-lg btn-primary btn-block" onclick="sendModifyRental(${x})">Send</button>
        <button type="button" class="btn btn-lg btn-warning btn-block" onclick="getAllReservations()">Close</button>
        </form>`;
        $('#content').html(toInsert);
      }).fail(function(err)
      {
          $('#content').html("<h3>Try again please</h3>")
      })
}

function rentDeletion(x)
{
    let start = allReservations[x].start;
    let end = allReservations[x].end;
    let product = allReservations[x].product;
    let email = allReservations[x].usermail; // la mail giusta dovrebbe essere questa, ma non nel caso di maintenace
    let employee = sessionStorage.getItem('email');
        
  let obj = `{
    "user": "${email}", 
    "employee": "${employee}",
    "start": "${start}",
    "end": "${end}"
  }`;
  console.log(obj);
  
  $.ajax({
    method: "DELETE",
    url:`http://localhost:8001/api/rental/${product}`,
    contentType: 'application/json',
    dataType: 'json',
    data: obj
  }).done(function(data){
    $('#content').html(`<h3>${data.message}</h3>`);
    getAllReservations();
  }).fail(function(data){
    if(data)
      {     
        $('#content').html(`<h3>Something went wrong</h3>`);
        // $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
      }else
      {
        $('#content').html(`<h3>Something went wrong</h3>`);

      }

})


    
}
      
function showDelete(x)
      {
        let toInsert = `</select></div>
  <button type="button" class="btn btn-lg btn-danger btn-block" onclick="rentDeletion(${x})" >Confirm Deletion</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="getAllReservations()" >Back</button>`;
  $('#reservations').html('');
  $('#content').html(toInsert);
}

function showReservations(actives, future)
{
  $('#content').html('');
  let allActives = '';
  let allFuture = '';
  allReservations = allReservations.concat(future);
  for(let x in actives)
    {
      let start = new Date(actives[x].start);
      let end = new Date(actives[x].end);

        allActives += `
        <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${actives[x].usermail}</h5>
        <h5 class="card-title">Employee: ${actives[x].employee}</h5>
        <p class="card-text">Product: ${actives[x].product}</p>
        <p class="card-text">From: ${start.toDateString()}</p>
        <p class="card-text">To: ${end.toDateString()} </p>
        <p class="card-text">Expense: ${actives[x].expense} </p>
      </div>
      </div>
        `
    }
  for(let x in future)
  {
    let start = new Date(future[x].start);
    let end = new Date(future[x].end);
    let today = new Date();
    let isToday = false;
    if(start.getDate() == today.getDate() &&
    start.getMonth() == today.getMonth() &&
    start.getFullYear() == today.getFullYear())
    {
      isToday=true;

    }
    allFuture += `
    <div class="card">
    <h5 class="card-header">${x}${isToday ?  " <b> TODAY</b>" : ''}</h5>
    <div class="card-body">
    <h5 class="card-title">User: ${future[x].usermail}</h5>
    <h5 class="card-title">Employee: ${future[x].employee}</h5>
    <p class="card-text">Product: ${future[x].product}</p>
    <p class="card-text">From: ${start.toDateString()}</p>
    <p class="card-text">To: ${end.toDateString()} </p>
    <p class="card-text">Expense: ${future[x].expense} </p>
    <span id="error"></span>
    <a href="#" class="btn btn-primary" onclick="showModify(${x})">Modify rental</a>
    <a href="#" class="btn btn-danger" onclick="showDelete(${x})">Delete</a>
  </div>
  </div>`
  }
  if(allActives === '')
    allActives = 'No active reservations'
  if(allFuture === '')
    allFuture = 'No future reservations'
  let toInsert =`
  <div id="active">
  <h3>Actives</h3>
  ${allActives}
  </div>
  
  <div id="future">
  <h3>Future</h3>
  ${allFuture}
  </div>
  `
      $('#content').html(toInsert);
}

function getAllReservations()
{
  $('#content').html('');
  $('#reservations').html('');
  $('#title').html('');
    $.get({
    type: 'GET',
      url: 'http://localhost:8001/api/rental/',
    }, function(data){
      console.log("data.actives", data.actives);
      console.log("futures", data.future);
      showReservations(data.actives, data.future);
    }).fail(function(err)
    {
        $('#content').html("Try again later please");
    })
}