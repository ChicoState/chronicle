import React, { useState } from 'react';
import { Pagination, Button } from 'react-bootstrap';

const GitHubDetails = ({ username, repoName, issues, pullRequests, commits }) => {
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
    const totalPageCount = Math.ceil(issues.length / itemsPerPage);
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

  // Render functions for issues, pull requests, and commits remain the same
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
        <p>Author: {issue.user.login}</p>
        <p>Created At: {new Date(issue.created_at).toLocaleString()}</p>
        <p>State: {issue.state}</p>
        <p>Description: {issue.body}</p>
        <p>Assignees: {issue.assignees.map(assignee => assignee.login).join(', ')}</p>
        <p>Closed At: {issue.closed_at ? new Date(issue.closed_at).toLocaleString() : 'Not closed'}</p>
        <p>Closed By: {issue.closed_by ? issue.closed_by.login : 'N/A'}</p>
      </div>
    ));
  };

  const renderPullRequests = (pullRequests) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPullRequests = pullRequests.slice(startIndex, startIndex + itemsPerPage);
    return paginatedPullRequests.map((pr, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h5>Pull Request Title: {pr.title}</h5>
        <p>Author: {pr.user.login}</p>
        <p>Created At: {new Date(pr.created_at).toLocaleString()}</p>
        <p>Status: {pr.state}</p>
        <p>Description: {pr.body}</p>
        <p>Reviewers: {pr.requested_reviewers.map(reviewer => reviewer.login).join(', ')}</p>
        <p>Merged At: {pr.merged_at ? new Date(pr.merged_at).toLocaleString() : 'Not merged'}</p>
        <p>Closed At: {pr.closed_at ? new Date(pr.closed_at).toLocaleString() : 'Not closed'}</p>
      </div>
    ));
  };

  return (
    <div>
      <h2>{`${username}/${repoName} Details`}</h2>
      <div>
        <Button variant="link" onClick={() => setActiveTab('issues')}>Issues</Button>
        <Button variant="link" onClick={() => setActiveTab('pullRequests')}>Pull Requests</Button>
        <Button variant="link" onClick={() => setActiveTab('commits')}>Commits</Button>
      </div>

      <div>
        {activeTab === 'issues' && (
          <div>
            <h3>Issues</h3>
            {renderIssues(issues)}
            {renderPagination(issues)}
          </div>
        )}
        {activeTab === 'pullRequests' && (
          <div>
            <h3>Pull Requests</h3>
            {renderPullRequests(pullRequests)}
            {renderPagination(pullRequests)}
          </div>
        )}
        {activeTab === 'commits' && (
          <div>
            <h3>Commits</h3>
            {renderCommits(commits)}
            {renderPagination(commits)}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubDetails;
