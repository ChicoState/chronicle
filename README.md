# chronicle

## Getting Started

1. Generate a [GitHub Personal Access Token](https://github.com/settings/tokens/new) that has permissions for all **read** scopes. Copy the token provided.
2. Create a file `client/.env` in the project root directory and edit it with the line: `REACT_APP_GITHUB_KEY=` followed by the token pasted from the previous step.

## Run the program

1. `cd client`
2. `npm start`

To set the required Github Account -> Go to App.js and change the userName required.

Once the application has run on the browser:

1. First we will get all the repositories present in the particular github account. It is paginated with 10 repos/page.
2. once you click on any repo. All the Commits, PRs, Issues, Reviews and comments will be displayed below the repos list.
3. Each datalist is paginated with 10 details/page.

## Test file

I have added a new file called testfile, that contains a react App.js file.
I used that for testing apis. Since there is a ratelimiter set on how many apis calls per day I have been using App.js from testfile folder to test my apis where I can manually put in github account name and the reponame from which we want to fetch data. That would help us not exceed the ratelimit.

In order to run that app you have to create a react app and add this code in you newly created react app and run it using npm start.
You cannot run it though this file as it is just a js file and I didn't install react and node modules to it.
