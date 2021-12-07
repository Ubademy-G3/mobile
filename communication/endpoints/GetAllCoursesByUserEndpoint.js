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
    constructor(userId, aprobalState, userType) {
        super(userId, aprobalState);
        console.log("entro al constructor:", userId, aprobalState, userType);
        this._user_id = userId;
        this._aprobal_state = aprobalState;
        this._user_type = userType;
        console.log("salgo del constructor:", this._user_id, this._aprobal_state, this._user_type);
    }
    url() {
        if((this._aprobal_state === undefined) && (this._user_type === undefined)) return `/users/${this._user_id}/courses`;
        if(this._user_type === undefined) return `/users/${this._user_id}/courses?aprobal_state=${this._aprobal_state}`
        if(this._aprobal_state === undefined) return `/users/${this._user_id}/courses?user_type=${this._user_type}`
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