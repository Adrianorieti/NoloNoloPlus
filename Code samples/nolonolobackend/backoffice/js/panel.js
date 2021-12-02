let allCostumers = [];
let productsNames = [];
let categoriesNames = [];
let productsPrices = [];

function getCostumers()
{
  return allCostumers;
}

function logout(){
    sessionStorage.clear();
    window.location.href = `http://localhost:8001/employee/login`;
}

function sendInfo(type, x)
{
  let value = $(`#${type}`).val();
  let obj = `{
    "type": "${type}",
    "data": "${value}",
    "userMail": "${allCostumers[x].email}"
  }`

  console.log(obj);

  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/changeUserInfo',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    })
}

function changeUserInfo(x, event)
{
  event.preventDefault();
  let toInsert = `<div class="row g-3">
  <div class="col">
    <label for="name" class="form-label">Name</label>
    <input type="text" id="name" class="form-control" placeholder="${allCostumers[x].name}" aria-label="First name">
    <button type="button" class="btn btn-primary btn-block" onclick="sendInfo('name', x)">+</button>
  </div>
  <div class="col">
    <label for="surname" class="form-label">Surname</label> 
    <input type="text" id="surname" class="form-control" placeholder="${allCostumers[x].surname}" aria-label="Last name">
    <button type="button" class="btn btn-primary btn-block">+</button>
  </div>
</div>
<div class="row g-3">
  <div class="col">
    <label for="phone" class="form-label">Phone</label>
    <input type="text" id="phone" class="form-control" placeholder="${allCostumers[x].phone}" aria-label="First name">
    <button type="button" class="btn btn-primary btn-block">+</button>
  </div>
  <div class="col">
    <label for="email" class="form-label">Email</label> 
    <input type="email" id="email" class="form-control" placeholder="${allCostumers[x].email}" aria-label="Last name">
    <button type="button" class="btn btn-primary btn-block">+</button>
  </div>
</div>
<div class="row g-3">
  <div class="col">
    <label for="payment" class="form-label">Payment method</label>
    <input type="text" id="payment" class="form-control" placeholder="${allCostumers[x].paymentMethod}" aria-label="First name">
    <button type="button" class="btn btn-primary btn-block">+</button>
  </div>
  <div class="col">
    <label for="points" class="form-label">Fidelity points</label> 
    <input type="text" id="points" class="form-control" placeholder="${allCostumers[x].fidelityPoints}" aria-label="Last name">
    <button type="button" class="btn btn-primary btn-block">+</button>
  </div>
</div>`
$("#content").html(toInsert);
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
        }).fail(function(err)
        {
            alert(err);
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
    let token = sessionStorage.getItem('token');
    let toInsert = '';
    let image = '';
    for(x in products)
    {
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
              <a href="#" class="btn btn-primary">Add a rent</a>
            </div>
          </div>`
        }else
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
    console.log(allCostumers);

    let toInsert = '';
    let image = '../images/user.jpeg';
    for(x in costumers)
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
          <a href="#" class="btn btn-primary" onclick="changeUserInfo(x, event)">Change user info</a>
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
