'use strict';

import React from 'react';
import { render } from 'react-dom';

import Carousel from './ui/carousel';

// class Index extends Component {
//   constructor(props) {
//     super(props);

//     this.handleAddClick = this.handleAddClick.bind(this);
//     this.handlePrevClick = this.handlePrevClick.bind(this);
//     this.handleNextClick = this.handleNextClick.bind(this);
//     this.handleSlowClick = this.handleSlowClick.bind(this);
//     this.handleFastClick = this.handleFastClick.bind(this);

//     this.state = {
//       images: [
//         'img/1.jpg',
//         'img/2.jpg',
//         'img/3x.jpg',
//         'img/4x.jpg',
//         'img/5x.jpg',
//         'img/6x.jpg',
//         'img/7x.jpg',
//         'img/8x.jpg',
//         'img/9.jpg'
//       ],
//       slideShowInterval: 1000
//     };
//   }

//   handlePrevClick() {
//     this.refs.carousel.go(-1);
//   }

//   handleNextClick() {
//     this.refs.carousel.go(1);
//   }

//   handleAddClick() {
//     const nextImages = this.state.images.slice();

//     nextImages.push('img/10.jpg');

//     this.setState({ images: nextImages });
//   }

//   handleSlowClick() {
//     this.setState({ slideShowInterval: 2000 });
//   }

//   handleFastClick() {
//     this.setState({ slideShowInterval: 500 });
//   }

//   render() {
//     return (
//       <div>
//         <button onClick={ this.handlePrevClick }>&laquo;</button>
//         <button onClick={ this.handleNextClick }>&raquo;</button>
//         <button onClick={ this.handleAddClick }>+</button>
//         <button onClick={ this.handleSlowClick }>Slow</button>
//         <button onClick={ this.handleFastClick }>Fast</button>
//         <Carousel
//           images={ this.state.images }
//           initialValue={ 0 }
//           ref="carousel"
//           slideShowInterval={ this.state.slideShowInterval }
//         />
//       </div>
//     );
//   }
// }

$.fn.reactCarousel = function (imageURLs, options = { animation: undefined, interval: undefined, pixelRatio: undefined }) {
  return $.each(this, (index, element) => {
    render(
      <Carousel
        animation={ options.animation }
        imageURLs={ imageURLs }
        pixelRatio={ options.pixelRatio }
        slideShowInterval={ options.interval }
      />,
      element
    );
  });
};
