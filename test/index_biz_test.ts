import {assert} from "chai";
import IndexBiz from "../src/index/index_biz";

describe('IndexBiz', () => {
   describe('sumTwoDigits', () => {
       it('Should produce the sum of two digits', () => {
           const sumA = IndexBiz.sumTwoDigits(3.6,5);
           assert.equal(sumA, 8.6);

           const sumB = IndexBiz.sumTwoDigits(3.5, 10);
           assert.notEqual(sumB, 8.6);
           assert.equal(sumB, 13.5);
       })
   })
});