let email ;

function sendInfo()
{
    let type = $('#changeInfo').val();
    let newValue = $('#newValue').val();

    const obj = `{
        "email": "${email}",
        "type": "${type}",
        "data": "${newValue}"
    }`;

    console.log(obj);
    $.post({
        type: 'POST',
          url: 'http://localhost:8001/api/employee/changeUserInfo',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: obj
        }, function(data)
        {
            $('#onErr').html(data.message);
        }).fail(function()
        {
            $('#onErr').html(data.message);
        })
    }

/** Shows the html and css elements to change the user info */
function changeUserInfo(x, event, costumers)
{
  costumersArray = [];
  costumersArray.concat(costumers);
  event.preventDefault();
  console.log("DIOCANE");
  email = costumers[x].email;
  console.log(email);
  let toInsert = `<div class="input-group mb-3">
  <label class="input-group-text" for="changeInfo">Field</label>
  <select class="form-select" id="changeInfo">
    <option selected value="name">Name</option>
    <option value="surname">Surname</option>
    <option value="phone">Phone</option>
    <option value="email">Email</option>
    <option value="payment">Payment method</option>
  </select>
</div>
<div class="mb-3">
<label for="newValue" class="form-label">New Value</label>
<input type="text" class="form-control" id="newValue">
<span id="onErr"></span>
<button class="btn btn-outline-success " type="button" onclick="sendInfo()">Confirm</button>
<button class="btn btn-outline-warning " type="button" onclick="getAllcostumers()" >Back</button>
</div>
`
$("#content").html(toInsert);
}