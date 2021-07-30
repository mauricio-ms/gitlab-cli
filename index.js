#!/usr/bin/env node

module.exports.ROOT_PATH = __dirname;

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const Table = require("cli-table");

const package = require("./package.json");

const Setup = require("./api/Setup");
const Search = require("./search/Search");
const PrintSearchResultsListener = require("./search/PrintSearchResultsListener");
const GetProjects = require("./search/GetProjects");
const ProjectsSearch = require("./search/ProjectsSearch");

program.version(package.version);

console.log(chalk.cyan(figlet.textSync("GitLab CLI")));

// TODO SPECIFY GROUPS TO AVOID USELESS PROJECTS

program
    .command("setup <gitlab-server-url> <personal-access-token>")
    .description("Setup the Gitlab Url of your server and your personal access token with read API permission")
    .action((gitlabServerUrl, personalAccessToken) => {
        try {
            Setup.of(gitlabServerUrl, personalAccessToken).save();
            console.log(`${chalk.green("Setup performed with success!")}`);
        } catch (err) {
            console.log(`${chalk.red("Setup cannot be performed:")}`);
            console.log(err);
        }
    });

program
    .command("search [term]")
    .option("-p, --projects", "Output only project's names that contain the specified term")
    .description("Search for an term across all your Gitlab repositories")
    .action(async (term, options) => {
        if (!term) {
            const answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "term",
                    message: "What is the search term?",
                    validate: value => value ? true : "An empty search term is not allowed!"
                }
            ]);
            term = answers.term;
        }
        
        const projects = await new GetProjects().execute();
        if (options.projects) {
            const projectsSearch = new ProjectsSearch(projects, term);
            const projectsFound = await projectsSearch.execute();

            const table = new Table({
                head: ["Row", "Project"],
                colWidths: [5, 50]
            });
            projectsFound.forEach((project, index) => {
                table.push([index, project.name])
            });
            console.log(table.toString());
        } else {
            const search = new Search(projects, term);
            search.addListener(new PrintSearchResultsListener(projects));
            search.execute();
        }
    });

program.parse(process.argv);