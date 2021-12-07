function reset(input)
{
  console.log("ciaoooooooo");
  switch(input){
    case "add":
      $('#add').html(`<button type="button" class="btn btn-lg btn-primary btn-block" onclick="addProduct()" >Add product</button>`);
      break;
    case 'delete':
      $('#delete').html(`<button type="button" class="btn btn-lg btn-danger btn-block" onclick="showDeleteProduct()" >Delete product</button>`)
    default:
        break;
  }
}

function sendProduct(event)
{
    event.preventDefault();
    let name = $('#name').val();
    let price = $('#price').val();
    let status = $('#status').val();
    let category =$('#category').val();
    if(!name || !price)
        $('#error').html("Please insert all fields");
    else
    {
        let obj = `{
            "name": "${name}",
            "price": "${price}",
            "status": "${status}",
            "category": "${category}"
          }`
          $.post({
            type: 'POST',
              url: 'http://localhost:8001/api/employee/addProduct',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              data: obj
            }, function(){
                $('#add').html("Successful added");
            }).fail(function(){
                $('#add').html("Error, maybe the element already exists");

            })
    }
}
/** Creates the add product's form */
function addProduct()
{
    let toInsert = `
    <form onsubmit="sendProduct(event)" class="needs-validation">
    <div class="mb-3">
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" aria-describedby="nameHelp">
  </div>
  <div class="input-group mb-3">
  <label class="input-group-text" for="category">Category</label>
  <select class="form-select" id="category">
    <option selected>Special Bike</option>
    <option value="Mountain Bike">Mountain Bike</option>
    <option value="City Bike">City Bike</option>
    <option value="Scooter">Scooter</option>
    <option value="Electric S_300">Electric S_300</option>
  </select>
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="status">Status</label>
<select class="form-select" id="status">
  <option selected value="New">New</option>
  <option value="Broken">Broken</option>
  <option value="Used">Used</option>
</select>
</div>
<div class="input-group mb-3">
<label class="input-group-text" for="price">Price</label>
  <span class="input-group-text">€</span>
  <input type="text" class="form-control" id="price" aria-label="Amount (to the nearest euro)">
  <span class="input-group-text">.00</span>
</div>
<span id="error"></span> <br>
<button type="submit" class="btn btn-lg btn-primary btn-block" >Add product</button>
</form>
<button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset('add')" >Close</button>

    `;
    $('#add').html(toInsert);

}

function sendDelete()
{
  let toDelete = $('#product').val();
  
  const obj =`{
    "name": "${toDelete}"
  }`
  $.post({
    type: 'POST',
      url: 'http://localhost:8001/api/employee/deleteProduct',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: obj
    }, function(){
        $('#add').html("Successful added");
    }).fail(function(){
        $('#add').html("Error, maybe the element already exists");

    })


}


/** Chiediamo al server tutti i prodotti e li mettiamo in un select per il dipendente così può cancellarli */
function showDeleteProduct()
{
  let toInsert= '';
  $.get({
    type: 'GET',
      url: 'http://localhost:8001/api/employee/products',
    }, function(data){
      toInsert = `<div class="input-group mb-3">
      <label class="input-group-text" for="status">Choose product to delete</label>
      <select class="form-select" id="product">
      `
      for(let name in data.productList)
      {
        toInsert += `<option value="${data.productList[name].name}">${data.productList[name].name}</option>`
      }
      toInsert += `</select></div>
      <button type="button" class="btn btn-lg btn-danger btn-block" onclick="sendDelete()" >Confirm Deletion</button>
      <button type="button" class="btn btn-lg btn-warning btn-block" onclick="reset('delete')" >Close</button>`;
      $('#delete').html(toInsert);
    }).fail(function(err)
    {
        // change this
        alert('error');
    })



}