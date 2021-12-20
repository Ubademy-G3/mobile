import {Endpoint} from "./Endpoint.js";

export class GetMediaByModuleEndpoint extends Endpoint {
    constructor(course_id,module_id) {
        super(course_id,module_id);
        console.log("entro al constructor:", course_id, module_id);
        this._course_id = course_id;
        this._module_id = module_id;
        console.log("salgo del constructor:", this._course_id, this._module_id);
    }
    
    url() {
        return `/courses/${this._course_id}/media/module/${this._module_id}`
    }

    method() {
        return 'GET'
    }

    needsAuthorization() {
        return true;
    }
}