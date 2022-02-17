import React, { useContext,useState,useEffect }  from 'react';
import { Form, Input,Card, Col, Row, PageHeader,Button,Calendar,Modal,InputNumber,Radio } from 'antd';

import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import 'sweetalert2/dist/sweetalert2.css'

import Appointment from './ChangeAppointment/ChangeAppointment.js'
import '../../App.css'
import mercuryAPI from '../../api/MercuryAPI.js';
/* Store */
import {
    MercuryContext,setOrderId
} from '../../store/MercuryContext';

import { isNotError } from '../../helper/UtilityFunction';
/* Icon */
import AppBreadcrumb from '../../component/AppBreadcrumb';
import success from '../../icon/success.svg'
import question from '../../icon/question.png'
import FlagTH from '../../icon/thailand.png'
import FlagUK from '../../icon/UK.png'
import Search from '../../icon/archive.png';
import warn from '../../icon/warn.png';

import {
    EditOutlined
} from '@ant-design/icons';

import MercuryAPI from '../../api/MercuryAPI'

const mercuryApi = new MercuryAPI();
const { Meta } = Card;
const { TextArea } = Input;
const moment = require('moment');
let statusBtnCancleAppointment = false

const Card_headStyle ={
  color:'#E34625',
  fontSize:20
}
const Card_BodyStyle ={
    paddingTop:0,
    paddingBottom:3
 }

const TitleStyle ={
      color:'tomato',
      fontSize:13
}
const TextStyle ={
    fontSize:16
}

const Btn_Change={
    paddingLeft:10,
    color:'blue'
}
const iconColor={
    width:20,
    height:20,
    marginRight:'7px'
}
const submitbuttons ={
    color: 'rgb(255, 255, 255)',
    width: '222px',
    backgroundcolor:'#E34625'  ,
    border:'2px solid #E34625',
    'borderRadius':'7px',
    padding:'0em',
    'marginTop': '5px',
    'marginBottom': '5px',
  }
  const Cancelbuttons = {
    color: '#E34625',
    width: '222px',
    backgroundcolor:'#ffffff'  ,
    border:'2px solid #E34625',
    borderRadius:'7px',
    padding:'0em',
    margin: '0px',
    'marginTop': '5px',
  }
  const MoreDetailbuttons={
    color: 'rgb(255, 255, 255)',
    width: '100px',
    backgroundcolor:'#E34625'  ,
    border:'2px solid #E34625',
    'borderRadius':'7px',
    padding:'0em',
    'marginTop': '5px',
    'marginBottom': '5px',
  }
const bodyStyleModel={padding:0,margin:0,border:0}
const headStyleModer={color:'',fontSize:20,paddingLeft:'0px',margin:'0px',border:0}

var  objdetails={
    Languages : '',
    TitleName : '',
    FirstName : '',
    LastName  : '',
    tels : '',
    address : '',   
    appointDtm : '',
    status:'' ,
}

