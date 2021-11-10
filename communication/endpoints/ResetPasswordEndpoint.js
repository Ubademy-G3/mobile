import {Endpoint} from "./Endpoint.js";
//import {SignUpSuccessful} from "../responses/signup/SignUpSuccessful";
//import {InvalidCredentials} from "../responses/login/InvalidCredentials";

export class ResetPasswordEndpoint extends Endpoint {
    static url() {
        return '/authentication/password'
    }

    ownResponses() {
        //return [SignUpSuccessful, InvalidCredentials];
    }

    method() {
        return 'POST'
    }

    needsAuthorization() {
        return false;
    }
}