import React from 'react';


function chooseImage(name) {
  return <img src={"http://site202145.tw.cs.unibo.it/images/categories/" + name} className="img-fluid" alt="Foto del prodotto" />
}

export { chooseImage };


