let prodName;
allProducts = [];
let categories = [];

function changeSel() {
  const val = $("#category").val();
  let price;
  for (let i in categories) {
    if (categories[i].name === val) {
      price = categories[i].price;
    }
  }
  $("#price").val(parseInt(price));
}
// $("#category").change(function () {
//   console.log("onchange");
//   const val = $("#category").val();
//   let price;
//   for (let i in categories) {
//     if (categories[i].name === val) {
//       price = categories[i].price;
//     }
//   }
//   $("#price").val(price);
// });

function changeProductPattern() {
  let field = document.getElementById('changeMenu').value;
  let newValue = document.getElementById('newValue');
  switch (field) {
    case 'name':
      $('#descr').hide();
      $('#newval').show();
      newValue.type = 'text';
      newValue.pattern = "[a-z0-9._%+-]";
      newValue.title = "Not valid text format";
      break;
    case 'type':
      $('#descr').hide();
      $('#newval').show();
      newValue.type = 'text';
      newValue.pattern = "[a-z0-9._%+-]";
      newValue.title = "Not valid text format";
      break;
    case 'status':
      $('#descr').hide();
      $('#newval').show();
      newValue.type = 'text';
      newValue.pattern = "[a-z0-9._%+-]";
      newValue.title = "Not valid text format";
      break;
    case 'price':
      $('#descr').hide();
      $('#newval').show();
      newValue.type = 'tel';
      newValue.pattern = "[0-9]{10}";
      newValue.title = "Not valid price number";
      break;
    case 'description':
      console.log("Qui");
      $('#newval').hide();
      $('#descr').show();
      break;
  }
}
/** Refresh page */
function reset() {
  console.log("qui dentro");
  history.go(0);
  location.reload();
}

