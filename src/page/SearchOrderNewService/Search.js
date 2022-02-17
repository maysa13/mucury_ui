import React, { useContext,useState,useEffect,useRef ,useImperativeHandle ,useCallback}  from 'react';
import { Form, Input,Card, Col, Row, PageHeader,Button,Calendar,Modal,InputNumber,Radio,Divider ,DatePicker ,Select ,Tag ,Table,Image ,Alert  } from 'antd';
import { 
    GoogleMap, 
    LoadScript,
    Marker,
    InfoWindow,
    DirectionsService,
    DirectionsRenderer,
    useJsApiLoader,
    Polyline,
    Circle,
    InfoBox
} from '@react-google-maps/api';
import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import 'sweetalert2/dist/sweetalert2.css'

import '../../App.css'
import MercuryAPI from '../../api/MercuryAPI.js';
import { isNotError } from '../../helper/UtilityFunction';
/* Store */
import {
    MercuryContext,setOrderId
} from '../../store/MercuryContext';

/* Icon */
import Search from '../../icon/archive.png';
import IconAdvsearch from '../../icon/Advsearch.png';
import AppBreadcrumb from '../../component/AppBreadcrumb';
import success from '../../icon/success.svg'
import warn from '../../icon/warn.png';
import wifi from '../../icon/wifi.png'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';



const { CheckableTag } = Tag;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;
const moment = require('moment');

/* style */

const Card_headStyle ={
  color:'#E34625',
  fontSize:20
}
const Card_BodyStyle ={
    paddingTop:0,
    paddingBottom:3
 }

const TitleStyle ={
      color:'#E34625',
      fontSize:14
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
const styleRow = {
    marginTop : '14px'
}
const img = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
}
// cancle-buttons{
//     color: #E34625;
//     width: 20vh;
//     background-color:#ffffff  ;
//     border:2px solid #E34625;
//     border-radius: 7px;
//     padding:.5em;
//     margin: 5px;
// }

const searchbuttons ={
    color: 'rgb(255, 255, 255)',
    width: '222px',
    backgroundcolor:'#E34625'  ,
    border:'2px solid #E34625',
    'borderRadius':'7px',
    padding:'0em',
    'marginTop': '5px',
    'marginBottom': '5px',
}
const backbuttons = {
    color: '#E34625',
    width: '222px',
    backgroundcolor:'#ffffff'  ,
    border:'2px solid #E34625',
    'borderRadius':'7px',
    padding:'0em',
    margin: '0px',
}
/* style */

const bodyStyleModel={padding:0,margin:0,border:0}
const headStyleModer={color:'',fontSize:20,paddingLeft:'0px',margin:'0px',border:0}

