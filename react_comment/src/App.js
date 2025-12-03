import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "./config/route";

function App() {
  const routing = useRoutes(routes);

  return (
      <>
        {routing}
      </>
  );
}

export default App;
