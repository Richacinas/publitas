import React from 'react';
import PropTypes from 'prop-types';

import { SCTitle } from './styles';

const Header = ({ title }) => {
  return (
    <header>
      <SCTitle>{title}</SCTitle>
    </header>
  );
};

Header.propTypes = {

};

export default Header;
