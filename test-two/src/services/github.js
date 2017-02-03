class GitHubService {
    constructor(baseUrl, http, apiAuthenticationToken) {
        this.baseUrl = baseUrl;
        this.http = http;
        this.apiAuthenticationToken = apiAuthenticationToken;
        this.authenticationQueryString = "";
        if (this.apiAuthenticationToken !== "") {
            this.authenticationQueryString = "access_token=" + this.apiAuthenticationToken;
        }
    }

    getUsersForOrganisation(organisationId,pageNumber) {
        return this.http.get(`${this.baseUrl}orgs/${organisationId}/members?page=${pageNumber}&${this.authenticationQueryString}`);
        
    }
    
    getHeaderForUsers(organisationId){
        return this.http.getHeader(`${this.baseUrl}orgs/${organisationId}/members?${this.authenticationQueryString}`);
    }
    
    getUsersRepos(username){
        return this.http.get(`${this.baseUrl}users/${username}/repos?per_page=100&${this.authenticationQueryString}`);
    }
    
    
    
}

module.exports = GitHubService;