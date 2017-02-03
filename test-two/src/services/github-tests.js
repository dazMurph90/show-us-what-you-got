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

    const organisationId = "facebook";

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

    beforeEach(() => {
        http = new Http();
        httpGetStub = sinon.stub(http, 'get');
    });

    afterEach(() => {
        httpGetStub.restore();
    });

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
    
    it("getPagesFromHeader() should return a number > 0", () => {
        
        //Arrange
        var header = { 
                server: 'GitHub.com',
              date: 'Fri, 03 Feb 2017 03:15:10 GMT',
              'content-type': 'application/json; charset=utf-8',
              'content-length': '26077',
              connection: 'close',
              status: '200 OK',
              'x-ratelimit-limit': '5000',
              'x-ratelimit-remaining': '4519',
              'x-ratelimit-reset': '1486091934',
              'cache-control': 'private, max-age=60, s-maxage=60',
              vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding',
              etag: '"1d9abc0c51f2248fa050992b535e0ab1"',
              'x-oauth-scopes': 'admin:gpg_key, admin:org, admin:org_hook, admin:public_key, admin:repo_hook, delete_repo, gist, notifications, repo, user',
              'x-accepted-oauth-scopes': 'admin:org, read:org, repo, user, write:org',
              'x-github-media-type': 'github.v3; format=json',
              link: '<https://api.github.com/organizations/538264/members?access_token=7205415229dde6380cde71ff8c6cfcb6144f34cc&page=2>; rel="next", <https://api.github.com/organizations/538264/members?access_token=7205415229dde6380cde71ff8c6cfcb6144f34cc&page=3>; rel="last"',
              'access-control-expose-headers': 'ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval',
              'access-control-allow-origin': '*',
              'content-security-policy': 'default-src \'none\'',
              'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
              'x-content-type-options': 'nosniff',
              'x-frame-options': 'deny',
              'x-xss-protection': '1; mode=block',
              'x-served-by': '2d7a5e35115884240089368322196939',
              'x-github-request-id': 'C6D5:19ED7:AA46E8F:DCC0F9C:5893F5BE'
        }
        
        //Act
        var res = gitHubService.getAmountOfPagesFromHeader(header)

        //Assert
        expect(res).to.be.a('Number')
        expect(res).to.be.above(-1)
    
        
        
    })
});