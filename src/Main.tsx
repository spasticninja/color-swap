import * as React from "react";
import Hello from "./components/Hello";

type tMainProps = {
  app: string;
}

const Main = (props: tMainProps) => {
  return (<Hello name={props.app}></Hello>)
}

export default Main;