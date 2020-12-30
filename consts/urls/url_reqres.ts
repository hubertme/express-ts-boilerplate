export default class URLReqres {
    private static readonly baseUrl = 'https://reqres.in/api';
    static readonly GET_SINGLE_USER = URLReqres.baseUrl + '/users/10';
    static readonly CREATE_USER = URLReqres.baseUrl + '/users';
}
