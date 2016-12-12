'use strict';

import React, { PropTypes } from 'react';
import FadeInImage from './fadeInImage';

const DEFAULT_SLIDE_SHOW_INTERVAL = 3000;
const PREFETCHING_STYLE = { opacity: 0, position: 'absolute' };
const SHOWING_STYLE = { position: 'relative' };

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this._nextChangeID = 1;
    this._prefetchedImages = {};
    this._prefetchFailedURLs = [];

    this.handleFadeInImageLoad = this.handleFadeInImageLoad.bind(this);
    this.handleFadeInImageShow = this.handleFadeInImageShow.bind(this);
    this.handlePrefetchError = this.handlePrefetchError.bind(this);
    this.handlePrefetchLoaded = this.handlePrefetchLoaded.bind(this);

    this.state = {
      prefetchingURL: this.props.imageURLs[0],
      showing: [{
        animation: false,
        changeID: 0,
        imageIndex: props.initialValue
      }]
    };
  }

  _nextPrefetchURL(props = this.props) {
    return props.imageURLs.find(url => !this._prefetchedImages[url] && !~this._prefetchFailedURLs.indexOf(url));
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.prefetchingURL) {
      const nextPrefetchURL = this._nextPrefetchURL(nextProps);

      nextPrefetchURL && this.setState({ prefetchingURL: nextPrefetchURL });
    }
  }

  _refreshExtent() {
    const { height, width } = Object.keys(this._prefetchedImages).reduce((max, url) => {
      const prefetchedImage = this._prefetchedImages[url];

      return {
        height: Math.max(max.height, prefetchedImage.height || 0),
        width: Math.max(max.width, prefetchedImage.width || 0)
      };
    }, { height: 0, width: 0 });

    this.state.maxHeight !== height
    && this.state.maxWidth !== width
    && this.setState({
      maxHeight: height,
      maxWidth: width
    });
  }

  handleFadeInImageLoad(url, width, height) {
    this._prefetchedImages[url] = Object.assign(this._prefetchedImages[url] || {}, { height, width });
    this._refreshExtent();
  }

  handleFadeInImageShow(changeID) {
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
    this._prefetchedImages[this.state.prefetchingURL] = {};
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

  _nextPrefetchedImageIndex(direction) {
    const { imageURLs } = this.props;
    const numImageURLs = imageURLs.length;

    if (!numImageURLs) {
      return -1;
    }

    const currentImage = this.state.showing[this.state.showing.length - 1];
    const currentImageIndex = currentImage && currentImage.imageIndex || 0;
    let nextImageIndex = currentImage ? currentImageIndex : -1;

    direction = Math.sign(direction);

    do {
      nextImageIndex = (nextImageIndex + direction + numImageURLs) % numImageURLs;

      if (this._prefetchedImages[imageURLs[nextImageIndex]]) {
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
    const nextImageIndex = this._nextPrefetchedImageIndex(typeof direction === 'number' ? direction : 1);

    ~nextImageIndex && this._push(nextImageIndex);
  }

  render() {
    const style = Object.assign(
      {
        height: this.state.maxHeight,
        width: this.state.maxWidth
      },
      this.props.style
    );

    return (
      <div
        className={ this.props.className }
        id={ this.props.id }
        ref="carousel"
        style={ style }
      >
        <div ref="showing" style={ SHOWING_STYLE }>
          {
            this.state.showing.map(image => {
              const url = this.props.imageURLs[image.imageIndex];

              return (
                <FadeInImage
                  animation={ this.props.animation }
                  duration={ image.animation === false ? 0 : undefined }
                  key={ image.changeID }
                  onLoad={ this.handleFadeInImageLoad.bind(this, url) }
                  onShow={ this.handleFadeInImageShow.bind(this, image.changeID) }
                  pixelRatio={ this.props.pixelRatio }
                  src={ url }
                />
              );
            })
          }
        </div>
        {
          this.state.prefetchingURL &&
            <img
              onError={ this.handlePrefetchError }
              onLoad={ this.handlePrefetchLoaded }
              src={ this.state.prefetchingURL }
              style={ PREFETCHING_STYLE }
            />
        }
      </div>
    );
  }
}

Carousel.defaultProps = {
  imageURLs        : [],
  initialValue     : 0,
  pixelRatio       : 1,
  slideShowInterval: DEFAULT_SLIDE_SHOW_INTERVAL
};

Carousel.propTypes = {
  animation        : PropTypes.string,
  className        : PropTypes.string,
  id               : PropTypes.string,
  imageURLs        : PropTypes.arrayOf(PropTypes.string).isRequired,
  initialValue     : PropTypes.number,
  pixelRatio       : PropTypes.number,
  slideShowInterval: PropTypes.number,
  style            : PropTypes.any
};
