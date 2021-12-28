// function getProducts(x)
// {
//     let options = {
//         method: 'GET'
//     };

//     let url = 'http://localhost:8001/api/products/';

//     fetch(url, options)
//     .then(response => {
//     if (response.status == 200) {
//         return response.json();
//     }
//     }).then((data) => {
        
//      console.log(data[0]);
//     })
//     .catch(error => {
//     console.log(error); // CAMBIARE
//     });
// }

export  {getProducts};


