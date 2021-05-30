import * as React from "react";
import Main from "./Main";

const App = () => {
  const _appName = 'Awesome TypeScript, React, Parcel App!';

  return (
    <div className="App">
      <Main app={_appName}></Main>
    </div>
  );
}

export default App;