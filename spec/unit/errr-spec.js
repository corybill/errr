"use strict";

const Maddox = require("maddox"),
  chai = require("chai"),
  util = require("util");

const Errr = require("../../lib/errr"),
  constants = require("../../lib/constants"),
  random = require("../random");

const Scenario = Maddox.functional.FromSynchronousScenario,
  expect = chai.expect;

describe("Errr", function () {
  describe("When throwing an error", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("it should throw an error", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            Errr.newError(context.message).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message));
          done();
        });
    });

    it("it should throw an error with template message", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            Errr.newError(context.message, context.uniqueId).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should throw an error including the debug params appended to the stack", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should throw an error including the debug params appended to the stack when given values is true", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams, true).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should throw an error NOT including the debug params when given value is false.", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams, false).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(1);
          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should append the new stack trace to the end of the given error.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error`;
        context.appendError1 = Errr.newError(context.appendError1Message).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams).appendTo(context.appendError1).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
          expect(response.stack.split(stringifiedDebugParams).length).eql(2);

          expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should append the new stack trace to the end of the given error when there are many errors already appended.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message).get();

        context.appendError2Id = random.uniqueId();

        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message).debug(context.appendError2DebugParams).appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams).appendTo(context.appendError3).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

          expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
          expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });
  });

  describe("When returning an error", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("it should throw an error", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            return Errr.newError(context.message).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message));
          done();
        });
    });

    it("it should throw an error with template message", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            return Errr.newError(context.message, context.uniqueId).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should throw an error including the debug params appended to the stack", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            return Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should throw an error including the debug params appended to the stack when given values is true", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            return Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams, true).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should throw an error NOT including the debug params when given value is false.", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            return Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams, false).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).eql(1);
          expect(response.stack.substring(0, stack.length)).eql(stack);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should append the new stack trace to the end of the given error.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error`;
        context.appendError1 = Errr.newError(context.appendError1Message).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            return Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams).appendTo(context.appendError1).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
          expect(response.stack.split(stringifiedDebugParams).length).eql(2);

          expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });

    it("it should append the new stack trace to the end of the given error when there are many errors already appended.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message).get();

        context.appendError2Id = random.uniqueId();

        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message).debug(context.appendError2DebugParams).appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = "[%s] Some Error";
            context.debugParams = {
              someParam: random.uniqueId()
            };

            return Errr.newError(context.message, context.uniqueId)
              .debug(context.debugParams).appendTo(context.appendError3).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).eql(undefined);

          let stack = `Error: [${context.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

          expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
          expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
          expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
          expect(response.stack.indexOf(stack)).to.be.above(-1);

          expect(response.message).eql(util.format(context.message, context.uniqueId));
          done();
        });
    });
  });
});
