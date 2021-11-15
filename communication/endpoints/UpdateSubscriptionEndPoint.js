import {Endpoint} from "./Endpoint.js";
//import { UpdateSubscriptionSuccessful } from "../responses/subscription/UpdateSubscriptionSuccesfull.js";

export class UpdateSubscriptionEndpoint extends Endpoint {
    constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._id = props;
        console.log("salgo del constructor:", this._id);
    }
    
    url() {
        return `/users/${this._id}`
    }

    /*ownResponses() {
        return [UpdateSubscriptionSuccessful];
    }*/

    method() {
        return 'PATCH'
    }

    needsAuthorization() {
        return true;
    }
}