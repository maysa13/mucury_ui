import React, { useContext,useState,useEffect }  from 'react';
import { Form, Input,Card, Col, Row, PageHeader,Button,Calendar,Modal,InputNumber,Radio } from 'antd';

import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import 'sweetalert2/dist/sweetalert2.css'

import '../../../App.css'
/* Store */
import {
    MercuryContext,setOrderId
} from '../../../store/MercuryContext';


/* Icon */
import AppBreadcrumb from '../../../component/AppBreadcrumb';
import success from '../../../icon/success.svg'
import question from '../../../icon/question.png'
import FlagTH from '../../../icon/thailand.png'
import FlagUK from '../../../icon/UK.png'
import Search from '../../../icon/archive.png';
import LightQuestion from '../../../icon/light-question-mark.svg';

const Card_headStyle ={
    color:'#E34625',
    fontSize:20
  }
  const Card_BodyStyle ={
      paddingTop:0,
      paddingBottom:3
   }
  const SubTitleStyle ={
    color:'#656565',
    fontSize:13
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
  const LanguageActive ={marginLeft:'14px',borderColor:'#E34625',color:'#E34625'}
  const Inputdisable = {color:'black',width:'100%',marginBottom:10,background:'#FCF5D0'}
  const { Meta } = Card;
  const { TextArea } = Input;
  const moment = require('moment');
const Installaddress = () => {
    

    const {
        objdata,orderdetail
    } = useContext(MercuryContext);
    let insContact = orderdetail.insContact
    let insAddr = orderdetail.insAddr
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
  return (
    
        <Row justify="center">                                 
            <Col span={24}>
                <Card title="STEP 3 เจ้าหน้าที่ระบุที่อยู่สถานที่ติดตั้ง"  headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                <Row>
                    <Col span={12} style={{paddingBottom:'0px',paddingTop:'4px'}}>
                        <label  style={SubTitleStyle}>ภาษาที่ใช้ในการติดต่อ</label><br/>
                        {/* <label  style={TextStyle}><img src={Languages==='TH'?FlagTH:FlagUK} style={iconColor}/>{Languages==='TH'?'ภาษาไทย':'ภาษาอังกฤษ'}</label> */}
                        <Form.Item  style={{paddingTop:'4px'}}>
                            <Radio.Group  >
                                {insContact.contactLang==='T'&&<>
                                    <Radio.Button style={LanguageActive} value="TH"><img src={FlagTH} style={iconColor}/> ภาษาไทย</Radio.Button>
                                    {/* <Radio.Button style={{marginLeft:'14px'}} disabled value="Eng"><img src={FlagUK} style={iconColor}/> English</Radio.Button> */}
                                </>
                                }
                                {insContact.contactLang==='E'&&<>
                                    {/* <Radio.Button style={{marginRight:'14px'}} disabled value="TH"><img src={FlagTH} style={iconColor}/> ภาษาไทย</Radio.Button> */}
                                    <Radio.Button style={LanguageActive}  value="Eng"><img src={FlagUK} style={iconColor}/> English</Radio.Button>
                                </>
                                }                
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{paddingBottom:'4px'}}><label style={SubTitleStyle}>ข้อมูลสำหรับติดต่อ และสถานที่ติดตั้ง</label> </Row>
                <Row>     
                      
                    {/* <Col span={3}>
                        <label style={TitleStyle}>คำนำหน้า</label><br/>
                        <label style={TextStyle}    >{insContact.contactTitelName}</label>
                    </Col> */}
                    <Col span={24} >
                        <label style={TitleStyle}>ชื่อลูกค้า </label>
                        <br/>
                        <label style={TextStyle}    >{insContact.contactNameFull}</label>
                    </Col>
                    {/* <Col span={4} offset={1}>
                        <label style={TitleStyle}>นามสกุล </label><br/>
                        <label style={TextStyle}    >{insContact.contactLastName}</label>                          
                    </Col> */}
                </Row>
                <Row>                   
                    <Col span={12} offset={0}>
                        <label style={TitleStyle}>เบอร์โทรศัพท์มือถือ (สำหรับติดต่องานติดตั้ง) </label><br/>
                        <label style={TextStyle}    >{showTel(insContact.contactTel)}</label>                           
                    </Col>
                </Row>
                <Row>     
                    <Col span={24} offset={0}>
                        <label style={TitleStyle}>สถานที่ติดตั้ง</label> <br/>
                        <label style={TextStyle}    >{insAddr.addrFull}</label>                          
                    </Col>              
                    {/* <Col span={2} offset={0}>
                        <label style={TitleStyle}>บ้านเลขที่</label> <br/>
                        <label style={TextStyle}    >{insAddr.homeNum}</label>                          
                    </Col>
                    <Col span={3} offset={2}>
                        <label style={TitleStyle}>หมู่</label><br/>
                        <label style={TextStyle}    >{insAddr.moo!==null?insAddr.moo:'-'}</label>                          
                    </Col>
                    <Col span={8} offset={1}>
                        <label style={TitleStyle}>หมู่บ้าน หรืออาคาร </label> <br/>
                        <label style={TextStyle}    >{insAddr.buildingName!==null?insAddr.buildingName:'-'}</label>                          
                    </Col> */}
                </Row>               
                {/* <Row>                   
                    <Col span={2} offset={0}>
                        <label style={TitleStyle}>ซอย</label> <br/>
                        <label style={TextStyle}    >{insAddr.soiName!==null?insAddr.soiName:'-'}</label>                         
                    </Col>
                    <Col span={3} offset={2}>
                        <label style={TitleStyle}>ห้อง</label>
                        <br/>
                        <label style={TextStyle}    >{insAddr.roomName!==null?insAddr.roomName:'-'}</label>                          
                    </Col>
                    <Col span={9} offset={1}>
                        <label style={TitleStyle}>ถนน </label>
                        <br/>
                        <label style={TextStyle}    >{insAddr.streetName!==null?insAddr.streetName:'-'}</label>                            
                    </Col>
                </Row> */}                
                {/* <Row>                   
                    <Col span={9} offset={0}>
                        <label style={TitleStyle}>ตำบล อำเภอ จังหวัด </label>
                        <br/>
                        <label style={TextStyle}    >{insAddr.tambolName+' '+insAddr.amphurName+' '+insAddr.provinceName}</label>                         
                    </Col>
                </Row> */}
                {/* <Row>                   
                    <Col span={9} offset={0}>
                        <label style={TitleStyle}>รหัสไปรษณี </label><br/>
                        <label style={TextStyle}    >{insAddr.zipcode}</label>
                    </Col>
                </Row> */}
                </Card>
            </Col>            
        </Row>  
   
  );
};

export default Installaddress;