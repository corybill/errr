"use strict";

var Maddox = require("maddox"),
  chai = require("chai");

var Errr = require("../../lib/"),
  random = require("../random"),
  constants = require("../../lib/constants");

var Scenario = Maddox.functional.FromSynchronousScenario,
  expect = chai.expect;

describe("Err", function () {
  describe("When throwing an error", function () {
    beforeEach(function () {
      this.setupEntryPoint = function () {
        this.entryPointObject = this.errr;
        this.entryPointFunction = "throw";
      };
    });

    it("it should throw an error", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = `[${this.uniqueId}] Some Error`;
        this.errr = Errr.newError(this.message);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error with template message", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.errr = Errr.newError(this.message, this.uniqueId);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error including the debug params appended to the stack", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error including the debug params appended to the stack when given values is true", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams, true);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error NOT including the debug params when given value is false.", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams, false);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(1);
          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should append the new stack trace to the end of the given error.", function (done) {
      this.setupAppendErrors = function () {
        this.appendError1Id = random.uniqueId();
        this.appendError1Message = `[${this.appendError1Id}] Some Error`;
        this.appendError1 = Errr.newError(this.appendError1Message).get();
      };
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams).appendTo(this.appendError1);
      };

      this.setupAppendErrors();
      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
          expect(response.stack.split(stringifiedDebugParams).length).eql(2);

          expect(response.stack.indexOf(this.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);
          done();
        }.bind(this));
    });

    it("it should append the new stack trace to the end of the given error when there are many errors already appended.", function (done) {
      this.setupAppendErrors = function () {
        this.appendError1Id = random.uniqueId();
        this.appendError1Message = `[${this.appendError1Id}] Some Error 1`;
        this.appendError1 = Errr.newError(this.appendError1Message).get();

        this.appendError2Id = random.uniqueId();

        this.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        this.appendError2Message = `[${this.appendError2Id}] Some Error 2`;
        this.appendError2 = Errr.newError(this.appendError2Message).debug(this.appendError2DebugParams).appendTo(this.appendError1).get();

        this.appendError3Id = random.uniqueId();
        this.appendError3Message = `[${this.appendError3Id}] Some Error 3`;
        this.appendError3 = Errr.newError(this.appendError3Message).appendTo(this.appendError2).get();
      };
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams).appendTo(this.appendError3);
      };

      this.setupAppendErrors();
      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (response) {
          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(this.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

          expect(response.stack.indexOf(this.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(this.appendError2)).to.be.above(-1);
          expect(response.stack.indexOf(this.appendError3)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);
          done();
        }.bind(this));
    });
  });

  describe("When returning an error", function () {
    beforeEach(function () {
      this.setupEntryPoint = function () {
        this.entryPointObject = this.errr;
        this.entryPointFunction = "get";
      };
    });

    it("it should throw an error", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = `[${this.uniqueId}] Some Error`;
        this.errr = Errr.newError(this.message);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error with template message", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.errr = Errr.newError(this.message, this.uniqueId);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error including the debug params appended to the stack", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error including the debug params appended to the stack when given values is true", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams, true);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error NOT including the debug params when given value is false.", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams, false);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(1);
          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error when appending the new error to the end of the given error.", function (done) {
      this.setupAppendErrors = function () {
        this.appendError1Id = random.uniqueId();
        this.appendError1Message = `[${this.appendError1Id}] Some Error`;
        this.appendError1 = Errr.newError(this.appendError1Message).get();
      };
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams).appendTo(this.appendError1);
      };

      this.setupAppendErrors();
      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.indexOf(stack)).to.be.above(-1);
          done();
        }.bind(this));
    });

    it("it should append the new stack trace to the end of the given error when there are many errors already appended.", function (done) {
      this.setupAppendErrors = function () {
        this.appendError1Id = random.uniqueId();
        this.appendError1Message = `[${this.appendError1Id}] Some Error 1`;
        this.appendError1 = Errr.newError(this.appendError1Message).get();

        this.appendError2Id = random.uniqueId();

        this.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        this.appendError2Message = `[${this.appendError2Id}] Some Error 2`;
        this.appendError2 = Errr.newError(this.appendError2Message).debug(this.appendError2DebugParams).appendTo(this.appendError1).get();

        this.appendError3Id = random.uniqueId();
        this.appendError3Message = `[${this.appendError3Id}] Some Error 3`;
        this.appendError3 = Errr.newError(this.appendError3Message).appendTo(this.appendError2).get();
      };
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.debugParams = {
          someParam: random.uniqueId()
        };

        this.errr = Errr.newError(this.message, this.uniqueId)
          .debug(this.debugParams).appendTo(this.appendError3);
      };

      this.setupAppendErrors();
      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) {
          if (err) {
            expect(err).to.be.undefined; //eslint-disable-line
            expect(err.stack).to.be.undefined; // eslint-disable-line
          }

          var stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(this.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

          expect(response.stack.indexOf(this.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(this.appendError2)).to.be.above(-1);
          expect(response.stack.indexOf(this.appendError3)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);
          done();
        }.bind(this));
    });
  });
});
