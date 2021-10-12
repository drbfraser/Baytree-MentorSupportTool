import * as S from './styles';

import Logo from '../Assets/baytree-logo.png';
import Nav from './Nav';
import React, { useState } from 'react';

type Properties = {
  childNode?: ChildNode;
};

export default function Navbar(properties: Properties) {
  const [open] = useState(false);

  return (
    <>
      <S.layout>
        <S.logo src={Logo} alt='Baytree' />
      </S.layout>
      
      <Nav open={open} />
      {properties.childNode}
    </>
  );
}
