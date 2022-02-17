import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

/* Helper */
import { getCookie } from '../helper/UtilityFunction';

/* Icon */
import errorIcon from '../icon/cancel.png';
import warnIcon from '../icon/warn.svg';

let instance = axios.create();

instance.interceptors.request.use( (config) => {
    document.body.classList.add('loading-indicator');
    if (getCookie('accessToken') !== null) {
        config.headers = { Authorization: `Bearer ${getCookie('accessToken')}` }; 
    }
    else{
        config.headers = { Authorization: '' };
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
                if (error.response.status === 401 || error.response.status === 403) { //ผู้ใช้งานไม่มีสิทธ์เข้าใช้งานหรือ accessToken ใช้งานไม่ได้แล้ว
                    if(error.response.config){
                        const url =  error.response.config.url;
                        if(url.indexOf("/ecs-api/v3/authen/me") > -1){
                            Swal.fire({
                                // icon: 'error',
                                // title: 'HTTP Status ' + error.response.status + ' ' + error.response.statusText,
                                // text: error.response.data.resMsg,
                                imageUrl: warnIcon,
                                imageWidth: 128,
                                imageHeight: 128,
                                imageAlt: 'warning',
                                html: 
                                '<div style="text-align: left;">'+
                                    '<div style="text-align: left;color:#8e0000;">'+
                                        //'ผู้ใช้งานไม่มีสิทธ์เข้าใช้งาน หรือ ปัจจุบันผู้ใช้งาน Login เกินเวลาที่กำหนด กรุณา Login เข้าใช้งานใหม่อีกครั้ง'+
                                        error.response.data.resMsg+
                                    '</div>'+
                                '</div>',
                                confirmButtonText: 'รับทราบ',
                                confirmButtonColor: '#1f8f6b',
                                footer: 
                                '<div style="text-align: right;font-size:10px;margin-top:18px;">'+
                                    'ERROR CODE '+error.response.data.errCode+
                                '</div>',
                                allowEscapeKey: false,
                                allowOutsideClick: false
                            });
                        }
                        else{
                            return Promise.reject(error);
                        }
                    }
                    //eraseCookie('accessToken');       
                }
                else { // อื่นๆ //http status = 4XX, 5XX 
                    Swal.fire({
                        // icon: 'error',
                        // title: 'HTTP Status ' + error.response.status + ' ' + error.response.statusText,
                        // text: error.response.data.resMsg,
                        imageUrl: warnIcon,
                        imageWidth: 128,
                        imageHeight: 128,
                        imageAlt: 'warning',
                        html: 
                        '<div style="text-align: left;">'+
                            '<div style="text-align: left;color:#8e0000;">'+
                                error.response.data.resMsg+
                            '</div>'+
                        '</div>',
                        showConfirmButton: false,
                        showCancelButton: true,
                        cancelButtonText: 'ปิด',
                        cancelButtonColor: '#394a44',
                        footer: 
                        '<div style="text-align: right;font-size:10px;margin-top:18px;">'+
                            'ERROR CODE '+error.response.data.errCode+
                        '</div>',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    return Promise.reject(error);
                }
            }
            else{
                Swal.fire({
                    // icon: 'error',
                    // title: 'ผิดพลาด',
                    // text: error,
                    imageUrl: errorIcon,
                    imageWidth: 128,
                    imageHeight: 128,
                    imageAlt: 'error',
                    html: 
                    '<div style="text-align: left;">'+
                        '<div style="text-align: left;color:#8e0000;">'+
                            error+
                        '</div>'+
                    '</div>',
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
                // icon: 'error',
                // title: 'Error',
                // text: error,
                imageUrl: errorIcon,
                imageWidth: 128,
                imageHeight: 128,
                imageAlt: 'error',
                html: 
                '<div style="text-align: left;">'+
                    '<div style="text-align: left;">'+
                        error+
                    '</div>'+
                '</div>',
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

export const httpClientEcs = instance;