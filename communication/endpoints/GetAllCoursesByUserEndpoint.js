import {Endpoint} from "./Endpoint.js";

export class GetAllCoursesByUserEndpoint extends Endpoint {
    /*constructor(props) {
        super(props);
        console.log("entro al constructor:", props);
        this._id = props;
        console.log("salgo del constructor:", this._id);
    }

    url() {
        return `/users/${this._id}/courses`
    }*/
    constructor(userId, aprobalState) {
        super(userId, aprobalState);
        console.log("entro al constructor:", userId, aprobalState);
        this._user_id = userId;
        this._aprobal_state = aprobalState;
        console.log("salgo del constructor:", this._user_id, this._aprobal_state);
    }
    url() {
        if(this._aprobal_state === undefined) return `/users/${this._user_id}/courses`;
        return `/users/${this._user_id}/courses?aprobal_state=${this._aprobal_state}`
    }
    /*ownResponses() {
        //return [GetProfileSuccessful];
    }*/

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}