import request from "request";

class Http {
    constructor(overrideRequest) {
        this.request = overrideRequest || request;
    }

    get(url) {
        let requestOptions = {
            url,
            headers: {
                "User-Agent": "request"
            }
        };

        return new Promise((resolve, reject) => {
            this.request.get(requestOptions, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    //console.log(response.headers.link)
                    resolve(JSON.parse(body));
                } else {
                    reject(JSON.stringify(response));
                }
            });
        });
    }
    
     getHeader(url) {
        let requestOptions = {
            url,
            headers: {
                "User-Agent": "request"
            }
        };

        return new Promise((resolve, reject) => {
            this.request.get(requestOptions, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(response.headers);
                } else {
                    reject(JSON.stringify(response));
                }
            });
        });
    }
    
}

module.exports = Http;