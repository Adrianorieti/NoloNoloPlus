function logout(){

    sessionStorage.clear();
    window.location.href = `http://localhost:8001/employee/login`;

}
/** Renders all products in the content div */ 
function showProducts(products)
{
    let toInsert = '';
    let image = '';
    for(x in products)
    {
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
        toInsert += `<div class="card" style="width: 18rem;">
        <img src="../images/${image}" class="card-img-top" alt="Product image">
        <div class="card-body">
          <h5 class="card-title">${products[x].name}</h5>
          <p class="card-text">${products[x].price}$ per day</p>
          <p class="card-text">Status: ${products[x].status}</p>
          <a href="#" class="btn btn-primary">Change product</a>
        </div>
      </div>`
      console.log("FINEEEEEEEEE");
    }
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
            alert('error');
        })
}