import axios from "axios";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

/* Helper */
import { getCookie, eraseCookie } from '../helper/UtilityFunction';

/* Icon */
import errorIcon from '../icon/cancel.png';
import warnIcon from '../icon/warn.svg';

let instance = axios.create();

instance.interceptors.request.use( (config) => {
    document.body.classList.add('loading-indicator');
    if (getCookie('accessToken') !== null) {
        config.headers = { 
            Authorization: `Bearer ${getCookie('accessToken')}`
        }; 
    }
    else{
        config.headers = { 
            Authorization: `Bearer ${getCookie('accessToken')}`
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
                                    //'ผู้ใช้งานไม่มีสิทธ์เข้าใช้งาน หรือ ปัจจุบันผู้ใช้งาน Login เกินเวลาที่กำหนด กรุณา Login เข้าใช้งานใหม่อีกครั้ง'+
                                    error.response.data.errMsg+
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
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location = './';
                            }
                        })
                    }
                    eraseCookie('accessToken');
                    return Promise.reject(error);
                }
                else if (error.response.status === 404) { //ไม่พบ api ในระบบ
                    Swal.fire({
                        imageUrl: errorIcon,
                        imageWidth: 128,
                        imageHeight: 128,
                        imageAlt: 'error',
                        //title: '<div style="color:#8e0000;">พบข้อผิดพลาดระหว่างใช้งาน</div>',
                        html: 
                        '<div style="text-align: left;">'+
                            '<div style="text-align: left;color:#8e0000;">'+
                                error.response.data.errMsg+
                            '</div>'+
                        '</div>',
                        showConfirmButton: false,
                        showCancelButton: false,
                        showDenyButton: true,
                        denyButtonText: 'ปิดหน้าต่าง',
                        footer: 
                        '<div style="text-align: right;font-size:10px;margin-top:18px;">'+
                            'ERROR CODE '+error.response.data.errCode+
                        '</div>',
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    })
                    return Promise.reject(error);
                }
                else { // อื่นๆ //http status = 4XX, 5XX 
                    Swal.fire({
                        imageUrl: errorIcon,
                        imageWidth: 128,
                        imageHeight: 128,
                        imageAlt: 'error',
                        //title: '<div style="color:#8e0000;">พบข้อผิดพลาดระหว่างใช้งาน</div>',
                        html: 
                        '<div style="text-align: left;">'+
                            '<div style="text-align: left;color:#8e0000;">'+
                                error.response.data.errMsg+
                            '</div>'+
                        '</div>',
                        showConfirmButton: false,
                        showCancelButton: false,
                        showDenyButton: true,
                        denyButtonText: 'ปิดหน้าต่าง',
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
                return Promise.reject(error);
            }
        }
        catch (error) {
            Swal.fire({
                imageUrl: errorIcon,
                imageWidth: 128,
                imageHeight: 128,
                imageAlt: 'error',
                //title: '<div style="color:#8e0000;">พบข้อผิดพลาดระหว่างใช้งาน</div>',
                html: 
                '<div style="text-align: left;">'+
                    '<div style="text-align: left;">'+
                        error+
                    '</div>'+
                '</div>',
                showConfirmButton: false,
                showCancelButton: false,
                showDenyButton: true,
                confirmButtonText: 'ปิดหน้าต่าง',
                confirmButtonColor: '#394a44',
                allowEscapeKey: false,
                allowOutsideClick: false
            })
            return Promise.reject(error);
        }
});

export const httpClientMercury = instance;