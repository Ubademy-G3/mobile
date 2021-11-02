import Requester from "../communication/requester/Requester";
import ApiClient from "../communication/client/ApiClient";
import {getSetting} from "../Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

class App {
    constructor() {
        this._apiClient = undefined;
    }

    apiClient() {
        if (this._apiClient === undefined) {
            this._setUpApiClient();
        }

        return this._apiClient;
    }

    _setUpApiClient() {
        const requester = new Requester( getSetting("apiUrl"));
        this._apiClient = new ApiClient(requester);
    }

    loginUser(token) {
        /*AsyncStorage.setItem("@storageMobile:token", token)
        .then(() => {
                console.warn("Guardo token: ", token);
            })
            .catch((error) => {
                console.warn("Local store error", error);
            });*/
    }

    thereIsLoggedInUser() {
        /*AsyncStorage.getItem("@storageMobile:token")
            .then((jsonString) => {
                const jsonResponse = jsonString === null ? "" : JSON.parse(jsonString);
            })
            .catch((error) => {
                console.warn("Local fetch error", error);
            }); 
        return ({age: jsonResponse.toString()});*/
    }
}

export let app = new App();