function SearchOrderNewServicePage(props) {
    
    
    const [form] = Form.useForm();
    const {
        selectedMenu,
        setOrderId , 
        objdata,
        Profile_dtacRef,
        setAppointment,
        appointment, 
        setDatcId,
        setObjData, 
        uiControlData,
        capacity,
        usage, 
        orderdetail, 
        status_Model_edit,
        set_status_Model_edit,status_app,set_Orderdetail,
        
    } = useContext(MercuryContext);
    
    const menuHandleClick = (parameter) => (event)  => {
        selectedMenu(parameter)        
    };
    useEffect(() => {
        
    },[])
    
    objdetails={
        Languages : orderdetail.insContact.contactLang===undefined?'':orderdetail.insContact.contactLang,
        TitleName : orderdetail.insContact.contactTitelName===undefined?'':orderdetail.insContact.contactTitelName,
        FirstName : orderdetail.insContact.contactFirstName===undefined?'':orderdetail.insContact.contactFirstName,
        LastName  : orderdetail.insContact.contactLastName===undefined?'':orderdetail.insContact.contactLastName,
        tels : orderdetail.insContact.contactTel===undefined?'':orderdetail.insContact.contactTel,
        address : orderdetail.insAddr.addrFull===undefined?'':orderdetail.insAddr.addrFull,
        lat : orderdetail.insAddr.lat===undefined?'':orderdetail.insAddr.lat,
        lng : orderdetail.insAddr.lng===undefined?'':orderdetail.insAddr.lng,
                //   orderdetail.insAddr.homeNum===undefined?'':orderdetail.insAddr.homeNum
                //   +' '+orderdetail.insAddr.tambolName===undefined?'':orderdetail.insAddr.tambolName
                //   +' '+orderdetail.insAddr.amphurName===undefined?'':orderdetail.insAddr.amphurName
                //   +' '+orderdetail.insAddr.provinceName===undefined?'':orderdetail.insAddr.provinceName
                //   +' '+orderdetail.insAddr.zipcode===undefined?'':orderdetail.insAddr.zipcode,   
        appointDate : orderdetail.insAppoint.appointDate===undefined?'':orderdetail.insAppoint.appointDate,
        appointZoneCode : orderdetail.insAppoint.appointZoneCode===undefined?'':orderdetail.insAppoint.appointZoneCode,
        mercuryAppointTimeTypeName : orderdetail.insAppoint.mercuryAppointTimeTypeName===undefined?'':orderdetail.insAppoint.mercuryAppointTimeTypeName,
        status:orderdetail.mercuryOrderStatusName===undefined?'':orderdetail.mercuryOrderStatusName,
        mercuryOrderID:orderdetail.mercuryOrderID===undefined?'':orderdetail.mercuryOrderID,
        appointNote:(orderdetail.insAppoint.appointNote===null)?'-':orderdetail.insAppoint.appointNote,
        dtacRefID:orderdetail.dtacRefID===null?'ยังไม่ได้ระบุ':orderdetail.dtacRefID,
        mercuryOrderTypeName:(orderdetail.mercuryOrderTypeName===null)?'':orderdetail.mercuryOrderTypeName,
        
    }
        
//   console.log('>>>',orderdetail)
//   usage,)

    const showNum=(encryptData)=>{
        if(typeof encryptData === 'string'){
          encryptData=encryptData
        }else if(typeof encryptData === 'number'){
          encryptData = encryptData.toString()
        }else{
          return "รูปแบบข้อมูลไม่ถูกต้อง"
        }
        return "".padStart(7,'*').concat(encryptData.slice(-3))    // *******567
      }
    const showTel=(tel)=>{
        // console.log(tel)
        if(tel!==null&&tel!=undefined&&tel!=''){
            let tel1 = tel.substring(0,3);
            let tel2 = tel.substring(3,6);
            let tel3 = tel.substring(6,10);
            let Tel = tel1+'-'+tel2+'-'+tel3
            return Tel
          }else{
            return tel
          }
    }
    
    // console.log('objdata',objdata)
    let edit={
        prefix:'',
        firstname:'',
        lastname:'',
        lang:'',
        tel:'',
    }
    // console.log('++++Profile_dtacRef ',orderdetail)


    /******************* API EDIT *****************************/
    
    const EditOrderdetails=(mercuryOrder)=>{ 
        console.log('EditOrderdetails',orderdetail)
        let  data= {
            "mercuryOrderID": orderdetail.mercuryOrderID,
            "dtacRefID": orderdetail.dtacRefID,
            "insContact": {
                "contactTitelName": mercuryOrder.prefix,
                "contactFirstName": mercuryOrder.firstname,
                "contactLastName": mercuryOrder.lastname,
                "contactTel": mercuryOrder.tel,
                "contactLang": mercuryOrder.lang
            },
            "insAppoint": {
                "mercuryAppointTimeTypeID": mercuryOrder.appointment.mercuryAppointTimeTypeID, //.insAppoint.mercuryAppointTimeTypeID
                "appointDate": mercuryOrder.appointment.appointDate,    //.appointDate
                "appointTimeStart": mercuryOrder.appointment.appointTimeStart,    //appointTimeStart
                "appointTimeEnd": mercuryOrder.appointment.appointTimeEnd,  //appointTimeEnd
                "appointZoneCode": mercuryOrder.appointment.appointZoneCode,//appointZoneCode
                "appointNote": mercuryOrder.Note//appointNote
            }
        }
        console.log('EditOrderdetails',data)
        let cheackdate = moment(orderdetail.insAppoint.appointDate).format('YYYYMMDD')>moment().format('YYYYMMDD')
        // if(cheackdate){
        mercuryApi.editOrder(data).then(order => {
            console.log('Api>>>>>>>>>>>>>>>>>>>>>>>>>>',order)
            if(isNotError(order)){  
                Swal.fire({
                    imageUrl:success,
                    imageHeight:'100px',
                    title: 'ระบบดำเนินการบันทึกแก้ไขข้อมูล'+'</br>'+'สำเร็จเรียบร้อยแล้วค่ะ',
                    showCancelButton: true,  
                    showConfirmButton: false,                
                        confirmButtonText: 'บันทึกแก้ไข',                
                        cancelButtonText: 'ปิดหน้าต่าง',
                        buttonsStyling: false,
                        customClass: {
                        actions: 'vertical-buttons',
                        confirmButton: 'confirm-buttons',
                        cancelButton: 'cancle-buttons',                    
                    },  
                }).then((result) => {
                    console.log('orderdetails',result)
                    if(result.isDismissed=== true){
                        mercuryApi.orderdetails(orderdetail.mercuryOrderID).then(data => {
                            if(isNotError(order)){
                                set_Orderdetail(data)  
                                selectedMenu(uiControlData.currentMenu)
                            
                            }
                        }); 
                    }
                    
                })
            }
            
            
        })       
        // } else{
        //     Swal.fire({
        //         imageUrl: warn,
        //         imageWidth: 100,
        //         // title: 'คำนำหน้า',
        //         // html:`<span>ไม่สามารถกรอกคำนำหน้าเป็นตัวเลขหรืออักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</span>`,
        //         html:
        //         '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่อนุญาติให้แก้ไขข้อมูลคำขอ<b/><br/>'+
        //         '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">เนื่องจากเลยวันที่นัดหมายมาแล้ว</text><br/>',
        //         showCancelButton: true,  
        //         showConfirmButton: false,                
        //             confirmButtonText: 'บันทึกแก้ไข',                
        //             cancelButtonText: 'ปิดหน้าต่าง',
        //             buttonsStyling: false,
        //             customClass: {
        //             actions: 'vertical-buttons',
        //             // confirmButton: 'confirm-buttons',
        //             cancelButton: 'cancle-buttons_2',                    
        //         }, 
        //     }).then((result) => {
        //         console.log('1',result)
               
        //     }) 
        // }    
    }
    /************************************************/
    const confirmAppointment = (value)=>{  
        console.log('confirmAppointment',edit)
        console.log(objdetails.Languages)
        let Flag,Name;
        
        if(edit.lang===''){  
            edit.lang=objdetails.Languages
        }
        if(edit.lang!==''){
            // Flag=edit.lang
            if(edit.lang==='T'){
                objdetails.Languages='ภาษาไทย'
                Flag=FlagTH
            }else if(edit.lang==='E'){
                objdetails.Languages='ภาษาอังกฤษ'
                Flag=FlagUK
            }            
        }

        if((edit.prefix!=='')&&(edit.firstname!=='')&&(edit.lastname!=='')){            
            Name = edit.prefix+' '+edit.firstname+' '+edit.lastname
        }else if(edit.prefix!==''){            
            Name = edit.prefix+' '+objdetails.FirstName+' '+objdetails.LastName
        }else if(edit.firstname!==''){            
            Name = objdetails.TitleName+' '+edit.firstname+' '+objdetails.LastName
        }else if(edit.lastname!==''){            
            Name = objdetails.TitleName+' '+objdetails.FirstName+' '+edit.lastname
        }else {
            Name=objdetails.TitleName+' '+objdetails.FirstName+' '+objdetails.LastName
        }
        // if(appointment!==null){
            if( edit.firstname===""&&edit.lang=== ""&&edit.lastname=== ""&&edit.prefix=== ""&& edit.tel=== ""&&appointment===null){
                Swal.fire({
                    html:`
                        <style>
                            .grid-container {
                              display: grid;
                              grid-gap: 5px;
                              padding: 10px;
                            }
                            .grid-container > div{
                              text-align: left;
                              padding: 0px;
                              font-size: 14px;
                            }
                            .item1 {
                                text-align: left;
                                grid-column: 1 / 3;
                            }
                        </style>
                        <body> 
                            <div class="grid-container">         
                                <div style="text-align: center;font-size: 16px;" class="item1">
                                    <img src=${question} style="width:120" >
                                </div>   
                                <div style="text-align: center;font-size: 16px;" class="item1">
                                </br><b>ไม่มีการแก้ไขข้อมูล</b>
                                </div>                                    
                            </div>
                        </body>
                    `,                       
                    showCancelButton: true,  
                    showConfirmButton: false,                
                    confirmButtonText: 'ใช่,ยืนยันดำเนินการ',                
                    cancelButtonText: 'ปิดหน้าต่าง',
                    buttonsStyling: false,
                    customClass: {
                        actions: 'vertical-buttons',
                        confirmButton: 'confirm-buttons',
                        cancelButton: 'cancle-buttons', 
                    }     
                  
                }).then((result) => {
                    console.log(result)

                    if(result.isDismissed === true){
                        edit={
                            prefix:'',
                            firstname:'',
                            lastname:'',
                            lang:'',
                            tel:'',
                            Note:''
                        }
                    }
                })
            }else{

                Swal.fire({
                    html:`
                        <style>
                            .grid-container {
                              display: grid;
                              grid-gap: 5px;
                              padding: 10px;
                            }
                            .grid-container > div{
                              text-align: left;
                              padding: 0px;
                              font-size: 14px;
                            }
                            .item1 {
                                text-align: left;
                                grid-column: 1 / 3;
                            }
                        </style>
                        <body> 
                            <div class="grid-container">         
                                <div style="text-align: center;font-size: 16px;" class="item1">
                                    <img src=${question} style="width:120" >
                                </div>   
                                <div style="text-align: center;font-size: 16px;" class="item1">
                                    <b>เจ้าหน้าที่ต้องการยืนยันจะบันทึกข้อมูล</b></br>
                                    <b>นัดหมายติดตั้งหรือไม่</b>
                                </div>   
                                <div style="text-align: Left;font-size: 16px;border: 1px solid #E34625;padding: 7px;" class="item1">
                                    <b style="padding-bottom: 7px;">ข้อมูลลูกค้า</b>
                                    <div style="padding-bottom: 7px;">
                                        <Text style="color:Tomato;font-size: 12px;" >ภาษาที่ใช้ติดิต่อ</Text><br/>
                                        <Text style="font-size: 14px;"><img src=${Flag} style="width:20"/> ${objdetails.Languages} </Text>
                                    </div> 
                                    <div style="padding-bottom: 7px;">
                                        <Text style="color:Tomato;font-size: 12px;" >ชื่อ-นามสกุล</Text><br/>
                                        <Text style="font-size: 14px;">${Name}</Text>
                                    </div>  
                                    <div style="padding-bottom: 7px;">
                                        <Text style="color:Tomato;font-size: 12px;" >เบอร์โทรศัพท์มือถือ</Text><br/>
                                        <Text style="font-size: 14px;">${edit.tel===''?showTel(objdetails.tels):showTel(edit.tel)}</Text>
                                    </div>  
                                    <div style="padding-bottom: 7px;">
                                        <Text style="color:Tomato;font-size: 12px;" >สถานที่ติดตั้ง</Text><br/>
                                        <Text style="font-size: 14px;">${objdetails.address}</Text>
                                    </div>                                                      
                                </div>
                                <div style="text-align: Left;font-size: 16px;border: 1px solid #E34625;padding: 7px;" class="item1">
                                    <b style="padding-bottom: 7px;">ข้อมูลนัดหมายติดตั้ง</b>
                                    <div style="padding-bottom: 7px;">
                                        <Text style="color:Tomato;font-size: 12px;" >วันที่นัดหมายเดิม</Text><br/>
                                        <Text style="font-size: 14px;width:378px">${moment(objdetails.appointDate).format('DD/MM/YYYY')} ${objdetails.mercuryAppointTimeTypeName} </Text>
                                    </div>  

                                    <div style="padding-bottom: 7px;background-color: #fff2e6">
                                        <Text style="color:Tomato;font-size: 12px;" >วันที่นัดหมายใหม่</Text><br/>
                                        <Text style="font-size: 14px;">${appointment!==null?moment(appointment.Day).format('DD/MM/YYYY'):'ไม่มีการเปลี่ยนแปลงวันนัดหมาย'}  ${appointment!==null?appointment.data.appointmentDurationName:''}</Text>
                                    </div>  
                                    <div style="padding-bottom: 7px;width:378px">
                                        <Text style="color:Tomato;font-size: 12px;" >รายละเอียดเพิ่มเติม</Text><br/>
                                        <Text style="font-size: 14px;">${edit.Note===''?'-':edit.Note}</Text>
                                    </div>                                                      
                                </div>    
                            </div>
                        </body>
                    `,                       
                    showCancelButton: true,  
                    showConfirmButton: true,                
                    confirmButtonText: 'ใช่,ยืนยันดำเนินการ',                
                    cancelButtonText: 'ไม่ใช่,กลับไปแก้ไขข้อมูล',
                    buttonsStyling: false,
                    customClass: {
                        actions: 'vertical-buttons',
                        confirmButton: 'confirm-buttons',
                        cancelButton: 'cancle-buttons', 
                    }     
                  
                }).then((result) => {
                    console.log(result)



                    if(result.isDismissed === true){
                        edit={
                            prefix:'',
                            firstname:'',
                            lastname:'',
                            lang:'',
                            tel:'',
                        }
                    }else if(result.isConfirmed === true){
                        EditOrderdetails(value)
                        console.log('true')
                        setAppointment(null)
                        handleCancel()
                        
                        
                    }
                })
            }
            
                
        // } else{
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'กรุณาระบุวันและช่วงเวลานัดหมายที่ต้องการเปลี่ยนแปลง',
        //         confirmButtonColor:'#E34625',
        //         confirmButtonText:'ปิดหน้าต่าง'
        //     })
        // }                   
            
            
    }
    const patternCheackStr = '^[a-zA-Zก-์]*$'
    const changeName =() =>{
        Swal.fire({
            html:`
                <style>
                    .grid-container {
                      display: '';
                      grid-gap: 5px;
                      padding: 10px;
                    }
                    .grid-container > div{
                      text-align: left;
                      padding: 0px;
                      font-size: 14px;
                    }
                    .item1 {
                        text-align: left;
                        grid-column: 1 / 3;
                    }
            </style>
            <body>  
                <div class="grid-container">         
                    <div style="text-align: Left;font-size: 20px;" class="item1">
                        <b>แก้ไขข้อมูล ชื่อ-นามสกุล</b>
                    </div>   

                    <div class="item4">
                        <label style="color:Tomato;font-size: 12px;">คำนำหน้าชื่อ *</label>
                        <input id="prefix" style="margin: 0px;" class="swal2-input">
                        <!--connect A<select id="prefix" style="margin: 0px;" class="swal2-input">
                          <option value="">คำนำหน้า</option>
                          <option value="นาย">Saab</option>
                          <option value="นาง">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>-->
                    </div>
                    <div class="item5">
                        <label style="color:Tomato;font-size: 12px;">ชื่อ *</label>
                        <input id="FirstName" style="margin: 0px;" class="swal2-input">
                    </div>
                    <div class="item6">
                        <label style="color:Tomato;font-size: 12px;">นามสกุล *</label>
                        <input id="LastName" style="margin: 0px;" class="swal2-input">
                    </div>
                </div>
            </body>
            `,                                                
            showCancelButton: true,  
            showConfirmButton: true,                
            confirmButtonText: 'บันทึกแก้ไข',                
            cancelButtonText: 'ปิดหน้าต่าง',
            buttonsStyling: false,
            customClass: {
                actions: 'vertical-buttons',
                confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons', 
            },
            preConfirm: () => {
                // const patternCheackStr = '^[a-zA-Zก-์]*$'
                const Prefix = Swal.getPopup().querySelector('#prefix').value 
                const FirstName = Swal.getPopup().querySelector('#FirstName').value 
                const LastName = Swal.getPopup().querySelector('#LastName').value 
                console.log(Prefix+FirstName+LastName)
                if(Prefix!==''&&FirstName!==''&&LastName!==''){
                    if(Prefix.match(patternCheackStr)&&FirstName.match(patternCheackStr)&&LastName.match(patternCheackStr)){
                        Swal.fire({
                            imageUrl:success,
                            imageHeight:'100px',
                            title: 'ระบบดำเนินการบันทึกแก้ไขข้อมูล'+'</br>'+'สำเร็จเรียบร้อยแล้วค่ะ',
                            showCancelButton: true,  
                            showConfirmButton: false,                
                            confirmButtonText: 'บันทึกแก้ไข',                
                            cancelButtonText: 'ปิดหน้าต่าง',
                            buttonsStyling: false,
                            customClass: {
                                actions: 'vertical-buttons',
                                confirmButton: 'confirm-buttons',
                                cancelButton: 'cancle-buttons', 
                            }     
                        })
                    }else{
                        Swal.showValidationMessage(`กรุณากรอกข้อมูลให้ถูกต้อง`)    
                    }
                }else{
                    Swal.showValidationMessage(`กรุณากรอกข้อมูลให้ครบถ้วน`)
                }
            }
        })
    }
    const patternCheackTel = '^[0][689][0-9]{8}$'
    const changeTel =()=>{
        Swal.fire({
            html:`
                <style>
                    .grid-container {
                      display: '';
                      grid-gap: 5px;
                      padding: 10px;
                      
                    }
                    .grid-container > div{
                      text-align: left;
                      padding: 0px;
                      font-size: 14px;
                    }
                    .item1 {
                        text-align: left;
                        grid-column: 1 / 3;
                    }
            </style>
            <body>  
                <div class="grid-container">         
                    <div style="text-align: Left;font-size: 20px;" class="item1">
                        <b>แก้ไขเบอร์โทรศัพท์มือถือ</b>
                    </div>   

                    <div class="item4" >
                        <label style="color:Tomato;font-size: 12px;">เบอร์โทรศัพท์มือถือ *</label>
                        <input id="Mobilenumber" style="margin: 0px;" class="swal2-input">
                    </div>                                                                     
                </div>
            </body>
            `,     
                showCancelButton: true,                
                confirmButtonText: 'บันทึกแก้ไข',                
                cancelButtonText: 'ปิดหน้าต่าง',
                buttonsStyling: false,
                customClass: {
                    actions: 'vertical-buttons',
                    confirmButton: 'confirm-buttons',
                    cancelButton: 'cancle-buttons',                    
                },                                              
            preConfirm: () => {
                // const patternCheackTel = '^[0][689][0-9]{8}$'
                const Mobilenumber = Swal.getPopup().querySelector('#Mobilenumber').value                 
                if(Mobilenumber!==''){
                    // pattern: new RegExp(/^[0][689][0-9]{8}$/),
                    if(Mobilenumber.match(patternCheackTel)&&(Mobilenumber.length === 10)){
                        Swal.fire({
                            imageUrl:success,
                            imageHeight:'100px',
                            title: 'ระบบดำเนินการบันทึกแก้ไขข้อมูล'+'</br>'+'สำเร็จเรียบร้อยแล้วค่ะ',
                            showCancelButton: true,  
                            showConfirmButton: false,                
                                confirmButtonText: 'บันทึกแก้ไข',                
                                cancelButtonText: 'ปิดหน้าต่าง',
                                buttonsStyling: false,
                                customClass: {
                                actions: 'vertical-buttons',
                                confirmButton: 'confirm-buttons',
                                cancelButton: 'cancle-buttons',                    
                            },  
                        })
                    }else{
                        Swal.showValidationMessage(`กรุณากรอกข้อมูลให้ถูกต้อง`)                       
                    }
                }else{
                    Swal.showValidationMessage(`กรุณากรอกข้อมูล`)
                }
            }
        })
    }   
    const cancleAppointment =()=>{
        setAppointment(null)
        Swal.fire({
            icon: 'success',
            title: 'ยกเลิกการเปลี่ยนแปลงนัดหมาย',
            showCancelButton: true,     
            showConfirmButton: false,                
            confirmButtonText: 'บันทึกแก้ไข',                
            cancelButtonText: 'ปิดหน้าต่าง',
            buttonsStyling: false,
            customClass: {
                actions: 'vertical-buttons',
                confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons',                    
            }
        }).then((result) => {
            console.log(result)
            if(result.isDismissed === true){
                setAppointment(null)
                menuHandleClick('MenuPage')
            }else if(result.isConfirmed === true){
                // console.log('true')
                // setAppointment(null)
                // statusBtnCancleAppointment=true //ใช้ disable ปุ่ม ยกเลิกเปลี่ยนแปลง
            }
        })
    }
    const moredetail=()=>{
        console.log(objdata.OrderId)
        selectedMenu('OrderNewServiceDetail')
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (appointZoneCode) => {
    console.log('นัดหมาย',status_app,appointZoneCode)
    if(status_app===false){
        Swal.fire({
            html:
            '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลตารางนัดหมายติดตั้ง<b/><br/>'+
            '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">เนื่องจากโซนพื้นที่ '+appointZoneCode+' ไม่พบตารางงานว่างสำหรับนัดหมายติดตั้งในช่วง x วันข้างหน้า</text><br/>',
            imageUrl: warn,
            imageWidth: 100,
            showCancelButton: true,  
            showConfirmButton: false,                
                confirmButtonText: 'บันทึกแก้ไข',                
                cancelButtonText: 'ปิดหน้าต่าง',
                buttonsStyling: false,
                customClass: {
                actions: 'vertical-buttons',
                confirmButton: 'cancle-buttons',
                cancelButton: 'cancle-buttons_2',                    
            }, 
        }).then((result) => {
            console.log('1',result)
            // setIsModalVisible(true);
            // set_status_Model_edit(true)
        })  
    }
    setIsModalVisible(true);
    set_status_Model_edit(true)
  };

  const handleOk = () => {
      console.log('Ok')
    setIsModalVisible(false);
    set_status_Model_edit(false)
    
  };

  const handleCancel = () => {
    console.log('Can')
    set_status_Model_edit(false)
    setIsModalVisible(false);
    setAppointment(null)
    edit={
        prefix:'',
        firstname:'',
        lastname:'',
        lang:'',
        tel:'',}
  };

  const onFinish = (values) => {
    let patternCheackTelphonenumber=/^[0][689][0-9]{8}$/
    let patternCheackLastName=/^[0-9a-zA-Zก-์ ]*$/
    let patternCheackText=/^[0-9a-zA-Zก-์ ]*$/
    let patternCheackPerfixText=/^[0-9a-zA-Zก-์.]*$/ 
    let tels=values.Telphonenumber===undefined||values.Telphonenumber===''?objdetails.tels:values.Telphonenumber
    let Prefix=values.Prefix===undefined||values.Prefix   ===''?objdetails.TitleName:values.Prefix
    let FirstName=values.FirstName===undefined||values.FirstName===''?objdetails.FirstName:values.FirstName
    let LastName=values.LastName===undefined||values.LastName ===''?objdetails.LastName:values.LastName
    console.log(objdetails)
    let Editappointment={
        "mercuryAppointTimeTypeID": '',
        "appointDate": "",
        "appointTimeStart": "",
        "appointTimeEnd": "",
        "appointTimeEnd": "",
        "appointZoneCode": "1",
    }
    if(appointment===null){
        Editappointment={
            "mercuryAppointTimeTypeID":  orderdetail.insAppoint.mercuryAppointTimeTypeID,
            "appointDate": orderdetail.insAppoint.appointDate,    //.appointDate
            "appointTimeStart":orderdetail.insAppoint.appointTimeStart,    //appointTimeStart
            "appointTimeEnd": orderdetail.insAppoint.appointTimeEnd,  //appointTimeEnd
            "appointZoneCode": orderdetail.insAppoint.appointZoneCode,//appointZoneCode
            
        }
    }else{
        var Time=appointment.data.appointmentDurationName.split(" ")
        var Timearr= Time[1].split("-")
        var Timestart=Timearr[0].substr(1, 6)
        var TimeEnd=Timearr[1].substr(0, 5)
        
        console.log('>>>>>>>>>>>>>>>>>>>>>>',appointment.data.appointmentDurationCode)
        console.log(TimeEnd)
        Editappointment={
            "mercuryAppointTimeTypeID":appointment.data.appointmentDurationCode,
            "appointDate": appointment.Day,
            "appointTimeStart": Timestart,
            "appointTimeEnd":TimeEnd,
            "appointZoneCode": orderdetail.insAppoint.appointZoneCode,
        }
    }
    if(!tels.match(patternCheackTelphonenumber)){
        Swal.fire({
            imageUrl: warn,
            imageWidth: 100,
            // title: 'เบอร์โทรศัพท์มือถือ',
            // html:`<span>เนื่องจากเบอร์โทรศัพท์มือถือ `+showTel(values.Telphonenumber)+`</span><br/><span>ไม่ถูกต้อง กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</span>`,
            html:
            '<b style="font-size: 18px;color:#8e0000; font-weight: bold">เบอร์โทรศัพท์มือถือ<b/><br/>'+
            '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">เนื่องจากเบอร์โทรศัพท์มือถือ <b>'+showTel(values.Telphonenumber)+'</b></text><br/>'+
            '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">ไม่ถูกต้อง กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</text>',
            showCancelButton: true,  
            showConfirmButton: false,                
                confirmButtonText: 'บันทึกแก้ไข',                
                cancelButtonText: 'ปิดหน้าต่าง',
                buttonsStyling: false,
                customClass: {
                actions: 'vertical-buttons',
                // confirmButton: 'confirm-buttons',
                // cancelButton: 'cancle-buttons',                    
                cancelButton: 'cancle-buttons_2',  
            }, 
            
        }).then((result) => {
            console.log('1',result)
           
        }) 
    }else if(!Prefix.match(patternCheackPerfixText)){
        Swal.fire({
            imageUrl: warn,
            imageWidth: 100,
            // title: 'คำนำหน้า',
            // html:`<span>ไม่สามารถกรอกคำนำหน้าเป็นตัวเลขหรืออักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</span>`,
            html:
            '<b style="font-size: 18px;color:#8e0000; font-weight: bold">คำนำหน้า<b/><br/>'+
            '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">ไม่สามารถกรอกคำนำหน้าเป็นอักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</text><br/>',
            showCancelButton: true,  
            showConfirmButton: false,                
                confirmButtonText: 'บันทึกแก้ไข',                
                cancelButtonText: 'ปิดหน้าต่าง',
                buttonsStyling: false,
                customClass: {
                actions: 'vertical-buttons',
                // confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons_2',                    
            }, 
        }).then((result) => {
            console.log('1',result)
           
        }) 
    }else if(!FirstName.match(patternCheackText)){
        Swal.fire({
            imageUrl: warn,
            imageWidth: 100,
            // title: 'ชื่อลูกค้า',
            // html:`<span>ไม่สามารถกรอกชื่อเป็นอักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</span>`,
            html:
            '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ชื่อลูกค้า<b/><br/>'+
            '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">ไม่สามารถกรอกชื่อเป็นอักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</text><br/>',
            showCancelButton: true,  
            showConfirmButton: false,                
                confirmButtonText: 'บันทึกแก้ไข',                
                cancelButtonText: 'ปิดหน้าต่าง',
                buttonsStyling: false,
                customClass: {
                actions: 'vertical-buttons',
                // confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons_2',                    
            }, 
        }).then((result) => {
            console.log('1',result)
           
        }) 
    }else if(!LastName.match(patternCheackLastName)){
        Swal.fire({
            imageUrl: warn,
            imageWidth: 100,
            // title: 'นามสกุล',
            // html:`<span>ไม่สามารถกรอกนามสกุลเป็นตัวเลขหรืออักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</span>`,
            html:
            '<b style="font-size: 18px;color:#8e0000; font-weight: bold">นามสกุลลูกค้า<b/><br/>'+
            '<text style="font-size: 16px;color:#2B2B2B; font-weight: normal">ไม่สามารถกรอกนามสกุลเป็นอักขระพิเศษได้<br/>กรุณาดำเนินการแก้ไขใหม่อีกครั้งค่ะ</text><br/>',
            showCancelButton: true,  
            showConfirmButton: false,                
                confirmButtonText: 'บันทึกแก้ไข',                
                cancelButtonText: 'ปิดหน้าต่าง',
                buttonsStyling: false,
                customClass: {
                actions: 'vertical-buttons',
                // confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons_2',                    
            }, 
        }).then((result) => {
            console.log('1',result)
           
        }) 
    }else{ 
        // console.log('EDit>>>',objdetails.Languages)
        if(objdetails.Languages==='ภาษาไทย'){
            objdetails.Languages='T'
        }else if(objdetails.Languages==='ภาษาอังกฤษ'){
            objdetails.Languages='E'
        }
        edit={
            prefix:   values.Prefix   ===undefined||values.Prefix   ===''?objdetails.TitleName:values.Prefix,
            firstname:values.FirstName===undefined||values.FirstName===''?objdetails.FirstName:values.FirstName,
            lastname: values.LastName ===undefined||values.LastName ===''?objdetails.LastName:values.LastName,
            tel:values.Telphonenumber===undefined||values.Telphonenumber===''?tels:tels,
            lang:values.radioLang===undefined?objdetails.Languages:values.radioLang,
            Note:values.Note===undefined?objdetails.appointNote:values.Note,
            appointment:Editappointment,
        }
        console.log(edit)
        confirmAppointment(edit)    
         
    }
    

    
    
  };
 
    const callBackto = function(){
        if(uiControlData.currentMenu === 'AdvancedSearchCustomerData'){
            selectedMenu('AdvancedSearch')
        }
        else{
            selectedMenu('Searchdtac')
            //wtest()
        }
        
    }
    console.log(orderdetail)
    
    return(
    <>             
        
        <Row style={{paddingTop:0, paddingBottom:7}}>
            <AppBreadcrumb />            
        </Row>
        <Row justify="center">                                 
            <Col span={24}>
                <Card title="ข้อมูลลูกค้าสำหรับติดต่อ"  headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                
                <Form layout="vertical"> 
                    <Row>
                        <Col span={12} style={{marginBottom:10}}>
                            <Form.Item style={{marginBottom:0}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                                <label  style={TitleStyle}>Order ref ID</label><br/>
                                <label style={TextStyle}>{objdetails.mercuryOrderID}</label>
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{marginBottom:10}}>
                            <Form.Item style={{marginBottom:0}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                                <label  style={TitleStyle}>Dtac ref ID</label><br/>
                                <label style={TextStyle}>{objdetails.dtacRefID}</label>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} style={{marginBottom:10}}>
                            <Form.Item style={{marginBottom:0}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                                <label  style={TitleStyle}>ประเภทคำขอ</label><br/>
                                <label style={TextStyle}>{objdetails.mercuryOrderTypeName}</label>
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{marginBottom:10}}>
                            <Form.Item style={{marginBottom:0}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                            <label  style={TitleStyle}>สถานะ</label><br/>
                                    <label style={TextStyle}>{objdetails.status}</label>
                            </Form.Item>
                        </Col>
                    </Row>    
                   
                    <Form.Item style={{marginBottom:10}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                        <label  style={TitleStyle}>ภาษาที่ใช้ติดต่อ</label><br/>
                        <label style={TextStyle}><img src={objdetails.Languages==='T'?FlagTH:FlagUK} style={iconColor}/>{objdetails.Languages==='T'?'ภาษาไทย':'ภาษาอังกฤษ'}</label>
                        {(orderdetail.mercuryOrderStatusID===2 || orderdetail.mercuryOrderStatusID===3) && orderdetail.mercuryOrderTypeID===1&&<EditOutlined style={Btn_Change} 
                            onClick={()=>{
                                if(objdetails.Languages!==''){
                                    showModal(objdetails.appointZoneCode)
                                    set_status_Model_edit(true)
                                }
                                
                            }}
                        />}
                    </Form.Item>                        
                </Form>
                    <Row>
                        <Col span={12} >
                            <Form layout="vertical">      
                                <Form.Item style={{marginBottom:10}} /*label="ชื่อ-นามสกุล"*/ /*required tooltip="This is a required field"*/>
                                <label style={TitleStyle}>ชื่อ-นามสกุล</label><br/>
                                <label style={TextStyle}>{objdetails.TitleName} {objdetails.FirstName} {objdetails.LastName} </label>
                                {(orderdetail.mercuryOrderStatusID===2 || orderdetail.mercuryOrderStatusID===3) && orderdetail.mercuryOrderTypeID===1&&<EditOutlined style={Btn_Change} 
                                    onClick={()=>{
                                        if(objdetails.FirstName!==''){
                                            showModal(objdetails.appointZoneCode)
                                            set_status_Model_edit(true)
                                        }
                                        
                                    }}
                                />}
                                </Form.Item>
                            </Form>   
                        </Col>                           
                        <Col span={12} >
                            <Form layout="vertical" >      
                                <Form.Item style={{marginBottom:10}} /*label="เบอร์โทรศัพท์มือถือ"*/ /*required tooltip="This is a required field"*/>
                                <label style={TitleStyle}>เบอร์โทรศัพท์มือถือ</label><br/>
                                <label style={TextStyle}>{showTel(objdetails.tels)}</label>
                                {(orderdetail.mercuryOrderStatusID===2 || orderdetail.mercuryOrderStatusID===3) && orderdetail.mercuryOrderTypeID===1&&<EditOutlined style={Btn_Change} 
                                    onClick={()=>{
                                        if(objdetails.tels!==''){
                                            showModal(objdetails.appointZoneCode)
                                            set_status_Model_edit(true)
                                        }
                                        
                                    }}
                                />}
                                </Form.Item>
                            </Form>                                
                        </Col>                            
                    </Row>
                    <Form layout="vertical" > 
                        <Form.Item style={{marginBottom:10}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                            <label  style={TitleStyle}>สถานที่ติดตั้ง</label><br/>
                            <label style={TextStyle}>{objdetails.address}</label>
                        </Form.Item>           
                        <Form.Item style={{marginBottom:10}} /*label="สถานที่ติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                            <Row>
                                <Col span={12}>
                                    <label  style={TitleStyle}>ละติจูด</label><br/>
                                    <label style={TextStyle}>{objdetails.lat}</label>
                                </Col>
                                <Col span={12}>
                                    <label  style={TitleStyle}>ลองจิจูด</label><br/>
                                    <label style={TextStyle}>{objdetails.lng}</label>
                                </Col>
                            </Row>
                            
                        </Form.Item> 
                        <Row >
                            <Col span={24} >
                                {(orderdetail.mercuryOrderTypeID===1)&&<Form.Item style={{marginBottom:10}} /*label="วันเวลานัดหมายติดตั้ง"*/ /*required tooltip="This is a required field"*/>
                                    <label  style={TitleStyle}>วัน/เวลา นัดหมายติดตั้ง</label><br/>
                                    <label style={TextStyle}>{moment(objdetails.appointDate).format('LL')} {objdetails.mercuryAppointTimeTypeName}</label>
                                    {(orderdetail.mercuryOrderStatusID===2 || orderdetail.mercuryOrderStatusID===3) && orderdetail.mercuryOrderTypeID===1&&<EditOutlined style={Btn_Change} 
                                            onClick={()=>{
                                                if(objdetails.appointDate!==''){
                                                    showModal(objdetails.appointZoneCode)
                                                    set_status_Model_edit(true)
                                                }

                                            }}
                                        />}
                                </Form.Item>}
                            </Col>   
                        </Row>                            
                    </Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item  style={{marginBottom:10}}>
                                <label  style={TitleStyle}>รายละเอียดเพิ่มเติม</label><br/>
                                <label  style={TextStyle} >{orderdetail.insAppoint.appointNote===undefined||orderdetail.insAppoint.appointNote===null?"-":orderdetail.insAppoint.appointNote}</label>
                            </Form.Item>
                        </Col>
                    </Row>
                    {orderdetail.mercuryOrderTypeID===1&&<Row>
                        <Col span={21} ></Col>
                        <Col span={3} style={{marginBottom:10}}>
                            <Button  //#E34625
                            type="primary"
                                style={MoreDetailbuttons}
                                onClick={()=> {
                                    if(uiControlData.currentMenu==="SearchOrderNewService"){
                                        selectedMenu('OrderNewServiceDetail')
                                    }else if(uiControlData.currentMenu==="AdvancedSearchCustomerData"){
                                        selectedMenu('AdvancedSearchtoListtoOrderNewServiceDetail')
                                    }
                                    
                                }/*moredetail()*/}
                            >
                                    More Detail
                            </Button>           
                        </Col> 
                    </Row>}
                </Card>                   
                {(orderdetail.mercuryOrderTypeID===1)
                &&(orderdetail.mercuryOrderStatusName!=='Mapping')
                &&(orderdetail.mercuryOrderStatusName!=='Waiting')
                &&(orderdetail.mercuryOrderStatusName!=='Cancel')
                &&(orderdetail.mercuryOrderStatusName!=='Fail')
                &&(orderdetail.mercuryOrderStatusName!=='Success')  
                &&<Card /*title="ชื่อ-นามสกุล (สำหรับติดต่องานติดตั้ง)" genso / Install */ style={{marginTop:7}} headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                        <Meta                           
                            title={
                                <div style={{color:'#E34625',fontSize:20,marginTop:16,marginBottom:0}}>
                                    ตารางเวลานัดหมายงานติดตั้ง
                                    </div>
                            }
                            style={{marginTop:0,paddingBottom:'4px'}}
                            // description="ระบบจะแสดงวันที่สามารถรับงานติดตั้งไม่เกิน 30 วัน รวมทั้งช่วงเวลาที่ว่างรับงาน"
                        />             
                        <Appointment changedate={false} appoint={capacity} appoints={orderdetail.insAppoint.appointZoneCode}/>           
                        {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}


                        {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
                        {/* <Card title="รายละเอียดเพิ่มเติม"  headStyle={{padding:0,color:'#E34625',font:'18'}} bodyStyle={{paddingLeft:0,paddingTop:0,paddingBottom:3}} bordered={false}>
                            <TextArea rows={4} style={{color:'black',width:'100%',marginBottom:10,background:'#e8e7e3'}} disabled value={orderdetail.insAppoint.appointNote} />
                        </Card> */}
                    
                    
                </Card>}
                <Row justify="center" style={{marginTop:7}}>
                    <Col span={4}/>
                    <Col span={8}>
                        <Row justify="center" >
                            <Button 
                                type="primary"
                                style={submitbuttons}
                                onClick={()=>{callBackto()  }}
                            >
                                {uiControlData.currentMenu === 'AdvancedSearchCustomerData'? 'ไปหน้าค้นหาขั้นสูง':'ไปหน้าค้นหาคำขอ'}
                            </Button>
                        </Row>
                    </Col> 
                    <Col span={8}>   
                        <Row justify="center" >
                            <Button 
                                style={Cancelbuttons}
                                // style={{ marginTop:10,borderColor:'#E34625',background:'white',color:'#E34625',borderRadius:'5px',alignSelf:'center',width:'50%'}}
                                onClick={()=>{ selectedMenu('MenuPage') }}
                                disabled={statusBtnCancleAppointment}
                            >
                                ไปหน้าหลัก
                            </Button>
                        </Row>
                    </Col> 
                    <Col span={4}/>
                    </Row>
            </Col>            
        </Row>  

        <Modal /*title="Basic Modal"*/ width={'80%'} visible={isModalVisible} footer={false} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
        <Form            
            onFinish={onFinish}
            
        >
            <Card title={'แก้ไขภาษาที่ใช้ติดต่อ'} style={bodyStyleModel} bodyStyle={bodyStyleModel} headStyle={headStyleModer}>
            <Form.Item
                name="radioLang"             
                // rules={[
                //     {
                //       required: true,
                //       message: 'กรุณาระบุ ภาษาที่ใช้ติดต่อ',
                //     },
                //   ]}
                initialValue={objdetails.Languages}
                >
                    <Radio.Group /*defaultValue={objdetails.Languages}*/>
                    <Radio.Button style={{marginRight:'14px'}}  value="T"><img src={FlagTH} style={iconColor}/> ภาษาไทย</Radio.Button>
                    <Radio.Button style={{marginLeft:'14px'}}  value="E"><img src={FlagUK} style={iconColor}/> English</Radio.Button>                       
                    </Radio.Group>
            </Form.Item>

            </Card>

            <Card title={'แก้ไขข้อมูล ชื่อ-นามสกุล'} style={{border:0}}  bodyStyle={bodyStyleModel} headStyle={headStyleModer}>
                <Row>
                    <Col span={4}>
                        <label style={TitleStyle}>คำนำหน้า <span style={{color:'red'}}>*</span></label>
                        <Form.Item name="Prefix" 
                        //     rules={[
                        //     {
                        //         pattern: new RegExp(/^[a-zA-Zก-์]*$/),
                        //         message: "ตัวอักษรเท่านั้น"
                        //     }
                        // ]}
                        initialValue={objdetails.TitleName}
                        >
                            <Input /*defaultValue={objdetails.TitleName}*//>
                        </Form.Item>
                    </Col>
                    <Col span={9} offset={1}>
                        <label style={TitleStyle}>ชื่อลูกค้า <span style={{color:'red'}}>*</span></label>
                        <Form.Item name="FirstName"  
                        //     rules={[
                        //     {
                        //         pattern: new RegExp(/^[a-zA-Zก-์]*$/),
                        //         message: "ตัวอักษรเท่านั้น"
                        //     }
                        // ]}
                        initialValue={objdetails.FirstName}
                        >
                        <Input /*defaultValue={objdetails.FirstName*//>
                        </Form.Item>
                    </Col>
                    <Col span={9} offset={1}>
                        <label style={TitleStyle}>นามสกุล <span style={{color:'red'}}>*</span></label>
                        <Form.Item name="LastName"  
                            // rules={[
                            //     {
                            //         pattern: new RegExp(/^[a-zA-Zก-์ ]*$/),
                            //         message: "ตัวอักษรเท่านั้น"
                            //     }
                            // ]}
                            initialValue={objdetails.LastName}
                        >
                        <Input   /*defaultValue={objdetails.LastName}*//>
                        </Form.Item>
                        
                    </Col>
                </Row>
            </Card>

            <Card title={'แก้ไขเบอร์โทรศัพท์มือถือ'} style={bodyStyleModel}  bodyStyle={bodyStyleModel} headStyle={headStyleModer}>
                {/* <Row > */}
                    {/* <Col span={12} style={{paddingBottom:0}}>  */}
                    <Form.Item >
                        <label style={TitleStyle}>เบอร์โทรศัพท์มือถือ <span style={{color:'red'}}>*</span></label>
                        <Form.Item name="Telphonenumber"  
                            // rules={[
                                // {
                                // pattern: new RegExp(/^[0][689][0-9]{8}$/),
                                // message: "ตัวเลข 0-9 โดยหมายเลขต้องขึ้นต้นด้วย 06, 08, 09 เท่านั้น"
                                // }
                            // ]}
                            initialValue={objdetails.tels}
                        >
                        <Input maxLength={10}  /*defaultValue={objdetails.tels}*//>
                        </Form.Item>
                    </Form.Item>

                    {/* </Col> */}
                {/* </Row> */}
            </Card>
        


            {(orderdetail.mercuryOrderTypeID===1)
                // &&(orderdetail.mercuryOrderStatusName!=='Mapping')
                // &&(orderdetail.mercuryOrderStatusName!=='Waiting')
                // &&(orderdetail.mercuryOrderStatusName!=='Cancel')
                // &&(orderdetail.mercuryOrderStatusName!=='Fail')
                // &&(orderdetail.mercuryOrderStatusName!=='Success')  
                &&<>
                <Meta                           
                    title={
                        <div style={{color:'',fontSize:20,marginTop:16,marginBottom:0}}>
                            เปลี่ยนแปลงนัดหมายงานติดตั้ง
                        </div>
                    }  
                />
                <label  style={TitleStyle}>วัน/เวลา นัดหมายติดตั้ง (ปัจจุบัน)</label><br/>
                <label style={TextStyle}>{moment(objdetails.appointDate).format('LL')} {objdetails.mercuryAppointTimeTypeName}</label>
                <div className="ant-card-meta-description" style={{paddingBottom:'16px'}}>
                    ระบบจะแสดงวันที่สามารถรับงานติดตั้งไม่เกิน 30 วัน รวมทั้งช่วงเวลาที่ว่างรับงาน
                </div>  
                <Appointment changedate={true} appoints={orderdetail.insAppoint.appointZoneCode} choose={objdetails.appointDtm}/>    
                <Card title="รายละเอียดเพิ่มเติม" /*title="ชื่อ-นามสกุล (สำหรับติดต่องานติดตั้ง)"*/ headStyle={{padding:0,color:'#E34625',font:'18'}} bodyStyle={{paddingLeft:0,paddingTop:0,paddingBottom:3}} bordered={false}>
                    <Form.Item name="Note" initialValues={orderdetail.insAppoint.appointNote} >
                    <TextArea rows={4} style={{color:'black',width:'100%',marginBottom:10,background:'#FCF5D0'}} defaultValue={orderdetail.insAppoint.appointNote}/>
                    </Form.Item>
                    
                </Card>
            </>}
            <Row justify="center">
            <Col >     
            <Button htmlType="submit" type="primary"
                style={submitbuttons}
            >
                บันทึกการแก้ไข
            </Button><br/>
            <Button 
                style={Cancelbuttons}
                onClick={()=>{ handleCancel()}}
                disabled={statusBtnCancleAppointment}
            >
                ปิดหน้าต่าง
            </Button>
            </Col>
            </Row>
            </Form>
        </Modal>
        
    </>
    )
}

export default SearchOrderNewServicePage;

