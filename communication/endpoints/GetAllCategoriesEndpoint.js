import {Endpoint} from "./Endpoint.js";

export class GetAllCategoriesEndpoint extends Endpoint {
    url() {
        return `/categories`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}