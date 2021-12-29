import React from 'react';
import { Carousel } from 'react-bootstrap';
import bikeTravel1 from '../images/bikeTravel1.jpg'
import bikeTravel2 from '../images/bikeTravel2.jpg'
import bikeTravel3 from '../images/bikeTravel3.jpg'
import './style/Carousel.css';


const CarouselContainer = () => {
  return (

    <Carousel className="App-carousel">
      <Carousel.Item>
        <img
          className="card d-block w-100 img-responsive"
          src={bikeTravel1}
          alt="Vivi la vita senza scuse, viaggia senza rimpianti (Oscal Wilde)."
        />
        <Carousel.Caption>
          <h3>Oscal Wilde</h3>
          <p>Vivi la vita senza scuse, viaggia senza rimpianti.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="card d-block w-100 img-responsive"
          src={bikeTravel2}
          alt="Ovunque tu vada, vacci con tutto il tuo cuore (Confucio)."
        />

        <Carousel.Caption>
          <h3>Confucio</h3>
          <p>Ovunque tu vada, vacci con tutto il tuo cuore.</p>
        </Carousel.Caption>
      </Carousel.Item>



      <Carousel.Item>
        <img
          className="card d-block w-100 img-responsive"
          src={bikeTravel3}
          alt="Non si ricordano i giorni, si ricordano gli attimi (Cesare Pavese)."
        />

        <Carousel.Caption>
          <h3>Cesare Pavese</h3>
          <p>Non si ricordano i giorni, si ricordano gli attimi.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default CarouselContainer;