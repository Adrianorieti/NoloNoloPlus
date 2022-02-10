import React from 'react';


function chooseImage(name) {
  return <img src={"http://localhost:8001/images/categories/" + name} className="card-img-top" alt="Foto del prodotto" />
}

export { chooseImage };


