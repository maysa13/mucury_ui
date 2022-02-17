import React, { useContext,useState,useEffect } from 'react';
import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import {Button, Form, Row, Col, Card,Tooltip,Input,Select,Radio,Upload, Table } from 'antd'
import 'antd/dist/antd.css';

import 'sweetalert2/src/sweetalert2.scss'
import XLSX from 'xlsx' // import xlsx
import MercuryAPI from '../../api/MercuryAPI'
import AppBreadcrumb from '../../component/AppBreadcrumb';
import { isNotError } from '../../helper/UtilityFunction';
/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';
import success from '../../icon/success.svg'
import warn from '../../icon/warn.png';
import edituser from '../../icon/edituser.png';
import adduser from '../../icon/adduser.png';

import moment from 'moment';
import 'moment/locale/th';

    const { Option } = Select;
    const { Column, ColumnGroup } = Table;
    const Card_headStyle ={
        color:'#000000',
        fontSize:20,
        paddingTop:0,
    }
    const Card_BodyStyle ={
        paddingTop:0,
        paddingBottom:3
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
    const submitbuttons_disable ={
        // color: 'rgb(255, 255, 255)',
        width: '222px',
        // backgroundcolor:'#E34625'  ,
        // border:'2px solid #E34625',
        'borderRadius':'7px',
        padding:'0em',
        'marginTop': '5px',
        'marginBottom': '5px',
    }
    const searchbuttons ={
        color: 'rgb(255, 255, 255)',
        width: '100px',
        backgroundcolor:'#E34625'  ,
        border:'2px solid #E34625',
        'borderRadius':'7px',
        padding:'0em',
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
    const hrline={
        border: '2px solid #E34625',
    }
    const TitleStyle ={

    }
    let statusshow = false
    const mercuryApi = new MercuryAPI();



function AdminPage(props) {

    const {
        selectedMenu,
        userLoginData,
        setUserLoginData,
    } = useContext(MercuryContext);

    const [formSeach] = Form.useForm();

    const [dataFrom, setDataFrom] = useState(false);
    const [dataadmin, setdataadmin] = useState({});
    /************************************************/
    

    const [DataUserstatus, setUserstatus] = useState([]);
    const [DataUserstatus_Search, setUserstatus_Search] = useState([]);
    const [StatusIDSearchAdmin,setStatusIDSearchAdmin]  = useState(null);
    const [DataUserrole, setUserrole] = useState([]);
    const [DataUserchannel, setUserchannel] = useState([]);
    const [selectedFileList,setselectedFileList] = useState([]);
    const [importFileList,setimportFileList] = useState([]);
    const [statusimport,setstatusimport] = useState(false);
    const [responeimport,setresponeimport] = useState([]);//responeimnport
    const [importadmin,setimportadmin] = useState([]);
    const [Beforimportadmin,setBeforimportadmin] = useState([]);//ข้อมูลก่อนเข้าApiจากexcel


    const [statusCreate,setstatusCreateEdit]= useState(true);
    //กรณีที่ยังไม่มีการค้นหาข้อมูล หรือยังไม่ได้กดปุ่มสร้างผู้ใช้งาน ต้องการให้ระบบปรับช่องที่แสดงผลด้านล่าง Disable (ช่องสีเทา) รวมถึงปุ่ม บันทึกข้อมูลห้ามกดเช่นกัน 

    useEffect(() => {       
        GetUserstatus()
        GetUserrole()
        GetUserchannel()
    },[]);

    /******************************************* API **********************************************************/
    const GetUserstatus =()=>{
        mercuryApi.getUserstatus().then(data => {
            if(isNotError(data)){
                // console.log('XX',data)
                setUserstatus(data)
                
                let newstatus_add_value_null=[]
                let Start=0,key=0
                console.log(data.length)
                while (Start <= data.length) { 
                    if(data[Start]!==undefined){  
                        console.log(Start,' ',data[Start])                 
                        console.log(data[Start].userStatusID)
                        newstatus_add_value_null.push({
                            userStatusID: data[Start].userStatusID, 
                            userStatusName : data[Start].userStatusName,
                        })  
                    
                    }else{
                        newstatus_add_value_null.push({
                            userStatusID: null, 
                            userStatusName : 'ทุกสถานะ',
                        }) 
                    }
                        Start=Start+1
                }
                console.log('newstatus_add_value_null',newstatus_add_value_null)
                setUserstatus_Search(newstatus_add_value_null)
                

            }
        });         
    } 
    const GetUserrole =()=>{
        mercuryApi.getUserrole().then(data => {
            if(isNotError(data)){
                // console.log(data)
                setUserrole(data)
            }
        });         
    } 
    const GetUserchannel =()=>{
        mercuryApi.getUserchannel().then(data => {
            if(isNotError(data)){
                // console.log(data)
                setUserchannel(data)
            }
        });         
    } 
    
    const GetAllDataAdmin =()=>{
        mercuryApi.getAllData().then(data => {
            console.log('data',data)   
            if(isNotError(data)){
                if(data.length>0){                                   
                    setdataadmin(data)
                    onExport(data)   
                }
            }  
            
        });         
    } 
    const SearchAdmin =(Objseacrch)=>{
        mercuryApi.searchAdmin(Objseacrch).then(data => {
            if(isNotError(data)){
                if(data.userName!==undefined){
                    setdataadmin(data)
                    if(dataadmin!=={}){
                        setDataFrom(true)
                        setstatusimport(false)
                        setstatusCreateEdit(false)
                    }

                }
            }else{
                setdataadmin({})
                setDataFrom(true)
                setstatusimport(false)
                setstatusCreateEdit(true)
            }
        });         
    } 
    const UpdateAdmin =(obj_update)=>{
        let datarefesh={
            userName:'',
            userEmail:obj_update.data_update.userEmail,
            userStatusID:'',
        }
        console.log('----------------------------------------------')
        console.log('แก้ไข User',obj_update.data_update)                        
        console.log('----------------------------------------------')
        let channel='',channelID,role='',roleID,userStatus=''
        if(obj_update.data_update.roleID==='1'){
            role='Admin'
            roleID=1
        }else if(obj_update.data_update.roleID==='2'){
            role="1 Tier"
            roleID=2
        }else if(obj_update.data_update.roleID==='3'){
            role='2 Tier'
            roleID=3
        }
    
        if(obj_update.data_update.channelID==='1'){
            channel='Admin'
            channelID=1
        }else if(obj_update.data_update.channelID==='2'){
            channel="Branded"
            channelID=2
        }
        else if(obj_update.data_update.channelID==='3'){
            channel='Call center'
            channelID=3
        }

        if(obj_update.data_update.userStatusID==='0'){
            userStatus='ยกเลิก'            
        }else if(obj_update.data_update.userStatusID==='1'){
            userStatus="ใช้งาน"
        }
        // <span class="label">Email เดิม : ${dataadmin.userEmail} </span><br/>
        // <span class="label">Username เดิม : ${dataadmin.userName} </span><br/>
        // <span class="label">channel เดิม : ${dataadmin.channelName} </span><br/>
        // <span class="label">role เดิม : ${dataadmin.roleName} </span><br/>
        // <span class="label">status เดิม : ${dataadmin.userStatusName} </span><br/>
        Swal.fire({
            imageUrl:edituser,
            imageHeight:'100px',
            title: 'แก้ไขข้อมูลผู้ใช้งาน',
            html:`                
                <body> 
                    <div class="summarize-box">                         
                        <div style="text-align: left;font-size: 16px;">
                            <span class="label">Email : </span>
                            <span class="data">${obj_update.data_update.userEmail}</span><br/>
                            
                            <span class="label">Username : </span>
                            <span class="data">${obj_update.data_update.userName.toLowerCase()}</span><br/>
                            
                            <span class="label">channel : </span>
                            <span class="data">${channel}</span><br/>
                            
                            <span class="label">role : </span>
                            <span class="data">${role}</span><br/>
                            
                            <span class="label">status : </span>
                            <span class="data">${userStatus}</span><br/>                            
                            
                        </div>                                                            
                    </div>
                </body>
            `,                       
            showCancelButton: true,  
            showConfirmButton: true,                
            confirmButtonText: 'ยืนยันดำเนินการ',                
            cancelButtonText: 'ปิดหน้าต่าง',
            buttonsStyling: false,
            customClass: {
                actions: 'vertical-buttons',
                confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons', 
            }     
          
        }).then((result) => {
            if(result.isConfirmed===true){               
                mercuryApi.updateAdmin(obj_update).then((response)  => {
                    if(isNotError(response)){
                    // if(!response){
                        Swal.fire({
                            imageUrl:success,
                            imageHeight:'100px',
                            title:'แก้ไขข้อมูล',
                            text: 'ระบบดำเนินการแก้ข้อมูลเรียบร้อยแล้วค่ะ',
                            //    html:'<span style="color:#E34625;fontsize:14">เลขที่คำขอ '+orderdetail.mercuryOrderID+'</span>',
                            showCancelButton: true,  
                            showConfirmButton:false,                
                                confirmButtonText: 'บันทึกข้อมูล',                
                                cancelButtonText: 'ปิดหน้าต่าง',
                                buttonsStyling: false,
                                customClass: {
                                actions: 'vertical-buttons',
                                confirmButton: 'confirm-buttons',
                                cancelButton: 'cancle-buttons_2',                    
                            },  
                        }).then((result) => {
                            if(result.isDismissed === true){ 
                                // SearchAdmin(datarefesh)

                                    // เคลียค่าหลังแก้ไข 
                                    setdataadmin({})
                                    setDataFrom(!dataFrom)
                                    formSeach.resetFields()
                                    setstatusCreateEdit(true)
                            }
                        })

                        //set user data info
                        if(obj_update.userID === userLoginData.userID){
                            mercuryApi.authorizationMe().then(data => {
                                if (isNotError(data)) {
                                    setUserLoginData(data);
                                }
                            })
                        }

                    // }
                    }
                });  
            }
        })
             
    } 
    // CheackimportAdmin
    const CheackimportAdmin =(Importdata)=>{
        console.log('Importdata',Importdata)
        var obj={
            user:Importdata
        }
        
        mercuryApi.cheackimportAdmin(obj).then(data => {
            // console.log('ImportAdmin ==============',data.length)
            if(isNotError(data)){
            //    console.log(data)
            setBeforimportadmin(data)
            setimportadmin(data)
            // setresponeimport(data)
            }
        });       
        
        
        
    }

    const ImportAdmin =(ImportAdmin)=>{
        console.log('ImportAdmin ==============',ImportAdmin)
        var obj={
            user:ImportAdmin
        }
        mercuryApi.importAdmin(obj).then(data => {
            // console.log('ImportAdmin ==============',data.length)
            if(isNotError(data)){
                if(data.length!==undefined){
                    setBeforimportadmin([])
                    setresponeimport([])
                    setstatusimport(true)
                    Swal.fire({
                        imageUrl:success,
                        imageHeight:'100px',
                        title: 'ระบบยืนยันนำเข้าข้อมูลเรียบร้อยแล้วค่ะ',
                        //    html:'<span style="color:#E34625;fontsize:14">เลขที่คำขอ '+orderdetail.mercuryOrderID+'</span>',
                        showCancelButton: true,  
                        showConfirmButton:false,                
                            confirmButtonText: 'บันทึกแก้ไข',                
                            cancelButtonText: 'ปิดหน้าต่าง',
                            buttonsStyling: false,
                            customClass: {
                            actions: 'vertical-buttons',
                            confirmButton: 'confirm-buttons',
                            cancelButton: 'cancle-buttons_2',                    
                        },  
                    })
                }
            }
        });         
    }

//formSeach
    const CreateAdmin =(createAdmin)=>{
        // console.log('createAdmin ==============',createAdmin[0])
        
        var objCreateAdmin={
            user:createAdmin
        }
        console.log('----------------------------------------------')
        console.log('สร้าง User',createAdmin)             
        console.log('----------------------------------------------')
        // console.log('obj ==============',objCreateAdmin)
        

        Swal.fire({
            imageUrl:adduser,
            imageHeight:'100px',
            title: 'สร้างข้อมูลผู้ใช้งานใหม่',
            html:`                
                <body> 
                    <div class="summarize-box">                         
                        <div style="text-align: left;font-size: 16px;">
                            <span class="label">Email : </span>
                            <span class="data">${createAdmin[0].userEmail}</span><br/>
                            <span class="label">Username : </span>
                            <span class="data">${createAdmin[0].userName}</span><br/>
                            <span class="label">channel : </span>
                            <span class="data">${createAdmin[0].channelName}</span><br/>
                            <span class="label">role : </span>
                            <span class="data">${createAdmin[0].roleName}</span><br/>
                            <span class="label">status : </span>
                            <span class="data">ใช้งาน</span><br/>
                        </div>                                                            
                    </div>
                </body>
            `,                       
            showCancelButton: true,  
            showConfirmButton: true,                
            confirmButtonText: 'ยืนยันดำเนินการ',                
            cancelButtonText: 'ปิดหน้าต่าง',
            buttonsStyling: false,
            customClass: {
                actions: 'vertical-buttons',
                confirmButton: 'confirm-buttons',
                cancelButton: 'cancle-buttons', 
            }     
          
        }).then((result) => {
            console.log(result)
            if(result.isConfirmed===true){
                mercuryApi.importAdmin(objCreateAdmin).then(data => {
                    // console.log('ImportAdmin ==============',data.length)
                    if(isNotError(data)){               
                            Swal.fire({
                                imageUrl:success,
                                imageHeight:'100px',
                                title:'สร้างข้อมูลใหม่',
                                text: 'ระบบยืนยันนำเข้าข้อมูลเรียบร้อยแล้วค่ะ',
                                //    html:'<span style="color:#E34625;fontsize:14">เลขที่คำขอ '+orderdetail.mercuryOrderID+'</span>',
                                showCancelButton: true,  
                                showConfirmButton:false,                
                                    confirmButtonText: 'บันทึกข้อมูล',                
                                    cancelButtonText: 'ปิดหน้าต่าง',
                                    buttonsStyling: false,
                                    customClass: {
                                    actions: 'vertical-buttons',
                                    confirmButton: 'confirm-buttons',
                                    cancelButton: 'cancle-buttons_2',                    
                                },  
                            })
                            setdataadmin({})
                            setDataFrom(!dataFrom)
                        
                    }
                });  
                
            }
        })
               
    }


    /******************************************* SearchAdmin **********************************************************/
    let ObjectSearch={
        userName:'',
        userEmail:'',
        userStatusID:'',
    }  

    const onFinish = (values) => {    
        setdataadmin({}) 
        if(values.User!== undefined){
            if(values.status===undefined){
                ObjectSearch.userStatusID=1;
                setStatusIDSearchAdmin(1)                
            }else{
                ObjectSearch.userStatusID=values.status;
                setStatusIDSearchAdmin(values.status) 
            }
            let patternCheackTextemail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    // +(@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,})*$
                                    // /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/
            // let patternCheackTextemail=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            let user =values.User.toLowerCase() 
            // console.log('.toLowerCase(): ',user)
            if(user.match(patternCheackTextemail)){
                // DEVtest01@lowercase.com .toLowerCase()  
                console.log('Email') 
                let patternCheackTextemailLowerCase=/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+(@[0-9a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,})*$/
                if(user.match(patternCheackTextemailLowerCase)){
                    ObjectSearch.userEmail=user
                    setDataFrom(false)
                    SearchAdmin(ObjectSearch)
                    setresponeimport([])                   
                    setstatusCreateEdit(false) //กรณีที่ยังไม่มีการค้นหาข้อมูล หรือยังไม่ได้กดปุ่มสร้างผู้ใช้งาน  ต้องการให้ระบบปรับช่องที่แสดงผลด้านล่าง Disable
                }else{
                    Swal.fire({
                        html:
                        '<b style="font-size: 18px;color:#8e0000; font-weight: bold">Email<b/><br/>'+
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุตัวอักษรเป็นพิมพ์เล็กเท่านั้น</text>',
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
                    })
                }
                
            }else{
                console.log('Username')
                ObjectSearch.userName=user
                setDataFrom(false)
                SearchAdmin(ObjectSearch)
                setresponeimport([])
            }  
            
        }else{
            Swal.fire({
                html:
                '<b style="font-size: 18px;color:#8e0000; font-weight: bold">กรุณาระบุ User <b/><br/>'+
                '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุ User ที่ต้องการค้นหา<br/>แล้วดำเนินการค้นหาใหม่อีกครั้งค่ะ</text>',
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
            })
        }
        
    }  

/******************************************* EditAdmin **********************************************************/
let ObjectEdit={
    userID: '',
    userName: "",
    userEmail: "",
    channelID: '',
    roleID: '',
    userStatusID: '',
}

    const onFinishCreate =(values)=>{
        let value=values
        console.log('onFinish',values)
        // let patternCheackTextemail=/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+?\.[A-Za-z]{2,3}$/
        let patternCheackTextemail=/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(@[0-9a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,})*$/
        // let patternCheackTextemail=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        let update={
            userName:"",
            userEmail: "",
            channelID: '',
            roleID: '',
            userStatusID: ''
        }
            if(value.Email!==undefined){
                update.userEmail=value.Email.toLowerCase()        
            }else{
                update.userEmail=dataadmin.userEmail
            }
            if(value.User!==undefined){
                update.userName=value.User  .toLowerCase()  
            }else{
                update.userName=dataadmin.userName
            }
            if(value.channel!==undefined){
                update.channelID=value.channel.toString()
            }else{
                update.channelID=dataadmin.channelID.toString()
            }
            if(value.role!==undefined){
                update.roleID=value.role.toString()
            }else{
                update.roleID=dataadmin.roleID
            }
            if(value.status!==undefined){
                update.userStatusID=value.status.toString()
            }else{
                update.userStatusID=dataadmin.userStatusID
            }
            
            if(update.userName!==undefined&&update.userEmail!==undefined && update.userName!=="" && update.userEmail!==""&&update.userEmail.match(patternCheackTextemail)){
                if(update.channelID===undefined){
                    update.channelID='1'
                }
                if(update.roleID===undefined){
                    update.roleID='1'
                }
                if(update.userStatusID===undefined){
                    update.userStatusID='1'
                }
                let ObjectEdit={
                    data_update:update,
                    userID:dataadmin.userID,
                }  
    
                // vv เพิ่มการสร้าง User     
                if(dataadmin.userID!==undefined){
                    // console.log('UpdateAdmin',dataadmin.userID)
                    UpdateAdmin(ObjectEdit)
                    
                } 
                else if(dataadmin.userID===undefined){
                    let channel='',channelID,role='',roleID
                    let status=value.status
                    if(value.role.toString()==='1'){
                        role='Admin'
                        roleID=1
                    }else if(value.role.toString()==='2'){
                        role="1 Tier"
                        roleID=2
                    }else if(value.role.toString()==='3'){
                        role='2 Tier'
                        roleID=3
                    }
    
                    if(value.channel.toString()==='1'){
                        channel='Admin'
                        channelID=1
                    }else if(value.channel.toString()==='2'){
                        channel="Branded"
                        channelID=2
                    }
                    else if(value.channel.toString()==='3'){
                        channel='Call center'
                        channelID=3
                    }
                    
                    let createAdmin= [{
                        "userName": update.userName,
                        "userEmail": update.userEmail,
                        "channelName": channel,
                        "roleName": role,
                        // "channelID": channelID,
                        // "roleID": roleID,
                        // "createUserStatusID":status,
                    }]
                    var obj={
                        user:createAdmin
                    }
                    mercuryApi.cheackimportAdmin(obj).then(data => {
                        // console.log('ImportAdmin ==============',data.length)
                        if(isNotError(data)){
                            //cheack      
                            if(data[0].createUserStatusID===1&&data[0].createUserStatusRemark==='OK'){
                                // console.log('DO IT')
                               
                                CreateAdmin(data)
                                setstatusCreateEdit(true)
                            }else if(data[0].createUserStatusID===0){
                                console.log(data[0].createUserStatusID)
                                console.log(data[0].createUserStatusRemark)
                                Swal.fire({
                                    html: `
                                        <b style="font-size: 18px;color:#8e0000; font-weight: bold">ระบบบันทึกข้อมูลไม่สำเร็จ<b/><br/>
                                        <text style="font-size: 18px;color:#2B2B2B; font-weight: normal">`+data[0].createUserStatusRemark+`</text>
                                    `,
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
                                })  
                            }
                        }
                    });  
                    // console.log('createAdmin Api=>',createAdmin)
                }
                //^^ เพิ่ม
               
            }else{
                Swal.fire({
                    html:
                    '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ระบบบันทึกข้อมูลไม่สำเร็จ<b/><br/>'+
                    '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาตรวจสอบข้อมูล User หรือ Email ให้ถูกต้อง</text>',
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
                })
            }       
                       
        }   

        /**************************************IMPORT**************************************************/
              

        const dummyRequest = ({ file, onSuccess }) => {
            if(file.type==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
            }           
          };
          
        const onChange = (info) => {            
            console.log('onChange =>',info)
            readFile(info.file)            
            // const dataWS = XLSX.utils.sheet_add_json(info)          
            setselectedFileList([])//เคลียไฟล์
        };
        function readFile(file){
            var f = file;
            // console.log(f.originFileObj,' == ',f.type)
            var name = f.name;
            if(f.type==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                const blob = new Blob([f.originFileObj],{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
            const reader = new FileReader();
            reader.onload = (evt) => {
              // evt = on_file_select event
              /* Parse data */
            //   console.log(evt)
              const bstr = evt.target.result;
              const wb = XLSX.read(bstr, { type: "binary" });
              /* Get first worksheet */
              const wsname = wb.SheetNames[0];
              const ws = wb.Sheets[wsname];
              /* Convert array of arrays */
              const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
              /* Update state */
            //   console.log("Data>>>" + data);// shows that excel data is read   
              let json = convertToJson(data) //ตัวหัวแล้ว
            //   console.log('POST ===>',JSON.parse(json))
              let Arr = JSON.parse(json)
              let ObjData=[]
                Arr.map((value,inx)=>{                
                if(value.UserName!==undefined&&value.UserEmail!==undefined&&value.roleName!==undefined &&value.channelName!==undefined){
                    
                    ObjData.push({
                        userName: value.UserName,
                        userEmail: value.UserEmail,
                        channelName: value.channelName,
                        roleName: value.roleName,                       
                    })
                }
              })
              console.log(ObjData)
                CheackimportAdmin(ObjData)
                // setimportadmin(ObjData)
                // setBeforimportadmin(ObjData)

            };
            reader.readAsBinaryString(blob);
            }else{
                Swal.fire({
                    html:
                    '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่สามารถอัพโหลดได้<b/><br/>'+
                    '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">เนื่องจากไม่ใช่ไฟล์ .xlsx</text>',
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
                })
            }
            
        }
        
          function convertToJson(csv) {
            console.log(csv)
            var lines = csv.split("\n");
        
            var result = [];
            var hearder ='UserName,UserEmail,roleName,channelName'
            var headers = hearder.split(",");
        
            for (var i = 1; i < lines.length; i++) {
              var obj = {};
              var currentline = lines[i].split(",");
        
              for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
              }
        
              result.push(obj);
            }
        
            
            return JSON.stringify(result); //JSON
          }

        const confirmInputAdmin=()=>{
            // console.log('confirmInputAdmin =>>',importadmin)
            // console.log('responeimport =>>',responeimport)
            let cheackstatusFail=0
            Beforimportadmin.map((value,i)=>{
                if(value.createUserStatusID===0){
                    cheackstatusFail=cheackstatusFail+1
                }else{
                    cheackstatusFail=cheackstatusFail+0
                }
            })
           console.log('cheackstatusFail',cheackstatusFail)
            // 
            if(cheackstatusFail===0){
                ImportAdmin(Beforimportadmin)
            }else{
                Swal.fire({
                    html:
                    '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่สามารถยืนยันนำเข้าข้อมูลได้<b/><br/>'+
                    '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">ข้อมูลผู้ใช้งานที่ต้องการนำเข้าไม่ถูกต้อง<br/>กรุณาตรวจสอบก่อนยืนยัน</text>',
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
                })
            }
        }
        /**************************************IMPORT**************************************************/
        
        const onExport=(data)=> {
          console.log('Exoirt => ',data)
          const dataWS = XLSX.utils.json_to_sheet(data)
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, dataWS)
          XLSX.writeFile(wb,'Mercury_All_Admin.xlsx')
        }


        const GetNewAdmin =()=>{
            console.log(responeimport)
            if(responeimport.length>0){
                const dataWS = XLSX.utils.json_to_sheet(responeimport)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, dataWS)
                XLSX.writeFile(wb,'Mercury_New_Admin.xlsx')
            }else if(Beforimportadmin.length>0){
                const dataWS = XLSX.utils.json_to_sheet(Beforimportadmin)
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, dataWS)
                XLSX.writeFile(wb,'Mercury_New_Admin_Cheack.xlsx')
            }
            else{
                Swal.fire({
                    html:
                    '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่สามารถดำเนินการได้<b/><br/>'+
                    '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">เนื่องจากยังไม่ดำเนินการยืนยันนำเข้าผู้ใช้งานใหม่</text>',
                    imageUrl: warn,
                    imageWidth: 100,
                    // text:'ไม่พบข้อมูลที่สามารถนัดหมายติดตั้งได้ในโซน '+ZoneCode,
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
                })
            }
            
        }
        
        const validateMessages = {
            required: 'กรุณาระบุ ${label} ',
            types: {
              email: 'กรุณาระบุ ${label} ให้ถูกต้อง',//'${label} is not a valid email!',
            //   number: '${label} is not a valid number!',
            },
            // number: {
            //   range: '${label} must be between ${min} and ${max}',
            // },
          };

    return(
        <>     
            <Row style={{paddingTop:0, paddingBottom:7}}>
                <AppBreadcrumb />            
            </Row>
            
            <Row justify="center">
                {/* <Button
                    onClick={()=>{
                        console.log('----------------------------------------------')
                        console.log('dataadmin =>',dataadmin)                        
                        console.log('----------------------------------------------')
                    }}
                >Cheack</Button> */}
                <Col span={24}>
                    <Card title="ค้นหาข้อมูลผู้ดูแล"  headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>                        
                        {/*!dataFrom&&*/<Form form={formSeach}  style={{paddingTop:"14px"}}  onFinish={onFinish} >
                            <Row style={{marginBottom:7}}>
                                <Col span={12} offset={0}>
                                    <label style={TitleStyle}>Username and Email</label><br/>
                                    <Form.Item name="User"
                                         rules={[
                                            {type: 'string', required: true, message: 'กรุณาระบุ User', whitespace: true },
                                            {
                                                        // [a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+?\.[a-z]{2,3}
                                                pattern: /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(@[A-Z0-9a-z.-]{2,}[.]{1}[A-Za-z]{2,3})*$/,
                                                message: "กรุณาระบุ User หรือ Email ให้ถูกต้อง"
                                            }
                                          ]}
                                    >
                                        <Input style={{textTransform:'lowercase'}} />                                        
                                    </Form.Item>
                                </Col>
                                <Col  span={7} offset={1}>
                                    <label style={TitleStyle}>User Status</label><br/>
                                    <Form.Item name="status" initialValue={StatusIDSearchAdmin===null?null:StatusIDSearchAdmin}>
                                        <Select >
                                            {DataUserstatus_Search.map((status,index)=>{
                                                console.log(status.userStatusName,'===>',status.userStatusID)
                                                let colortxt;
                                                if(status.userStatusID===0){
                                                    colortxt='red'
                                                }else if(status.userStatusID===1){
                                                    colortxt='green'
                                                }else if(status.userStatusID===null){
                                                    colortxt=''
                                                }
                                                return(
                                                    <Option key={index} value={status.userStatusID} /*disabled={status.userStatusID===2}*/ ><span style={{color:colortxt}}>{status.userStatusName}</span></Option>
                                                    
                                                )
                                            })}

                                        
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col  span={3} offset={1}>
                                <br/>
                                    <Button 
                                        type="primary"
                                        style={searchbuttons}
                                        htmlType="submit"
                                    >
                                        ค้นหา
                                    </Button>
                                </Col>
                            </Row>      
                        </Form>
                    } 
                    </Card>
                    {/* ************************************************************************************************************* */}

                   <Row justify="center">
                    <Col span={24}>
                   
                    <hr style={hrline}/>
                    <Card   headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>  
                        <Row style={{paddingTop:14}}>
                            <Col span={4} style={{margin:0}}/>
                            <Col span={20}  style={{margin:0,display:'flex', justifyContent:'flex-end'}}>                                
                                <Button type=""
                                    onClick={(value)=>{
                                        setdataadmin({});
                                        setDataFrom(!dataFrom);
                                        setstatusimport(false)
                                        setstatusCreateEdit(false) // กรณียังไม่ได้กดปุ่มสร้างผู้ใช้งาน Disable ถ้ากดแล้วจึงเป็น true
                                        formSeach.resetFields()
                                        
                                    }}
                                >
                                    สร้างผู้ใช้งานใหม่
                                </Button>
                                <Button type=""  onClick={(value)=>{setstatusimport(true);setdataadmin({});}}>นำเข้าผู้ใช้งานใหม่จากไฟล์</Button>
                                {statusimport&&<Button type="" onClick={(value)=>{GetNewAdmin()}}>ผลการนำเข้าผู้ใช้งานใหม่เป็นไฟล์</Button>}
                                <Button type="" onClick={(value)=>{GetAllDataAdmin()}}>นำออกผู้ใช้งานเป็นไฟล์</Button>                           
                            </Col>
                        </Row> 
                    </Card>

                    {!statusimport&&<> <Card   headStyle={Card_headStyle} bodyStyle={{paddingTop:0,paddingBottom:0}} bordered={false}>                  
                        <Row>
                          <Col span={23} >
                              {dataadmin.userID!==undefined&&<span style={{fontSize:'20px',fontWeight:'bold'}}>แก้ไขข้อมูลผู้ดูแลใหม่</span>}
                              {dataadmin.userID===undefined&&<span style={{fontSize:'20px',fontWeight:'bold'}}>สร้างข้อมูลผู้ดูแลใหม่</span>}
                            </Col>                         
                        </Row>
                        
                        {dataFrom&&<Form style={{paddingTop:"0px"}}  onFinish={onFinishCreate} validateMessages={validateMessages}>
                        <Row style={{marginTop:7,marginBottom:7}}>
                            <Col span={11}>
                                <span style={TitleStyle}>User</span>                                
                                <Form.Item name="User" initialValue={dataadmin.userName}
                                 rules={[
                                    {type: 'string', required: true, message: '*** รองรับ a-z,0-9,_,.,- สูงสุดไม่เกิน 12 ตัวอักษร', whitespace: true },
                                    {
                                         pattern: /^[A-Za-z0-9_.-]*$/,
                                        message: "*** รองรับ a-z,0-9,_,.,- สูงสุดไม่เกิน 12 ตัวอักษร"
                                    }
                                  ]}>
                                    <Input maxLength={12} disabled={statusCreate}  defaultValue={dataadmin.userName} style={{textTransform:'lowercase'}}/>
                                </Form.Item> 
                            </Col>
                            <Col span={12} offset={1}>
                                <span style={TitleStyle}>Email</span>
                                <Form.Item name="Email" initialValue={dataadmin.userEmail}
                                    rules={[                                      
                                        {
                                            required: true,
                                            message: 'กรุณาระบุ E-mail',
                                        },
                                        {
                                            pattern:  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(@[0-9a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,})*$/,
                                            message: "กรุณาระบุ E-mail ให้ถูกต้อง"
                                        }
                                      ]}>
                                    <Input style={{textTransform:'lowercase'}} disabled={statusCreate} defaultValue={dataadmin.userEmail} />
                                </Form.Item> 
                            </Col>
                        </Row>
                        <Row style={{marginTop:7}}>
                            <Col span={8}>
                                <span style={TitleStyle}>Channel</span>
                                <Form.Item name="channel" initialValue={dataadmin.channelID===undefined?1:dataadmin.channelID}>
                                    <Select disabled={statusCreate} defaultValue={dataadmin.channelID===undefined?1:dataadmin.channelID}>
                                        {DataUserchannel.map((channel,index)=>{
                                            console.log(' DataUserchannel ===>',DataUserchannel)
                                            return(
                                                <Option key={index} disabled={statusCreate} value={channel.channelID}>{channel.channelName}</Option>
                                            )
                                        })}                                      
                                    </Select>
                                </Form.Item>
                            </Col>    
                            <Col span={7} offset={1}>
                                <span style={TitleStyle}>Role</span>
                                {console.log(dataadmin)}
                                <Form.Item name="role" initialValue={dataadmin.roleID===undefined?1:dataadmin.roleID}>
                                    <Select disabled={statusCreate} defaultValue={dataadmin.roleID===undefined?1:dataadmin.roleID}>
                                        {DataUserrole.map((role,index)=>{
                                            // console.log('===>',DataUserrole)
                                            return(
                                                <Option key={index} disabled={statusCreate} value={role.roleID} disabled={role.confStatusID===0}>{role.roleName}</Option>
                                            )
                                        })}                                      
                                    </Select>
                                </Form.Item>
                            </Col> 
                            <Col span={7} offset={1}>
                                <span style={TitleStyle}>User Status</span>
                                <Form.Item name="status" initialValue={dataadmin.userStatusID===2?0:1}>
                                    <Select disabled={dataadmin.userID===undefined?true:false} defaultValue={dataadmin.userStatusID===2?0:1}>
                                        {DataUserstatus.map((status,index)=>{
                                            // console.log('===>',DataUserstatus)
                                            return(
                                                <Option key={index} defaultValue disabled={status.userStatusID===2||statusCreate} value={status.userStatusID}>
                                                    {/* <span style={{}}>{status.userStatusName}</span> */}
                                                    {status.userStatusID===0&&<span style={{color:'red'}}>{status.userStatusName}</span>}
                                                    {status.userStatusID===1&&<span style={{color:'green'}}>{status.userStatusName}</span>}
                                                    {status.userStatusID===2&&<span >{status.userStatusName}</span>}
                                                </Option>
                                            )
                                        })}  
                                    </Select>
                                </Form.Item>
                            </Col>               
                        </Row>
                        <Row style={{marginTop:7}}>
                            <Col span={10} >
                                <span style={TitleStyle}>วันที่ดำเนินการล่าสุด</span>
                                <Tooltip
                                    trigger={['focus']}
                                    placement="topLeft"                                
                                >
                                    <Input disabled defaultValue={moment(dataadmin.lastUpdDtm).format('DD/MM/YYYY HH:mm')} />
                                </Tooltip>
                            </Col>    
                            <Col span={10}/>                        
                        </Row>
                        <Row justify="center" style={{marginTop:15,marginBottom:10}}>
                            <Col span={4}/>
                            <Col span={8}>
                                <Row justify="center" >
                                    <Button 
                                        type="primary"
                                        style={statusCreate===false?submitbuttons:submitbuttons_disable}
                                        htmlType="submit"
                                        disabled={statusCreate}
                                    >
                                        บันทึกข้อมูล
                                    </Button>
                                </Row>
                            </Col> 
                            <Col span={8}>   
                                <Row justify="center" >
                                    <Button 
                                        style={Cancelbuttons}
                                        onClick={()=>{ selectedMenu('MenuPage') }}
                                    >
                                        ไปหน้าหลัก
                                    </Button>
                                </Row>
                            </Col> 
                            <Col span={4}/>
                        </Row>
                    </Form>}

                    
                    
                    
                    {!dataFrom&&<Form  style={{paddingTop:"0px"}}   onFinish={onFinishCreate} validateMessages={validateMessages}>
                        
                        <Row style={{marginTop:7,marginBottom:7}}>
                            <Col span={11}>
                                <span style={TitleStyle}>User</span>                                
                                <Form.Item name="User" initialValue={dataadmin.userName}
                                    rules={[
                                        {type: 'string', required: true, message: '*** รองรับ a-z,0-9,_,.,- สูงสุดไม่เกิน 12 ตัวอักษร', whitespace: true },
                                        {
                                            pattern: /^[A-Za-z0-9_.-]*$/,
                                            message: "*** รองรับ a-z,0-9,_,.,- สูงสุดไม่เกิน 12 ตัวอักษร"
                                        }
                                      ]}
                                >
                                    <Input maxLength={12} disabled={statusCreate} defaultValue={dataadmin.userName} style={{textTransform:'lowercase'}}/>
                                </Form.Item> 
                            </Col>
                            <Col span={12} offset={1}>
                                <span style={TitleStyle}>Email</span>
                                <Form.Item initialValue={dataadmin.userEmail}
                                    name="Email"
                                    rules={[
                                        // {
                                        //   type: 'email',
                                        //   message: 'กรุณาระบุ E-mail ให้ถูกต้อง',
                                        // },
                                        {
                                            required: true,
                                            message: 'กรุณาระบุ E-mail',
                                        },
                                        {
                                            pattern:  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+(@[0-9a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,})*$/,
                                            // pattern: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/,
                                            message: "กรุณาระบุ E-mail ให้ถูกต้อง"
                                        }
                                      ]}>
                                    <Input style={{textTransform:'lowercase'}} disabled={statusCreate} defaultValue={dataadmin.userEmail} />
                                </Form.Item> 
                            </Col>
                        </Row>
                        <Row style={{marginTop:7}}>
                            <Col span={8}>
                                <span style={TitleStyle}>Channel</span>
                                <Form.Item name="channel" initialValue={dataadmin.channelID===undefined?1:dataadmin.channelID}>
                                    <Select disabled={statusCreate} defaultValue={dataadmin.channelID===undefined?1:dataadmin.channelID} >
                                        
                                        {DataUserchannel.map((channel,index)=>{
                                            // console.log('DataUserchannel ===>',DataUserchannel)
                                            return(
                                                <Option key={index} disabled={statusCreate} value={channel.channelID}>{channel.channelName}</Option>
                                            )
                                        })}                                      
                                    </Select>
                                </Form.Item>
                            </Col>    
                            <Col span={7} offset={1}>
                                <span style={TitleStyle}>Role {dataadmin.roleID}</span>
                                <Form.Item name="role" initialValue={dataadmin.roleID===undefined?1:dataadmin.roleID}>
                                    <Select disabled={statusCreate} defaultValue={dataadmin.roleID===undefined?1:dataadmin.roleID}>
                                        {DataUserrole.map((role,index)=>{
                                            // console.log('===>',DataUserrole)
                                            return(
                                                <Option key={index} value={role.roleID} disabled={role.confStatusID===0}>{role.roleName}</Option>
                                            )
                                        })}                                      
                                    </Select>
                                </Form.Item>
                            </Col> 
                            <Col span={7} offset={1}>
                                <span style={TitleStyle}>User Status</span>
                                <Form.Item name="status" initialValue={dataadmin.userStatusID===2?0:1} >
                                    <Select disabled={dataadmin.userID===undefined?true:false} defaultValue={dataadmin.userStatusID===2?0:1}>
                                        {DataUserstatus.map((status,index)=>{
                                            // console.log('===>',DataUserstatus)
                                            return(
                                                <Option key={index} disabled={status.userStatusID===2} value={status.userStatusID}>
                                                    {/* <span style={{color:status.userStatusID===0?'red':'green'}}>{status.userStatusName}</span> */}
                                                    {status.userStatusID===0&&<span style={{color:'red'}}>{status.userStatusName}</span>}
                                                    {status.userStatusID===1&&<span style={{color:'green'}}>{status.userStatusName}</span>}
                                                    {status.userStatusID===2&&<span >{status.userStatusName}</span>}
                                                </Option>
                                            )
                                        })}  
                                    </Select>
                                </Form.Item>
                            </Col>               
                        </Row>
                        <Row style={{marginTop:7}}>
                            <Col span={10} >
                                <span style={TitleStyle}>วันที่ดำเนินการล่าสุด</span>
                                <Tooltip
                                    trigger={['focus']}
                                    placement="topLeft"                                
                                >
                                    <Input disabled defaultValue={moment(dataadmin.lastUpdDtm).format('DD/MM/YYYY HH:mm')} />
                                </Tooltip>
                            </Col>    
                            <Col span={10}/>                        
                        </Row>
                        <Row justify="center" style={{marginTop:15,marginBottom:10}}>
                            <Col span={4}/>
                            <Col span={8}>
                                <Row justify="center" >
                                    <Button 
                                        type="primary"
                                        style={statusCreate===false?submitbuttons:submitbuttons_disable}
                                        htmlType="submit"
                                        disabled={statusCreate}
                                    >
                                        บันทึกข้อมูล
                                    </Button>
                                   
                                </Row>
                            </Col> 
                            <Col span={8}>   
                                <Row justify="center" >
                                    <Button 
                                        style={Cancelbuttons}
                                        onClick={()=>{ selectedMenu('MenuPage') }}
                                    >
                                        ไปหน้าหลัก
                                    </Button>
                                </Row>
                            </Col> 
                            <Col span={4}/>
                        </Row>
                    </Form>}
                    
                </Card></>}
                    
                    {/* {console.log('Beforimportadmin = ',Beforimportadmin)} */}
                    {statusimport&&<Card /*title="รายการผู้ใช้งานใหม่"*/  headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>    
                      
                        <Row>
                            <Col span={24} ><span style={{fontSize:'20px',fontWeight:'bold'}}>รายการผู้ใช้งานใหม่</span></Col>
                            <Col span={24}>
                        {Beforimportadmin.length===0&&responeimport.length===0&&
                        <Table    
                            style={{paddingTop:14,paddingBottom:0}}      
                            locale={{ emptyText: 'ไม่มีข้อมูล' }}  
                            dataSource={[]} 
                            rowKey={(record,i) => i}
                        >

                            {/* <Column title="No"  render={(text, record ,inx) => (
                                    <div key={inx}>
                                        <span> {inx+1}</span>
                                    </div>
                                )}
                            /> */}
                            <Column title="UserName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                        {/* {record.userName} */}
                                    </div>
                                )}
                            />
                             <Column title="User Email"   render={(text, record,inx) => (
                                    <div key={inx}>
                                       {/* {record.userEmail} */}
                                    </div>
                                )}
                            />
                            <Column title="roleName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                      {/* {record.roleName} */}
                                    </div>
                                )}
                            />
                            <Column title="channelName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                       {/* {record.channelName} */}
                                    </div>
                                )}
                            />  
                            <Column title="Status Import"  render={(text, record,inx) => (
                                    <div></div>
                                )}
                            />                           
                                                      
                        </Table>}
                            {Beforimportadmin.length!==0&&
                            <Table    
                            style={{paddingTop:14,paddingBottom:0}}      
                            locale={{ emptyText: 'ไม่มีข้อมูล' }} 
                            scroll={{ y: '100%' }} 
                            dataSource={Beforimportadmin} 
                            rowKey={(record,i) => i}
                        >

                            {/* <Column title="No"  render={(text, record ,inx) => (
                                    <div key={inx}>
                                        <span> {inx+1}</span>
                                    </div>
                                )}
                            /> */}
                            <Column title="UserName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                        {record.userName}
                                    </div>
                                )}
                            />
                             <Column title="User Email"   render={(text, record,inx) => (
                                    <div key={inx}>
                                       {record.userEmail}
                                    </div>
                                )}
                            />
                            <Column title="roleName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                      {record.roleName}
                                    </div>
                                )}
                            />
                            <Column title="channelName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                       {record.channelName}
                                    </div>
                                )}
                            />  
                            <Column title="Status Import"  render={(text, record,inx) => (
                                <div>
                                   {record.createUserStatusID==1&&<span style={{color:'Green'}}>OK</span>}
                                   {record.createUserStatusID==0&&<span style={{color:'red'}}>Fail</span>}
                                </div>
                                )}
                            />                           

                            <Column title="Remark"  render={(text, record,inx) => (
                                 <div>
                                    <span  style={{fontSize:'12',textAlign:'left'}}>{record.createUserStatusRemark}</span>
                                 </div>
                            )}
                            />                           
                        </Table>}
                        {responeimport.length!==0&&
                        <Table    
                            style={{paddingTop:14,paddingBottom:0}}      
                            locale={{ emptyText: 'ไม่มีข้อมูล' }}  
                            dataSource={responeimport} 
                            rowKey={(record,i) => i}
                        >

                            {/* <Column title="No"  render={(text, record ,inx) => (
                                    <div key={inx}>
                                        <span> {inx+1}</span>
                                    </div>
                                )}
                            /> */}
                            <Column title="UserName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                        {record.userName}
                                    </div>
                                )}
                            />
                             <Column title="User Email"   render={(text, record,inx) => (
                                    <div key={inx}>
                                       {record.userEmail}
                                    </div>
                                )}
                            />
                            <Column title="roleName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                      {record.roleName}
                                    </div>
                                )}
                            />
                            <Column title="channelName"  render={(text, record,inx) => (
                                    <div key={inx}>
                                       {record.channelName}
                                    </div>
                                )}
                            /> 
                            <Column title="Status Import"  render={(text, record,inx) => (
                                    <div>
                                       {record.createUserStatusID==1&&<span style={{color:'Green'}}>Success</span>}
                                       {record.createUserStatusID==0&&<span style={{color:'red'}}>Fail</span>}
                                    </div>
                                )}
                            />                            
                                                    
                        </Table>

                        }
                            </Col>
                        </Row>
                        <Row>    
                            
                        </Row>
                            {Beforimportadmin.length!==0&&<Row justify="center" style={{marginTop:0,marginBottom:10}}>
                            <Col span={4}/>
                            <Col span={8}>
                                <Row justify="center" >
                                <Button 
                                        type="primary"
                                        style={submitbuttons}
                                        onClick={()=>{ confirmInputAdmin() }}
                                    >
                                        ยืนยันนำเข้าข้อมูล
                                    </Button>
                                </Row>
                            </Col> 
                            <Col span={8}>   
                                <Row justify="center" >
                                    
                                    <Button 
                                        style={Cancelbuttons}
                                        onClick={()=>{ 
                                            setresponeimport([])
                                            setselectedFileList([]) 
                                            setBeforimportadmin([])
                                        }}
                                    >
                                        ยกเลิกรายการ
                                    </Button>
                                </Row>
                            </Col> 
                            <Col span={4}/>
                        </Row>}

                            {Beforimportadmin.length===0&&<Row justify="center" style={{marginTop:15,marginBottom:10}}>
                            <Col span={8}/>
                            <Col span={8}>
                                <Row justify="center"  >
                                <Upload
                                            fileList={selectedFileList}
                                            customRequest={dummyRequest}
                                            onChange={onChange}
                                        ><Button 
                                        onClick={()=>{ 
                                            setresponeimport([])
                                            // setselectedFileList([]) 
                                            // setBeforimportadmin([])
                                        }}
                                        type="primary"
                                        style={submitbuttons}
                                        // htmlType="submit"                                        
                                    >
                                        เพิ่มผู้ใช้งานใหม่
                                    </Button></Upload>
                                </Row>
                            </Col> 
                            {/* <Col span={8}>   
                                <Row justify="center" >
                                    
                                    <Button 
                                        style={Cancelbuttons}
                                        // onClick={()=>{ selectedMenu('MenuPage') }}
                                    >
                                        ยกเลิกรายการ
                                    </Button>
                                </Row>
                            </Col>  */}
                            <Col span={8}/>
                        </Row>}
                    </Card>}
                </Col>
                </Row>
                
                </Col>
            </Row>
            
        </>
    )
}

export default AdminPage;


