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
        var promises = []

        //push promises from api calls to array
        for(var i = 1; i<=this.amountPages; i++){
            promises.push(this.getUsersByPage(i))
        }

        //event for when all api calls return
        return Promise.all(promises).then(() => { 
            this.logger.log("Complete.")
            //resolve()
        }).catch((error) => {
            this.logger.log("Error: " + error);
        });
        
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
                        "repos" : []
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
    getAllUsersRepos(){
        this.logger.log("Getting all users repos...")

        var promises = [];
        var ctrl = this;
        
        ctrl.userArray.forEach((user) => {
            var promise = ctrl.gitHubService.getUsersRepos(user.login).then((repos) => {
                
                repos.forEach((repo) => {
                    user.repos.push(repo)
                })
            })
            promises.push(promise)
        })

        return Promise.all(promises).then(function(res){
            ctrl.logger.log("Complete.")
        })

    }

    //displays username, then users repos/
    displayAll(){
        
        this.userArray.forEach((user) => {

            this.logger.log("username: " + user.login)

            user.repos.forEach((repo) => {
                this.logger.log("\t" + repo.name)

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
                text += "\t" + repo.name + "\n"
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