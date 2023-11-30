import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './App.css';

const App = () => {
  const [avatarURL, setAvatarURL] = useState();
  const [githubUsername, setGitHubUsername] = useState();
  const [repoData, setRepoData] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const [pullRequestData, setPullRequestData] = useState([]);
  const [codeReviewData, setCodeReviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCommits = async (repoName) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/ChicoState/PantryNode/commits`);
      setCommitData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIssues = async (repoName) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/ChicoState/PantryNode/issues`);
      setIssueData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPullRequests = async (repoName) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/ChicoState/PantryNode/pulls`);
      setPullRequestData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRepoData = async (page = 1) => {
    try {
      const userDataResponse = await axios.get(`https://api.github.com/users/ChicoState`);
      setAvatarURL(userDataResponse.data.avatar_url);
      setGitHubUsername(userDataResponse.data.login);
  
      const reposResponse = await axios.get(`https://api.github.com/users/ChicoState/repos`, {
        params: {
          page: page,
          per_page: 279, // Set the number of items per page (max is 100)
        },
      });
  
      const list = reposResponse.data.map((item) => item.name);
      setRepoData(list);
  
      // Extract pagination information from headers
      const linkHeader = reposResponse.headers.link;
      const totalPagesMatch = linkHeader && linkHeader.match(/&page=(\d+)>; rel="last"/);
      const totalPages = totalPagesMatch ? parseInt(totalPagesMatch[1]) : 1;
      setTotalPages(totalPages);
  
      // Fetch next page if there are more pages
      if (page < totalPages) {
        await fetchRepoData(page + 1);
      }
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

  useEffect(() => {
    // Fetch GitHub user data with pagination when the component mounts
    fetchRepoData(currentPage);
  }, [currentPage]);

  return (
    <div className="App w-100 min-vh-100 justify-content-center align-items-center d-flex flex-column">
      <Card className="Card">
        <Card.Img variant="top" src={avatarURL} />
        <Card.Body>
          <Card.Title>{githubUsername}</Card.Title>
        </Card.Body>
      </Card>

      <div>
        {repoData.map((repoName, index) => (
          <div key={index} className="text-center">
            <a target="_blank" href={`https://github.com/ChicoState/PantryNode`}>
              {repoName}
            </a>
            <Button
              variant="info"
              size="sm"
              onClick={() => {
                fetchCommits(repoName);
                fetchIssues(repoName);
                fetchPullRequests(repoName);
              }}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
      <div>
        <h2>Commit Messages:</h2>
        <ul>
          {commitData.map((commit, index) => (
            <li key={index}>
              Date/Time: {commit.commit.author.date}<br />
              Author: {commit.commit.author.name}<br />
              Lines Added: {commit.stats ? commit.stats.additions : 'N/A'}<br />
              Lines Deleted: {commit.stats ? commit.stats.deletions : 'N/A'}<br />
              Commit Message: {commit.commit.message}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Issues:</h2>
        <ul>
          {issueData.map((issue, index) => (
            <li key={index}>
              Date/Time: {issue.created_at}<br />
              ID #: {issue.number}<br />
              Author: {issue.user.login}<br />
              Description: {issue.title}<br />
              Assignees: {issue.assignees.map((assignee) => assignee.login).join(", ")}<br />
              Date/Time Closed: {issue.closed_at}<br />
              Closed By: {issue.closed_by ? issue.closed_by.login : "Not Closed"}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Pull Requests:</h2>
        <ul>
          {pullRequestData.map((pr, index) => (
            <li key={index}>
              Date/Time Submitted: {pr.created_at}<br />
              ID #: {pr.number}<br />
              Author: {pr.user.login}<br />
              Status: {pr.state}<br />
              Reviewers: {pr.requested_reviewers.map((reviewer) => reviewer.login).join(", ")}<br />
              Date/Time Approved: {pr.merged_at}<br />
              Date/Time Closed: {pr.closed_at}<br />
            </li>
          ))}
        </ul>
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
    </div>
  );
}

export default App;
