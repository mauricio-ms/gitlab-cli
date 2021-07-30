#!/usr/bin/env node

module.exports.ROOT_PATH = __dirname;

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");

const package = require("./package.json");

const Setup = require("./api/Setup");
const Search = require("./search/Search");

program.version(package.version);

console.log(chalk.cyan(figlet.textSync("GitLab CLI")));

// TODO BUSCAR LISTA DE PROJETOS
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
    .description("Search for an term across all your Gitlab repositories")
    .action(async (term, options) => {
        if (!term) {
            answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "term",
                    message: "What is the search term?",
                    validate: value => value ? true : "An empty search term is not allowed!"
                }
            ]);
            term = answers.term;
        }
        new Search(term).execute();
    });

program.parse(process.argv);