import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import GitHubDetails from "./GitHubDetails";
import handleExportData from "./exportUtils";

const GitHubRepos = () => {
  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [commits, setCommits] = useState([]);
  const [codeReviews, setCodeReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isRepoFetched, setIsRepoFetched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // GitHub token
  const token = process.env.REACT_APP_GITHUB_KEY;

  const resetData = () => {
    setRepoData(null);
    setIssues([]);
    setPullRequests([]);
    setCommits([]);
    setCodeReviews([]);
    setComments([]);
    setIsRepoFetched(false);
    setErrorMessage('');
  };

  const fetchRepoData = async () => {
    try {
      const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      setRepoData(repoResponse.data);

      await fetchAllIssues();
      const prs = await fetchAllPullRequests();
      await fetchAllCommits();
      await fetchAllComments();
      
      // Fetch code reviews after all pull requests have been fetched
      await fetchAllCodeReviews(prs);
      
      setIsRepoFetched(true); // Set visibility state to true after successful fetch
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Repository not found.');
      } else {
        setErrorMessage('An error occurred while fetching the repository data.');
      }
      resetData();
    }
  };

  const fetchAllIssues = async () => {
    let page = 1;
    let allIssues = [];
    let hasMore = true;

    while (hasMore) {
      const issuesResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/issues`, {
        params: { page, per_page: 100, state: "all" },
        headers: {
          Authorization: `token ${token}`
        }
      });
      if (issuesResponse.data.length > 0) {
        // Filter out pull requests
        const issuesOnly = issuesResponse.data.filter(issue => !issue.pull_request);
        allIssues = allIssues.concat(issuesOnly);
        page++;
      } else {
        hasMore = false;
      }
    }
    setIssues(allIssues);
  };

  const fetchAllPullRequests = async () => {
    let page = 1;
    let allPullRequests = [];
    let hasMore = true;

    while (hasMore) {
      const pullRequestsResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/pulls`, {
        params: { page, per_page: 100, state: "all" },
        headers: {
          Authorization: `token ${token}`
        }
      });
      if (pullRequestsResponse.data.length > 0) {
        allPullRequests = allPullRequests.concat(pullRequestsResponse.data);
        page++;
      } else {
        hasMore = false;
      }
    }
    setPullRequests(allPullRequests);
    return allPullRequests;
  };

  const fetchAllCommits = async () => {
    let page = 1;
    let allCommits = [];
    let hasMore = true;

    while (hasMore) {
      const commitsResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/commits`, {
        params: { page, per_page: 100 },
        headers: {
          Authorization: `token ${token}`
        }
      });
      console.log("Commit Response:", commitsResponse.data);
      if (commitsResponse.data.length > 0) {
        // Check for each commit author and try to link to GitHub user
        const mappedCommits = commitsResponse.data.map(commit => {
          if (!commit.author) {
            commit.author = { login: commit.commit.author.name }; // Fallback to commit author's name if author is null
          }
          return commit;
        });
        allCommits = allCommits.concat(mappedCommits);
        page++;
      } else {
        hasMore = false;
      }
    }
    setCommits(allCommits);
  };

  const fetchAllCodeReviews = async (pullRequests) => {
    const allReviews = [];
    for (const pr of pullRequests) {
      const reviews = await fetchCodeReviewsForPR(pr.number);
      allReviews.push(...reviews);
    }
    setCodeReviews(allReviews);
  };

  const fetchCodeReviewsForPR = async (prNumber) => {
    try {
      const codeReviewsResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/pulls/${prNumber}/reviews`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
      return codeReviewsResponse.data;
    } catch (error) {
      console.error(`Error fetching code reviews for PR ${prNumber}:`, error);
      return [];
    }
  };

  const fetchAllComments = async () => {
    let page = 1;
    let allComments = [];
    let hasMore = true;

    while (hasMore) {
      const commentResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}/issues/comments`, {
        params: { page, per_page: 100 },
        headers: {
          Authorization: `token ${token}`
        }
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
    resetData();  // Reset data before starting a new search
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
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter repository name"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />
        <Button variant="primary" onClick={handleRepoSearch}>
          Search
        </Button>
      </div>

      {errorMessage && (
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}

      {repoData && (
        <div>
          <h2>{repoData.full_name}</h2>
          <p>{repoData.description}</p>
          {isRepoFetched && (
            <>
              <Button variant="link" onClick={() => handleRepoClick(repoData.name)}>
                View Details
              </Button>
              <Button variant="secondary" onClick={() => handleExportData(repoName, { repoData, issues, pullRequests, commits, codeReviews, comments })}>
                Export Data
              </Button>
            </>
          )}
        </div>
      )}

      {selectedRepo && (
        <GitHubDetails
          username={username}
          repoName={selectedRepo}
          issues={issues}
          pullRequests={pullRequests}
          commits={commits}
          codeReviews={codeReviews}
          comments={comments}
        />
      )}
    </div>
  );
};

export default GitHubRepos;
