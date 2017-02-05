import fs from 'fs'

class AuthManager {
    
    constructor(){
        
    }
    
    //get api key from file external to source tree as to not upload it to GH.
    getAuth(apiName){
        var obj = JSON.parse(fs.readFileSync('D:/OAuth_Keys.txt', 'utf8'));
        return obj[apiName]
    }
}

module.exports = AuthManager;