import React from "react";
import { useEffect, useState} from "react";
import { useHistory } from "react-router";
import { chooseImage } from "../functions/helper";
import './style/products.css';
import Product from '../components/Product';

function Products() {

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  let allProducts =[];
  /** Creates event listener on search bar */
  function setSearchBar()
  {
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
        
    let filtered = [];
    for(let x in allProducts)
    {
        if(allProducts[x].name.toLowerCase().includes(searchString) || 
        allProducts[x].price.toString().includes(searchString))
            {
                filtered.push(allProducts[x]);
            };  
    }
    console.log(filtered);
    setLoading(false);
    setProducts(products.concat(filtered));
    setLoading(true);

    // console.log("filtered", filtered);
    // allProducts.forEach((product) => {
    //      console.log(product.name);
    //      console.log(searchString);
    //     if(product.name.indexOf(searchString) > -1 )
    //         {
    //             filtered.push[product];
    //         }
    // });
})
}
  /** Renderizza nel div content le categorie di prodotto */

   function rendering()
    {
       return(
            <Product products={products} token={token} />                 
            )
       
   }

/** Prendiamo le categorie di oggetti dal server */
useEffect(() => {
    let res = [];

    async function getProducts() {
      let url = "http://localhost:8001/api/categories/";
      try
      {
          let response = await fetch(url);
             res = await response.json();
             allProducts = allProducts.concat(res);
            setProducts(products.concat(res)); // la prima volta è 5
            // setProducts([...products,res]);
            setLoading(true)
      }catch(error)
      {
          console.log(error);
      }
    }

    setToken(JSON.parse(sessionStorage.getItem("token")));
    
    getProducts();
    setSearchBar();
    
  }, []);

  
  
  return ( <div id="main">
      <div id="searchWrapper">
                <input
                    type="text"
                    name="searchBar"
                    id="searchBar"
                    placeholder="search for name or price"
                />
            </div>

    <div className="content" id="content"> 
  {loading ? rendering() :  <p>Vuoto</p>}     
    </div>
    </div>
  )
}

export default Products;










// dopodichè se clicca ipotesi o l'altro li rimando alla pagina iniziale e da lì gestisco un'altra pagina
// se è loggato farò apparire la schermata di conferma della prenotazione
// se non è loggato farò apparire il risultato finale dell'ipotesi
