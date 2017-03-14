'use strict';

import Carousel from './ui/carousel';

const REACT_COMPONENT_DATA_KEY = 'react-component';

if (typeof $ !== 'undefined') {
  $.fn.reactCarousel = function (imageURLs, options = { animation: undefined, interval: undefined, pixelRatio: undefined }) {
    return $.each(this, (index, element) => {
      let component = $(element).data(REACT_COMPONENT_DATA_KEY);

      if (component) {
        switch (imageURLs) {
        case 'next':
          component.go(1);
          break;

        case 'prev':
          component.go(-1);
          break;
        }
      } else {
        component = render(
          <Carousel
            animation={ options.animation }
            imageURLs={ imageURLs }
            pixelRatio={ options.pixelRatio }
            slideShowInterval={ options.interval }
          />,
          element
        );

        $(element).data(REACT_COMPONENT_DATA_KEY, component);
      }
    });
  };
}
