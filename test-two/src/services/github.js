import Url from "url";
import QueryString from "querystring";

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
    
    getHeaderForRepos(username){
        return this.http.getHeader(`${this.baseUrl}users/${username}/repos?${this.authenticationQueryString}`)
    }
    
    getUsersRepos(username,pageNumber){
        return this.http.get(`${this.baseUrl}users/${username}/repos?page=${pageNumber}&${this.authenticationQueryString}`);
    }
    

    
    //extracts amount of pages for users from the API response header
    getAmountOfPagesFromHeader(header){
        //API stores amount of pages in response headers 'link' field
        //amount of pages is in the query parameters of link where rel="last"
        
        //if header.link is not present, only 1 page exists
        if(header.link){
            var array = header.link.split(',') //split field into first and last links

            var link = Url.parse(array[1]) //parse url as to access query

            var query = QueryString.parse(link.query) //parse query to access pages param

            return parseInt(query.page[0]) //amount is first char in param
        }
        else{
            return 1
        }
    } 
}

module.exports = GitHubService;