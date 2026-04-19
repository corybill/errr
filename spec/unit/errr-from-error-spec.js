import Maddox from "maddox";
import util from "node:util";

import Errr from "../../lib/errr.js";
import * as constants from "../../lib/constants.js";
import random from "../random.js";
import { maddoxVitestContext } from "../helpers/maddox-vitest-context.js";

const Scenario = Maddox.functional.FromSynchronousScenario;

class Private {
  static replacer(key, value) {
    return value === undefined ? "undefined" : value;
  }
}

describe("Given the errr module", function () {
  describe("when generating an errr, it", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("should create an error with values set onto the error object using set", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should keep errr internals off enumerable keys so util.inspect does not print them", async (vitestCtx) => {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.error = new Error("base");
            Errr.fromError(context.error)
              .debug({ userId: "user_test" })
              .throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          expect(Object.keys(response)).not.toContain("_allDebugParams_");
          expect(Object.keys(response)).not.toContain("_setValues_");
          expect(Object.keys(response)).not.toContain("set");
          expect(Object.keys(response)).not.toContain("get");
          expect(Object.keys(response)).not.toContain("getAllDebugParams");
          expect(util.inspect(response)).not.toContain("_allDebugParams_");
        });
    });

    it("should create an error without overriding 'set' values", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_ (`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueIf1First);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueIf1First,
            param2: context.uniqueId2
          });
        });
    });

    it("should create an error with values set onto the error object using setAll", async (vitestCtx) => {
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
              .setAll({ param3: context.uniqueId3, param4: context.uniqueId4 }).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response.param3).toEqual(context.uniqueId3);
          expect(response.param4).toEqual(context.uniqueId4);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2,
            param3: context.uniqueId3,
            param4: context.uniqueId4
          });
        });
    });

    it("should create an error without overriding 'setAll' values", async (vitestCtx) => {
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
              .setAll({ param3: context.uniqueId3, param4: context.uniqueId4 })
              .setAll({ param3: context.uniqueId4, param4: context.uniqueId3 }).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response.param3).toEqual(context.uniqueId3);
          expect(response.param4).toEqual(context.uniqueId4);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2,
            param3: context.uniqueId3,
            param4: context.uniqueId4
          });
        });
    });

    it("should create an error including the debug params appended to the stack", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should create an error including the debug params appended to the stack when given values is true", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should create an error NOT including the debug params when given value is false.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(1);
          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should append the new stack trace to the end of the given error.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should append the new stack trace to the end of the given error when there are many errors already appended.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should append values from the 'set' function when using the 'appendTo' function.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError1Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError1Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should not overwrite values passed into the 'set' function for new errors when force is not set.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError1Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError1Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should overwrite values passed into the 'set' function for new errors when force is set.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError3Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError3Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should not overwrite values passed into the 'setAll' function for new errors when force is not set.", async (vitestCtx) => {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .setAll({ param0: context.appendError1Id, param1: context.value1 }).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .setAll({ param0: context.appendError2Id, param2: context.value2 }, false)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .setAll({ param0: context.appendError3Id, param3: context.value3 })
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
              .setAll({ param0: context.value4, param4: context.value4 })
              .debug(context.debugParams).appendTo(context.appendError3).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError1Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError1Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should overwrite values passed into the 'setAll' function for new errors when force is set.", async (vitestCtx) => {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.value1 = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .setAll({ param0: context.appendError1Id, param1: context.value1 }).get();

        context.appendError2Id = random.uniqueId();
        context.value2 = random.uniqueId();
        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .setAll({ param0: context.appendError2Id, param2: context.value2 }, false)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .setAll({ param0: context.appendError3Id, param3: context.value3 }, true)
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
              .setAll({ param0: context.value4, param4: context.value4 })
              .debug(context.debugParams).appendTo(context.appendError3).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError3Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError3Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should turn undefined debug params into strings so they are viewable in the stack.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).toBeUndefined();

          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, Private.replacer, 2)}`;

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to retrieve an array of all the debug params when there is no appendTo err.", async (vitestCtx) => {
      context.setupAppendErrors = function () {};

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
              .debug(context.debugParams).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(1);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(1);

          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);
          expect(response.getAllDebugParams()).toEqual([context.debugParams]);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to retrieve an array of all the debug params.", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);
          expect(response.getAllDebugParams()).toEqual([context.debugParams, context.appendError3DebugParams, context.appendError2DebugParams]);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to retrieve an array of all the debug params when using many appendTo errs in a single errr.", async (vitestCtx) => {
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
        context.appendError2 = Errr.newError(context.appendError2Message).debug(context.appendError2DebugParams).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).debug(context.appendError3DebugParams).get();
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
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).debug(context.debugParams)
              .appendTo(context.appendError3).appendTo(context.appendError2).appendTo(context.appendError1)
              .throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);
          expect(response.getAllDebugParams()).toEqual([context.debugParams, context.appendError3DebugParams, context.appendError2DebugParams]);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to retrieve an array of all the debug params when many appendTo errs don't have debug params.", async (vitestCtx) => {
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
        context.appendError2 = Errr.newError(context.appendError2Message).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).get();
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
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).debug(context.debugParams)
              .appendTo(context.appendError3).appendTo(context.appendError2).appendTo(context.appendError1)
              .throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);
          expect(response.getAllDebugParams()).toEqual([context.debugParams]);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to retrieve an array of all the debug params when using many appendTo errs and the new error doesn't have debug params.", async (vitestCtx) => {
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
        context.appendError2 = Errr.newError(context.appendError2Message).debug(context.appendError2DebugParams).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).debug(context.appendError3DebugParams).get();
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
              .appendTo(context.appendError3).appendTo(context.appendError2).appendTo(context.appendError1)
              .throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);
          expect(response.getAllDebugParams()).toEqual([context.appendError3DebugParams, context.appendError2DebugParams]);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to set a value on the errr instance.", async (vitestCtx) => {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            const errr = Errr.fromError(context.error)
              .set("param1", context.uniqueId1).get();

            errr.set("param2", context.uniqueId2);

            throw errr;
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should not overwrite values passed into the 'set' function on an error instance when force is not set.", async (vitestCtx) => {
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
          .set("param2", context.value2)
          .debug(context.appendError2DebugParams)
          .appendTo(context.appendError1).get();

        context.appendError2.set("param0", context.appendError2Id, false);

        context.appendError3Id = random.uniqueId();
        context.value3 = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;

        context.appendError3 = Errr.newError(context.appendError3Message)
          .set("param3", context.value3)
          .appendTo(context.appendError2).get();

        context.appendError3.set("param0", context.appendError3Id);
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError1Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError1Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should overwrite values passed into the 'set' function on an error instance when force is set.", async (vitestCtx) => {
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
          .set("param3", context.value3)
          .appendTo(context.appendError2).get();

        context.appendError3.set("param0", context.appendError3Id, true);
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param0).toEqual(context.appendError3Id);
          expect(response.param1).toEqual(context.value1);
          expect(response.param2).toEqual(context.value2);
          expect(response.param3).toEqual(context.value3);
          expect(response.param4).toEqual(context.value4);

          expect(response._setValues_).toEqual({
            param0: context.appendError3Id,
            param1: context.value1,
            param2: context.value2,
            param3: context.value3,
            param4: context.value4
          });
        });
    });

    it("should allow you to get a value on the errr instance.", async (vitestCtx) => {
      context.setupEntryPoint = function () {
        context.entryPointObject = {
          run: function () {
            context.uniqueId = random.uniqueId();
            context.message = `[${context.uniqueId}] Some Error`;
            context.error = new Error(context.message);

            context.uniqueId1 = random.uniqueId();
            context.uniqueId2 = random.uniqueId();

            const errr = Errr.fromError(context.error)
              .set("param1", context.uniqueId1).get();

            errr.set("param2", context.uniqueId2);

            throw errr;
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response.get("param1")).toEqual(context.uniqueId1);
          expect(response.get("param2")).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should allow you to append many errors on a single errr instance.", async (vitestCtx) => {
      context.setupAppendErrors = function () {
        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message).get();

        context.appendError2Id = random.uniqueId();

        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message).debug(context.appendError2DebugParams).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message).get();
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
              .appendTo(context.appendError1).appendTo(context.appendError2).appendTo(context.appendError3)
              .debug(context.debugParams).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });

    it("should not overwrite set values when appending many errors on a single errr instance.", async (vitestCtx) => {
      context.setupAppendErrors = function () {
        context.uniqueId4 = random.uniqueId();
        context.uniqueId5 = random.uniqueId();
        context.uniqueId6 = random.uniqueId();
        context.uniqueId7 = random.uniqueId();
        context.uniqueId8 = random.uniqueId();

        context.appendError1Id = random.uniqueId();
        context.appendError1Message = `[${context.appendError1Id}] Some Error 1`;
        context.appendError1 = Errr.newError(context.appendError1Message)
          .set("param1", context.uniqueId4).get();

        context.appendError2Id = random.uniqueId();

        context.appendError2DebugParams = {
          someParam2: random.uniqueId()
        };

        context.appendError2Message = `[${context.appendError2Id}] Some Error 2`;
        context.appendError2 = Errr.newError(context.appendError2Message)
          .set("param1", context.uniqueId5).set("param2", context.uniqueId6)
          .debug(context.appendError2DebugParams).get();

        context.appendError3Id = random.uniqueId();
        context.appendError3Message = `[${context.appendError3Id}] Some Error 3`;
        context.appendError3 = Errr.newError(context.appendError3Message)
          .set("param1", context.uniqueId7).set("param2", context.uniqueId8).get();
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
            context.uniqueId3 = random.uniqueId();

            Errr.fromError(context.error)
              .set("param1", context.uniqueId1).set("param2", context.uniqueId2).set("param3", context.uniqueId3)
              .appendTo(context.appendError1).appendTo(context.appendError2).appendTo(context.appendError3)
              .debug(context.debugParams).throw();
          }
        };
        context.entryPointFunction = "run";
      };

      context.setupAppendErrors();
      context.setupEntryPoint();

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`,
            stringifiedDebugParamsForError2 = `${constants.DebugPrefix}${JSON.stringify(context.appendError2DebugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(4);

          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);
          expect(response.stack.split(stringifiedDebugParamsForError2).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError2)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(context.appendError3)).toBeGreaterThan(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId7);
          expect(response.param2).toEqual(context.uniqueId8);
          expect(response.param3).toEqual(context.uniqueId3);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId7,
            param2: context.uniqueId8,
            param3: context.uniqueId3
          });
        });
    });

    it("should ignore appendTo err if the provided error is undefined.", async (vitestCtx) => {
      context.setupAppendErrors = function () {
        context.appendError1 = undefined;
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(context.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).toEqual(1);
          expect(response.stack.split(stringifiedDebugParams).length).toEqual(2);

          expect(response.stack.indexOf(context.appendError1)).toEqual(-1);
          expect(response.stack.indexOf(stack)).toBeGreaterThan(-1);

          expect(response.message).toEqual(context.message);

          expect(response.param1).toEqual(context.uniqueId1);
          expect(response.param2).toEqual(context.uniqueId2);
          expect(response._setValues_).toEqual({
            param1: context.uniqueId1,
            param2: context.uniqueId2
          });
        });
    });
  });

  describe("when throwing an error from an error, it", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("should throw an error", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(util.format(context.message));
        });
    });
  });

  describe("when returning an error from an error, it", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("should return an error", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).toBeUndefined();

          let stack = `Error: [${context.uniqueId}] Some Error`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(util.format(context.message));
        });
    });

  });

  describe("when throwing an error from a message, it", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("should throw an error", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(util.format(context.message));
        });
    });

    it("should throw an error with template message, it", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (response) {
          let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(util.format(context.message, context.uniqueId));
        });
    });
  });

  describe("when returning an error from a message, it", function () {
    let context;

    beforeEach(function () {
      context = {};
    });

    it("should return an error", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).toBeUndefined();

          let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);

          expect(response.message).toEqual(util.format(context.message));
        });
    });

    it("should return an error with template message", async (vitestCtx) => {
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

      await new Scenario(maddoxVitestContext(vitestCtx))
        .withEntryPoint(context.entryPointObject, context.entryPointFunction)

        .test(function (err, response) {
          expect(err).toBeUndefined();

          let stack = `Error: [${context.uniqueId}] Some Error\n    at FromMessage._build_`;

          expect(response.stack.substring(0, stack.length)).toEqual(stack);
          expect(response.message).toEqual(util.format(context.message, context.uniqueId));
        });
    });
  });
});
