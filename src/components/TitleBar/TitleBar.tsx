import './title-bar.scss';

export type tTitleBar = {
  title: string;
  subtitle?: string;
}

const TitleBar = (props: tTitleBar) => {
  const subTitle = props.subtitle ? (<small>{props.subtitle}</small>) : null
  
  return (
    <h1>
      {props.title}
      {subTitle}
    </h1>
  )
}

export default TitleBar;