import React, { useState } from 'react';
import { Pagination, Button } from 'react-bootstrap';

const GitHubDetails = ({ username, repoName, issues, pullRequests, commits, codeReviews, comments }) => {
  const [activeTab, setActiveTab] = useState('issues');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPageCount = Math.ceil(activeTab === 'issues' ? issues.length / itemsPerPage :
                                      activeTab === 'pullRequests' ? pullRequests.length / itemsPerPage :
                                      activeTab === 'commits' ? commits.length / itemsPerPage :
                                      activeTab === 'codeReviews' ? codeReviews.length / itemsPerPage :
                                      comments.length / itemsPerPage);
    if (currentPage < totalPageCount) {
      setCurrentPage(currentPage + 1);
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

</div>
);
}

export default GitHubDetails;