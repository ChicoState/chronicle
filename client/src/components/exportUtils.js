const handleExportData = (repoName, { repoData, issues, pullRequests, commits }) => {
    const csvRows = [];

    // Function to convert timestamp to date string
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString();
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
            commit.commit.author.name,
            commit.sha,
            "",
            "",
            `"${commit.commit.message.replace(/"/g, '""')}"`,
            "",
            "",
            "",
            "",
            "",
            ""
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
            "",
            "",
            `"${pullRequest.title.replace(/"/g, '""')}"`,
            formatList(pullRequest.assignees),
            pullRequest.closed_at ? formatDate(pullRequest.closed_at) : "N/A", // Check if closed_at exists
            pullRequest.closed_by ? pullRequest.closed_by.login : "N/A", // Check if closed_by exists
            pullRequest.state,
            formatList(pullRequest.requested_reviewers),
            "",
            ""
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
            "",
            "",
            `"${issue.title.replace(/"/g, '""')}"`,
            formatList(issue.assignees),
            issue.closed_at ? formatDate(issue.closed_at) : "N/A", // Check if closed_at exists
            issue.closed_by ? issue.closed_by.login : "N/A", // Check if closed_by exists
            issue.state,
            "",
            "",
            ""
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
    downloadAnchorNode.remove();
};

export default handleExportData;
