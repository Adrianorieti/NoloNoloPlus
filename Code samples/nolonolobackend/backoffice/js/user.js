let email ;

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
      
      console.log(obj);
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
  costumersArray = [];
  costumersArray.concat(costumers);
  event.preventDefault();
  email = costumers[x].email;
  console.log(email);
  let toInsert = `<div class="input-group mb-3">
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
<button class="btn btn-warning " type="button" onclick="getAllcostumers()" >Back</button>
</form>
`
$("#content").html(toInsert);
$('#payments').hide();
$( "#changeInfo" ).change(function() {
  console.log("changed");
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
  console.log(obj);
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
  let toInsert = `
  <div class="input-group mb-3 text-center">
  <input class="form-control" type="text" id='email' value="${allCostumers[x].email}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3 text-center justify-content-center">
<div class="mb-3 ">
  <label for="text" class="form-label">Message to send</label>
  <textarea class="form-control" id="text" rows="3"></textarea>
  <button type="button" class="btn btn-lg btn-primary btn-block" onclick="sendComunication()" >Insert</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>
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
  let toInsert = `
  <div class="input-group mb-3 text-center">
  <input class="form-control" type="text" id='email' value="${allCostumers[x].email}" aria-label="readonly input example" readonly></div>
  <div class="input-group mb-3 text-center justify-content-center">
<div class="mb-3 ">
  <button type="button" class="btn btn-lg btn-danger btn-block" onclick="deleteUser(${x}, allCostumers)" >Delete</button>
  <button type="button" class="btn btn-lg btn-warning btn-block" onclick="getAllcostumers()" >Back</button>
  </div>
</div>
</div>
  `
  $('#content').html(toInsert);
}