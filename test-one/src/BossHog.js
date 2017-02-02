import Logger from "./helpers/logger";

class BossHog {
    constructor(){
        this.logger = new Logger()
    }
    
    run(){
        for(var i = 1; i<=100; i++){
            this.logger.log(this.get(i))
        }
    }
    
    get(i){
        if(i % 5 == 0 && i % 3 == 0){
            //divisible by 5 and 3
            //logger.log('BossHog')

            return "BossHog"
        }
        else if(i % 5 == 0){
            //divisible by 5
            return "Hog"
            //logger.log('Hog')
        }
        else if(i % 3 == 0){
            //divisible by 3
            return "Boss"
            //logger.log('Boss')
        }
        else{
            //not divisble by either 5 or 3
            return i
            //logger.log(i)
        }
    }
}

module.exports = BossHog;