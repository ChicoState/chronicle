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

  const renderPagination = (items) => {
    const pageCount = Math.ceil(items.length / itemsPerPage);
    return (
      <Pagination>
        <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
        {[...Array(pageCount)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={handleNextPage} disabled={currentPage === pageCount} />
      </Pagination>
    );
  };

  const renderCommits = (commits) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCommits = commits.slice(startIndex, startIndex + itemsPerPage);
    return paginatedCommits.map((commit, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h5>Commit Message: {commit.commit.message}</h5>
        <p>Author: {commit.commit.author.name} ({commit.commit.author.email})</p>
        <p>Date: {new Date(commit.commit.author.date).toLocaleString()}</p>
      </div>
    ));
  };

  const renderIssues = (issues) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIssues = issues.slice(startIndex, startIndex + itemsPerPage);
    return paginatedIssues.map((issue, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h5>Issue Title: {issue.title}</h5>
        <p>State: {issue.state}</p>
        <p>Created At: {new Date(issue.created_at).toLocaleString()}</p>
        <p>Updated At: {new Date(issue.updated_at).toLocaleString()}</p>
      </div>
    ));
  };

  const renderPullRequests = (pullRequests) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPullRequests = pullRequests.slice(startIndex, startIndex + itemsPerPage);
    return paginatedPullRequests.map((pr, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h5>PR Title: {pr.title}</h5>
        <p>State: {pr.state}</p>
        <p>Created At: {new Date(pr.created_at).toLocaleString()}</p>
        <p>Updated At: {new Date(pr.updated_at).toLocaleString()}</p>
        <p>URL: <a href={pr.html_url} target="_blank" rel="noopener noreferrer">{pr.html_url}</a></p>
      </div>
    ));
  };

  const renderCodeReviews = (codeReviews) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCodeReviews = codeReviews.slice(startIndex, startIndex + itemsPerPage);
    return paginatedCodeReviews.map((review, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h5>Reviewer: {review.user.login}</h5>
        <p>State: {review.state}</p>
        <p>Submitted At: {new Date(review.submitted_at).toLocaleString()}</p>
        <p>Pull Request URL: <a href={review.pull_request_url} target="_blank" rel="noopener noreferrer">{review.pull_request_url}</a></p>
        <p>Body: {review.body}</p>
      </div>
    ));
  };

  const renderComments = (comments) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedComments = comments.slice(startIndex, startIndex + itemsPerPage);
    return paginatedComments.map((comment, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h5>Commenter: {comment.user.login}</h5>
        <p>Comment: {comment.body}</p>
        <p>Created At: {new Date(comment.created_at).toLocaleString()}</p>
        <p>Updated At: {new Date(comment.updated_at).toLocaleString()}</p>
      </div>
    ));
  };

  return (
    <div>
      <div>
        <Button variant={activeTab === 'issues' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('issues'); setCurrentPage(1); }}>Issues</Button>
        <Button variant={activeTab === 'pullRequests' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('pullRequests'); setCurrentPage(1); }}>Pull Requests</Button>
        <Button variant={activeTab === 'commits' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('commits'); setCurrentPage(1); }}>Commits</Button>
        <Button variant={activeTab === 'codeReviews' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('codeReviews'); setCurrentPage(1); }}>Code Reviews</Button>
        <Button variant={activeTab === 'comments' ? 'primary' : 'secondary'} onClick={() => { setActiveTab('comments'); setCurrentPage(1); }}>Comments</Button>
      </div>
      {activeTab === 'issues' && (
        <>
          {renderIssues(issues)}
          {renderPagination(issues)}
        </>
      )}
      {activeTab === 'pullRequests' && (
        <>
          {renderPullRequests(pullRequests)}
          {renderPagination(pullRequests)}
        </>
      )}
      {activeTab === 'commits' && (
        <>
          {renderCommits(commits)}
          {renderPagination(commits)}
        </>
      )}
      {activeTab === 'codeReviews' && (
        <>
          {renderCodeReviews(codeReviews)}
          {renderPagination(codeReviews)}
        </>
      )}
      {activeTab === 'comments' && (
        <>
          {renderComments(comments)}
          {renderPagination(comments)}
        </>
      )}
    </div>
  );
};

export default GitHubDetails;