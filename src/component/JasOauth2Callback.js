import React, {Component} from "react";

/* Helper */
import { setCookie } from '../helper/UtilityFunction';

class JasOauth2Callback extends Component {

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        try {
            this.getToken();
        } 
        catch (e) {
            console.log(e);
            alert(e)
        }
    }

    componentWillUnmount() {
    
    }

    updateWindowDimensions() {
       
    }

    getToken() {
        let url = document.location.href;
        //let urlparts = url.split('#'); //for BrowserRouter
        let urlparts = url.split('#/'); //for HashRouter

        //console.log('url : ', url);
        //console.log('urlparts : ', urlparts);


        if (urlparts.length >= 2) {
            let baseURL = urlparts[0];
            //let paramsURL = urlparts[1]; //for BrowserRouter
            //let paramsURL = urlparts[2]; //for HashRouter
            let paramsURL = urlparts[1]; //for HashRouter fix problem

            //window.history.pushState('', document.title, baseURL);

            //console.log('baseURL : ', baseURL);
            //console.log('paramsURL : ', paramsURL)

            let paramArray = paramsURL.split('&');
            let paramObj = {};
            //console.log('paramArray : ', paramArray);
            //console.log('paramObj : ', paramObj);



            paramArray.forEach(function (element, index) {
                let key_value = element.split('=');
                let key = decodeURIComponent(key_value[0]);
                //console.log('key : ', key);
                if (!(typeof key_value[1] === 'undefined' || key_value[1] === null)) {
                    paramObj[key] = key_value[1];
                } else {
                    paramObj[key] = '';
                }
            });

            //console.log('paramObj : ', paramObj);

            //console.log('this is ACCESS TOKEN : ', paramObj.access_token);

            //localStorage['accessToken'] = paramObj.access_token;

            setCookie('accessToken', paramObj.access_token, 6);

            //04/08/2021
            ///window.opener.postMessage({loginStatus : "SUCCESS"}, "*");
            //window.location.replace(baseURL);
            window.history.replaceState({},'', window.location.origin);

            //window.close();
        }
    }

    render() {
        return (
            <div>
                <p>Finishing authentication...</p>
            </div>        
        )
    }
}

export default JasOauth2Callback;