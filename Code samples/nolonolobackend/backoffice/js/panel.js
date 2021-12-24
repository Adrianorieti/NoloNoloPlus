let allCostumers = [];
let productsNames = [];
let categoriesNames = [];
let productsPrices = [];
let allProducts = [];
let requests= [];
let allReservations = [];
function reset()
{
  location.reload();
}

function getCostumers()
{
  return allCostumers;
}

function logout(){
    sessionStorage.clear();
    window.location.href = `http://localhost:8001/employee/login`;
}

function sendRentalHypothesis(x, event)
{
  event.preventDefault();
    let email = $('#email').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();

    let obj = `{
        "categoryName": "${categoriesNames[x]}",
        "productName": "${productsNames[x]}",
        "email": "${email}",
        "startingDate": "${startDate}",
        "endingDate": "${endDate}"
    }`;
    console.log(obj);
    $.post({
        type: 'POST',
          url: 'http://localhost:8001/api/employee/makeRentalHypothesis',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: obj
        }, function(data){
            let toInsert = '';
            if(data.availability)
            {
                 toInsert = `<div id="available">
                <h5>The product is available !</h5>
                <p>Final price: ${data.finalPrice}€</p>
                <p>Product chosen by system: ${data.currProdName}</p>
                <button type="button" class="btn btn-lg btn-primary btn-block" onclick="logout()">Bring me back to login</button>
                </div>`
            }else
            {
                 toInsert = `<div id="unavailable">
                <h5>The product is unavailable in these dates!</h5>
                <p>Product chosen by system: ${data.currProdName}</p>
                <button type="button" class="btn btn-lg btn-primary btn-block" onclick="logout()">Bring me back to login</button>
                </div>`
            }
            $('#info').html(toInsert);   
        }).fail(function(data)
        {
          toInsert = `<div id="unavailable">
          <h5>The product is unavailable in these dates!</h5>
          <p>Product chosen by system: ${data.currProdName}</p>
          <button type="button" class="btn btn-lg btn-primary btn-block" onclick="logout()">Bring me back to login</button>
          </div>`     
          $('#info').html(toInsert);   

           });
}
/** Make a rental hypothesis on a product , there is no need to be logged */
function makeRentalHypothesis(x)
{
    let toInsert = `<div id="summary"><h5>Insert last infos</h5>
    <p>Name: ${productsNames[x]}</p>
    <p>Price: ${productsPrices[x]}$</p>
    <form>
  <div class="mb-3">
    <label for="email" class="form-label">User Email address</label>
    <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
  </div>
  <div class="mb-3">
    <label for="startDate" class="form-label">Start Date</label>
    <input type="date" class="form-control" id="startDate">
  </div>
  <div class="mb-3 >
  <label class="form-check-label" for="endDate">End Date</label>
    <input type="date" class="form-control" id="endDate">
  </div>
  <button type="submit" class="btn btn-primary" onclick="sendRentalHypothesis(${x}, event)">Send</button>
</form>
    </div>`;
    $("#content").html("");
    $('#info').html(toInsert);
}

