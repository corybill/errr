"use strict";

var Chance = require("chance");

var chance = new Chance();

module.exports = {
  uniqueId: function () {
    return chance.hash({length: 24});
  },
  zip: function () {
    return chance.zip();
  },
  firstName: function () {
    return chance.first();
  },
  lastName: function () {
    return chance.last();
  },
  word: function (len) {
    return chance.word({length: len || 5});
  },
  sentence: function (len) {
    return chance.sentence({words: len || 5});
  },
  date: function () {
    return chance.date();
  }
};
