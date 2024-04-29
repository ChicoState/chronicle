//GitHubRepos.js
import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import GitHubDetails from "./GitHubDetails";

const GitHubRepos = () => {
  const [avatarURL, setAvatarURL] = useState('');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoData, setRepoData] = useState(null);
  
  const fetchRepoData = async () => {
    try {
      const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
      setRepoData(repoResponse.data);
    } catch (error) {
      console.error(error);
      setRepoData(null);
    }
  };

  const handleRepoSearch = async () => {
    await fetchRepoData();
  };

  const handleRepoClick = (repoName) => {
    setSelectedRepo(repoName);
  };

  return (
    <div>
      <Card className="Card">
        <Card.Body>
          <h1>GitHub Repository Viewer</h1>
        </Card.Body>
      </Card>

      {/* Input fields for GitHub username and repo name */}
      <div>
        <input type="text" placeholder="Enter GitHub username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Enter repository name" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
        <Button variant="primary" onClick={handleRepoSearch}>Search</Button>
      </div>

      {/* Display repo data if available */}
      {repoData && (
        <div>
          <h2>{repoData.full_name}</h2>
          <p>{repoData.description}</p>
          <Button variant="link" onClick={() => handleRepoClick(repoData.name)}>
            View Details
          </Button>
        </div>
      )}

      {/* Display GitHubDetails if a repo is selected */}
      {selectedRepo && (
        <GitHubDetails username={username} repoName={selectedRepo} />
      )}
    </div>
  );
}

export default GitHubRepos;