/** Renders all products in the content div */ 
function showProducts(products)
{
    productsNames = [];
    productsPrices = [];
    categoriesNames = [];
    allProducts = [] ;
    let token = sessionStorage.getItem('token');
    let toInsert = '';
    let image = '';
    for(let x in products)
    {
        allProducts.push(products[x]);
        productsNames.push(products[x].name);
        productsPrices.push(products[x].price);
        categoriesNames.push(products[x].type);
        image = '';
        switch(products[x].type){
            case 'Electric S_300':
                image = 'electricBike.jpg';
                break;
            case 'Mountain Bike' :
                image = 'mountainBike.jpg';
                break;
            case 'City Bike' :
                image = 'cityBike.jpg' ;
                break;
            case 'Scooter' :
                image = 'scooter.jpg' ;
                break;
            case 'Special Bike' :
                image = 'specialBike.jpeg' ;
                break;
        }
        if(token)
        {
            toInsert += `<div class="card" style="width: 18rem;">
            <img src="../images/${image}" class="card-img-top" alt="Product image">
            <div class="card-body">
              <h5 class="card-title">${products[x].name}</h5>
              <p class="card-text">${products[x].price}$ per day</p>
              <p class="card-text">Status: ${products[x].status}</p>
              <div class="input-group mb-3">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Actions</button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" onclick="showAddRent(${x}, allProducts)">Add Rent</a></li>
              <li><a class="dropdown-item" onclick="showChangeProduct(${x}, allProducts)">Change product info</a></li>
              <li><a class="dropdown-item" onclick="showDeleteProduct(${x}, allProducts)">Delete</a></li>
              <li><a class="dropdown-item" onclick="showMaintenance(${x}, allProducts)">Mantainance</a></li>
            </ul>
          </div>
            </div>
          </div>`
        }else if( !token && document.referrer.includes('login'))
        {
            
            toInsert += `<div class="card" style="width: 18rem;">
            <img src="../images/${image}" class="card-img-top" alt="Product image">
            <div class="card-body">
              <h5 class="card-title">${products[x].name}</h5>
              <p class="card-text">${products[x].price}$ per day</p>
              <p class="card-text">Status: ${products[x].status}</p>
              <a href="#" class="btn btn-primary" onclick="makeRentalHypothesis(${x})">Make rental hypothesis</a>
            </div>
          </div>`
        }
       
    }
    console.log(productsNames);
    $('#title').html("");
    $('#content').html(toInsert);
}

/** Get all single products from database */
function getAllproducts()
{
  $('#reservations').html('');
    $.get({
        type: 'GET',
          url: 'http://localhost:8001/api/employee/products',
        }, function(data){
            showProducts(data.productList);     
        }).fail(function(err)
        {
            // change this
            alert('error');
        })
}

function showCostumers(costumers)
{
    allCostumers = [];
    allCostumers = allCostumers.concat(costumers);
    let toInsert = '';
    let image = '../images/user.jpeg';
    for(let x in costumers)
    {
        toInsert += `<div class="card" style="width: 18rem;">
        <img src="../images/${image}" class="card-img-top" alt="Product image">
        <div class="card-body">
          <h5 class="card-title">${costumers[x].name} ${costumers[x].surname} </h5>
          <p class="card-text">Email :${costumers[x].email}</p>
          <p class="card-text">Phone :${costumers[x].phone}</p>
          <p class="card-text">Payment method: ${costumers[x].paymentMethod}</p>
          <p class="card-text">Fidelity point: ${costumers[x].fidelityPoints}</p>
          <p class="card-text">Amount paid: ${costumers[x].amountPaid}</p>
           <div class="input-group mb-3">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Actions</button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" onclick="changeUserInfo(${x}, event, allCostumers)">Change user info</a></li>
              <li><a class="dropdown-item" href="#" onclick="showAddComunication(${x}, allCostumers)">Add communication</a></li>
              <li><a class="dropdown-item" href="#"></a></li>
            </ul>
          </div>
        </div>
      </div>`
    }
    $('#title').html("");
    $('#content').html(toInsert);
}

function getAllcostumers()
{
  $('#reservations').html('');
    $.get({
        type: 'GET',
          url: 'http://localhost:8001/api/employee/getUsersInfo',
        }, function(data){
            showCostumers(data.users);     
        }).fail(function(err)
        {
            alert('error');
        })
}

function denyPendingRequest(x)
{
 let message = $('#text').val();
 let email = $('#email').val();
 let start = requests[x].start;
 let end = requests[x].end;
 let product = requests[x].product;
 let id = requests[x]._id;

 const obj =`{
  "email": "${email}",
  "start": "${start}",
  "end": "${end}",
  "product": "${product}",
  "message": "${message}",
  "id": "${id}"
}`;

$.post({
  type: 'POST',
    url: 'http://localhost:8001/api/employee/denyBeginOfRental',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: obj
  }, function(){
    $('#content').html("Succesful operation");
  }).fail(function(){
    $('#content').html("error");

  })


}

