import Logger from "./logger";
import sinon from "sinon";
import { expect } from "chai";

describe("logger", () => {
    let logger;
    let consoleLogSpy;

    beforeEach(() => {
        logger = new Logger();

        consoleLogSpy = new sinon.spy(console, "log");
    });

    afterEach(() => {
        consoleLogSpy.restore();
    });

    it("should log message", () => {
        //Arrange
        const message = "hello world";

        //Act
        logger.log(message);

        //Assert
        expect(console.log.calledWith(message)).to.be.equal(true);
    });
    
});