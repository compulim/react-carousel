'use strict';

import React, { PropTypes } from 'react';

const INITIAL_STYLE = {
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

    $(this.refs.image).css({ height, width });
    props.onLoad(width, height);
  }

  handleLoad() {
    const $image = $(this.refs.image);

    this._nativeHeight = $image.height();
    this._nativeWidth = $image.width();
    this._setPixelRatio(this.props);

    $image.animate(
      {
        opacity: 1
      },
      {
        duration: this.props.animation ? 1000 : 0
      },
      this.props.onShow
    );
  }

  render() {
    return (
      <img
        onLoad={ this.handleLoad }
        ref="image"
        src={ this.props.src }
        style={ INITIAL_STYLE }
      />
    );
  }
}

FadeInImage.defaultProps = {
  animation : 'fade',
  onLoad    : () => 0,
  onShow    : () => 0,
  pixelRatio: 1
};

FadeInImage.propTypes = {
  animation : PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onLoad    : PropTypes.func,
  onShow    : PropTypes.func,
  pixelRatio: PropTypes.number,
  src       : PropTypes.string.isRequired
};
