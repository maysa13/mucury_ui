import React, { useState, useContext, useEffect, useCallback } from "react"

/* Plugin */
import NewWindow from "react-new-window";
import { Layout, Button, Row, Col} from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'

/* Helper */
import { getCookie, eraseCookie } from '../helper/UtilityFunction';
import { isNotError, setCookie } from '../helper/UtilityFunction';

/*Image*/
// import jasLogo from "../icon/jaslogo.gif";
import logoDtac from "../icon/logoDtac.jpeg";
/* Icon */
import warnIcon from '../icon/warn.svg';
import errorIcon from '../icon/cancel.png';

/* Store */
import {
    AuthContext
} from '../store/AuthContext'

import {
    MercuryContext
} from '../store/MercuryContext'

/* API */
import MercuryAPI from '../api/MercuryAPI'

const mercuryAPI = new MercuryAPI();

function LoginPage() {

    const [loginWindowOpened, setLoginWindowOpened] = useState(false);

    const {
        setUserLoginData
    } = useContext(MercuryContext);

    const {
        logoutJasWindowOpened,
        closeLogoutJasWindow,
        isAuthenticated,
        loginSuccess,
        loginFail,
        logoutSuccess
    } = useContext(AuthContext);

    const stableLoginSuccess = useCallback(loginSuccess, []); 
    const stableLoginFail = useCallback(loginFail, []); 
    const stableLogoutSuccess = useCallback(logoutSuccess, []);

    
    //onst urlJasLogin = process.env.REACT_APP_JASMINE_OAUTH_JAS_LOGIN_URI + "?response_type=token&client_id=" + process.env.REACT_APP_JASMINE_OAUTH_CLIENT_ID + "&redirect_uri=" + process.env.REACT_APP_JASMINE_OAUTH_REDIRECT_URI + "&scope=user-information";
    const urlJasLogin = process.env.REACT_APP_JASMINE_OAUTH_JAS_LOGIN_URI + "?response_type=code&client_id=" + process.env.REACT_APP_JASMINE_OAUTH_CLIENT_ID + "&redirect_uri=" + process.env.REACT_APP_JASMINE_OAUTH_REDIRECT_URI + "&scope=user-information";
    const urlJasLogout =  process.env.REACT_APP_JASMINE_OAUTH_JAS_LOGOUT_URI;

    const newWindowUnloaded = () => {
        setLoginWindowOpened(false);
        closeLogoutJasWindow();
    };

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
                        else{
                            Swal.fire({
                                imageUrl: errorIcon,
                                imageWidth: 128,
                                imageHeight: 128,
                                imageAlt: 'error',
                                //title: '<div style="color:#8e0000;">พบข้อผิดพลาดระหว่างใช้งาน</div>',
                                html: 
                                '<div style="text-align: left;">'+
                                    '<div style="text-align: left;color:#8e0000;">'+
                                        error+
                                    '</div>'+
                                '</div>',
                                showConfirmButton: false,
                                showCancelButton: false,
                                showDenyButton: true,
                                denyButtonText: 'ปิดหน้าต่าง',
                                allowEscapeKey: false,
                                allowOutsideClick: false
                            })
                        }
                    } else if (error.request) {
                        /*
                         * The request was made but no response was received, `error.request`
                         * is an instance of XMLHttpRequest in the browser and an instance
                         * of http.ClientRequest in Node.js
                         */
                        console.log(error.request);
                        Swal.fire({
                            imageUrl: errorIcon,
                            imageWidth: 128,
                            imageHeight: 128,
                            imageAlt: 'error',
                            //title: '<div style="color:#8e0000;">พบข้อผิดพลาดระหว่างใช้งาน</div>',
                            html: 
                            '<div style="text-align: left;">'+
                                '<div style="text-align: left;color:#8e0000;">'+
                                    error+
                                '</div>'+
                            '</div>',
                            showConfirmButton: false,
                            showCancelButton: false,
                            showDenyButton: true,
                            denyButtonText: 'ปิดหน้าต่าง',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        })
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                        Swal.fire({
                            imageUrl: errorIcon,
                            imageWidth: 128,
                            imageHeight: 128,
                            imageAlt: 'error',
                            //title: '<div style="color:#8e0000;">พบข้อผิดพลาดระหว่างใช้งาน</div>',
                            html: 
                            '<div style="text-align: left;">'+
                                '<div style="text-align: left;color:#8e0000;">'+
                                    error+
                                '</div>'+
                            '</div>',
                            showConfirmButton: false,
                            showCancelButton: false,
                            showDenyButton: true,
                            denyButtonText: 'ปิดหน้าต่าง',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        })
                    }
                    console.log(error.config);
                    reject('User not logged in');
                }
            );
        });
    }

    const checkAccessToken = () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let code = params.get('code');
        window.history.replaceState({},'', window.location.origin + window.location.pathname);

        if (getCookie('accessToken') === null && !code) {
            console.log('Access Token Not Found !!!');
            stableLoginFail();
            window.location.href = urlJasLogin;
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
                            window.location.href = urlJasLogin;
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
    };

    const openLoginWindow = () => {
        //window.location.href = urlJasLogin
        checkAccessToken();
    };

    useEffect(() => {
        window.addEventListener('message', function (ev) {
            if (ev.data.loginStatus === "SUCCESS") {
                window.location = './';
            }
            
        });
        // if(logoutJasWindowOpened === false){
        //     checkAccessToken();
        // }
       
    }, []);

    return (
        <>

            <Layout className="layout" style={{ minHeight: '100vh', justifyContent: 'center' }}>
                <Row style={{justifyContent: 'center'}}>
                    <Col xs={20} sm={18} md={14} lg={10} xl={6}>
                        <div className="card-signin" style={{padding: '32px 16px'}}>
                            <div style={{textAlign: 'center'}}>
                                <h5 className="card-title">สมัครบริการ 3BB อินเทอร์เน็ต</h5>
                                <h2 className="card-title-small mb-4">Version {process.env.REACT_APP_VERSION} </h2>
                                <div className="form-signin">
                                    <img className="mb-4" src={logoDtac} width={160} alt="Jasmine Logo" />
                                    <br/>
                                    <Button type="primary" shape="round" size="large" onClick={() => openLoginWindow()}>
                                        LOGIN WITH OAUTH
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Layout>        
            {(loginWindowOpened) && (
                <NewWindow
                    url={urlJasLogin}
                    onUnload={() => newWindowUnloaded()}
                    features={{ left: 200, top: 200, width: 650, height: 520 }}
                />
            )}
            {logoutJasWindowOpened && (
                <NewWindow
                    url={urlJasLogout}
                    onUnload={() => newWindowUnloaded()}
                    features={{ left: 200, top: 200, width: 650, height: 520 }}
                />
            )}
        </>
    )
}

export default LoginPage;