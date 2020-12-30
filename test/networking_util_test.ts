import {assert} from "chai";
import {fail} from "assert";
import NetworkingUtil from "../utils/networking_util";
import URLReqres from "../consts/urls/url_reqres";

describe('NetworkingUtil', () => {
    describe('Basic Request', () => {
        it('Send basic GET request', async () => {
            try {
                const resp = await NetworkingUtil.get(URLReqres.GET_SINGLE_USER);
                console.log('GET request:', resp);

                assert.isNotNull(resp.headers);
                assert.isNotNull(resp.data);
            } catch (e) {
                fail('Exception occurred');
            }
        });

        it('Send basic POST request', async () => {
            try {
                const data = {
                    'name': 'Albert Test',
                    'job': 'Musician',
                    'foo': 12.93,
                    'bar': false,
                }
                const resp = await NetworkingUtil.post(URLReqres.CREATE_USER, data);
                console.log('POST request:', resp);

                assert.isNotNull(resp.headers);
                assert.isNotNull(resp.data);
            } catch (e) {
                fail('Exception occurred');
            }
        })
    })
});
