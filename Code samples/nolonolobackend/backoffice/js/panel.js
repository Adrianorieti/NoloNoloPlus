let allCostumers = [];
let productsNames = [];
let categoriesNames = [];
let productsPrices = [];
let allProducts = [];

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
              <li><a class="dropdown-item" onclick="showMantainance(${x}, allProducts)">Mantainance</a></li>
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

    $('#content').html(toInsert);
}

/** Get all single products from database */
function getAllproducts()
{
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
    $('#content').html(toInsert);
}

function getAllcostumers()
{
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
