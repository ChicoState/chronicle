import React from "react";
import GitHubRepos from "./components/GitHubRepos";

const App = () => {
  return (
    <div className="App w-100 min-vh-100 justify-content-center align-items-center d-flex flex-column">
      <GitHubRepos username="ChicoState" />
    </div>
  );
}

export default App;
