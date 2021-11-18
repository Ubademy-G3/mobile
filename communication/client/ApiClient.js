import {ServerErrorResponse} from "../responses/generalResponses/ServerErrorResponse.js";
import {GetProfileEndpoint} from "../endpoints/GetProfileEndpoint.js";
import {LoginEndpoint} from "../endpoints/LoginEndpoint";
import { SignUpEndpoint } from "../endpoints/SignUpEndpoint.js";
import { ResetPasswordEndpoint } from "../endpoints/ResetPasswordEndpoint.js";
import { EditProfileEndpoint } from '../endpoints/EditProfileEndpoint'
import { SearchBySubscriptionEndpoint } from "../endpoints/SearchBySubscription.js";
import { GetAllCoursesEndpoint } from "../endpoints/GetAllCoursesEndpoint.js";
import { CreateCourseEndpoint } from "../endpoints/CreateCourseEndpoint.js";

class ApiClient {
    constructor(requester, onServerErrorDo = () => {
    }) {
        this._requester = requester;
        this._handleServerError = onServerErrorDo;
        this._handleResponse = this._handleResponse.bind(this);
    }

    _handleResponse(response, onResponse) {
        if (response instanceof ServerErrorResponse) {
            console.log("Server error: ", response);
            return this._handleServerError(response);
        }

        return onResponse(response);
    }

    login(data, onResponse) {
        return this._requester.call({
            endpoint: new LoginEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }
    
    signup(data, onResponse) {
        return this._requester.call({
            endpoint: new SignUpEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    resetPassword(data, onResponse) {
        return this._requester.call({
            endpoint: new ResetPasswordEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getProfile(data, userId, onResponse) {
        return this._requester.call({
            endpoint: new GetProfileEndpoint(userId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    editProfile(data, userId, onResponse) {
        return this._requester.call({
            endpoint: new EditProfileEndpoint(userId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    searchCourseBySubscription(data, subscription, onResponse) {
        return this._requester.call({
            endpoint: new SearchBySubscriptionEndpoint(subscription),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllCourses(data, onResponse) {
        return this._requester.call({
            endpoint: new GetAllCoursesEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    createCourse(data, onResponse) {
        return this._requester.call({
            endpoint: new CreateCourseEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }
}

export default ApiClient;