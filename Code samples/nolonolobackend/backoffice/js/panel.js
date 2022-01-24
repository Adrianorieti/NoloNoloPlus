let allCostumers = [];
let productsNames = [];
let categoriesNames = [];
let productsPrices = [];
let allProducts = [];
let requests= [];

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
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    console.log(endDate.getTime())
    console.log(startDate.getTime());
    if(endDate.getTime() < startDate.getTime())
        { 
            console.log("EH SI È COSÌ NÈ")
        }  
  if((startDate && endDate && email) && (endDate.getTime() >= startDate.getTime()) )
      {
        $.post({
          type: 'GET',
          url: `http://localhost:8001/api/products/${productsNames[x]}/available/?start=${startDate}&end=${endDate}&email=${email}`
            }, function(data){
              console.log(data.status);
                let toInsert = '';
                    toInsert = `<div id="available">
                    <h5>The product is available !</h5>
                    <p>Final price: ${data.price}€</p>
                    <p>Product chosen by system: ${data.product.name}</p>
                    <button type="button" class="btn btn-lg btn-primary btn-block" onclick="logout()">Bring me back to login</button>
                    </div>`
            
                $('#content').html(toInsert);   
              }).fail(function(data)
              {
                toInsert = `<div id="unavailable">
                <h5>The product is unavailable in these dates!</h5>
                <p>Product chosen by system: ${data.product.name}</p>
                <button type="button" class="btn btn-lg btn-primary btn-block" onclick="logout()">Bring me back to login</button>
                </div>`     
              $('#info').html(toInsert);   
              
            });
      }else
        {
          console.log("errore");
          $('#hyperror').html("Please insert all fields correctly");
        }
}
/** Make a rental hypothesis on a product , there is no need to be logged */
function makeRentalHypothesis(x)
{
    let toInsert = `<div id="summary"><h5>Insert last infos</h5>
    <p>Name: ${productsNames[x]}</p>
    <p>Price: ${productsPrices[x]}$</p>
    <form>
  <div class="mb-3 hypothesis">
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
  <div><span id="hyperror"></span></div>
    </div>`;
    $("#content").html("");
    $('#content').html(toInsert);
}

/** Renders all products in the content div */ 
function showProducts(products)
{
  console.log(products);
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
        image = products[x].image;
        // switch(products[x].type){
        //     case 'Electric S_300':
        //         image = 'electricBike.jpg';
        //         break;
        //     case 'Mountain Bike' :
        //         image = 'mountainBike.jpg';
        //         break;
        //     case 'City Bike' :
        //         image = 'cityBike.jpg' ;
        //         break;
        //     case 'Scooter' :
        //         image = 'scooter.jpg' ;
        //         break;
        //     case 'Special Bike' :
        //         image = 'specialBike.jpeg' ;
        //         break;
        // }
        if(token)
        {
            toInsert += `<div class="card" style="width: 18rem;">
            <img src="../../images/categories/${image}" class="card-img-top" alt="Product image">
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
    console.log(toInsert);
    $('#title').html("");
    $('#content').html(toInsert);
}

/** Get all single products from database */
function getAllproducts()
{
  $('#reservations').html('');
  $('#content').html('');
    $.get({
        type: 'GET',
          url: 'http://localhost:8001/api/products/',
        }, function(data){
            showProducts(data.productList);     
        }).fail(function(data)
        {
          if(data.responseJSON.message)
            $('#content').html(`<h3>${data.responseJSON.message}</h3>`);

        })
}

function showCostumers(costumers)
{
    allCostumers = [];
    allCostumers = allCostumers.concat(costumers);
    let toInsert = '';
    for(let x in costumers)
    {
      let image = costumers[x].image;
      if(costumers[x].email != 'defaultUser@nolonolo.com')
      {

        toInsert += `<div class="card" style="width: 18rem;">
        <img src="../../images/users/${image}" class="card-img-top" alt="Product image">
        <div class="card-body">
        <h5 class="card-title">${costumers[x].name} ${costumers[x].surname} </h5>
        <p class="card-text">Email: ${costumers[x].email}</p>
        <p class="card-text">Phone: ${costumers[x].phone}</p>
        <p class="card-text">Payment method: ${costumers[x].paymentMethod}</p>
        <p class="card-text">Fidelity point: ${costumers[x].fidelityPoints}</p>
        <p class="card-text">Amount paid: ${costumers[x].amountPaid}</p>
        <div class="input-group mb-3">
        <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Actions</button>
        <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#" onclick="changeUserInfo(${x}, event, allCostumers)">Change user info</a></li>
        <li><a class="dropdown-item" href="#" onclick="showAddComunication(${x}, allCostumers)">Add communication</a></li>
        <li><a class="dropdown-item" href="#" onclick="showDeleteCostumer(${x}, allCostumers)">Delete user</a></li>
        </ul>
        </div>
        </div>
        </div>`
      }
      }
      $('#title').html("");
    $('#content').html(toInsert);
}

function getAllcostumers()
{
  $('#reservations').html('');
    $.get({
        type: 'GET',
          url: 'http://localhost:8001/api/user/',
        }, function(data){
            showCostumers(data.users);     
        }).fail(function(err)
        {
            alert('error');
        })
}
function endMantainance(x)
{

}
function denyPendingRequest(x)
{
  let message = $('#text').val();
  let email = $('#email').val();
  let start = requests[x].reserve.start;
  let end = requests[x].reserve.end;
  let product = requests[x].reserve.product;
  let id = requests[x]._id;
    if(message)
    {
        const obj =`{
          "email": "${email}",
          "product": "${product}",
          "message": "${message}"
        }`;
        $.post({
          type: 'DELETE',
          url: `http://localhost:8001/api/pending/${id}/?start=${start}&end=${end}`,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: obj
        }, function(data){
          $('#content').html(`<h3>${data.message}</h3>`);
          location.reload();
        }).fail(function(data){
          $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
      })
}
  

}

