import Controller from "./Controller";
import Http from "./helpers/http";
import Logger from "./helpers/logger";
import GitHubService from "./services/github";
import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonAsPromised from "sinon-as-promised";
import { expect } from "chai";

let should = chai.should();

chai.use(chaiAsPromised);

describe("Controller", () => {
    const baseGitHubUrl = "https://api.github.com/";

    let http;
    let gitHubService;
    let controller;
    let logger;
    
    const organisationId = "uber";
    
    const header = { 
        server: 'GitHub.com',
        date: 'Fri, 03 Feb 2017 03:15:10 GMT',
        'content-type': 'application/json; charset=utf-8',
        link: '<https://api.github.com/organizations/538264/members?access_token=6fe9ec8b072c895adf40b1d9db487fb827bb4522&page=2>; rel="next", <https://api.github.com/organizations/538264/members?access_token=6fe9ec8b072c895adf40b1d9db487fb827bb4522&page=3>; rel="last"'
    }
    
     beforeEach(() => {
        http = new Http();
        logger = new Logger();
        gitHubService = new GitHubService(baseGitHubUrl, http, "");
        controller = new Controller("uber", gitHubService, logger);
    });

    afterEach(() => {
        
    });
    
    
    //tests getUsersReposByPage
    it("should get a users repos by page number", (done) => {
        //Arrange
        
        //obj to be modified by getUserRepos
        var user = { 
            name : "name", 
            repos: [], 
            amtRepoPages: 0 
        }
        
        //mocked dataset
        var repos = [
            { name : "one" },
            { name : "two" },
            { name : "three" }
        ];
        
        //end result to compare to
        var endResult = {
            name: "name",
            repos: [ "one", "two", "three" ],
            amtRepoPages: 0 
        }
        
        let gitStub = sinon.stub(controller.gitHubService,"getUsersRepos");
        gitStub.resolves(repos);

        //Act
        let promise = controller.getUsersReposByPage(user, 1)
        
        //Assert
        promise.should.eventually.deep.equal(endResult).notify(done);
        
    })
    
    //tests getAllUserRepos
    it("should get all user repos", (done) => {
        
        //Arrange
        controller.userArray.push({ user:"user1", repos: [], amtRepoPages: 1 });
        controller.userArray.push({ user:"user2", repos: [], amtRepoPages: 1 });
        controller.userArray.push({ user:"user3", repos: [], amtRepoPages: 1 });

        //mocked repo dataset for getUserRepo stub
        var repos = [
            { name : "one" },
            { name : "two" },
            { name : "three" }
        ];
        
        //result to compare to
        var endResult = [
            {
                user: "user1",
                repos: ["one", "two", "three"],
                amtRepoPages: 1
            },
            {
                user: "user2",
                repos: ["one", "two", "three"],
                amtRepoPages: 1
            },
            {
                user: "user3",
                repos: ["one", "two", "three"],
                amtRepoPages: 1
            }
        ];
        
        
        let gitStub = sinon.stub(controller.gitHubService,"getUsersRepos");
        gitStub.resolves(repos);

        //Act
        var promise = controller.getAllUserRepos()
        
        //Assert
        promise.should.eventually.deep.equal(endResult).notify(done);
        
    })
    
    //tests setUsersRepoPageAmount
    it("should set a users repo page amount", (done) => {
        
        //Arrange

        //mocked repo dataset 
        var user = { 
            name : "one", 
            repos: [], 
            amtRepoPages: 0 
        }
        
        
        //result to compare to
        var endResult = { 
            name : "one", 
            repos: [], 
            amtRepoPages: 3 
        }
        
        
        let gitStub = sinon.stub(controller.gitHubService,"getHeaderForRepos");
        gitStub.resolves(header);

        //Act
        var promise = controller.setUsersRepoPageAmount(user)
        
        //Assert
        promise.should.eventually.deep.equal(endResult).notify(done);
        
    })
    
    //tests setUsersRepoPageAmount
    it("should set all users repo page amounts", (done) => {
        
        //Arrange
        controller.userArray.push({ user:"user1", repos: [], amtRepoPages: 0 });
        controller.userArray.push({ user:"user2", repos: [], amtRepoPages: 0 });
        controller.userArray.push({ user:"user3", repos: [], amtRepoPages: 0 });
        
        
        
        //result to compare to
        var endResult = [
            {
                user: "user1",
                repos: [],
                amtRepoPages: 3
            },
            {
                user: "user2",
                repos: [],
                amtRepoPages: 3
            },
            {
                user: "user3",
                repos: [],
                amtRepoPages: 3
            }
        ];
        
        
        let gitStub = sinon.stub(controller.gitHubService,"getHeaderForRepos");
        gitStub.resolves(header);

        //Act
        var promise = controller.setAllUsersRepoPageAmount()
        
        //Assert
        promise.should.eventually.deep.equal(endResult).notify(done);
        
    })
    
    //getUsersByPage
    it("should get users names by page", (done) => {
        
        //Arrange
        
        //mock data for getUsersForOrganisation
        //result to compare to
        var users = [
            { login: "user1"},
            { login: "user2" },
            { login: "user3" }
        ];
     
        //result to compare to
        var endResult = [
            {
                login: "user1",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user2",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user3",
                repos: [],
                amtRepoPages: 0
            }
        ];
        
        
        let gitStub = sinon.stub(controller.gitHubService,"getUsersForOrganisation");
        gitStub.resolves(users);

        //Act
        var promise = controller.getUsersByPage(1)
        
        //Assert
        promise.should.eventually.deep.equal(endResult).notify(done);
        
    })
    
    
    //getAllUsers
    it("should get all users names", (done) => {
        
        //Arrange
        
        //mock data for getUsersForOrganisation
        //result to compare to
        var users = [
            { login: "user1" },
            { login: "user2" }
        ];
     
        //result to compare to
        //mocked header states 3 pages of users, thus endResult is 3 x users
        var endResult = [
            {
                login: "user1",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user2",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user1",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user2",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user1",
                repos: [],
                amtRepoPages: 0
            },
            {
                login: "user2",
                repos: [],
                amtRepoPages: 0
            }

        ];
        
        
        let gitStub = sinon.stub(controller.gitHubService,"getUsersForOrganisation");
        gitStub.resolves(users);
        
        let gitStubHeader = sinon.stub(controller.gitHubService,"getHeaderForUsers");
        gitStubHeader.resolves(header);

        //Act
        var promise = controller.getAllUsers()
        
        //Assert
        promise.should.eventually.deep.equal(endResult).notify(done);
        
    })
    
    
})
