// GitHubRepos.js
import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import GitHubDetails from "./GitHubDetails";

const GitHubRepos = ({ username }) => {
  const [avatarURL, setAvatarURL] = useState();
  const [repoData, setRepoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const fetchRepoData = async (page = 1) => {
    try {
      const userDataResponse = await axios.get(`https://api.github.com/users/${username}`);
      setAvatarURL(userDataResponse.data.avatar_url);

      const reposCountResponse = await axios.get(`https://api.github.com/users/${username}`);
      const totalReposCount = reposCountResponse.data.public_repos;

      const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: {
          page: page,
          per_page: 10,
        },
      });

      const list = reposResponse.data.map((item) => item.name);
      setRepoData(list);

      // Calculate total pages based on total repos count
      const totalPages = Math.ceil(totalReposCount / 10);
      setTotalPages(totalPages);

    } catch (error) {
      console.error(error);
    }
  };

  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRepoClick = (repoName) => {
    setSelectedRepo(repoName);
  };

  useEffect(() => {
    fetchRepoData(currentPage);
  }, [currentPage]);

  return (
    <div>
      <Card className="Card">
        <Card.Img variant="top" src={avatarURL} style={{ width: '100px', height: '100px' }} />
        <Card.Body>
          <Card.Title style={{ fontSize: '50px' }}>{username}</Card.Title>
        </Card.Body>
      </Card>

      <div>
        {repoData.map((repoName, index) => (
          <div key={index} className="text-center">
            <Button variant="link" onClick={() => handleRepoClick(repoName)}>
              {repoName}
            </Button>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div>
        <Button variant="secondary" onClick={() => handlePagination('prev')} disabled={currentPage === 1}>
          Previous Page
        </Button>{' '}
        <Button variant="secondary" onClick={() => handlePagination('next')} disabled={currentPage === totalPages}>
          Next Page
        </Button>
      </div>

      {/* Display GitHubDetails if a repo is selected */}
      {selectedRepo && (
        <GitHubDetails username={username} repoName={selectedRepo} />
      )}
    </div>
  );
}

export default GitHubRepos;
