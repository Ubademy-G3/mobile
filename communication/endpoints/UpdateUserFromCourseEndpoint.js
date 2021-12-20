import {Endpoint} from "./Endpoint.js";

function serializeQuery(params, prefix) {
    const query = Object.keys(params).map((key) => {
      const value  = params[key];

      if (params.constructor === Array)
        key = `${prefix}[]`;
      else if (params.constructor === Object)
        key = (prefix ? `${prefix}[${key}]` : key);
  
      if (typeof value === 'object')
        return serializeQuery(value, key);
      else
        return `${key}=${encodeURIComponent(value)}`;
    });
  
    return [].concat.apply([], query).join('&');
}

export class UpdateUserFromCourseEndpoint extends Endpoint {
    constructor(courseId, userId, query) {
        super(courseId, userId, query);
        console.log("entro al constructor:", courseId, userId);
        this._course_id = courseId;
        this._user_id = userId;
        this._query = query;
        console.log("salgo del constructor:", this._course_id, this._user_id);
    }

    url() {
        let url = `/courses/${this._course_id}/users/${this._user_id}`;
        const params = serializeQuery(this._query);
        if (params.length > 0) {
            url = url.concat(`?${params}`);
        }
        return url;
    }
    
    method() {
        return 'PATCH'
    }

    needsAuthorization() {
        return true;
    }
}
