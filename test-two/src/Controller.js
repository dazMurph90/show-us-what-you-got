import fs from "fs"; //for file output of results

class Controller {
    constructor(organisationId, gitHubService, logger){
        this.gitHubService = gitHubService;
        this.organisationId = organisationId;
        this.logger = logger;
        this.userArray = [];
        this.amountPages = 0;
    }
    
    //retreives all usernames from the github API
    //runs getUsersByPage by amountPages times
    getAllUsers(){
        this.logger.log("Getting all users...")
        var ctrl = this;
        
        return new Promise(function(resolve,reject){
            var promises = []
            
            //get header data to find amt of pages of users 
            ctrl.gitHubService.getHeaderForUsers(ctrl.organisationId).then((header) => {
    
                ctrl.amountPages = ctrl.gitHubService.getAmountOfPagesFromHeader(header)
                
                for(var i = 1; i<= ctrl.amountPages; i++){
                    promises.push(ctrl.getUsersByPage(i))
                }

                Promise.all(promises).then(() => { 
                    ctrl.logger.log("Complete.")
                    resolve(ctrl.userArray)
                }).catch((error) => {
                    ctrl.logger.log("Error: " + error);
                });
            })
        })
    }
    
    
    //function to retreive a page(30) users from the gitHub API
    getUsersByPage(pageNumber){

        var ctrl = this;
       return new Promise(function(resolve,reject){
           
           ctrl.gitHubService.getUsersForOrganisation(ctrl.organisationId,pageNumber).then((users) => {

                users.forEach((user) => {

                    //create user object
                    var newUser = {
                        "login" : user.login,
                        "repos" : [],
                        "amtRepoPages" : 0
                    }

                    //store in array
                    ctrl.userArray.push(newUser)
                });

                resolve(ctrl.userArray)

            }).catch((error) => {
                ctrl.logger.log("Error: " + error);
            });

        })
    }
    
    //gets repos for all users
    getRepos(){
        this.logger.log("Getting all users repos...")
        
        var ctrl = this;
        return new Promise(function(resolve,reject){
            
            ctrl.setAllUsersRepoPageAmount().then(() => {
                ctrl.getAllUserRepos().then((data) => {
                    ctrl.logger.log("Complete.")
                    resolve();
                });
            }); 
            
        });

    }
    
    setAllUsersRepoPageAmount(){
        var ctrl = this;
        
        var promises = [];
        
        return new Promise(function(resolve,reject){
            
            ctrl.userArray.forEach((user) => {
                promises.push(ctrl.setUsersRepoPageAmount(user))
            });

            Promise.all(promises).then(function(res){
                resolve(ctrl.userArray)
            })
        })
        
        
    }
    
    //set amount of repo pages for a single user
    setUsersRepoPageAmount(user){
        var ctrl = this;
        return new Promise(function(resolve,reject){
            ctrl.gitHubService.getHeaderForRepos(user.login).then((header) => {
                user.amtRepoPages = ctrl.gitHubService.getAmountOfPagesFromHeader(header)
                resolve(user);
            });
        });
    }
    
    //get all repos for all users
    getAllUserRepos(){
        var ctrl = this;
        
        return new Promise(function(resolve,reject){
            var promises = []

            ctrl.userArray.forEach((user) => {
                for(var i = 1; i <= user.amtRepoPages; i++){
                    promises.push(ctrl.getUsersReposByPage(user,i))
                }
            });

            Promise.all(promises).then(function(res){
                resolve(ctrl.userArray)
            })
            
        });
        
    }
    
    //get repos for a single user by page
    getUsersReposByPage(user,pageNumber){
        var ctrl = this;
        return new Promise(function(resolve, reject){

            ctrl.gitHubService.getUsersRepos(user.login, pageNumber).then((repos) => {
                
                repos.forEach((repo) => {
                    user.repos.push(repo.name)
                })

                resolve(user);
            }).catch((error) => {
                ctrl.logger.log("Error: " + error);
            });
            
        });
            

    }
   
    //displays username, then users repos
    displayAll(){
        
        this.userArray.forEach((user) => {

            this.logger.log("username: " + user.login)

            user.repos.forEach((repo) => {
                this.logger.log("\t" + repo)

            })
        })
    }

    //displays username, then number of repos from user
    displayStats(){
        this.logger.log("Total users: " + this.userArray.length + "\n")
        
        this.logger.log("\tUSER\t\t# OF REPOS")
        this.userArray.forEach((user) => {
            this.logger.log(user.login + "\t\t" + user.repos.length)
        })
        
    }
    
    //writes the data retreived to file in the test-two dir.
    ouputToFile(filename){
        var text = ""
        this.userArray.forEach((user) => {

            text += "username: " + user.login + "\n";

            user.repos.forEach((repo) => {
                text += "\t" + repo + "\n"
            })
        })
        
        var ctrl = this
        fs.writeFile("./" + filename, text, function(err) {
            if(err) {
                ctrl.logger.log(err);
            }

            ctrl.logger.log("Data successfully written to file.");
        });
    }
    
    
}


module.exports = Controller;