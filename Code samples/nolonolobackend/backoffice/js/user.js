let email ;
let allCostumers = [];
let oldCostumers = [];

function reset()
{
  location.reload();
}

function changePattern() {
  let field = document.getElementById('changeInfo').value;
  let newValue = document.getElementById('newValue');
  switch (field) {
    case 'name':
      $('#payments').hide();
      $('#newVal').show();

      newValue.type = 'text';
      newValue.pattern = "[a-z0-9._%+-]";
      newValue.title = "Not valid text format";
      break;
      case 'surname':
        $('#payments').hide();
        $('#newVal').show();

        newValue.type = 'text';
        newValue.pattern = "[a-z0-9._%+-]";
        newValue.title = "Not valid text format";
          break;
      case 'phone':
        $('#payments').hide();
        $('#newVal').show();

        newValue.type = 'tel';
        newValue.pattern = "[0-9]{10}";
        newValue.title = "Not valid number format";
        break;
      case 'email':
        $('#payments').hide();
        $('#newVal').show();

        newValue.type = 'email';
        newValue.pattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
        newValue.title = "Not valid email format";
        break;
      case 'paymentMethod':
          $('#payments').show();
          $('#newVal').hide();
      break;
      }
}

/** Send changed user info */
function sendInfo()
{
    let type = $('#changeInfo').val();
    let newValue
    if(type === 'paymentMethod')
    {
      newValue = $('#paymentsMenu').val();
    }else
    {
      newValue = $('#newValue').val();
    }
      
    if(newValue != '')
    {

      
      const obj = `{
        "${type}": "${newValue}"
      }`;
      
      $.post({
        type: 'PATCH',
        url: `http://localhost:8001/api/user/${email}`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: obj
      }, function(data)
      {
        $('#content').html("Succesful operation");
        reset();
      }).fail(function()
      {
        $('#onErr').html(data.message);
      })
    }else
    {
      ('#onErr').html("Please correctly insert a value");
    }
}
    
/** Shows the html and css elements to change the user info */
function changeUserInfo(x, event, costumers)
{
  $('#title').html("");

  costumersArray = [];
  costumersArray.concat(costumers);
  event.preventDefault();
  email = costumers[x].email;
  let toInsert = `<div>
  <h3>Choose the field you want to change:</h3>
  <div class="input-group mb-3">
  <label class="input-group-text" for="changeInfo">Field</label>
  <select class="form-select" id="changeInfo">
    <option selected value="name">Name</option>
    <option value="surname">Surname</option>
    <option value="phone">Phone</option>
    <option value="email">Email</option>
    <option value="paymentMethod">Payment method</option>
  </select>
</div>
<div id="payments">
<select class="form-select" id="paymentsMenu">
<option selected value="visa">Visa</option>
<option value="surname">Satispay</option>
<option value="phone">Mastercard</option>
<option value="email">PayPal</option>
<option value="payment">Poste Pay</option>
<option value="payment">Mooney</option>
</select>
</div>
<form onsubmit="sendInfo()">
<div class="mb-3" id="newVal">
<label for="newValue" class="form-label">New Value</label>
<input type="text" class="form-control" id="newValue">
</div>
<span id="onErr"></span>
<button class="btn btn-success " type="submit">Confirm</button>
<button class="btn btn-warning " type="button" onclick="getAllcostumers()" ><i class="fa fa-backward">&nbsp; Back</i></button>
</form>
</div>
`
$("#content").html(toInsert);
$('#payments').hide();
$( "#changeInfo" ).change(function() {
      changePattern();
    });
}

