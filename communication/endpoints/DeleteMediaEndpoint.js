import {Endpoint} from "./Endpoint.js";

export class DeleteMediaEndpoint extends Endpoint {
    constructor(courseId, mediaId) {
        super(courseId, mediaId);
        console.log("entro al constructor:", courseId, mediaId);
        this._course_id = courseId;
        this._media_id = mediaId;
        console.log("salgo del constructor:", this._course_id, this._media_id);
    }

    url() {
        return `/courses/${this._course_id}/media/${this._media_id}`
    }
    
    method() {
        return 'DELETE'
    }

    needsAuthorization() {
        return true;
    }
}