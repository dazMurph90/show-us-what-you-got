import BossHog from "../BossHog";
import sinon from "sinon";
import { expect } from "chai";

describe("BossHog", () => {
    let bosshog;
    let consoleLogSpy;

    beforeEach(() => {
        bosshog = new BossHog();
        
        consoleLogSpy = new sinon.spy(console, "log");
    });
    
     afterEach(() => {
        consoleLogSpy.restore();
    });
    
    
    it("Constructor should init bosshogs logger attribute", () => {
        //Arrange
        const message = "hello world";

        //Act
        bosshog.logger.log(message);

        //Assert
        expect(console.log.calledWith(message)).to.be.equal(true);
    })

    
    it("A number divisable by 3 and 5 should return 'BossHog'", () => {
        //Arrange
        const message = "BossHog";
        var res;

        //Act
        res = bosshog.get(15)

        //Assert
        expect(res).to.be.equal(message);
    });
    
    
    it("A number divisable by 3 should return 'Boss'", () => {
        //Arrange
        const message = "Boss";
        var res;

        //Act
        res = bosshog.get(6)

        //Assert
        expect(res).to.be.equal(message);
    });
    
    
    it("A number divisable by 5 should return 'Hog'", () => {
        //Arrange
        const message = "Hog";
        var res;

        //Act
        res = bosshog.get(10)

        //Assert
        expect(res).to.be.equal(message);
    });
    
    
    it("A number not divisibly by 5 or 3 should return a number > 0 and <= 100",() => {
        //Arrange
        const val = 2;
        var res;

        //Act
        res = bosshog.get(2)

        //Assert
        expect(res).to.be.equal(val);
        expect(res).to.be.within(1,100);
    });

    
});