/** Send comunication to user's area comunication */
function sendComunication()
{
  let email = $('#email').val();
  let message = $('#text').val();
  const obj = `{
    "communications": "${message}"
  }`;
  $.post({
    type: 'PATCH',
      url: `http://localhost:8001/api/user/${email}`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(data){
        $('#content').html(data.message);
    }).fail(function(data){
        $('#content').html(data.responseJSON.message);
    })
}

/** Show comunication field for insertion */
function showAddComunication(x, allCostumers)
{
  $('#title').html("");

  let toInsert = `
  <div>
  <h3>This is the user you are writing to:</h3>
  <div class="input-group mb-3 text-center">
  <input class="form-control" type="text" id='email' value="${allCostumers[x].email}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3 text-center justify-content-center">
<div class="mb-3 ">
  <label for="text" class="form-label">Write the message:</label>
  <textarea class="form-control" id="text" rows="3" pattern="[a-z]"></textarea>
  <button type="button" class="btn btn-lg btn-primary btn-block" onclick="sendComunication()" >Send</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="getAllcostumers()" >Close</button>
  </div>
</div>
</div>
</div>
  `
  $('#content').html(toInsert);
}

function deleteUser(x, allCostumers)
{
  let email = allCostumers[x].email;
  $.post({
    type: 'DELETE',
    url: `http://localhost:8001/api/user/${email}`
  }, function(data)
  {
    $('#content').html(data.message);
    getAllcostumers();
  }).fail(function(data)
  {
    $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
  })
}

function showDeleteCostumer(x, allCostumers)
{
  $('#title').html("");

  let toInsert = `<div>
  <h3>You are deleting the user:</h3>
  <div class="input-group mb-3 text-center">
  <input class="form-control" type="text" id='email' value="${allCostumers[x].email}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3 text-center justify-content-center">
<div class="mb-3 ">
  <button type="button" class="btn btn-lg btn-danger btn-block" onclick="deleteUser(${x}, allCostumers)" >Delete</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="getAllcostumers()" ><i class="fa fa-backward">&nbsp; Back</i></button>
  </div>
</div>
</div>
</div>
  `
  $('#content').html(toInsert);
}

function renderFilteredCostumers(filtered)
{
  let toInsert = ``;
  allCostumers = [];
  allCostumers = allCostumers.concat(filtered);

  for(let x in filtered)
  {
    image = filtered[x].image;
    toInsert += `<div class="card" style="width: 18rem;">
    <img src="../../images/users/${image}" class="card-img-top" alt="Product image">
    <div class="card-body">
    <h5 class="card-title">${filtered[x].name} ${filtered[x].surname} </h5>
    <p class="card-text">Email: ${filtered[x].email}</p>
    <p class="card-text">Phone: ${filtered[x].phone}</p>
    <p class="card-text">Payment method: ${filtered[x].paymentMethod}</p>
    <p class="card-text">Fidelity point: ${filtered[x].fidelityPoints}</p>
    <p class="card-text">Amount paid: ${filtered[x].amountPaid}</p>
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
  $('#content').html('');
  $('#content').html(toInsert);
}

function setUsersSearchBar()
{
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    allCostumers = [];
    allCostumers = allCostumers.concat(oldCostumers);
    let filtered = [];
    for(let x in allCostumers)
    {
        if(allCostumers[x].name.toLowerCase().includes(searchString) )
            {
                filtered.push(allCostumers[x]);
            }  
    }
   renderFilteredCostumers(filtered);
  })
}

function showCostumers(costumers)
{
  console.log("costumers",costumers);
    allCostumers = [];
    oldCostumers = [];
    allCostumers = allCostumers.concat(costumers);
    oldCostumers = oldCostumers.concat(allCostumers);
    let toInsert = '';
    for(let x in costumers)
    {
      let image = costumers[x].image;
      if(costumers[x].email != 'defaultUser@nolonolo.com')
      {

        toInsert += `<div class="card" style="width: 18rem;">
        <img src="../../images/users/${image}" class="card-img-top" alt="Product image">
        <div class="card-body">
        <h5 class="card-title"><b>${costumers[x].name} ${costumers[x].surname} </b></h5>
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

      let searchBar = `
      <div>
      <div id="searchWrapper">
                <input
                    type="text"
                    name="searchBar"
                    id="searchBar"
                    placeholder="search for name or price"
                />
            </div>
  </div>
      `
      $('#title').html(searchBar);
    $('#content').html(toInsert);
    setUsersSearchBar();

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