import React from 'react';
import './magic-button.scss';
import logo from './assets/magicButton.png';

function MagicButton(props:any) {
  console.log('magic button props', props);
  // Component code start
  return (
    <div className="magic-button">
      <img src={logo} alt={'Magic Button'} />
    </div>
  );
}

export default MagicButton;
