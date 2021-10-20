import React from 'react';
import {Carousel} from 'react-bootstrap';
import bikeTravel1 from '../images/bikeTravel1.jpg'
import bikeTravel2 from '../images/bikeTravel2.jpg'
import bikeTravel3 from '../images/bikeTravel3.jpg'
import './Carousel.css';


const CarouselContainer = () =>
{
    return(
        <Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100 img-responsive"
      src={bikeTravel1} 
      alt="First slide"
    />
    <Carousel.Caption>
      <h3>Oscal Wilde</h3>
      <p>Vivi la vita senza scuse, viaggia senza rimpianti.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100 img-responsive"
      src={bikeTravel2}
      alt="Second slide"
    />

    <Carousel.Caption>
      <h3>Confucio</h3>
      <p>Ovunque tu vada, vacci con tutto il tuo cuore.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100 img-responsive"
      src={bikeTravel3}
      alt="Third slide"
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