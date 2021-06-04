import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
/*import * as jwt_decode from "jwt-decode";*/
import jwt_decode from "jwt-decode";
@Injectable({
    providedIn: 'root'
})
export class utilService {

    activeBankPanel = new BehaviorSubject(null);
    selectedItems = new Subject<any>();
    constructor() { }


    /**
     * @desc To generate a sessionId token which is of UUID format
     * @returns string sessionId of UUID format
     * @reference Taken from the reference `https://stackoverflow.com/a/105074/5836969`
     */
    // generateSessionId(): string {
    //     function s4() {
    //         return Math.floor((1 + Math.random()) * 0x10000)
    //             .toString(16)
    //             .substring(1);
    //     }
    //     return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    // }

    /**
     * @desc To get the OS name from userAgent string
     * @param  userAgent
     * @returns string
     * @reference Taken from the reference `https://stackoverflow.com/a/18030465`
     */
    getOS(userAgent: string): string {
        var os;
        try {
            if (userAgent.toLowerCase().indexOf("windows") >= 0) {
                os = "Windows";
            } else if (userAgent.toLowerCase().indexOf("mac") >= 0) {
                os = "Mac";
            } else if (userAgent.toLowerCase().indexOf("x11") >= 0) {
                os = "Linux";
            } else if (userAgent.toLowerCase().indexOf("android") >= 0) {
                os = "Android";
            } else if (userAgent.toLowerCase().indexOf("iphone") >= 0) {
                os = "IPhone";
            } else {
                os = "UnKnown, More-Info: " + userAgent;
            }
            return os;
        }
        catch (Error) {
            return "";
        }
    }

    /**
     * @desc To get the Browser name from userAgent string
     * @param   userAgent
     * @returns string
     * @reference Taken from the reference `https://stackoverflow.com/a/18030465`
     */
    getBrowser(userAgent: string): string {
        var user = userAgent.toLowerCase(), browser;
        try {
            if (user.includes("msie")) {
                var substring = userAgent.substring(userAgent.indexOf("MSIE")).split(";")[0];
                browser = substring.split(" ")[0].replace("MSIE", "IE") + "-" + substring.split(" ")[1];
            } else if (user.includes("safari") && user.includes("version")) {
                browser = (userAgent.substring(userAgent.indexOf("Safari")).split(" ")[0]).split("/")[0] + "-" + (userAgent.substring(userAgent.indexOf("Version")).split(" ")[0]).split("/")[1];
            } else if (user.includes("opr") || user.includes("opera")) {
                if (user.includes("opera"))
                    browser = (userAgent.substring(userAgent.indexOf("Opera")).split(" ")[0]).split("/")[0] + "-" + (userAgent.substring(userAgent.indexOf("Version")).split(" ")[0]).split("/")[1];
                else if (user.includes("opr"))
                    browser = ((userAgent.substring(userAgent.indexOf("OPR")).split(" ")[0]).replace("/", "-")).replace("OPR", "Opera");
            } else if (user.includes("chrome")) {
                browser = (userAgent.substring(userAgent.indexOf("Chrome")).split(" ")[0]).replace("/", "-");
            } else if ((user.indexOf("mozilla/7.0") > -1) || (user.indexOf("netscape6") != -1) || (user.indexOf("mozilla/4.7") != -1) || (user.indexOf("mozilla/4.78") != -1) || (user.indexOf("mozilla/4.08") != -1) || (user.indexOf("mozilla/3") != -1)) {
                //browser=(userAgent.substring(userAgent.indexOf("MSIE")).split(" ")[0]).replace("/", "-");
                browser = "Netscape-?";

            } else if (user.includes("firefox")) {
                browser = (userAgent.substring(userAgent.indexOf("Firefox")).split(" ")[0]).replace("/", "-");
            } else if (user.includes("rv")) {
                browser = "IE-" + user.substring(user.indexOf("rv") + 3, user.indexOf(")"));
            } else {
                browser = "UnKnown, More-Info: " + userAgent;
            }
            return browser;
        }
        catch (Error) {
            return "";
        }
    }

    /**
     * @desc To decode JWT token
     * @param   token
     * @returns any
     */
    decodeJWTToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }

    /**
     * @desc To set an item in local storage (key, value) pair
     * @param   key
     * @param   value
     * @returns void
     */
    setItemInLocalStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    /**
     * @desc To get an item from localstorage based on passed key
     * @param   key
     * @returns any
     */
    getItemFromLocalStorage(key: string): any {
        try {
            return localStorage.getItem(key);
        }
        catch (Error) {
            return null;
        }
    }

    /**
     * @desc To remove an item from localstorage based on passed key
     * @param   key
     * @returns void
     */
    removeItemFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * @description To get Active Bank Account Panel in Accordion
     * @returns string [value of userAccountID]
     */
    getActiveBankPanel(): BehaviorSubject<string> {
        return this.activeBankPanel;
    }

    /**
     * @description To set Active Bank Account Panel in Accordion
     * @returns void
     */
    setActiveBankPanel(activeBankPanel): void {
        this.activeBankPanel.next(activeBankPanel);
    }

    searchElement(array, searchValue, key?) {
        let res = array.filter((elem) => {
            if (key) {
                elem = elem[key];
            }
            elem = elem.toLowerCase();
            searchValue = searchValue.toLowerCase();
            return elem.includes(searchValue);
        });
        return res;
    }

    searchElementBasedOnFilter(array, searchValue, filterValue, filterProperty, key?) {
        let res = array;
        if (filterValue) {
            res = array.filter(elem => {
                return elem[filterProperty] == filterValue;
            });
        }
        if (key) {
            res = this.searchElement(res, searchValue, key)
        }
        res = res.filter((elem) => {
            if (key) {
                elem = elem[key];
            }
            elem = elem.toLowerCase();
            searchValue = searchValue.toLowerCase();
            return elem.includes(searchValue);
        });
        return res;
    }

    searchString(string, searchValue) {
        return string.includes(searchValue);
    }

}
/**
 * This function is used to replace all the matched string with the replacemnet text
 */
/* replaceAll(target, search, replacement) {
   return target.replace(new RegExp(search, 'g'), replacement);
}*/