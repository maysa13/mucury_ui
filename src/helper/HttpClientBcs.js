import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

/* Helper */
import { getCookie, eraseCookie } from '../helper/UtilityFunction';

let instance = axios.create();

instance.interceptors.request.use( (config) => {
    document.body.classList.add('loading-indicator');
    if (getCookie('accessToken') !== null) {
        config.headers = { 
            accessToken: getCookie('accessToken'), 
            ipClient: '0.0.0.0'
        }; 
    }
    else{
        config.headers = { 
            accessToken: '', 
            ipClient: '0.0.0.0'
        };
    }
    return config;
});

instance.interceptors.response.use( (response) => {
    document.body.classList.remove('loading-indicator');
    return response;
}, function (error) {
        try {
            console.log("error : ", error);
            console.log("error.response : ", error.response);
            document.body.classList.remove('loading-indicator');
            if(error.response){
                if (error.response.status === 401) { //ผู้ใช้งานไม่มีสิทธ์เข้าใช้งานหรือ accessToken ใช้งานไม่ได้แล้ว
                    if(error.response.config){
                        const url =  error.response.config.url;
                        if(url.indexOf("wfs-fos-api") > -1){
                            Swal.fire({
                                icon: 'error',
                                title: 'HTTP Status ' + error.response.status + ' ' + error.response.statusText,
                                text: error.response.data.resMsg,
                                confirmButtonText: 'รับทราบ',
                                confirmButtonColor: '#1f8f6b',
                                allowEscapeKey: false,
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.value) {
                                    window.location = './';
                                }
                            })
                        }
                        else{
                            Swal.fire({
                                icon: 'error',
                                title: 'HTTP Status ' + error.response.status + ' ' + error.response.statusText,
                                text: 'ผู้ใช้งานไม่มีสิทธ์เข้าใช้งาน หรือ ปัจจุบันผู้ใช้งาน Login เกินเวลาที่กำหนด กรุณา Login เข้าใช้งานใหม่อีกครั้ง',
                                confirmButtonText: 'รับทราบ',
                                confirmButtonColor: '#1f8f6b',
                                allowEscapeKey: false,
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.value) {
                                    window.location = './';
                                }
                            })
                        }
                    }
                    eraseCookie('accessToken');
                    return Promise.reject(error);
                }
                else if (error.response.status === 404) { //ไม่พบ api ในระบบ
                    Swal.fire({
                        icon: 'error',
                        title: 'HTTP Status ' + error.response.status + ' ' + error.response.statusText,
                        text: error.response.data.resMsg,
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'ปิด',
                        cancelButtonColor: '#394a44',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    return Promise.reject(error);
                }
                else { // อื่นๆ //http status = 4XX, 5XX 
                    Swal.fire({
                        icon: 'error',
                        title: 'ผิดพลาด',
                        text: error.response.data.resMsg,
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'ปิด',
                        cancelButtonColor: '#394a44',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    return Promise.reject(error);
                }
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'ผิดพลาด',
                    text: error,
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonText: 'ปิด',
                    cancelButtonColor: '#394a44',
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                return Promise.reject(error);
            }
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: 'ปิด',
                cancelButtonColor: '#394a44',
                allowEscapeKey: false,
                allowOutsideClick: false
            })
            return Promise.reject(error);
        }
});

export const httpClientBcs = instance;