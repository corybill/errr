"use strict";

const Maddox = require("maddox"),
  chai = require("chai"),
  util = require("util");

const Errr = require("../../lib/errr"),
  constants = require("../../lib/constants"),
  random = require("../random");

const Scenario = Maddox.functional.FromSynchronousScenario,
  expect = chai.expect;

class Private {
  static replacer(key, value) {
    return (util.isUndefined(value)) ? "undefined" : value;
  }
}

describe("when generating", function () {
  describe("any error", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("it should create an error with values set onto the error object using set", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run`;

            expect(response.stack.substring(0, stack.length)).eql(stack);
            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should create an error without overriding 'set' values", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;

            context.uniqueIf1First = random.uniqueId();
            context.error = Errr.newError(context.message).set("param1", context.uniqueIf1First).get();

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2)
              .set("param1", context.uniqueId2).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_ (/Users/corybil`;

            expect(response.stack.substring(0, stack.length)).eql(stack);
            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueIf1First);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueIf1First,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should create an error with values set onto the error object using setAll", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();
            context.uniqueId3 = random.uniqueId();
            context.uniqueId4 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2)
              .setAll({param3: context.uniqueId3, param4: context.uniqueId4}).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run`;

            expect(response.stack.substring(0, stack.length)).eql(stack);
            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response.param3).eql(context.uniqueId3);
            expect(response.param4).eql(context.uniqueId4);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2,
              param3: context.uniqueId3,
              param4: context.uniqueId4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should create an error without overriding 'setAll' values", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();
            context.uniqueId3 = random.uniqueId();
            context.uniqueId4 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).set("param1", context.uniqueId2)
              .setAll({param3: context.uniqueId3, param4: context.uniqueId4})
              .setAll({param3: context.uniqueId4, param4: context.uniqueId3}).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run`;

            expect(response.stack.substring(0, stack.length)).eql(stack);
            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response.param3).eql(context.uniqueId3);
            expect(response.param4).eql(context.uniqueId4);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2,
              param3: context.uniqueId3,
              param4: context.uniqueId4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should create an error including the debug params appended to the stack", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).debug(context.debugParams).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should create an error including the debug params appended to the stack when given values is true", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).debug(context.debugParams, true).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should create an error NOT including the debug params when given value is false.", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).debug(context.debugParams, false).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

            expect(response.stack.split(stringifiedDebugParams).length).eql(1);
            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
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
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2)
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
            expect(response.stack.split(stringifiedDebugParams).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
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
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2)
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should append values from the 'set' function when using the 'appendTo' function.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .set("param0", context.appendError1Id)
          .set("param1", context.value1).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .set("param0", context.appendError2Id)
          .set("param2", context.value2)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .set("param0", context.appendError3Id)
          .set("param3", context.value3)
          .appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.value4 = random.uniqueId();

            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param0", context.value4)
              .set("param4", context.value4)
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param0).eql(context.appendError1Id);
            expect(response.param1).eql(context.value1);
            expect(response.param2).eql(context.value2);
            expect(response.param3).eql(context.value3);
            expect(response.param4).eql(context.value4);

            expect(response._setValues_).eql({
              param0: context.appendError1Id,
              param1: context.value1,
              param2: context.value2,
              param3: context.value3,
              param4: context.value4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should not overwrite values passed into the 'set' function for new errors when force is not set.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .set("param0", context.appendError1Id)
          .set("param1", context.value1).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .set("param0", context.appendError2Id, false)
          .set("param2", context.value2)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .set("param0", context.appendError3Id)
          .set("param3", context.value3)
          .appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.value4 = random.uniqueId();

            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param0", context.value4)
              .set("param4", context.value4)
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param0).eql(context.appendError1Id);
            expect(response.param1).eql(context.value1);
            expect(response.param2).eql(context.value2);
            expect(response.param3).eql(context.value3);
            expect(response.param4).eql(context.value4);

            expect(response._setValues_).eql({
              param0: context.appendError1Id,
              param1: context.value1,
              param2: context.value2,
              param3: context.value3,
              param4: context.value4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should overwrite values passed into the 'set' function for new errors when force is set.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .set("param0", context.appendError1Id)
          .set("param1", context.value1).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .set("param0", context.appendError2Id, false)
          .set("param2", context.value2)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .set("param0", context.appendError3Id, true)
          .set("param3", context.value3)
          .appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.value4 = random.uniqueId();

            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param0", context.value4)
              .set("param4", context.value4)
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param0).eql(context.appendError3Id);
            expect(response.param1).eql(context.value1);
            expect(response.param2).eql(context.value2);
            expect(response.param3).eql(context.value3);
            expect(response.param4).eql(context.value4);

            expect(response._setValues_).eql({
              param0: context.appendError3Id,
              param1: context.value1,
              param2: context.value2,
              param3: context.value3,
              param4: context.value4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should not overwrite values passed into the 'setAll' function for new errors when force is not set.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .setAll({param0: context.appendError1Id, param1: context.value1}).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .setAll({param0: context.appendError2Id, param2: context.value2}, false)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .setAll({param0: context.appendError3Id, param3: context.value3})
          .appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.value4 = random.uniqueId();

            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .setAll({param0: context.value4, param4: context.value4})
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param0).eql(context.appendError1Id);
            expect(response.param1).eql(context.value1);
            expect(response.param2).eql(context.value2);
            expect(response.param3).eql(context.value3);
            expect(response.param4).eql(context.value4);

            expect(response._setValues_).eql({
              param0: context.appendError1Id,
              param1: context.value1,
              param2: context.value2,
              param3: context.value3,
              param4: context.value4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should overwrite values passed into the 'setAll' function for new errors when force is set.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .setAll({param0: context.appendError1Id, param1: context.value1}).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .setAll({param0: context.appendError2Id, param2: context.value2}, false)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .setAll({param0: context.appendError3Id, param3: context.value3}, true)
          .appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.value4 = random.uniqueId();

            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .setAll({param0: context.value4, param4: context.value4})
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);

            expect(response.param0).eql(context.appendError3Id);
            expect(response.param1).eql(context.value1);
            expect(response.param2).eql(context.value2);
            expect(response.param3).eql(context.value3);
            expect(response.param4).eql(context.value4);

            expect(response._setValues_).eql({
              param0: context.appendError3Id,
              param1: context.value1,
              param2: context.value2,
              param3: context.value3,
              param4: context.value4
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should turn undefined debug params into strings so they are viewable in the stack.", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);

            context.debugParams = {
              undefinedParam: undefined,
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            return Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2)
              .debug(context.debugParams).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          try {
            expect(err).eql(undefined);

            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, Private.replacer, 2)}`;

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(context.message);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should allow you to retrieve an array of all the debug params.", function (done) {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message).get();

        context.appendError2Id = random.uniqueId();

        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError3DebugParams = {
          someParam3: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message).debug(context.appendError2DebugParams).appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).debug(context.appendError3DebugParams).appendTo(context.appendError2).get();
      };

      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            context.debugParams = {
              someParam: random.uniqueId()
            };

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2)
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run (`,
              stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
              stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

            expect(response.stack.split(constants.StackTraceDelimiter).length).eql(4);

            expect(response.stack.split(stringifiedDebugParams).length).eql(2);
            expect(response.stack.split(stringifiedDebugParamsForError2).length).eql(2);

            expect(response.stack.indexOf(context.appendError1)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError2)).to.be.above(-1);
            expect(response.stack.indexOf(context.appendError3)).to.be.above(-1);
            expect(response.stack.indexOf(stack)).to.be.above(-1);

            expect(response.message).eql(context.message);
            expect(response.getAllDebugParams()).eql([context.debugParams, context.appendError3DebugParams, context.appendError2DebugParams]);

            expect(response.param1).eql(context.uniqueId1);
            expect(response.param2).eql(context.uniqueId2);
            expect(response._setValues_).eql({
              param1: context.uniqueId1,
              param2: context.uniqueId2
            });

            done();
          } catch (testError) {
            done(testError);
          }
        });
    });
  });

  describe("when throwing an error from an error", function () {
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
            context.error = new Error(context.message);
            Errr.fromError(context.error).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run`;

            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(util.format(context.message));
            done();
          } catch (testError) {
            done(testError);
          }
        });
    });
  });

  describe("when returning an error from an error", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("it should return an error", function (done) {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);
            return Errr.fromError(context.error).get();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      new Scenario()
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          try {
            expect(err).eql(undefined);

            let stack = `Error: [${context.uniqueId}] Some Error\n    at Object.context.entryPointObject.run`;

            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(util.format(context.message));
            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

  });

  describe("when throwing an error from a message", function () {
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(util.format(context.message));
            done();
          } catch (testError) {
            done(testError);
          }
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
          try {
            let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

            expect(response.stack.substring(0, stack.length)).eql(stack);
            expect(response.message).eql(util.format(context.message, context.uniqueId));
            done();
          } catch (testError) {
            done(testError);
          }
        });
    });
  });

  describe("when returning an error from a message", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("it should return an error", function (done) {
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
          try {
            expect(err).eql(undefined);

            let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

            expect(response.stack.substring(0, stack.length)).eql(stack);

            expect(response.message).eql(util.format(context.message));
            done();
          } catch (testError) {
            done(testError);
          }
        });
    });

    it("it should return an error with template message", function (done) {
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
          try {
            expect(err).eql(undefined);

            let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

            expect(response.stack.substring(0, stack.length)).eql(stack);
            expect(response.message).eql(util.format(context.message, context.uniqueId));
            done();
          } catch (testError) {
            done(testError);
          }
        });
    });
  });
});
