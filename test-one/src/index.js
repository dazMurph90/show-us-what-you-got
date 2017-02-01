import Logger from './helpers/logger';

let logger = new Logger();

//Your code should go here instead of the welcome message below. Create and modify additional files as necessary.

for(var i = 1; i<=100; i++){
    
    if(i % 5 == 0 && i % 3 == 0){
        //divisible by 5 and 3
        logger.log('BossHog')
    }
    else if(i % 5 == 0){
        //divisible by 5
        logger.log('Hog')
    }
    else if(i % 3 == 0){
        //divisible by 3
        logger.log('Boss')
    }
    else{
        //not divisble by either 5 or 3
        logger.log(i)
    }
}
