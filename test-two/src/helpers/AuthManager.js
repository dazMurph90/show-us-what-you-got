import fs from 'fs'

class AuthManager {
    
    constructor(){
        
    }
    
    getAuth(apiName){
        var obj = JSON.parse(fs.readFileSync('D:/OAuth_Keys.txt', 'utf8'));
        return obj[apiName]
    }
}

module.exports = AuthManager;