function showDenyPendingRequest(x)
{
  let toInsert = `
  <div class="input-group mb-3">
  <input class="form-control" type="text" id='email' value="${requests[x].usermail}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3">
<div class="mb-3">
  <label for="text" class="form-label">Message to send</label>
  <textarea class="form-control" id="text" rows="3"></textarea>
  <button type="button" class="btn btn-lg btn-primary btn-block" onclick="denyPendingRequest(${x})" >Insert</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>
</div>`
$('#content').html(toInsert);
}

function confirmPendingRequest(x)
{
  console.log(x);
  console.log("dentro confirm", requests[x]);
  let userMail = requests[x].usermail;
  let employeeMail = sessionStorage.getItem('email');
  let start = requests[x].start;
  let end = requests[x].end;
  let product = requests[x].product;
  let price = requests[x].expense;
  let id = requests[x]._id;
  const obj =`{
    "email": "${userMail}",
    "employee": "${employeeMail}",
    "start": "${start}",
    "end": "${end}",
    "product": "${product}",
    "expense": "${price}",
    "id": "${id}"
  }`;
  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/confirmBeginOfRental',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(){

      $(`#card-${x}`).html("Succesfully added");
    }).fail(function(){
      $(`#card-${x}`).html("Error, please try again");

    })
}

function showPendingRequests(data)
{
  let toInsert= '';
  requests = [];
  requests = requests.concat(data);
  console.log("requests", requests);
  for(let x in requests)
  {
    console.log(requests[x]);
    toInsert += `
    <div class="card" id="card-${x}">
    <h5 class="card-header">${x}</h5>
    <div class="card-body">
    <h5 class="card-title">Product: ${requests[x].product}</h5>
    <p class="card-text">User: ${requests[x].usermail}</p>
    <p class="card-text">From: ${requests[x].start} </p>
    <p class="card-text">TO: ${requests[x].end} </p>
    <p class="card-text">Price: ${requests[x].expense} </p>
    <a href="#" class="btn btn-primary" onclick="confirmPendingRequest(${x})">Accept</a>
    <a href="#" class="btn btn-danger" onclick="showDenyPendingRequest(${x})">Deny</a>
    </div>
    </div>
    
    `
  }
  $('#title').html('<h2>Pending requests</h2>')
  if(requests.length === 0)
    $('#content').html("<p>There are no pending requests waiting for approval</p>");
  else
    $('#content').html(toInsert);

}

function getPendingRequests()
{
  $('#reservations').html('');

  $.get({
    type: 'GET',
      url: 'http://localhost:8001/api/employee/pendingRequests',
    }, function(data){
      showPendingRequests(data.pendingList);
    }).fail(function(err)
    {
        $('#content').html("Try again later please");
    })
}

function sendModifyRental(x)
{
  console.log("SONO QUIIII");
  let oldStart = allReservations[x].start;
  let oldEnd = allReservations[x].end;
  let oldProduct = allReservations[x].name;
  let email = $('#user').val(); // la mail giusta dovrebbe essere questa, ma non nel caso di maintenace
  let employee = sessionStorage.getItem('email');
  let product = $('#name').val(); // nome del prodotto
  let start = $('#start').val();
  let end = $('#end').val();
  console.log(product);
  console.log(start);
  console.log(end);
  // devo comunque mandare i vecchi dati
  if( product && start && end)
  {

  let obj = `{
    "user": "${email}", 
    "employee": "${employee}",
    "product": "${product}",
    "oldProduct": "${oldProduct}",
    "oldStart": "${oldStart}",
    "oldEnd": "${oldEnd}",
    "start": "${start}",
    "end": "${end}"
  }`;

  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/modifyRental',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(){
      $('#content').html("Yes");
    }).fail(function(data)
    {
      console.log(data.message);
        $('#content').html("Try again later please");
    })
  }else
  {
    $('#error').html("Please enter all fields")
  }
}

function showModify(x)
{
  let toInsert = `
  <form onsubmit="sendProduct(event)" class="needs-validation">
  <div class="mb-3">
  <input class="form-control" type="text" id="user" value="${allReservations[x].usermail}" aria-label="readonly input example" readonly>
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="name">Product name</label>
<input type="text" class="form-control" id="name" aria-label="Insert the new product name, default empty">
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="start">Start</label>
<input type="date" id="start">
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="end">End</label>
<input type="date" id="end">
</div>
<span id="error"></span> <br>
<button type="submit" class="btn btn-lg btn-primary btn-block" onclick="sendModifyRental(${x})">Send</button>
<button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()">Close</button>
</form>`;

  $('#content').html(toInsert);
}

