import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import GitHubDetails from "./GitHubDetails";
import handleExportData from "./exportUtils";

const GitHubRepos = () => {
  const [loginName, setLoginName] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [commits, setCommits] = useState([]);
  const [codeReviews, setCodeReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const fetchRepoData = async () => {
    try {
      const repoResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}`);
      console.log("Repo Response:", repoResponse.data);
      const contResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}/contributors`);
      console.log("Repo Response:", contResponse.data);
      setRepoData(repoResponse.data);

      await fetchAllIssues();
      await fetchAllPullRequests();
      await fetchAllCommits();
      await fetchAllCodeReviews();
      await fetchAllComments();
    } catch (error) {
      console.error(error);
      setRepoData(null);
      setIssues([]);
      setPullRequests([]);
      setCommits([]);
      setCodeReviews([]);
      setComments([]);
    }
  };

  const fetchAllIssues = async () => {
    let page = 1;
    let allIssues = [];
    let hasMore = true;

    while (hasMore) {
      const issuesResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}/issues`, {
        params: { page, per_page: 100, state: "all" }
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
      const pullRequestsResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}/pulls`, {
        params: { page, per_page: 100, state: "all" }
      });
      if (pullRequestsResponse.data.length > 0) {
        allPullRequests = allPullRequests.concat(pullRequestsResponse.data);
        page++;
      } else {
        hasMore = false;
      }
    }
    setPullRequests(allPullRequests);
  };

  const fetchAllCommits = async () => {
    let page = 1;
    let allCommits = [];
    let hasMore = true;

    while (hasMore) {
      const commitsResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}/commits`, {
        params: { page, per_page: 100 }
      });
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

  const fetchAllCodeReviews = async () => {
    let page = 1;
    let allCodeReviews = [];
    let hasMore = true;

    while (hasMore) {
      const codeReviewResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}/pulls/comments`, {
        params: { page, per_page: 100 }
      });
      if (codeReviewResponse.data.length > 0) {
        allCodeReviews = allCodeReviews.concat(codeReviewResponse.data);
        page++;
      } else {
        hasMore = false;
      }
    }
    setCodeReviews(allCodeReviews);
  };

  const fetchAllComments = async () => {
    let page = 1;
    let allComments = [];
    let hasMore = true;

    while (hasMore) {
      const commentResponse = await axios.get(`https://api.github.com/repos/${loginName}/${repoName}/issues/comments`, {
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
        <input
          type="text"
          placeholder="Enter GitHub login name"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
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

      {repoData && (
        <div>
          <h2>{repoData.full_name}</h2>
          <p>{repoData.description}</p>
          <Button variant="link" onClick={() => handleRepoClick(repoData.name)}>
            View Details
          </Button>
          <Button variant="secondary" onClick={() => handleExportData(repoName, { repoData, issues, pullRequests, commits, codeReviews, comments })}>
            Export Data
          </Button>
        </div>
      )}

      {selectedRepo && (
        <GitHubDetails
          username={loginName}
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
