import GitHubService from "./github";
import Http from "./../helpers/http";
import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonAsPromised from "sinon-as-promised";
import { expect } from "chai";

let should = chai.should();

chai.use(chaiAsPromised);

describe("github service", () => {
    const baseGitHubUrl = "https://api.github.com/";

    let gitHubService;
    let http;
    let httpGetStub;

    const organisationId = "uber";

    const userData = [
        {
            userId: "one"
        },
        {
            userId: "two"
        },
        {
            userId: "three"
        }
    ];
    
    const header = { 
            server: 'GitHub.com',
            date: 'Fri, 03 Feb 2017 03:15:10 GMT',
            'content-type': 'application/json; charset=utf-8',
            link: '<https://api.github.com/organizations/538264/members?access_token=6fe9ec8b072c895adf40b1d9db487fb827bb4522&page=2>; rel="next", <https://api.github.com/organizations/538264/members?access_token=6fe9ec8b072c895adf40b1d9db487fb827bb4522&page=3>; rel="last"'
    }
    
    const userRepos = [
        {
            name: "repo1"
        },
        {
            name: "repo2"
        },
        {
            name: "repo3"
        }
    ]

    beforeEach(() => {
        http = new Http();
        httpGetStub = sinon.stub(http, 'get');
    });

    afterEach(() => {
        httpGetStub.restore();
    });

    //tests getUsersForOrganisation
    it("should return users for organisation", (done) => {
        //Arrange
        httpGetStub.resolves(userData);

        gitHubService = new GitHubService(baseGitHubUrl, http, "");

        //Act
        let promise = gitHubService.getUsersForOrganisation(organisationId);

        //Assert
        promise.should.eventually.deep.equal(userData).notify(done);
    });

    it("should append authentication parameter to url", () => {
        //Arrange
        const secret = "secret";

        httpGetStub.resolves(userData);

        gitHubService = new GitHubService(baseGitHubUrl, http, secret);

        //Act
        gitHubService.getUsersForOrganisation(organisationId);

        //Assert
        httpGetStub.getCall(0).args[0].endsWith("access_token=" + secret).should.equal(true);
    });

    it("should prepend base url to url", () => {
        //Arrange
        const secret = "secret";

        httpGetStub.resolves(userData);

        gitHubService = new GitHubService(baseGitHubUrl, http, secret);

        //Act
        gitHubService.getUsersForOrganisation(organisationId);

        //Assert
        httpGetStub.getCall(0).args[0].startsWith(baseGitHubUrl).should.equal(true);
    });
    
    //tests getPagesFromHeader
    it("getPagesFromHeader() should return a number > 0", () => {
        
        //Arrange
        
        
        //Act
        var res = gitHubService.getAmountOfPagesFromHeader(header)

        //Assert
        expect(res).to.be.a('Number')
        expect(res).to.be.above(-1)

    })
    
    //tests getHeaderForUsers
    it("should return the header from api request for getUsersForOrganisaion", (done) => {
        //Arrange
        httpGetStub = sinon.stub(http, 'getHeader');

        httpGetStub.resolves(header);

        gitHubService = new GitHubService(baseGitHubUrl, http, "");

        //Act
        let promise = gitHubService.getHeaderForUsers(organisationId);

        //Assert
        //header will not include 'link' property if only one page exists
        promise.should.eventually.deep.equal(header).notify(done);
    });
    
    //tests getHeaderForRepos
    it("should return the header from api request for getUserRepos", (done) => {
        //Arrange
        httpGetStub = sinon.stub(http, 'getHeader');

        httpGetStub.resolves(header);

        gitHubService = new GitHubService(baseGitHubUrl, http, "");

        //Act
        let promise = gitHubService.getHeaderForRepos("sectioneight");

        //Assert
        //header will not include 'link' property if only one page exists
        promise.should.eventually.deep.equal(header).notify(done);
    });
    
    //tests getUsersRepos
    it("should return a users repos",(done) => {
        //arrange
        httpGetStub.resolves(userRepos)
        gitHubService = new GitHubService(baseGitHubUrl, http, "");
        
        //act
        let promise = gitHubService.getUsersRepos("sectioneight",1);
        
        promise.should.eventually.deep.equal(userRepos).notify(done);
        
    });
    
    
    
});