import React from 'react';
import {Carousel} from 'react-bootstrap';


const CarouselContainer = () =>
{
    return(
        <Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/strada-viaggiare-1528810575.jpg?resize=480:*"
      alt="First slide"
    />
    <Carousel.Caption>
      <h3>Oscal Wilde</h3>
      <p>Vivi la vita senza scuse, viaggia senza rimpianti.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://i.redd.it/2o4r27jok2g41.jpg"
      alt="Second slide"
    />

    <Carousel.Caption>
      <h3>Confucio</h3>
      <p>Ovunque tu vada, vacci con tutto il tuo cuore.</p>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="https://www.gelestatic.it/thimg/oylBPO0HdAXlNmT0WxAomVhSx8c=/fit-in/960x540/https%3A//www.lastampa.it/image/contentid/policy%3A1.33824702%3A1560675768/191b5ef0-6681-11e8-8f8f-753ca73ba52f_WPNX-29290_sudafrica-kDBF-U104175853522304-1024x576%40LaStampa.it.jpg%3Ff%3Ddetail_558%26h%3D720%26w%3D1280%26%24p%24f%24h%24w%3Dfd59bc1"
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