import Logger from './helpers/logger';
import GitHubService from './services/github';
import Http from './helpers/http';
import Url from "url";
import QueryString from "querystring";
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


//github API paginates the list of ubers users to 30 per page
//we need to get amount of pages first(IE amount of requests to make)
gitHubService.getHeaderForUsers(organisationId).then((header) => {
    //param header returns the header information from an API call
    
    controller.amountPages = getAmountOfPagesFromHeader(header)
    
    controller.getAllUsers().then(() => {
         controller.getAllUsersRepos().then(() => {
             controller.displayAll()
            //controller.ouputToFile("output.txt")
         })
    })

    
}).catch((error) => {
    logger.log("Error: " + error);
});




/*  -------------------------- MISC FUNCTIONS -------------------------------  */

//extracts amount of pages for users from the API response header
var getAmountOfPagesFromHeader = (header) => {
    //API stores amount of pages in response headers 'link' field
    //amount of pages is in the query parameters of link where rel="last"
    
    var array = header.link.split(',') //split field into first and last links
    
    var link = Url.parse(array[1]) //parse url as to access query
    
    var query = QueryString.parse(link.query) //parse query to access pages param
    
    return parseInt(query.page[0]) //amount is first char in param
}