function rentDeletion(x)
{
  let start = allReservations[x].start;
  let end = allReservations[x].end;
  let product = allReservations[x].name;
  let email = allReservations[x].usermail; // la mail giusta dovrebbe essere questa, ma non nel caso di maintenace
  let employee = sessionStorage.getItem('email');

  let obj = `{
    "user": "${email}", 
    "employee": "${employee}",
    "product": "${product}",
    "start": "${start}",
    "end": "${end}"
  }`;
  console.log(obj);
  
  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/deleteRental',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(){
        $('#content').html("Successful deletion");
    }).fail(function(){
        $('#content').html("Error, maybe the element doesn't exists");
    })
  }

function showDelete(x)
{
  let toInsert = `</select></div>
  <button type="button" class="btn btn-lg btn-danger btn-block" onclick="rentDeletion(${x})" >Confirm Deletion</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>`;
  $('#content').html(toInsert);
}
function showReservations(reservations)
{
  console.log(reservations);
  let toInsert = '';
  allReservations = allReservations.concat(reservations);
  for(let x in reservations)
    {
        toInsert += `
        <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${reservations[x].usermail}</h5>
        <p class="card-text">Product: ${reservations[x].name}</p>
        <p class="card-text">From: ${reservations[x].start}</p>
        <p class="card-text">To: ${reservations[x].end} </p>
        <p class="card-text">Expense: ${reservations[x].expense} </p>
        <a href="#" class="btn btn-primary" onclick="showModify(${x})">Modify rental</a>
        <a href="#" class="btn btn-danger" onclick="showDelete(${x})">Delete</a>

      </div>
      </div>
        `
    }
    if(toInsert === '')
      $('#content').html("No reservations");
    else
      $('#content').html(toInsert);

}

function getAllReservations()
{
  $('#reservations').html('');
  $('#title').html('');
    $.get({
    type: 'GET',
      url: 'http://localhost:8001/api/employee/getAllReservations',
    }, function(data){
      showReservations(data.reservations);
    }).fail(function(err)
    {
        $('#content').html("Try again later please");
    })
}

function showMyReservations(emp)
{
  let active = '';
  let future = '';
  let past = '';
  for(x in emp.activeReservations)
  {
    active += `
    <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.activeReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.activeReservations[x].product}</p>
        <p class="card-text">From: ${emp.activeReservations[x].start}</p>
        <p class="card-text">To: ${emp.activeReservations[x].end} </p>
        <p class="card-text">Expense: ${emp.activeReservations[x].expense} </p>
        </div>
        </div>

    `
  }
  for(x in emp.futureReservations)
  {
    future += `
    <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.futureReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.futureReservations[x].product}</p>
        <p class="card-text">From: ${emp.futureReservations[x].start}</p>
        <p class="card-text">To: ${emp.futureReservations[x].end} </p>
        <p class="card-text">Expense: ${emp.futureReservations[x].expense} </p>
        <a href="#" class="btn btn-primary" onclick="confirmLending(${x})">Confirm lending</a>

        </div>
        </div>
    `
  }
  for(x in emp.pastReservations)
  {
    past += `
    <div class="card">
        <h5 class="card-header">${x}</h5>
        <div class="card-body">
        <h5 class="card-title">User: ${emp.pastReservations[x].usermail}</h5>
        <p class="card-text">Product: ${emp.pastReservations[x].product}</p>
        <p class="card-text">From: ${emp.pastReservations[x].start}</p>
        <p class="card-text">To: ${emp.pastReservations[x].end} </p>
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
  let obj = `{
    "email": "${email}"
  }`;
  $.post({
    type: 'POST',
      url: `http://localhost:8001/api/employee/singleEmp`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj 
    }, function(data){
      console.log(data.emp);
      showMyReservations(data.emp);
    }).fail(function(err)
    {
        $('#content').html("Try again later please");
    })
}