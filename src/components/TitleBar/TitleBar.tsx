import * as React from 'react';
import GameContext from '../../context/gameContext';
import './title-bar.scss';

export type tTitleBar = {
  title: string;
}

const TitleBar = (props: tTitleBar) => {
  const { gameName } = React.useContext(GameContext);

  
  return (
    <h1>
      {props.title}
      <small>{gameName}</small>
    </h1>
  )
}

export default TitleBar;