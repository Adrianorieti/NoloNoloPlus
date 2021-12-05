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

    `;
    $('#add').html(toInsert);

}