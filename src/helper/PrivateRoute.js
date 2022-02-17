import React, { useEffect, useContext, useCallback } from 'react';

/* Plugin */
import { Route } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
//import 'sweetalert2/src/sweetalert2.scss'

/* Helper */
import { getCookie, eraseCookie } from '../helper/UtilityFunction';
import { isNotError, setCookie } from '../helper/UtilityFunction';

/* Icon */
import warnIcon from '../icon/warn.svg';

/* Store */
import {
    AuthContext
} from '../store/AuthContext'

import {
    MercuryContext
} from '../store/MercuryContext'

/* Component */
import LoginPage from '../page/LoginPage'

/* API */
import MercuryAPI from '../api/MercuryAPI'

const mercuryAPI = new MercuryAPI();

function verifyToken() {
    return new Promise(function (resolve, reject) {
        axios.request({
            method: "get",
            url: process.env.REACT_APP_JASMINE_OAUTH_JAS_AUTHEN_ME,
            headers: {
                Authorization: 'Bearer ' + getCookie('accessToken')
            }
        }).then(
            (response) => {
                //console.log('token verify Success !!!! ==> response : ', response);
                //not have app userLoginData
                //resolve(response.data[0]);

                //have app userLoginData
                mercuryAPI.authorizationMe().then(data => {
                    if (isNotError(data)) {
                        resolve({jasUserLoginData : response.data[0], appUserLoginData : data});
                    }
                })
                
            }
        ).catch(
            (error) => {
                console.log('token verify Error !!!! ==> error.response : ', error.response);
                if (error.response) {
                    /*
                     * The request was made and the server responded with a
                     * status code that falls out of the range of 2xx
                     */
                    if (error.response.status === 401) {
                        eraseCookie('accessToken');

                        
                    }
                } else if (error.request) {
                    /*
                     * The request was made but no response was received, `error.request`
                     * is an instance of XMLHttpRequest in the browser and an instance
                     * of http.ClientRequest in Node.js
                     */
                    console.log(error.request);

                } else {
                    // Something happened in setting up the request and triggered an Error
                    console.log('Error', error.message);

                }
                console.log(error.config);
                reject('User not logged in');
            }
        );
    });
}




function PrivateRoute({ component: Component, ...rest }) {

    const {
        isAuthenticated,
        loginSuccess,
        loginFail,
        logoutSuccess
    } = useContext(AuthContext);

    const {
        setUserLoginData
    } = useContext(MercuryContext);

    const stableLoginSuccess = useCallback(loginSuccess, []); 
    const stableLoginFail = useCallback(loginFail, []); 
    const stableLogoutSuccess = useCallback(logoutSuccess, []);

    const urlJasLogin = process.env.REACT_APP_JASMINE_OAUTH_JAS_LOGIN_URI + "?response_type=code&client_id=" + process.env.REACT_APP_JASMINE_OAUTH_CLIENT_ID + "&redirect_uri=" + process.env.REACT_APP_JASMINE_OAUTH_REDIRECT_URI + "&scope=user-information";

    useEffect(() => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let code = params.get('code');
        window.history.replaceState({},'', window.location.origin + window.location.pathname);

        if (getCookie('accessToken') === null && !code) {
            console.log('Access Token Not Found !!!');
            stableLoginFail();
        } else {
            if(code){
                mercuryAPI.getAccessToken(code).then((result1) => {
                    if(result1){
                        setCookie('accessToken', result1.accessToken , 6);
                        verifyToken().then((result2) => {
                            setUserLoginData(result2.appUserLoginData);
                            stableLoginSuccess();
                            //window.history.replaceState({},'', window.location.origin + window.location.pathname);
                        }, (error) => {
                            stableLoginFail();
                        });
                    }
                })
            }
            else{
                verifyToken().then((result2) => {
                    setUserLoginData(result2.appUserLoginData);
                    stableLoginSuccess();
                    //window.history.replaceState({},'', window.location.origin + window.location.pathname);
                }, (error) => {
                    stableLoginFail();

                    Swal.fire({
                        imageUrl: warnIcon,
                        imageWidth: 128,
                        imageHeight: 128,
                        imageAlt: 'warning',
                        //title: 'HTTP Status ' + error.response.status + ' ' + error.response.statusText,
                        //title: '<div style="color:#8e0000;">ไม่มีสิทธ์เข้าใช้งาน</div>',
                        //text: 'ERROR CODE '+error.response.data.errCode+' ผู้ใช้งานไม่มีสิทธ์เข้าใช้งาน หรือ ปัจจุบันผู้ใช้งาน Login เกินเวลาที่กำหนด กรุณา Login เข้าใช้งานใหม่อีกครั้ง',
                        html: 
                        '<div style="text-align: left;">'+
                            '<div style="text-align: left;color:#8e0000;">'+
                                'ผู้ใช้งานไม่มีสิทธ์เข้าใช้งาน หรือ ปัจจุบันผู้ใช้งาน Login เกินเวลาที่กำหนด กรุณา Login เข้าใช้งานใหม่อีกครั้ง'+
                            '</div>'+
                        '</div>',
                        confirmButtonText: 'รับทราบ',
                        confirmButtonColor: '#1f8f6b',
                        // footer: 
                        // '<div style="text-align: right;font-size:10px;margin-top:18px;">'+
                        //     'ERROR CODE '+error.response.data.errCode+
                        // '</div>',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = urlJasLogin;
                        }
                    })
                });
            }
        }
    },  [stableLoginFail, stableLoginSuccess, stableLogoutSuccess]);

    return (
        <Route 
            {...rest} 
            render={(props) => 
                isAuthenticated === true ? (
                    <Component {...props} />
                ) : (
                    <LoginPage {...props} />
                )
            }
        />
    );
}

export default PrivateRoute;