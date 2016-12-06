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

  handleLoad() {
    $(this.refs.image).animate(
      {
        opacity: 1
      },
      () => this.props.onLoad(this.props.src)
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
  onLoad: () => 0
};

FadeInImage.propTypes = {
  onLoad: PropTypes.func,
  src: PropTypes.string.isRequired
};
