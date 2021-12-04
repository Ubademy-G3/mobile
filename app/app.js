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

    loginUser = async (token, id) => {
        const jsonValue = JSON.stringify(token);
        const jsonValue2 = JSON.stringify(id);
        try {
            await AsyncStorage.setItem("@storageMobile:token", jsonValue);
            await AsyncStorage.setItem("@storageMobile:id", jsonValue2);
            console.log("Guardo token: ", token);
            console.log("Guardo id: ", id);
          } catch(e) {
                console.warn("Local storage setItem error", e);
          }
    }

    getToken = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@storageMobile:token")
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.warn("Local storage getItem error", e);
        }
    }

    getId = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("@storageMobile:id")
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            console.warn("Local storage getItem error", e);
        }
    }

    signOutUser = async () => {
        try {
            await AsyncStorage.removeItem("@storageMobile:token")
        } catch(e) {
            console.warn("Local storage signOut error", e);
        }
        try {
            await AsyncStorage.removeItem("@storageMobile:id")
        } catch(e) {
            console.warn("Local storage signOut error", e);
        }
    }
}

export let app = new App();