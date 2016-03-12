"use strict";

const Maddox = require("maddox"),
  chai = require("chai");

const Errr = require("../../lib/"),
  random = require("../random"),
  constants = require("../../lib/constants");

const Scenario = Maddox.functional.FromSynchronousScenario,
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
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error with templated message", function (done) {
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
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

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
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
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
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
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
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
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

        .test(function (response) {
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
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

        .test(function (err, response) { // eslint-disable-line
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

          expect(response.stack.substring(0, stack.length)).eql(stack);
          done();
        }.bind(this));
    });

    it("it should throw an error with templated message", function (done) {
      this.setupErrr = function () {
        this.uniqueId = random.uniqueId();
        this.message = "[%s] Some Error";
        this.errr = Errr.newError(this.message, this.uniqueId);
      };

      this.setupErrr();
      this.setupEntryPoint();

      new Scenario()
        .withEntryPoint(this.entryPointObject, this.entryPointFunction)

        .test(function (err, response) { // eslint-disable-line
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `;

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

        .test(function (err, response) { // eslint-disable-line
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
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

        .test(function (err, response) { // eslint-disable-line
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
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

        .test(function (err, response) { // eslint-disable-line
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
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

        .test(function (err, response) { // eslint-disable-line
          let stack = `Error: [${this.uniqueId}] Some Error\n    at ErrorBuilder._build_ `,
            stringifiedDebugParams = `${constants.DebugPrefix}${JSON.stringify(this.debugParams, null, 2)}`;

          expect(response.stack.split(constants.StackTraceDelimiter).length).eql(2);
          expect(response.stack.split(stringifiedDebugParams).length).eql(2);
          expect(response.stack.indexOf(stack)).to.be.above(-1);
          done();
        }.bind(this));
    });
  });
});
