'use strict';

import React, { PropTypes } from 'react';
import FadeInImage from './fadeInImage';

import './carousel.less';

const DEFAULT_SLIDE_SHOW_INTERVAL = 1000;

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this._nextChangeID = 1;
    this._prefetchedURLs = [];
    this._prefetchFailedURLs = [];

    this.handleFadeInImageLoad = this.handleFadeInImageLoad.bind(this);
    this.handlePrefetchError = this.handlePrefetchError.bind(this);
    this.handlePrefetchLoaded = this.handlePrefetchLoaded.bind(this);

    this.state = {
      prefetchingURL: this.props.imageURLs[0],
      showing: [{
        changeID: 0,
        imageIndex: props.initialValue
      }]
    };
  }

  _nextPrefetchURL(props = this.props) {
    return props.imageURLs.find(url => !~this._prefetchedURLs.indexOf(url) && !~this._prefetchFailedURLs.indexOf(url));
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.prefetchingURL) {
      const nextPrefetchURL = this._nextPrefetchURL(nextProps);

      nextPrefetchURL && this.setState({ prefetchingURL: nextPrefetchURL });
    }
  }

  handleFadeInImageLoad(changeID) {
    const { showing } = this.state;
    const index = showing.findIndex(current => current.changeID === changeID);

    ~index && this.setState({
      showing: showing.slice(index)
    });
  }

  handlePrefetchError() {
    this._prefetchFailedURLs.push(this.state.prefetchingURL);
    this._prefetchNext();
  }

  handlePrefetchLoaded() {
    this._prefetchedURLs.push(this.state.prefetchingURL);
    this._prefetchNext();
  }

  _prefetchNext() {
    this.setState({
      prefetchingURL: this._nextPrefetchURL()
    });
  }

  componentDidMount() {
    this._scheduleShowNextImage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.showing !== this.state.showing
      || prevProps.slideShowInterval !== this.props.slideShowInterval
    ) {
      this._scheduleShowNextImage();
    }
  }

  _nextPrefetechedImageIndex(direction) {
    const { imageURLs } = this.props;
    const numImageURLs = imageURLs.length;
    const currentImage = this.state.showing[this.state.showing.length - 1];
    const currentImageIndex = currentImage && currentImage.imageIndex || 0;
    let nextImageIndex = currentImageIndex;

    direction = Math.sign(direction);

    do {
      nextImageIndex = (nextImageIndex + direction + numImageURLs) % numImageURLs;

      if (~this._prefetchedURLs.indexOf(imageURLs[nextImageIndex])) {
        break;
      }
    } while (nextImageIndex !== currentImageIndex)

    return nextImageIndex;
  }

  _push(imageIndex) {
    this.setState({
      showing: this.state.showing.concat({
        changeID: this._nextChangeID++,
        imageIndex
      })
    });
  }

  _scheduleShowNextImage() {
    clearTimeout(this._slideShowTimeout);

    const { slideShowInterval } = this.props;

    if (typeof slideShowInterval === 'number') {
      this._slideShowTimeout = setTimeout(() => {
        this.go(1);
      }, slideShowInterval);
    }
  }

  go(direction) {
    this._push(this._nextPrefetechedImageIndex(typeof direction === 'number' ? direction : 1));
  }

  render() {
    return (
      <div className="react-carousel" ref="carousel">
        <div className="showing" ref="showing">
          {
            this.state.showing.map(image =>
              <FadeInImage
                key={ image.changeID }
                onLoad={ this.handleFadeInImageLoad.bind(this, image.changeID) }
                src={ this.props.imageURLs[image.imageIndex] }
              />
            )
          }
        </div>
        {
          this.state.prefetchingURL &&
            <img
              className="prefetching"
              onError={ this.handlePrefetchError }
              onLoad={ this.handlePrefetchLoaded }
              src={ this.state.prefetchingURL }
            />
        }
      </div>
    );
  }
}

Carousel.defaultProps = {
  imageURLs: [],
  initialValue: 0,
  slideShowInterval: DEFAULT_SLIDE_SHOW_INTERVAL
};

Carousel.propTypes = {
  imageURLs: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialValue: PropTypes.number,
  slideShowInterval: PropTypes.number
};
