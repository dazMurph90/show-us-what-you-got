import Logger from './helpers/logger';
import GitHubService from './services/github';
import Http from './helpers/http';
import Url from "url";
import QueryString from "querystring";

const baseUrl = "https://api.github.com/";
const organisationId = "uber";
const gitHubApiAuthToken = "915fa9458cabcffab770ba07faadfc0b23ea707e"; //add your GitHub API OAuth key here to increase request limit

let logger = new Logger();
let http = new Http();

let gitHubService = new GitHubService(baseUrl, http, gitHubApiAuthToken);


//github API paginates the list of ubers users to 30 per page
//we need to get amount of pages (IE amount of requests to make)
gitHubService.getHeader(organisationId).then(function(header){
    //param header returns the header information from an API call
    
    var amountPages = getAmountOfPagesFromHeader(header)
    
    getAllUsers(organisationId,amountPages,function(users){
        
        getAllUsersRepos(users,function(users){
            //displayStats(users)
            displayAll(users)
        })
        
    })
})


/*  -------------------------- FUNCTIONS -------------------------------  */


function getAmountOfPagesFromHeader(header){
    //API stores amount of pages in response headers 'link' field
    //amount of pages is in the query parameters of link where rel="last"
    
    var array = header.link.split(',') //split field into first and last links
    
    var link = Url.parse(array[1]) //parse url as to access query
    
    var query = QueryString.parse(link.query) //parse query to access pages param
    
    return parseInt(query.page[0]) //amount is first char in param
}

function getAllUsers(organisationId, amountPages, callback){
    logger.log("Getting all users...")
    var usersArray = []
    var promises = []
    
    //push promises from api calls to array
    for(var i = 1; i<=amountPages; i++){
        promises.push(getUsersByPage(organisationId,i,usersArray))
    }
    
    //event for when all api calls return
    Promise.all(promises).then(values => { 
        logger.log("Complete.")
        //all users retreived, now get their repos.
        callback(usersArray)
    });
}



//function to retreive a page(30) users from the gitHub API
//param 1: ID of organisation to query
//param 2: Page number
//param 3: array of user objects to store user data
function getUsersByPage(organisationId, pageNumber,usersArray){

   return new Promise(function(resolve,reject){
       gitHubService.getUsersForOrganisation(organisationId,pageNumber).then((users) => {
    
            users.forEach((user) => {
                
                //create user object
                var newUser = {
                    "login" : user.login,
                    "repos" : []
                }
                
                //store in array
                usersArray.push(newUser)
            });
           
            resolve(usersArray)

        }).catch((error) => {
            logger.log("Error: " + error);
        });
        
    })
}

function getAllUsersRepos(usersArray, callback){
    console.log("Getting all users repos...")
    
    var promises = []
    
    usersArray.forEach((user) => {
        var promise = gitHubService.getUsersRepos(user.login).then((repos) => {
            
            //console.log(user.login)
            repos.forEach((repo) => {
                user.repos.push(repo)
                //console.log("\t" + repo.name)
            })
            
        })
        promises.push(promise)
    })
    
    Promise.all(promises).then(function(res){
        console.log("Complete.")
        callback(usersArray)
    })

}

function displayAll(usersArray){
    usersArray.forEach((user) => {
        
        logger.log("username: " + user.login)
       
        user.repos.forEach((repo) => {
            logger.log("\t" + repo.name)
        
        })
    })
}

function displayStats(usersArray){
    logger.log("Total users: " + usersArray.length + "\n")
    logger.log("\tUSER\t\t# OF REPOS")
    usersArray.forEach((user) => {
        logger.log(user.login + "\t\t" + user.repos.length)
    })
}














