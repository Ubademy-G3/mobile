import {ServerErrorResponse} from "../responses/generalResponses/ServerErrorResponse.js";
import {GetProfileEndpoint} from "../endpoints/GetProfileEndpoint.js";
import {LoginEndpoint} from "../endpoints/LoginEndpoint";
import { SignUpEndpoint } from "../endpoints/SignUpEndpoint.js";
import { ResetPasswordEndpoint } from "../endpoints/ResetPasswordEndpoint.js";
import { EditProfileEndpoint } from '../endpoints/EditProfileEndpoint'
import { SearchCoursesEndpoint } from "../endpoints/SearchCoursesEndpoint";
import { GetAllCoursesEndpoint } from "../endpoints/GetAllCoursesEndpoint.js";
import { CreateCourseEndpoint } from "../endpoints/CreateCourseEndpoint.js";
import { SubscribeToCourseEndpoint } from "../endpoints/SubscribeToCourseEndpoint.js";
import { GetAllUsersInCourseEndpoint } from "../endpoints/GetAllUsersInCourse.js";
import { GetAllCategoriesEndpoint } from "../endpoints/GetAllCategoriesEndpoint.js";
import { UnsubscribeToCourseEndpoint } from "../endpoints/UnsubscribeToCourseEndpoint.js";
import { GetCourseRatingEndpoint } from "../endpoints/GetCourseRatingEndpoint";
import { CreateExamEndpoint } from "../endpoints/CreateExamEndpoint.js";
import { CreateQuestionEndpoint } from "../endpoints/CreateQuestionEndpoint.js";
import { GetAllCoursesByUserEndpoint } from "../endpoints/GetAllCoursesByUserEndpoint.js";
import { GetCourseByIdEndpoint } from "../endpoints/GetCourseByIdEndpoint.js";
import { GetCategoryByIdEndpoint } from "../endpoints/GetCategoryByIdEndpoint.js";
import { GetAllExamsByCourseIdEndpoint } from "../endpoints/GetAllExamsByCourseIdEndpoint.js";


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

    searchCourse(data, searchKey, keyType, onResponse) {
        return this._requester.call({
            endpoint: new SearchCoursesEndpoint(searchKey, keyType),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getCourseById(data, id, onResponse){
        return this._requester.call({
            endpoint: new GetCourseByIdEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllCoursesByUser(data, id, aprobalState, onResponse) {
        return this._requester.call({
            endpoint: new GetAllCoursesByUserEndpoint(id, aprobalState),
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
    
    createExam(data, onResponse) {
        return this._requester.call({
            endpoint: new CreateExamEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    createQuestion(data, examId, onResponse) {
        return this._requester.call({
            endpoint: new CreateQuestionEndpoint(examId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllExamsByCourseId(data, courseId, onResponse) {
        return this._requester.call({
            endpoint: new GetAllExamsByCourseIdEndpoint(courseId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    subscribeCourse(data, courseId, onResponse) {
        return this._requester.call({
            endpoint: new SubscribeToCourseEndpoint(courseId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    unsubscribeCourse(data, courseId, userId, onResponse) {
        return this._requester.call({
            endpoint: new UnsubscribeToCourseEndpoint(courseId, userId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getCourseRating(data, courseId, onResponse){
        return this._requester.call({
            endpoint: new GetCourseRatingEndpoint(courseId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        })
    }

    getAllUsersInCourse(data, courseId, userType, onResponse) {
        return this._requester.call({
            endpoint: new GetAllUsersInCourseEndpoint(courseId, userType),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllCategories(data, onResponse) {
        return this._requester.call({
            endpoint: new GetAllCategoriesEndpoint(),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getCategoryById(data, id, onResponse) {
        return this._requester.call({
            endpoint: new GetCategoryByIdEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }
}

export default ApiClient;