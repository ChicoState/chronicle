// GitHubRepos.js
import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import GitHubDetails from "./GitHubDetails";
import handleExportData from "./exportUtils";

const GitHubRepos = ({ username }) => {
  const [avatarURL, setAvatarURL] = useState();
  const [repoData, setRepoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isRepoFetched, setIsRepoFetched] = useState(false);

  useEffect(() => {
    if (username && repoName) {
      fetchRepoData();
    }
  }, [username, repoName]);

  const fetchRepoData = async () => {
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
    setComments(allComments);
  };

  const handleRepoSearch = async () => {
    await fetchRepoData();
  };

  const fetchAllComments = async () => {
    let page = 1;
    let allComments = [];
    let hasMore = true;

    while (hasMore) {
      const commentResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/issues/comments`, {
        params: { page, per_page: 100 }
      });
      if (commentResponse.data.length > 0) {
        allComments = allComments.concat(commentResponse.data);
        page++;
      } else {
        hasMore = false;
      }
    }
    setComments(allComments);
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
};

export default GitHubRepos;
