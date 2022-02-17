import { httpClientMercury } from '../helper/HttpClientMercury';

class MercuryAPI {
    //สำหรับการนำ code มาแลก accessToken
    async getAccessToken(authorizationCode){
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/authorization/authorizationcode', 
            {
                authorizationCode : authorizationCode,  
                authorizationClientName : process.env.REACT_APP_JAJSMINE_AURHORIZATION_CLIENT_NAME
            }   
        )
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error;
            });
    }

    //ใช้สำหรับการ login
    async authorizationMe() {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/authorization/me')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }

    //ค้นหาตำบล อำเภอ จังหวัด
    async searchAcomp(stxt) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/addr/search/acomp?stxt='+stxt)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }

    //ดึงข้อมูลข่ายสายในพื้นที่ lat, lng
    async searchCircuit(lat,lng) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/network/search/circuit?lat='+lat+'&lng='+lng)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }

    //สร้างข้อมูลคำขอ
    async createNewOrder(objectData){
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/order/new', objectData)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error;
            });
    }
    // ค้นหาคำขอ ในเมนูค้นหาคำขอ
    async getsearchdtacRefID(dtacRefID) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/search/nors/order',dtacRefID)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    async search(dtacRefID) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/profile/detl?dtacRefID='+dtacRefID)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //แก้ไขคำขอ 
    async editOrder(mercuryOrder) {      
        
        console.log(mercuryOrder)        
        return httpClientMercury.patch(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/order/new',mercuryOrder)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }

    // ลบคำขอ
    async delOrder(mercuryOrder) {               
        console.log('Api =>> ',mercuryOrder)        
        return httpClientMercury.delete(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/order/new',{data:mercuryOrder})
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    
    async capacity(ZoneCode) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/appoint/scd?dwZoneCode='+ZoneCode)//D10024
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    async usage(ZoneCode) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY + '/mercury-api/v1/appoint/usage?dwZoneCode='+ZoneCode)//D10024
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    async orderdetails(mercuryOrderID) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/order/detl?mercuryOrderID='+mercuryOrderID)//210000007
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    // Advance Search--------------------------------------------------------------------------------
    //advs 
    async searchAdvs(Input) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/search/advs',Input)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //user 
    async searchUser(Input) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/search/user',Input)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //get mercuryordertype 
    async getsearchMercuryordertype() {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/search/mercuryordertype')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    // Advance Search--------------------------------------------------------------------------------
    // Reset Accress Point--------------------------------------------------------------------------------
    //get service/wifi Dtac Ref
    async getServiceWifiDtacRef(dtacRefID) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/profile/service/wifi?dtacRefID='+dtacRefID)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //update service/wifi Dtac Ref
    async updateServiceWifiDtacRef(input) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/profile/service/wifi',input)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //get service/wifi/history
    async getServiceWifiHistory(dtacRefID) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/profile/service/wifi/history?dtacRefID='+dtacRefID)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    

    // Reset Accress Point--------------------------------------------------------------------------------

    //SearchAdmin
    async searchAdmin(Objdata) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/user/search',Objdata)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //EditAdmin
    async editAdmin(Objdata) {
        return httpClientMercury.patch(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/user',Objdata)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //GetUserstatus
    async getUserstatus() {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/userstatus')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //GetUserrole
    async getUserrole() {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/userrole')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    //getUserchannel
    async getUserchannel() {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/userchannel')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }//
    //patchUserchannel
    async updateAdmin(obj) {
        return httpClientMercury.patch(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/user/'+obj.userID,obj.data_update)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    // getAllDataAdmin
    async getAllData(obj) {
        return httpClientMercury.get(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/user')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    async importAdmin(obj) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/user',obj)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    async cheackimportAdmin(obj) {
        return httpClientMercury.post(process.env.REACT_APP_DOMAIN_MERCURY +'/mercury-api/v1/admin/user/check',obj)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.handleError(error);
                return error
            });
    }
    handleResponseError(response) {
        console.log("handleResponseError ==> response : ",response);
        throw new Error("HTTP error, status = " + response.status);
    }
    handleError(error) {
        console.log("handleErrorr ==> error.message : ", error.message);
    }
}

export default MercuryAPI;

//ตัวอย่างการเรียกใช่้งาน API

//import MercuryAPI from '../api/MercuryAPI'


//ที่ function ของตัวเอง
//const mercuryAPI = new MercuryAPI();

//แบบ get 
// mercuryAPI.getOrderWork(orderId).then(data => {
//     if(isNotError(data)){ //ไม่เกิด error ระหว่างเรียก API
//         if(data.resultCode === "1"){

//         }
//         else{
//             Swal.fire({
//                 icon: 'error',
//                 title: 'ผิดพลาด',
//                 text: 'resultCode : '+data.resultCode+' result : '+data.result,
//                 confirmButtonText: 'รับทราบ',
//                 confirmButtonColor: '#1f8f6b',
//                 allowEscapeKey: false,
//                 allowOutsideClick: false
//             });
//         } 
//     }
//     else{  //เกิด error ระหว่างเรียก API
//         setOrderWorkData({noData:true});
//     }
// });


// แบบ post
// let param = {
//     "transSubtypeId": "10",
//     "teamCode": props.loginData.ops.teamCode,
//     "refDocNum": params.orderId,
//     "remark": "", 
//     "channCode": "webwfs",
//     "balance": [
//         {
//             "itemCode": inputItemCode.itemCode,
//             "balanceTypeId": "4",
//             "eqSeq": pickedEquipment.eqSeq, 
//             "requestRefCode": inputSerialNo,
//             "requestRefCode2": inputMacAddress,
//             "requestQty": 1
//         }
//     ]
// }
// mercuryAPI.summitPickUpEquipment(param).then(data => {
//     if(isNotError(data)){      //ไม่เกิด error ระหว่างเรียก API
//         if(data.resStatus === 0){  
//             Swal.fire({
//                 icon: 'warning',
//                 text: data.resMsg,
//                 confirmButtonText: 'รับทราบ',
//                 confirmButtonColor: '#1f8f6b',
//                 allowEscapeKey: false,
//                 allowOutsideClick: false
//             });
//         }
//         else{
//             Swal.fire({
//                 icon: 'success',
//                 title: 'สำเร็จ',
//                 text: 'บันทึกรายการเบิกอุปกรณ์สำเร็จ',
//                 confirmButtonText: 'รับทราบ',
//                 confirmButtonColor: '#1f8f6b',
//                 allowEscapeKey: false,
//                 allowOutsideClick: false
//             }).then((result) => {
//                 if (result.value) {
//                     //clear data
//                     clearCreateRequistFormData();
//                     selectedMenu('SelectRequist');
//                     getEquipmentData(params.orderId);
//                  }
//             })
//         }
//     }
//     else{ //เกิด error ระหว่างเรียก API
//          
//     }
// });