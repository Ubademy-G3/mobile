import {Endpoint} from "./Endpoint.js";

export class DeleteModuleEndpoint extends Endpoint {
    constructor(courseId, moduleId) {
        super(courseId, moduleId);
        console.log("entro al constructor:", courseId, moduleId);
        this._course_id = courseId;
        this._module_id = moduleId;
        console.log("salgo del constructor:", this._course_id, this._module_id);
    }

    url() {
        return `/courses/${this._course_id}/modules/${this._module_id}`
    }
    
    method() {
        return 'DELETE'
    }

    needsAuthorization() {
        return true;
    }
}