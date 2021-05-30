import * as React from "react";

type tHelloProps = {
  name: string;
}

const Hello = (props: tHelloProps) => {
  return (
    <h1>Hello! - {props.name}</h1>
  )
}

export default Hello;