const mercuryApi = new MercuryAPI();
function Searchdtac(props) {
    const {
        selectedMenu , setObjData , setDatcId , uiControlData ,setAppointment,set_Profile_dtacRef,set_Orderdetail,
    } = useContext(MercuryContext);
    const [map, setMap] = useState(null);
    
  

    const [dtacRefID , setDtacRefID] = useState("");
    const [resetTypeID , setResetTypeID] = useState("1");
    
    const [titleAlertDtacRef , setTitleAlertDtacRef] = useState("");

    useEffect(() => {
       
    },[])
    const onFinish = (values) => {   
        console.log(values)
        InputDtacRefId(values)
        
      };
   
    const InputDtacRefId = (values) => {
        const  value  = (values.dtacrefID);
        const reg = /^-?\d*(\.\d*)?$/;
        const patternCheack = '^[0-9]*$'
        if (value!=="" &&value!==undefined && value.match(patternCheack)) {
                // setDtacRefID(value)
            callSeachDtacRefId(Number(value))
            console.log('dtacRefID',dtacRefID)
            setTitleAlertDtacRef("")
        }else {
            setDtacRefID(dtacRefID)
            setTitleAlertDtacRef(`กรุณาระบุเลขที่อ้างอิง Dtac ref ID ให้ถูกต้อง`)
            Swal.fire({
                html:
                '<b style="font-size: 18px;color:#8e0000; font-weight: bold">กรุณาระบุเลขที่อ้างอิง Dtac ref ID <b/><br/>'+
                '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุเลขที่อ้างอิง Dtac ref ID ที่ต้องการค้นหา<br/>แล้วดำเนินการค้นหาใหม่อีกครั้งค่ะ</text>',
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
    };
   


    /******************** API ****************************/
    
    const callSeachDtacRefId=(value)=>{  
        let dtacRefID={
            'dtacRefID':value
        }
        
   
        mercuryApi.getsearchdtacRefID(dtacRefID).then(Apidata => {
            /* ถ้าได้   5 ให้ไปเรียก api /mercury-api/v1/profile/detl?dtacRefID= เพื่อแสดงหน้าจอ profile ของลูกค้า (คำขอ new service ปิดงานแล้ว เขาจะให้ระบบแสดงหน้าจอ profile แทนหน้าคำขอ)
               ถ้าไม่ใช่ 5 ให้ไปเรียก api /mercury-api/v1/order/detl?mercuryOrderID= เพื่อแสดงหน้าจอ order ของลุกค้า*/
            if(isNotError(Apidata)){
            if(Apidata.dtacRefID!==undefined&&Apidata.dtacRefID!==''){
                // console.log(Apidata)                
                if(Apidata.mercuryOrderStatusID===5){ 
                    setDatcId(dtacRefID)
                    selectedMenu('ResetAccressPoint')                                              
                }
                else if(Apidata.mercuryOrderStatusID===0){
                    set_Profile_dtacRef(Apidata)  
                    // Orderdetails(Apidata.mercuryOrderID)//orderId  
                    Swal.fire({
                        html:
                        '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลคำขอ<b/><br/>'+
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">เนื่องจากคำขอได้ถูกยกเลิกไปแล้ว</text>',
                        imageUrl: warn,
                        imageWidth: 100,
                        // imageHeight: 20,                                       
                        showCancelButton: true,
                        showConfirmButton: false,                
                        confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
                        cancelButtonText: 'ปิดหน้าต่าง',
                        buttonsStyling: false,
                        customClass: {
                            actions: 'vertical-buttons',
                            confirmButton: 'cancle-buttons',
                            cancelButton: 'cancle-buttons_2',  
                        },
                        preConfirm: () => {
                            selectedMenu('CheckServiceArea')
                        }
                    })
                    
                }
                else if(Apidata.mercuryOrderStatusID!==5&&Apidata.mercuryOrderStatusID!==0){
                    set_Profile_dtacRef(Apidata)  
                    Orderdetails(Apidata.mercuryOrderID)//orderId  
                }
            }else{
                Swal.fire({
                    html:
                    '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลคำขอที่ต้องการค้นหา<b/><br/>'+
                    '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">เลขที่อ้างอิง Dtac ref ID: '+value+'</text>',
                    imageUrl: warn,
                    imageWidth: 100,
                    // imageHeight: 20,                                       
                    showCancelButton: true,
                    showConfirmButton: false,                
                    confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
                    cancelButtonText: 'ปิดหน้าต่าง',
                    buttonsStyling: false,
                    customClass: {
                        actions: 'vertical-buttons',
                        confirmButton: 'cancle-buttons',
                        cancelButton: 'cancle-buttons_2',  
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
            if(isNotError(orderdetails)){
            if(orderdetails.mercuryOrderID!==undefined){
            // if(orderdetails.length!=={}){  
                set_Orderdetail(orderdetails)               
                selectedMenu('SearchOrderNewService')     
            }
            }
            // else{
            //     Swal.fire({
            //             html:
            //             '<b style="font-size: 18px;">ไม่พบข้อมูลคำขอที่ต้องการค้นหา<b/><br/>'+
            //             '<text style="color:#C45C36;font-size: 16px;">เลขที่ Order ref ID: '+mercuryOrderID+'</text>',                    
            //             imageUrl: warn,
            //             imageWidth: 100,                                       
            //             showCancelButton: true,
            //             showConfirmButton: false,                 
            //             confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
            //             cancelButtonText: 'ปิดหน้าต่าง',
            //             buttonsStyling: false,
            //             customClass: {
            //                 actions: 'vertical-buttons',
            //                 confirmButton: 'confirm-buttons',
            //                 cancelButton: 'cancle-buttons_2', 
            //             },
            //             preConfirm: () => {
            //                 selectedMenu('CheckServiceArea')
            //             }
            //     })
            // }

        }) 
        // .catch(error => {
        //     Swal.fire({
        //         html:
        //         '<b style="font-size: 18px;">การค้นหา<b/><br/>'+
        //         '<text style="color:#C45C36;font-size: 16px;">'+error+'</text>',                    
        //         imageUrl: warn,
        //         imageWidth: 100,                                       
        //         showCancelButton: true,
        //         showConfirmButton: false,                 
        //         confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
        //         cancelButtonText: 'ปิดหน้าต่าง',
        //         buttonsStyling: false,
        //         customClass: {
        //             actions: 'vertical-buttons',
        //             confirmButton: 'confirm-buttons',
        //             cancelButton: 'cancle-buttons_2', 
        //         },
                
        // })
        // });     
    }
    /******************** API ****************************/
    /************************************************/
    const callAlertDtacRefId =()=>{
        setTitleAlertDtacRef(`กรุณาระบุเลขที่อ้างอิง DTAC`)
    }
    return(
        <>              
            <Row style={{paddingTop:0, paddingBottom:7}}>
                <AppBreadcrumb />              
            </Row>
            <Row justify="center">
                <Col xs={{ span: 14, offset: 0 }} lg={{ span: 14, offset: 0 }}>
                    <Card style={{textAlign : 'center'}}>
                        <Image 
                            style={img}
                            width={100}
                            src={Search}
                            preview = {false}
                        >
                        </Image><br></br>
                        <span style={{fontSize: '18px'}}>เจ้าหน้าที่กรุณากรอกข้อมูล Dtac ref ID</span><br/>
                        <span style={{fontSize: '18px'}}>สำหรับค้นหาข้อมูลคำขอติดตั้ง</span>
                        {/* <div className="grid-container" style={{marginBottom : '6px'}}> */}
                        <Form  style={{paddingTop:"14px"}}  onFinish={onFinish} >
                            {/* <Col xs={{ span: 14 , offset: 5}} lg={{ span: 10, offset: 7}}>                            */}
                                    <label style={TitleStyle}>ระบุเลขที่อ้างอิง Dtac ref ID <span style={{color:'#b3b3b3'}}>*</span></label>
                                    <Form.Item name="dtacrefID"  
                                        rules={[
                                            {
                                            pattern: new RegExp(/^[0-9]{9}$/),
                                            message: "กรุณาระบุเลขที่อ้างอิงให้ถูกต้อง"
                                            }
                                        ]}
                                    ><Col xs={{ span: 14 , offset: 5}} lg={{ span: 10, offset: 7}}>
                                        <Input size='large' maxLength={9} style={{background:'#FFF2D3',textAlign:'center'}}/></Col>
                                    </Form.Item>
                                    <Col xs={{ span: 14 , offset: 5}} lg={{ span: 10, offset: 7}}>                                        
                                        <Button  htmlType="submit"  style={searchbuttons} block type="primary" >ค้นหาคำขอ</Button>  <br/>                            
                                        <Button style={backbuttons} block onClick={()=>{selectedMenu('MenuPage')}}>ย้อนกลับ</Button>
                                    </Col>
                                   
                            {/* </Col>   */}
                        </Form>
                        {/* </div> */}
                        
                    </Card>
                    
                </Col>
            </Row>            
        </>
    )
}

export default Searchdtac;

