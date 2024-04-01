// GitHubDetails.js
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const GitHubDetails = ({ username, repoName }) => {
  const [commitData, setCommitData] = useState([]);
  const [issueData, setIssueData] = useState([]);
  const [pullRequestData, setPullRequestData] = useState([]);
  const [codeReviewData, setCodeReviewData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [commitPage, setCommitPage] = useState(1);
  const [issuePage, setIssuePage] = useState(1);
  const [pullRequestPage, setPullRequestPage] = useState(1);
  const [codeReviewPage, setCodeReviewPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  
    // Function to convert data to CSV format
    const exportCSV = async (page) => {
      try {
        // Fetch all data for each type of activity
        await fetchCommits();
        await fetchIssues();
        await fetchPullRequests();
        await fetchCodeReviews();
        await fetchComments();
    
        // Combine all data arrays into one array with an additional "Action" column
        const allData = [
          ...commitData.map(data => ({ ...data, Action: 'Commit' })),
          ...issueData.map(data => ({ ...data, Action: 'Issue' })),
          ...pullRequestData.map(data => ({ ...data, Action: 'Pull Request' })),
          ...codeReviewData.map(data => ({ ...data, Action: 'Code Review' })),
          ...commentData.map(data => ({ ...data, Action: 'Comment' }))
        ];
    
        // Create CSV content
        let csvContent = "Repository,Timestamp,Action,Author,ID,Additions,Deletions,Message,Description,Assignees,Close_date,Closed_by,Request_Status,Reviewers,Review_Recommendation,Tagged\n";
    
        // Append data rows
        allData.forEach(data => {
          // Construct each row of CSV data
          // ...
          let timestamp = 'NA';
          let assigneesStr = 'NA';
          let reviewersStr = 'NA';
          let author = 'NA';
          let repoID = 'NA';
          let message='NA';
          let description='NA';
          let close_date='NA';
          let closed_by='NA';
          let status='NA';
          // Determine the appropriate fields based on the action
          switch (data.Action) {
            case 'Commit':
              timestamp = data.commit.author.date;
              author = data.commit.author.name;
              repoID = data.repoID;
              if (Array.isArray(data.assignees) && data.assignees.length > 0) {
                assigneesStr = data.assignees.map(assignee => assignee.name || 'NA').join(';');
              }
              message=data.commit.message;
              break;
            case 'Issue':
              timestamp = data.created_at;
              author = data.user.login;
              repoID = data.number;
              if (Array.isArray(data.assignees) && data.assignees.length > 0) {
                assigneesStr = data.assignees.map(assignee => assignee.login || 'NA').join(';');
              }
              description=data.title;
              close_date=data.closed_at||'NA';
              closed_by=data.closed_by ? data.closed_by.login : "Not Closed"
              break;
            case 'Pull Request':
              timestamp = data.created_at;
              author = data.user.login;
              repoID = data.number;
              if (Array.isArray(data.requested_reviewers) && data.requested_reviewers.length > 0) {
                reviewersStr = data.requested_reviewers.map(reviewer => reviewer.login || 'NA').join(';');
              }
              close_date=data.closed_at;
              status=data.state;
              break;
            case 'Code Review':
              timestamp = data.created_at;
              author = data.user.login;
              repoID = data.pull_request_url.split('/').pop();
              // Add logic to retrieve reviewers' information from code review data
              if (data.user && data.user.login) {
                reviewersStr = data.user.login;
              }
              description=data.body;
              status=data.state;
              break;
            case 'Comment':
              timestamp = data.created_at;
              author = data.user.login;
              repoID = data.id;
              message=data.body;
              // Add logic to extract assignees/reviewers if applicable
              break;
            default:
              break;
          }
          message = message ? `"${message.replace(/"/g, '""').replace(/\n/g, '\\n')}"` : 'NA';
          description = description ? `"${description.replace(/"/g, '""').replace(/\n/g, '\\n')}"` : 'NA';
          csvContent += `${repoName},${timestamp},${data.Action},${author},${repoID},${data.additions || 'NA'},${data.deletions || 'NA'},${message || 'NA'},${description || 'NA'},${assigneesStr},${close_date || 'NA'},${closed_by || 'NA'},${status|| 'NA'},${reviewersStr},${data.reviewRecommendation || 'NA'},${data.tagged || 'NA'}\n`;
        });
    
        // Create Blob and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${repoName}_${page}_data.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error(error);
      }
    };
    
  const fetchCommits = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/commits?sha=frontend`, {
        params: {
          page: page,
          per_page: 10,
        },
      });
      setCommitData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchIssues = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/issues`, {
        params: {
          page: page,
          per_page: 10,
        },
      });
      setIssueData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPullRequests = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/pulls`, {
        params: {
          page: page,
          per_page: 10,
        },
      });
      setPullRequestData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCodeReviews = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/pulls/comments`, {
        params: {
          page: page,
          per_page: 10,
        },
      });
      setCodeReviewData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (page = 1) => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/issues/comments`, {
        params: {
          page: page,
          per_page: 10,
        },
      });
      setCommentData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCommits(commitPage);
    fetchIssues(issuePage);
    fetchPullRequests(pullRequestPage);
    fetchCodeReviews(codeReviewPage);
    fetchComments(commentPage);
  }, [username, repoName, commitPage, issuePage, pullRequestPage, codeReviewPage, commentPage]);

  // Pagination controls for each type of data
  const handlePagination = (dataType, direction) => {
    switch (dataType) {
      case 'commits':
        setCommitPage(direction === 'next' ? commitPage + 1 : commitPage - 1);
        break;
      case 'issues':
        setIssuePage(direction === 'next' ? issuePage + 1 : issuePage - 1);
        break;
      case 'pullRequests':
        setPullRequestPage(direction === 'next' ? pullRequestPage + 1 : pullRequestPage - 1);
        break;
      case 'codeReviews':
        setCodeReviewPage(direction === 'next' ? codeReviewPage + 1 : codeReviewPage - 1);
        break;
      case 'comments':
        setCommentPage(direction === 'next' ? commentPage + 1 : commentPage - 1);
        break;
      default:
        break;
    }
    
  };

  return (
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

      {/* Pagination controls for commits */}
      <div>
        <Button variant="secondary" onClick={() => handlePagination('commits', 'prev')} disabled={commitPage === 1}>
          Previous Page
        </Button>{' '}
        <Button variant="secondary" onClick={() => handlePagination('commits', 'next')} disabled={commitData.length < 10}>
          Next Page
        </Button>
      </div>

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

      {/* Pagination controls for issues */}
      <div>
        <Button variant="secondary" onClick={() => handlePagination('issues', 'prev')} disabled={issuePage === 1}>
          Previous Page
        </Button>{' '}
        <Button variant="secondary" onClick={() => handlePagination('issues', 'next')} disabled={issueData.length < 10}>
          Next Page
        </Button>
      </div>

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

      {/* Pagination controls for pull requests */}
      <div>
        <Button variant="secondary" onClick={() => handlePagination('pullRequests', 'prev')} disabled={pullRequestPage === 1}>
          Previous Page
        </Button>{' '}
        <Button variant="secondary" onClick={() => handlePagination('pullRequests', 'next')} disabled={pullRequestData.length < 10}>
          Next Page
        </Button>
      </div>

      {/* ... (similar pagination controls for other data) ... */}
      {/* ... (similar pagination controls for other data) ... */}

<h2>Code Reviews:</h2>
<ul>
  {codeReviewData.map((review, index) => (
    <li key={index}>
      Date/Time Submitted: {review.submitted_at}<br />
      ID #: {review.pull_request_url.split('/').pop()}<br />
      Reviewer: {review.user.login}<br />
      Status: {review.state}<br />
      Description: {review.body}
    </li>
  ))}
</ul>

{/* Pagination controls for code reviews */}
<div>
  <Button variant="secondary" onClick={() => handlePagination('codeReviews', 'prev')} disabled={codeReviewPage === 1}>
    Previous Page
  </Button>{' '}
  <Button variant="secondary" onClick={() => handlePagination('codeReviews', 'next')} disabled={codeReviewData.length < 10}>
    Next Page
  </Button>
</div>

<h2>Comments:</h2>
<ul>
  {commentData.map((comment, index) => (
    <li key={index}>
      Date/Time: {comment.created_at}<br />
      Author: {comment.user.login}<br />
      ID #: {comment.id}<br />
      Message: {comment.body}
    </li>
  ))}
</ul>

{/* Pagination controls for comments */}
<div>
  <Button variant="secondary" onClick={() => handlePagination('comments', 'prev')} disabled={commentPage === 1}>
    Previous Page
  </Button>{' '}
  <Button variant="secondary" onClick={() => handlePagination('comments', 'next')} disabled={commentData.length < 10}>
    Next Page
  </Button>
</div>
<Button variant="success" onClick={() => exportCSV(commitPage)}>Export to CSV</Button>
</div>
);
  }

export default GitHubDetails;
