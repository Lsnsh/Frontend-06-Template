var assert = require('assert');
// var add = require('../add.js');
import { add, mul } from '../add.js';

describe('add function testing', function () {
  it('1+2 should be 3', function () {
    assert.strictEqual(add(1, 2), 3);
  });
  it('-2+3 should be 1', function () {
    assert.strictEqual(add(-2, 3), 1);
  });
});

describe('mul function testing', function () {
  it('2*3 should be 6', function () {
    assert.strictEqual(mul(2, 3), 6);
  });
});