function sendRent() {
  let employee = sessionStorage.getItem('email');
  let email = $('#email').val();
  let start = new Date($('#start').val());
  console.log(start);
  let end = new Date($('#end').val());
  if (email == '' || start === '' || end === '' || start.getTime() > end.getTime()) {
    $('#rentErr').html("Please check everything it's okay");

  } else {
    let obj = `{
      "product": "${prodName}",
      "employee": "${employee}",
      "user": "${email}",
      "start": "${start}",
      "end": "${end}"
    }`;

    $.post({
      type: 'POST',
      url: 'http://localhost:8001/api/rental/true',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function () {
      $('#content').html("<h3>Succesful operation</h3>");
      reset();
    }).fail(function (data) {
      if (data) {
        console.log(data.responseJSON.message);
        $('#content').html(`<h3>${data.responseJSON.message}</h3`);
      }
      else
        $('#content').html("<h3Something went wrong</h3>");

    })
  }
}

function showAddRent(x, products) {
  console.log(products);
  console.log(x);
  allProducts = allProducts.concat(products);
  prodName = products[x].name;
  toInsert = `
    <div>
    <h3>Bike for Rental:</h3>
    <input class="form-control" type="text" value="${prodName}" aria-label="readonly input example" readonly>
    <div class="mb-3">
    <label for="email" class="form-label">User for Rental - put his/her email as identifier:</label>
    <input type="email" class="form-control" id="email">
  </div>
  <div class="mb-3">
  <label for="start">Starting date:</label>
  <input type="date" id="start" name="start">
  <label for="end">Ending date:</label>
  <input type="date" id="end" name="end">
    </div>
    <span id="rentErr"></span>
    <button class="btn btn-primary " type="button" onclick="sendRent()">Rent</button>
    <button class="btn btn-warning " type="button" onclick="reset()"><i class="fa fa-backward">&nbsp; Back</i></button>
</div>
    `
  $('#title').html("");
  $('#content').html(toInsert);
}

function sendProduct(event) {
  event.preventDefault();
  let name = $('#name').val();
  let price = $('#price').val();
  let category = $('#category').val();
  if (!name || !price)
    $('#error').html("Please insert all fields");
  else {
    let obj = `{
            "name": "${name}",
            "price": "${price}",
            "type": "${category}"
          }`
    $.post({
      type: 'POST',
      url: 'http://localhost:8001/api/products/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function (data) {
      $('#content').html(`<h3>${data.message}</h3>`);
    }).fail(function (data) {
      $('#content').html(`<h3>${data.responseJSON.message}</h3>`);

    })
  }
}
/** Creates the add product's form */
function showAddProduct() {
  $.get({
    type: 'GET',
    url: 'http://localhost:8001/api/categories/',
  }, function (data) {
    categories = [];
    categories = data;
    $('#reservations').html('');
    let toInsert = `<div>
    <form onsubmit="sendProduct(event)" class="needs-validation">
    <div class="mb-3">
    <label for="name" class="form-label">Bike</label>
    <input type="text" class="form-control" id="name" aria-describedby="nameHelp">
  </div>
  <h3>Select the type:</h3>
  <div class="input-group mb-3">
  <label class="input-group-text" for="category">Category</label>
  <select class="form-select" onchange="changeSel()" id="category" $>
  <option val="" disabled selected> Please select one category</options>`
    for (let i in categories) {
      toInsert += `<option value="${categories[i].name}"> ${categories[i].name} </option> `;
    }
    toInsert += `</select>
</div>
<h3>Put the price:</h3>
<div class="input-group mb-3">
<label class="input-group-text" for="price">Price</label>
  <span class="input-group-text">€</span>
  <input type="number" class="form-control" pattern="[0-9]" id="price" aria-label="Amount (to the nearest euro)">
  <span class="input-group-text">.00</span>
</div>
<span id="error"></span> <br>
<button type="submit" class="btn btn-lg btn-primary btn-block" ">Add</button>
</form>
<br />
<button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button>
</div>
    `;
    $('#title').html("<h3>Add a new product</h3>");
    $('#content').html("");
    $('#content').html(toInsert);
  }).fail(function (data) {
    if (data.responseJSON.message)
      $('#content').html(`<h3>${data.responseJSON.message}</h3>`);

  })

}

function sendChange(event) {
  event.preventDefault();
  let name = $('#oldname').val();
  let field = $('#changeMenu').val();
  let newValue = $('#newValue').val();
  console.log(newValue);
  if (newValue != null && newValue != 'undefined' && newValue != undefined && newValue != '') {

    const obj = `{
     "${field}": "${newValue}"
    }`;

    $.post({
      type: 'POST',
      url: `http://localhost:8001/api/products/${name}`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function (data) {
      $('#content').html(`<h3>${data.message}</h3>`);
    }).fail(function (data) {
      $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
    })
  } else {
    $('#changeErr').html("Please fill the value field");
  }

}

/** Show the area when the employee can change a product field */
function showChangeProduct(x, products) {
  toInsert = `<div>
  <h3>Bike about:</h3>
  <div class="input-group mb-3">
  <input class="form-control" type="text" id='oldname' value="${products[x].name}" aria-label="readonly input example" readonly></div>
  <h3>Choose the field you want to change:</h3>
  <div class="input-group mb-3">
  <label class="input-group-text" for="changeMenu">Field</label>
  <select class="form-select" id="changeMenu">
    <option selected value="name">Name</option>
    <option value="type">Type</option>
    <option value="status">Status</option>
    <option value="price">Price</option>
    <option value="description">Description</option>
  </select>
</div>

<form onsubmit="sendChange(event)">
<div class="mb-3" id="newval">
  <label for="newValue" class="form-label">New value</label>
  <input type="text" class="form-control" id="newValue">
</div>
<div id="descr">
<label for="text" class="form-label">New description</label>
<textarea class="form-control"  rows="3"></textarea>
</div>
<span id="changeErr"></span>
<button class="btn btn-primary" type="submit">Confirm</button>
</form>
<button class="btn btn-warning btn-block" type="button" onclick="reset()">Close</button>

</div>
  `
  $('#title').html("");

  $('#content').html(toInsert);
  $('#descr').hide();


  $("#changeMenu").change(function () {
    console.log("changed");
    changeProductPattern();
  });
}


/** TODO GESTIRE GRAFICAMENTE LA LISTA DI RESERVATIONS RITORNATA DAL SERVER QUANDO CANCELLIAMO IL PRODOTTO */
function sendDelete() {
  let toDelete = $('#product').val();

  $.post({
    type: 'DELETE',
    url: `http://localhost:8001/api/products/${toDelete}`,
  }, function (data) {
    console.log(data);
    $('#content').html(`<h3>${data.message}</h3>`);
    location.reload();
  }).fail(function (data) {
    console.log(data);
    $('#content').html(`<h3>${data.responseJSON.message}</h3> `);


  })
}

/** Chiediamo al server tutti i prodotti e li mettiamo in un select per il dipendente così può cancellarli */
function showDeleteProduct(x, products) {
  console.log(products);
  console.log(x)
  let toInsert = `<div>
     <h3>Bike you whant to delete:</h3>
     <input class="form-control" type="text" id="product" value="${products[x].name}" aria-label="readonly input example" readonly>
      </div>`
  toInsert += `<div>
      </select></div>
      <button type="button" class="btn btn-lg btn-danger btn-block" onclick="sendDelete()" >Confirm</button>
      <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset()" >Close</button> </div>`;
  $('#title').html("");
  $('#content').html(toInsert);
}

function sendMaintenance() {
  let employee = sessionStorage.getItem('email');
  let product = $('#name').val();
  let start = new Date($('#start').val());
  let end = new Date($('#end').val());
  if ((start != '' && end != '') && (start.getTime() <= end.getTime())) {

    const obj = `{
      "employee": "${employee}",
      "start": "${start}",
      "end": "${end}"
    }`;

    $.post({
      type: 'POST',
      url: `http://localhost:8001/api/rental/${product}/mantainance`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function (data) {

      $('#content').html(`<h3>${data.message}</h3>`);
      console.log(data.reservations);
      for (let x in data.reservations) {
        if (data.reservations[x].usermail != 'defaultUser@nolonolo.com') {
          // le cancello tutte tanto sono già come pending requests
          // poi deve fare in modo che anche la maintenance sia cancellabile quindi 
          // la aggiungo come pending request
          let product = data.reservations[x].product;
          let obj = `{
                  "user": "${data.reservations[x].usermail}", 
                  "employee": "${data.reservations[x].employee}",
                  "start": "${data.reservations[x].start}",
                  "end": "${data.reservations[x].end}"
                }`;
          console.log(obj);

          $.ajax({
            method: "DELETE",
            url: `http://localhost:8001/api/rental/${product}`,
            contentType: 'application/json',
            dataType: 'json',
            data: obj
          }).done(function () {
            //  location.reload();
          }).fail(function (data) {
            if (data) {
              $('#content').html(`<h3>Something went wrong</h3>`);
              // $('#content').html(`<h3>${data.responseJSON.message}</h3>`);
            } else {
              $('#content').html(`<h3>Something went wrong</h3>`);

            }
          })

        }
      }
      // location.reload();
    }).fail(function (data) {
      $('#content').html(`<h3>${data.message}</h3>`);
    })
  } else {
    $('#maintErr').html('Please insert start and end correctly');
  }

}
/** Show the mainenance html form */
function showMaintenance(x, products) {

  let toInsert = `<div>
  <h3>The bike you are dealing with:</h3>
  <input class="form-control" type="text" id="name" value="${products[x].name}" aria-label="readonly input example" readonly>
  <label for="start">Start:</label>
  <input type="date" id="start" name="start"> 
  <label for="end">End:</label>
  <input type="date" id="end" name="end"> 
  <span id="maintErr"></span>
  <button type="button" class="btn btn-dark" onclick="sendMaintenance()">Send product to maintenance</button>
  <button type="button" class="btn btn-warning" onclick="reset()"><i class="fa fa-backward">&nbsp; Back</i></button>
  </div>
  `
  $('#title').html("");
  $('#content').html(toInsert);
}