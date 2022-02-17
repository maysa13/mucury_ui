import React, { useContext,useEffect } from 'react';
import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import {Button, Image, Row, Col, Card } from 'antd'
import 'antd/dist/antd.css';
import 'sweetalert2/src/sweetalert2.scss'

import MercuryAPI from '../../api/MercuryAPI'

/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';

/* Icons */
import Search from '../../icon/archive.png';
import LightQuestion from '../../icon/light-question-mark.svg';
import { ReactComponent as IconAdvsearch } from '../../icon/Advsearch.svg';
import { ReactComponent as IconSearch } from '../../icon/Icon_Search.svg';
import { ReactComponent as IconCheackArea } from '../../icon/Icon_CheckArea.svg';
import { ReactComponent as Iconuser } from '../../icon/user.svg';
import { ReactComponent as Icontodolist } from '../../icon/check-list.svg';
import { ReactComponent as IconLaptop } from '../../icon/laptop.svg';
// import { ReactComponent as IconAppointment } from '../../icon/Icon_Appointment.svg';
import IconSearchConfigs  from '../../icon/configuration.png';
const moment = require('moment');
const stylecard = {
    borderRadius:' 14px',
    height:'100%',
}
const bodystyle ={
    textAlign:'center',
    height:'100%',
    fontSize:'11px'
}
const mercuryApi = new MercuryAPI();
function MenuPage(props) {

    const {
        userLoginData,
        selectedMenu,
        setOrderId, 
        set_Capacity,        
        set_Usage,        
        set_Profile_dtacRef,
        set_Orderdetail,
    } = useContext(MercuryContext);
    const menuHandleClick = (parameter) => (event)  => {       
        if(parameter=='SearchOrderNewService'){            
            Swal.fire({
                imageUrl: Search,
                imageHeight:'100px',
                html: `
                    <style>
                        .grid-container {
                          display: grid;
                          grid-gap: 5px;
                          padding: 10px;
                        }
                        .grid-container > div{
                          text-align: center;
                          padding: 0px;
                          font-size: 14px;
                        }
                        .item1 {
                          grid-column: 1 / 3;
                        }
                    </style>
                    
                    <body>
                        <b style="font-size: 20px;">เจ้าหน้าที่กรุณากรอกข้อมูล dtac ref ID<b/><br/>
                        <b style="font-size: 20px;">สำหรับค้นหาข้อมูลคำขอติดตั้ง<b/>
                        <div class="grid-container">
                            <div class="item1">
                                <!--<input type="text" id="Tel" class="swal2-input" placeholder="เบอร์โทรศัพท์มือถือ">-->
                                <text style="color:#b3b3b3"> ระบุเลขที่อ้างอิง dtac ref ID</text>
                                <input style="margin:0px;font-size:18;text-align: center;background-color:#FFF2D3;color:#3758af;font-weight: 900;"  type="text" id="DtacId" class="swal2-input" /*placeholder="ระบุเลขที่อ้างอิง dtac ref ID"*/>
                            </div> 
                        </div>
                    </body>
                `,
                showCancelButton: true,  
                showConfirmButton: true,                
                confirmButtonText: 'ค้นหาคำขอ',                
                cancelButtonText: 'ย้อนกลับ',
                buttonsStyling: false,
                customClass: {
                    actions: 'vertical-buttons',
                    confirmButton: 'search-buttons',
                    cancelButton: 'back-buttons', 
                },
                // cancelButtonColor:'#262523',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    const DtacId = Swal.getPopup().querySelector('#DtacId').value
                    const patternCheack = '^[0-9]*$'
                    console.log('DtacId',DtacId.length)
                    if(DtacId.length>0){
                        if(DtacId.match(patternCheack)&&(DtacId.length === 9)){                                                   
                            return { DtacId: DtacId}        
                        }else {
                            Swal.showValidationMessage(`กรุณาระบุเลขที่อ้างอิง DTAC ให้ถูกต้อง`)
                        }  
                    }else {
                        Swal.showValidationMessage(`กรุณาระบุเลขที่อ้างอิง DTAC ที่ต้องการค้นหา`)
                    }                
                }
              }).then((result) => {
                    console.log('1',result)
                    //isDismissed true
                    // isConfirmed: true
                    if(result.isConfirmed===true){
                        SearchdtacRefID(result.value.DtacId)//API
                        // console.log(Profile_dtacRef.dtacRefStatusID==='3')
                        // if(Profile_dtacRef.dtacRefStatusID==='3'){                            
                        //     if(result.value.DtacId!=='999999999'&&result.value.DtacId!=='888888888'){
                        //         setAppointment(null)                           
                        //         selectedMenu(parameter)
                        //     }else{      
                        //         let DtacId = result.value.DtacId
                                
                        //         let Status //สถานะคำขอไม่พบหรือยกเลิก                                              
                        //         if(DtacId ==='999999999'){
                        //             Status='0' //สถานะไม่พบ
                        //         }else if(DtacId ==='888888888'){
                        //             Status='1' //สถานะยกเลิก
                        //         }

                        //         if(Status==='0'){
                        //             Swal.fire({
                        //                 html:
                        //                 '<b style="font-size: 18px;">ไม่พบข้อมูลคำขอ<b/><br/>'+
                        //                 '<text style="color:#C45C36;font-size: 16px;">เลขที่อ้างอิง dtac ref ID '+DtacId+'</text>',
                        //                 imageUrl: LightQuestion,
                        //                 imageWidth: 400,
                        //                 imageHeight: 200,                                       
                        //                 showCancelButton: true,
                        //                 showConfirmButton: true,                
                        //                 confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
                        //                 cancelButtonText: 'ปิดหน้าต่าง',
                        //                 buttonsStyling: false,
                        //                 customClass: {
                        //                     actions: 'vertical-buttons',
                        //                     confirmButton: 'confirm-buttons',
                        //                     cancelButton: 'cancle-buttons', 
                        //                 },
                        //                 preConfirm: () => {
                        //                     selectedMenu('CheckServiceArea')
                        //                 }
                        //             })
                        //         }else if(Status==='1'){
                        //             Swal.fire({
                        //                 html:
                        //                 '<b style="font-size: 18px;">ข้อมูลคำขอได้ถูกยกเลิกไปแล้ว<b/><br/>'+
                        //                 '<text style="color:#C45C36;font-size: 16px;">เลขที่อ้างอิง dtac ref ID '+DtacId+'</text>',
                        //                 imageUrl: LightQuestion,
                        //                 imageWidth: 400,
                        //                 imageHeight: 200,
                        //                 showCancelButton: true,
                        //                 showConfirmButton: true,                
                        //                 confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
                        //                 cancelButtonText: 'ปิดหน้าต่าง',
                        //                 buttonsStyling: false,
                        //                 customClass: {
                        //                     actions: 'vertical-buttons',
                        //                     confirmButton: 'confirm-buttons',
                        //                     cancelButton: 'cancle-buttons', 
                        //                 },
                        //                 preConfirm: () => {
                        //                     selectedMenu('CheckServiceArea')
                        //                 }
                        //             })
                        //         } 
                        //     }  
                        // }
                       
                    }else if(result.isConfirmed===false){
                        selectedMenu('MenuPage')
                    }
                    

            })
            /****************************************************************************************************/
        }else {
            setOrderId('123456test')
            selectedMenu(parameter)
        }
       
    };
    
    
    /************************** API **************************/
    /* API search*/
    const SearchdtacRefID=(dtacRefID)=>{  
        mercuryApi.search(dtacRefID).then(Apidata => {
            if(Apidata){
                console.log(Apidata)
                set_Profile_dtacRef(Apidata)
                if(Apidata.dtacRefStatusID==='3'){ 
                    Orderdetails('210000061')//orderId
                                    
                }else{
                    Swal.fire({
                            html:
                            '<b style="font-size: 18px;">ไม่พบข้อมูลคำขอ<b/><br/>'+
                            '<text style="color:#C45C36;font-size: 16px;">เลขที่อ้างอิง dtac ref ID '+dtacRefID+'</text>',
                            imageUrl: LightQuestion,
                            imageWidth: 400,
                            imageHeight: 200,                                       
                            showCancelButton: true,
                            showConfirmButton: true,                
                            confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
                            cancelButtonText: 'ปิดหน้าต่าง',
                            buttonsStyling: false,
                            customClass: {
                                actions: 'vertical-buttons',
                                confirmButton: 'confirm-buttons',
                                cancelButton: 'cancle-buttons', 
                            },
                            preConfirm: () => {
                                selectedMenu('CheckServiceArea')
                            }
                    })
                }
            }            
        })      
    }
    const Orderdetails=(mercuryOrderID)=>{ 
        mercuryApi.orderdetails(mercuryOrderID).then(orderdetails => {
            if(orderdetails){  
                set_Orderdetail(orderdetails) 
              
                selectedMenu('SearchOrderNewService')     
            }

        })      
    }
        
        /************************** API **************************/
    console.log(userLoginData)

        /************************** Menu **************************/
    const Searchdtac = () =>{
        return(
            <Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                <Card  hoverable={true} onClick={menuHandleClick('Searchdtac')} style={stylecard} bodyStyle={bodystyle}>
                {/* menuHandleClick('SearchOrderNewService')} */}
                    <IconSearch  width="80px" height="80"/> 
                    <br/>
                    <span>ค้นหาคำขอ</span>
                </Card>
            </Col>   
        )
    }
    
    const AdvancedSearch = () =>{
        return(
            (userLoginData.roleID===1||userLoginData.roleID===3||userLoginData.roleID===4)&&<Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}> {/*user tier 2 ไม่เห็นเมนูค้นหาขั้นสูง => เพิ่มให้ userRoleID=3 เห็นเมนูค้นหาขั้นสูง*/}
                    <Card  hoverable={true} onClick={menuHandleClick('AdvancedSearch')} style={stylecard} bodyStyle={bodystyle}>
                        {/* <img  src={IconAdvsearch} style={{width:80,height:80,color:'#212F6A',marginBottom:7}}/> */}
                        <IconAdvsearch width="80px" height="80"/>
                        <br/>
                        <span>ค้นหาขั้นสูง</span>
                    </Card>
                </Col>  
        )
    }

    const CheckServiceArea = () =>{
        return(
            <Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}>
            <Card hoverable={true} onClick={menuHandleClick('CheckServiceArea')} style={stylecard} bodyStyle={bodystyle}>
                <IconCheackArea width="80px" height="80" style={{color:'#212F6A'}}/>
                <br/>
                <span >ตรวจสอบพื้นที่บริการ</span>
            </Card>
        </Col> 
        )
    }

    const ResetAccressPoint = () =>{
        return(
            <Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                <Card hoverable={true} onClick={menuHandleClick('ResetAccressPoint')} style={stylecard} bodyStyle={bodystyle}>
                    <img  src={IconSearchConfigs} style={{width:80,height:80,color:'#212F6A',marginBottom:7}}/>
                    <br/>
                    <span >แก้ไขปัญหา</span>
                </Card>
            </Col> 
        )
    }
    
    const ResultOrderPage = () =>{
        return(
            (userLoginData.roleID===4)&&<Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                    <Card hoverable={true} onClick={menuHandleClick('ResultOrderPage')} style={stylecard} bodyStyle={bodystyle}>
                        <Icontodolist width="80px" height="80" style={{color:'#212F6A'}}/>
                        <br/>
                        <span >สรุปผลรายการคำขอ</span>
                    </Card>
                </Col>
        )
    }

    const StarFault = () =>{
        return(
            <Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                    <Card hoverable={true} onClick={()=>{window.location.href = process.env.REACT_APP_CCM_STARFALL_PAGE}} style={stylecard} bodyStyle={bodystyle}>
                        <IconLaptop width="80px" height="80" style={{color:'#212F6A'}}/>
                        <br/>
                        <span >Star Fault</span>
                    </Card>
                </Col> 
        )
    }

    const AdminPage = () =>{
        return(
            (userLoginData.roleID===1||userLoginData.roleID===4)&&<Col style={{marginTop:'10px'}} xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                <Card hoverable={true} onClick={menuHandleClick('AdminPage')} style={stylecard} bodyStyle={bodystyle}>
                    <Iconuser width="80px" height="80" style={{color:'#212F6A'}}/>
                    <br/>
                    <span >ผู้ดูแลระบบ</span>
                </Card>
            </Col>
        )
    }

    const Colnull =()=>{
        return(
            <Col xs={{ span: 5, offset: 1 }} lg={{ span: 4, offset: 1 }} />    
        )
        
    }
        /************************** Menu **************************/
        useEffect(() => {
            
        }) 
    return(
        <>     
            <Row justify="center" >
                <Searchdtac />
                <AdvancedSearch/>      
                <CheckServiceArea/>
                <ResetAccressPoint/>
            {/* </Row> */}
            {/* Line Menu 2 */}
            {/* <Row justify="center" > */}
                <AdminPage/>
                <ResultOrderPage/>
                {(userLoginData.roleID===2||userLoginData.roleID===3 && userLoginData.channelID===3) && <StarFault/>}
                <Colnull/>    

                {/*AdminPage  (userLoginData.roleID!==1&&userLoginData.roleID!==4) */}
                {(userLoginData.roleID!==1&&userLoginData.roleID!==4)&&<Colnull/>}

                {/* ResultOrderPage (userLoginData.roleID!==4) */}
                {(userLoginData.roleID!==4)&&<Colnull/>}

                {/* AdvancedSearch (userLoginData.roleID!==1&&userLoginData.roleID!==3&&userLoginData.roleID!==4) */}
                {(userLoginData.roleID!==1&&userLoginData.roleID!==3&&userLoginData.roleID!==4)&&<Colnull/>      }

                {/* StarFault (userLoginData.roleID!==1&&userLoginData.roleID!==3&&userLoginData.roleID!==4) */}
                {(userLoginData.roleID!==2||userLoginData.roleID!==3 && userLoginData.channelID!==3)&&<Colnull/>      }
            </Row>
        </>
    )
}

export default MenuPage;


