import React from 'react';
import PropTypes from 'prop-types';
import { CanvasCarousel } from '@components';

import { SCSlider } from './styles';

const images = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  'bob.jpg',
];

const Slider = props => {

  return (
    <SCSlider>
      <CanvasCarousel images={images} />
    </SCSlider>
  );
};

Slider.propTypes = {

};

export default Slider;
