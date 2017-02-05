import Logger from './helpers/logger';
import GitHubService from './services/github';
import Http from './helpers/http';

import Controller from "./Controller";
import AuthManager from "./helpers/AuthManager";


const baseUrl = "https://api.github.com/";
const organisationId = "uber";
//const gitHubApiAuthToken = ""; //OAuth key
var authManager = new AuthManager()
const gitHubApiAuthToken = authManager.getAuth("github");

let logger = new Logger();
let http = new Http();

let gitHubService = new GitHubService(baseUrl, http, gitHubApiAuthToken);

var controller = new Controller(organisationId,gitHubService, logger)

controller.getAllUsers().then(() => {
    
     controller.getRepos().then(() => {
         
        controller.displayAll()
        //controller.displayStats()
        //controller.ouputToFile("output.txt")
        
     })
     
}).catch((error) => {
    
    logger.log("Error: " + error);
    
});






