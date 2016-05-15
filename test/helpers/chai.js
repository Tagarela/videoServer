/**
 * set up chai as our assertion library
 */
var chai = require('chai');
chai.config.includeStack = true;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
