import React from 'react';


function chooseImage(name) {
  if (name === "Electric S_300") {
    return (
      <img src="http://localhost:8001/images/categories/electricBike.jpg" className="card-img-top" alt="Foto del prodotto" />
    )
  } else if (name === "Mountain Bike") {
    return (
      <img src="http://localhost:8001/images/categories/mountainBike.jpg" className="card-img-top" alt="Foto del prodotto" />
    )
  } else if (name == "City Bike") {
    return (
      <img src="http://localhost:8001/images/categories/cityBike.jpg" className="card-img-top" alt="Foto del prodotto" />
    )
  }
  else if (name == "Special Bike") {
    return (
      <img src="http://localhost:8001/images/categories/specialBike.jpeg" className="card-img-top" alt="Foto del prodotto" />
    )
  }
  else if (name == "Scooter") {
    return (
      <img src="http://localhost:8001/images/categories/scooter.jpg" className="card-img-top" alt="Foto del prodotto" />
    )
  }
}

export { chooseImage };


