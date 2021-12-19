import { ServerErrorResponse } from "../responses/generalResponses/ServerErrorResponse.js";
import { GetProfileEndpoint } from "../endpoints/GetProfileEndpoint.js";
import { LoginEndpoint } from "../endpoints/LoginEndpoint";
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
import { GetAllQuestionsByExamIdEndpoint } from "../endpoints/GetAllQuestionsByExamIdEndpoint.js";
import { GetQuestionByIdEndpoint } from "../endpoints/GetQuestionByIdEndpoint.js";
import { CreateNewExamSolutionEndpoint } from "../endpoints/CreateNewExamSolutionEndpoint.js";
import { CreateNewExamAnswerEndpoint } from "../endpoints/CreateNewExamAnswerEndpoint.js";
import { UpdateQuestionEndpoint } from "../endpoints/UpdateQuestionEndpoint.js";
import { DeleteQuestionEndpoint } from "../endpoints/DeleteQuestionEndpoint.js";
import { CreateNewModuleEndpoint } from "../endpoints/CreateNewModuleEndpoint.js";
import { UpdateModuleEndpoint } from "../endpoints/UpdateModuleEndpoint.js";
import { DeleteModuleEndpoint } from "../endpoints/DeleteModuleEndpoint.js";
import { UpdateExamEndpoint } from "../endpoints/UpdateExamEndpoint.js";
import { GetExamByIdEndpoint } from "../endpoints/GetExamByIdEndpoint.js";
import { GetUserByEmailEndpoint } from "../endpoints/GetUserByEmailEndpoint.js";
import { AddMediaEndpoint } from "../endpoints/AddMediaEndpoint";
import { DeleteMediaEndpoint } from "../endpoints/DeleteMediaEndpoint";
import { GetCourseMetricsEndpoint } from "../endpoints/GetCourseMetricsEndpoint.js";
import { GetWalletByIdEndpoint } from "../endpoints/GetWalletByIdEndpoint.js";
import { CreateWalletEndpoint } from "../endpoints/CreateWalletEndpoint.js";
import { MakeDepositEndpoint } from "../endpoints/MakeDepositEndpoint.js";
import { GetAllSolutionsByExamIdEndpoint } from "../endpoints/GetAllSolutionsByExamIdEndpoint.js";
import { GetAllAnswersByExamIdEndpoint } from "../endpoints/GetAllAnswersByExamIdEndpoint.js";
import { UpdateSolutionEndpoint } from "../endpoints/UpdateSolutionEndpoint.js";
import { UpdateAnswerEndpoint } from "../endpoints/UpdateAnswerEndpoint.js";
import { GetModuleByIdEndpoint } from "../endpoints/GetModuleByIdEndpoint.js";
import { GetMediaByModuleEndpoint } from "../endpoints/GetMediaByModuleEndpoint.js";
import { UpdateCourseEndpoint } from "../endpoints/UpdateCourseEndpoint.js";
import { GetSolvedExamsByUserEndpoint } from "../endpoints/GetSolvedExamsByUserEndpoint";
import { GetSolvedExamsByCourseEndpoint } from "../endpoints/GetSolvedExamsByCourseEndpoint";
import { GetAllModulesByCourseIdEndpoint } from "../endpoints/GetAllModulesByCourseIdEndpoint";
import { GetAllMediaByCourseIdEndpoint } from "../endpoints/GetAllMediaByCourseIdEndpoint";
import { UpdateUserFromCourseEndpoint } from "../endpoints/UpdateUserFromCourseEndpoint.js";

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

    getUsersByEmail(data, email, onResponse) {
        return this._requester.call({
            endpoint: new GetUserByEmailEndpoint(email),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    updateUserFromCourse(data, courseId, userId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateUserFromCourseEndpoint(courseId, userId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    searchCourse(data, query, onResponse) {
        return this._requester.call({
            endpoint: new SearchCoursesEndpoint(query),
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

    getAllCoursesByUser(data, id, aprobalState, userType, onResponse) {
        return this._requester.call({
            endpoint: new GetAllCoursesByUserEndpoint(id, aprobalState, userType),
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

    updateCourse(data, courseId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateCourseEndpoint(courseId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getCourseMetrics(data, courseId, onResponse) {
        return this._requester.call({
            endpoint: new GetCourseMetricsEndpoint(courseId),
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

    updateExam(data, examId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateExamEndpoint(examId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getExamsById(data, examId, onResponse) {
        return this._requester.call({
            endpoint: new GetExamByIdEndpoint(examId),
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

    updateQuestion(data, examId, questionId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateQuestionEndpoint(examId, questionId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    deleteQuestion(data, examId, questionId, onResponse) {
        return this._requester.call({
            endpoint: new DeleteQuestionEndpoint(examId, questionId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllExamsByCourseId(data, courseId, params, onResponse) {
        return this._requester.call({
            endpoint: new GetAllExamsByCourseIdEndpoint(courseId, params),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllQuestionsByExamId(data, examId, onResponse) {
        return this._requester.call({
            endpoint: new GetAllQuestionsByExamIdEndpoint(examId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getQuestionById(data, examId, questionId, onResponse) {
        return this._requester.call({
            endpoint: new GetQuestionByIdEndpoint(questionId, examId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    createNewExamSolution(data, examId, onResponse) {
        return this._requester.call({
            endpoint: new CreateNewExamSolutionEndpoint(examId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllSolutionsByExamId(data, examId, onResponse) {
        return this._requester.call({
            endpoint: new GetAllSolutionsByExamIdEndpoint(examId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    updateSolution(data, examId, solutionId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateSolutionEndpoint(examId, solutionId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    createNewExamAnswer(data, examId, solutionId, onResponse) {
        return this._requester.call({
            endpoint: new CreateNewExamAnswerEndpoint(examId, solutionId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getAllAnswersByExamId(data, examId, solutionId, onResponse) {
        return this._requester.call({
            endpoint: new GetAllAnswersByExamIdEndpoint(examId, solutionId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    updateAnswer(data, examId, solutionId, answerId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateAnswerEndpoint(examId, solutionId, answerId),
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

    getAllUsersInCourse(data, courseId, params, onResponse) {
        return this._requester.call({
            endpoint: new GetAllUsersInCourseEndpoint(courseId, params),
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

    createNewModule(data, courseId, onResponse) {
        return this._requester.call({
            endpoint: new CreateNewModuleEndpoint(courseId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getModuleById(data, courseId, moduleId, onResponse){
        return this._requester.call({
            endpoint: new GetModuleByIdEndpoint(courseId, moduleId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getMediaByModule(data, courseId, moduleId, onResponse){
        return this._requester.call({
            endpoint: new GetMediaByModuleEndpoint(courseId, moduleId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    updateModule(data, courseId, moduleId, onResponse) {
        return this._requester.call({
            endpoint: new UpdateModuleEndpoint(courseId, moduleId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    deleteModule(data, courseId, moduleId, onResponse) {
        return this._requester.call({
            endpoint: new DeleteModuleEndpoint(courseId, moduleId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    addMedia(data, courseId, onResponse) {
        return this._requester.call({
            endpoint: new AddMediaEndpoint(courseId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }
    getWalletById(data, id, onResponse) {
        return this._requester.call({
            endpoint: new GetWalletByIdEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    deleteMediaFromCourse(data, courseId, mediaId, onResponse) {
        return this._requester.call({
            endpoint: new DeleteMediaEndpoint(courseId, mediaId),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }
    createWallet(data, id, onResponse) {
        return this._requester.call({
            endpoint: new CreateWalletEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    makeDeposit(data, id, onResponse) {
        return this._requester.call({
            endpoint: new MakeDepositEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        });
    }

    getSolvedExamsByUser(data, id, params, onResponse) {
        return this._requester.call({
            endpoint: new GetSolvedExamsByUserEndpoint(id, params),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        })
    }

    getSolvedExamsByCourse(data, id, params, onResponse) {
        return this._requester.call({
            endpoint: new GetSolvedExamsByCourseEndpoint(id, params),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        })
    }

    getAllModules(data, id, onResponse) {
        return this._requester.call({
            endpoint: new GetAllModulesByCourseIdEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        })
    }

    getAllMedia(data, id, onResponse) {
        return this._requester.call({
            endpoint: new GetAllMediaByCourseIdEndpoint(id),
            onResponse: (response) => this._handleResponse(response, onResponse),
            data: data
        })
    }
}

export default ApiClient;