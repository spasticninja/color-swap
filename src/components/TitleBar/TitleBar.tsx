import * as React from 'react';
import GameContext from '../../context/gameContext';
import './title-bar.scss';

export type tTitleBar = {
  title: string;
  showTitle?: boolean;
}

const CopyButton = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
  }
  return (
    <button onClick={copyToClipboard}>
      <i className="fa-solid fa-paperclip"></i>
    </button>
  )
}

const TitleBar = (props: tTitleBar) => {
  const {title, showTitle = false} = props;
  const { gameName } = React.useContext(GameContext);
  
  return (
    <h1>
      {title}
      {showTitle ? <>
        <small>{gameName}</small>
        <CopyButton />
      </> : <></>}
    </h1>
  )
}

export default TitleBar;