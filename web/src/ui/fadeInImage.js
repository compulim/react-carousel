'use strict';

import React, { PropTypes } from 'react';

const INITIAL_BOX_STYLE = {
  overflow: 'hidden'
};

const INITIAL_IMAGE_STYLE = {
  opacity: 0
};

export default class FadeInImage extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoad = this.handleLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.pixelRatio !== this.pixelRatio
    && this._loaded
    && this._setPixelRatio(nextProps);
  }

  _setPixelRatio(props) {
    const { pixelRatio } = props;
    const height = this._nativeHeight / pixelRatio;
    const width = this._nativeWidth / pixelRatio;

    $(this.refs.box).css({ height, width: width * (this._animating(props, 'slide') ? .9 : 1) });
    $(this.refs.image).css({ height, width });
    props.onLoad(width, height);
  }

  _animating(props, animation) {
    return typeof props.animation === 'string' && ~props.animation.split(' ').indexOf(animation);
  }

  handleLoad() {
    const $image = $(this.refs.image);

    this._nativeHeight = $image.height();
    this._nativeWidth = $image.width();
    this._setPixelRatio(this.props);

    $image
      .css({
        marginLeft: 0,
        opacity: this._animating(this.props, 'fade') ? 0 : 1
      })
      .animate(
        {
          marginLeft: this._animating(this.props, 'slide') ? this._nativeWidth / this.props.pixelRatio * -.05 : 0,
          opacity: 1
        },
        {
          duration: this.props.duration
        },
        this.props.onShow
      );
  }

  render() {
    return (
      <div
        className="fade-in-image"
        ref="box"
        style={ INITIAL_BOX_STYLE }
      >
        <img
          onLoad={ this.handleLoad }
          ref="image"
          src={ this.props.src }
          style={ INITIAL_IMAGE_STYLE }
        />
      </div>
    );
  }
}

FadeInImage.defaultProps = {
  animation : 'fade slide',
  duration  : 1000,
  onLoad    : () => 0,
  onShow    : () => 0,
  pixelRatio: 1
};

FadeInImage.propTypes = {
  animation : PropTypes.string,
  duration  : PropTypes.number,
  onLoad    : PropTypes.func,
  onShow    : PropTypes.func,
  pixelRatio: PropTypes.number,
  src       : PropTypes.string.isRequired
};
