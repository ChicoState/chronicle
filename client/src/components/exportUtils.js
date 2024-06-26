const handleExportData = (repoName, { repoData, issues, pullRequests, commits, codeReviews, comments }) => {
    const csvRows = [];

    // Function to convert timestamp to date string
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return isNaN(date) ? 'N/A' : date.toISOString();
    };

    // Function to convert assignees/reviewers to string
    const formatList = (list) => {
        return list.map(item => item.login).join('; ');
    };

    // Add CSV header row
    csvRows.push([
        "Repository",
        "Timestamp",
        "Action",
        "Author",
        "Repo_ID",
        "Additions",
        "Deletions",
        "Message",
        "Assignees",
        "Close_date",
        "Closed_by",
        "Request_Status",
        "Reviewers",
        "Review_Recommendation",
        "Tagged"
    ]);

    // Add commit data
    commits.forEach(commit => {
        csvRows.push([
            repoName,
            formatDate(commit.commit.author.date),
            "commit",
            commit.author.login,
            commit.sha,
            "N/A",
            "N/A",
            `"${commit.commit.message.replace(/"/g, '""')}"`,
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A"
        ]);
    });

    // Add pull request data
    pullRequests.forEach(pullRequest => {
        csvRows.push([
            repoName,
            formatDate(pullRequest.created_at),
            "pull_request",
            pullRequest.user.login,
            pullRequest.number,
            "N/A",
            "N/A",
            `"${pullRequest.title.replace(/"/g, '""')}"`,
            formatList(pullRequest.assignees),
            pullRequest.closed_at ? formatDate(pullRequest.closed_at) : "N/A",
            pullRequest.closed_by ? pullRequest.closed_by.login : "N/A",
            pullRequest.state,
            formatList(pullRequest.requested_reviewers),
            "N/A",
            "N/A"
        ]);
    });

    // Add issue data
    issues.forEach(issue => {
        csvRows.push([
            repoName,
            formatDate(issue.created_at),
            "issue",
            issue.user.login,
            issue.number,
            "N/A",
            "N/A",
            `"${issue.title.replace(/"/g, '""')}"`,
            formatList(issue.assignees),
            issue.closed_at ? formatDate(issue.closed_at) : "N/A",
            issue.closed_by ? issue.closed_by.login : "N/A",
            issue.state,
            "N/A",
            "N/A",
            "N/A"
        ]);
    });

    // Add code review data
    codeReviews.forEach(review => {
        csvRows.push([
            repoName,
            formatDate(review.submitted_at),
            "code_review",
            review.user.login,
            review.pull_request_url.split('/').pop(),
            "N/A",
            "N/A",
            `"${review.body ? review.body.replace(/"/g, '""') : 'N/A'}"`,
            "N/A",
            "N/A",
            "N/A",
            review.state ? review.state : "N/A",
            "N/A",
            "N/A",
            "N/A"
        ]);
    });

    // Add comment data
    comments.forEach(comment => {
        csvRows.push([
            repoName,
            formatDate(comment.created_at),
            "comment",
            comment.user.login,
            comment.id,
            "N/A",
            "N/A",
            `"${comment.body.replace(/"/g, '""')}"`,
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A",
            "N/A"
        ]);
    });

    // Convert CSV rows to string
    const csvString = csvRows.map(row => row.join(',')).join('\n');

    // Create download link
    const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", `${repoName}_data.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
};

export default handleExportData;