import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../asset/Butter.jpg';
import img2 from '../asset/Justice.jpg';
import img3 from '../asset/shivers.jpg';

function MusicCarousel(){
    return(
        <div style={{backgroundColor:'black'}}>
            <Carousel slide={false}>
            <Carousel.Item>
                <img
                className="d-block w-50 h-50" 
                style={{marginLeft:"auto", marginRight:"auto"}}
                src={img1}
                alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-50 h-50"
                style={{marginLeft:"auto", marginRight:"auto"}}
                src={img2}
                alt="Second slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                className="d-block w-50 h-50"
                style={{marginLeft:"auto", marginRight:"auto"}}
                src={img3}
                alt="Third slide"
                />
            </Carousel.Item>
            </Carousel>
        </div>
    )
}
export default MusicCarousel;