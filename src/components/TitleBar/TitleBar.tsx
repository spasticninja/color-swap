import * as React from 'react';
import GameContext from '../../context/gameContext';
import './title-bar.scss';

export type tTitleBar = {
  title: string;
  showTitle?: boolean;
}

const TitleBar = (props: tTitleBar) => {
  const {title, showTitle = false} = props;
  const { gameName } = React.useContext(GameContext);
  
  return (
    <h1>
      {title}
      {showTitle ? <small>{gameName}</small> : <></>}
    </h1>
  )
}

export default TitleBar;