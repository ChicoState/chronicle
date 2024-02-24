# chronicle

# Steps to run the App:
1. cd client
2. npm start

# To set the required Github Account -> Go to App.js and change the userName required.
# Once the application has run on the browser:
1. First we will get all the repositories present in the particular github account. It is paginated with 10 repos/page.
2. once you click on any repo. All the Commits, PRs, Issues, Reviews and comments will be displayed below the repos list.
3. Each datalist is paginated with 10 details/page.

%
The below code is what I used for testing the api's without exceeding ratelimit set by the GitHub on it's apis:

In this code we can put in the github account name and the repo name manually on each api to test them.
It is a basic react frontend, you can run this by typing "npm start" in the terminal.

import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './App.css';

const App = () => {
  const [avatarURL, setAvatarURL] = useState();
  const [githubUsername, setGitHubUsername] = useState();
  const [repoData, setRepoData] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const [pullRequestData, setPullRequestData] = useState([]);
  const [codeReviewData, setCodeReviewData] = useState([]);
  const [commentData, setCommentData] = useState([]);

  async function fetchCommits(repoName) {
    // Get commit data for a specific repository
    await fetch(`https://api.github.com/repos/ChicoState/PantryNode/commits`)
      .then((res) => res.json())
      .then(
        (result) => {
          setCommitData(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async function fetchIssues(repoName) {
    // Get issue data for a specific repository
    await fetch(`https://api.github.com/repos/ChicoState/PantryNode/issues`)
      .then((res) => res.json())
      .then(
        (result) => {
          setIssueData(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async function fetchPullRequests(repoName) {
    // Get pull request data for a specific repository
    await fetch(`https://api.github.com/repos/ChicoState/PantryNode/pulls`)
      .then((res) => res.json())
      .then(
        (result) => {
          setPullRequestData(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async function fetchRepoData() {
    // Get repo data about the GitHub user
    await fetch(`https://api.github.com/users/ChicoState`)
      .then((res) => res.json())
      .then(
        (result) => {
          setAvatarURL(result.avatar_url);
          setGitHubUsername(result.login);
        },
        (error) => {
          console.log(error);
        }
      );

    // Get the list of public repositories
    await fetch(`https://api.github.com/users/ChicoState/repos`)
      .then((res) => res.json())
      .then(
        (result) => {
          const list = result.map((item) => item.name);
          setRepoData(list);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  useEffect(() => {
    // Fetch GitHub user data when the component mounts
    fetchRepoData();
  }, []);

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
      <div>
        <h2>Code Reviews:</h2>
        <ul>
          {codeReviewData.map((review, index) => (
            <li key={index}>
              Date/Time Submitted: {review.submitted_at}<br />
              Associated PR ID #: {review.pull_request_url.split("/").pop()}<br />
              Reviewer: {review.user.login}<br />
              Status: {review.state}<br />
              Description: {review.body}<br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
%
