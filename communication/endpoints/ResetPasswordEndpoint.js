import {Endpoint} from "./Endpoint.js";

export class ResetPasswordEndpoint extends Endpoint {
    static url() {
        return '/authentication/password'
    }

    method() {
        return 'POST'
    }

    needsAuthorization() {
        return false;
    }
}