function showDenyPendingRequest(x)
{
  let toInsert = `
  <div id="deny">
  <h2>Deny a pending request</h2>
  <p>We take care of our customers, remember to insert a message to let them know </p>
  <label for="email" class="form-label">User: </label>
  <div class="input-group mb-3" id="message">
  <input class="form-control" type="text" id='email' value="${requests[x].reserve.usermail}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3">
<div class="mb-3 text-center justify-content-center" >
  <label for="text" class="form-label">Message to send</label>
  <textarea class="form-control" id="text" rows="3"></textarea>
  <button type="button" class="btn btn-lg btn-primary btn-block" onclick="denyPendingRequest(${x})" >Insert</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>
  </div>
  </div>
</div>
</div>`
$('#title').html(' ')
$('#content').html(toInsert);
}

function confirmPendingRequest(x)
{
  let userMail = requests[x].reserve.usermail;
  let employeeMail = sessionStorage.getItem('email');
  let start = requests[x].reserve.start;
  let end = requests[x].reserve.end;
  let product = requests[x].reserve.product;
  let expense = requests[x].reserve.expense;
  let id = requests[x]._id;
  const obj =`{
    "email": "${userMail}",
    "product": "${product}",
    "message": ""
  }`;
  const obj2 = `{
    "user": "${userMail}",
    "product": "${product}",
    "employee": "${employeeMail}",
    "start": "${start}",
    "end": "${end}",
    "expense": "${expense}"
  }`;
  console.log(obj2);
  // VADO A CHIAMARE LA DELETE PER LE PENDING E QUANDO LO FÀ CHIAMO QUELLA CHE AGGIUNGE
  //LA PRENOTAZIONE OVUNQUE
  $.post({
    type: 'DELETE',
    url: `http://localhost:8001/api/pending/${id}/?start=${start}&end=${end}`,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: obj
  }, function(data){  

      $.post({
        type: 'POST',
        url: `http://localhost:8001/api/rental/false`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: obj2
      }, function(data){
        $('#content').html(`<h3>${data.message}</h3>`);   
        location.reload();
      }).fail(function(data){
        $('#content').html(`<h3>${data.responseJSON.message}</h3>`);   
    })
    
  }).fail(function(data){
    $('#content').html(`<h3>${data.responseJSON.message}</h3>`);   
})
}

function showPendingRequests(data)
{
  $('#body a').removeClass('disabled');
  let toInsert= '';
  requests = [];
  requests = requests.concat(data);
  for(let x in requests)
  {
    let start = new Date(requests[x].reserve.start);
    let end = new Date(requests[x].reserve.end)
    if(requests[x].reserve.usermail === 'defaultUser@nolonolo.com')
    {
      toInsert += `
      <div class="card" id="card-${x}">
      <h5 class="card-header"><b>MANTAINANCE</b></h5>
      <div class="card-body">
      <h5 class="card-title">Product ${requests[x].reserve.product}</h5>
      <p class="card-text">Set to mantainance</p>
      <p class="card-text">From: ${start.toDateString()} </p>
    <p class="card-text">TO: ${end.toDateString()} </p>
    <p class="card-text">From employee: ${requests[x].reserve.employee} </p>
    <a href="#" class="btn btn-primary" onclick="endMantainance(${x})">End mantainance</a>
    </div>
    </div> 
    `
    }else{

      toInsert += `
      <div class="card" id="card-${x}">
      <h5 class="card-header">${x} ${(requests[x].reserve.modify === 1) ? '<h4><b>MANTAINANCE</b>' : '' }</h5>
      <div class="card-body">
      <h5 class="card-title">Product: ${requests[x].reserve.product}</h5>
      <p class="card-text">User: ${requests[x].reserve.usermail}</p>
      <p class="card-text">From: ${start.toDateString()} </p>
    <p class="card-text">TO: ${end.toDateString()} </p>
    <p class="card-text">Price: ${requests[x].reserve.expense} </p>
    <a href="#" class="btn btn-primary" onclick="confirmPendingRequest(${x})">Accept</a>
    <a href="#" class="btn btn-danger" onclick="showDenyPendingRequest(${x})">Deny</a>
    </div>
    </div> 
    `
  }
  }
  $('#spinner').html('');
  $('#title').append('<h2>Pending requests</h2>')
  if(requests.length === 0)
    $('#content').html("<p>There are no pending requests waiting for approval</p>");
  else
    $('#content').html(toInsert);

}

function getPendingRequests()
{
  $('#reservations').html('');
  $('#title').html(`<h1>Welcome to the Admin Panel</h1>`)
  $('#spinner').html(` <div id="spinner" class="spinner-border" role="status">
  </div>`)
 

  $.get({
    type: 'GET',
      url: 'http://localhost:8001/api/pending/',
    }, function(data){
      showPendingRequests(data.requests);
    }).fail(function(err)
    {
      $('#title').html('');
        $('#content').html("Please refresh the page");
    })
}

