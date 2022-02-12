import React from 'react';


function chooseImage(name) {
  return <img src={"http://site202145.tw.cs.unibo.it/images/categories/" + name} className="card-img-top" alt="Foto del prodotto" />
}

export { chooseImage };


