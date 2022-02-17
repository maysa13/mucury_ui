import React, { useContext,useState,useEffect }  from 'react';
import { Form, Card, Input } from 'antd';
//
import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import 'sweetalert2/dist/sweetalert2.css';
import Appointment from '../SearchOrderNewService/ChangeAppointment/ChangeAppointment';
import '../../App.css';
import question from '../../icon/question.png';

/* Icon */
import {
    InfoCircleOutlined
  } from '@ant-design/icons';

/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';
const moment = require('moment');
function Step4(props){
    
   
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [requiredMark, setRequiredMarkType] = useState('optional');

    const [appointmentDetail, setAppointmentDetail] = useState('');

    const {
        selectedMenu,
        setOrderId ,
        setObjData,
        setFullname,
        phoneNumber,
        fullname,
        datcId,
        objdata,
        setAppointment,
        appointment, 
        status_app,
    } = useContext(MercuryContext);

    const  appointmenDeatilChange = (value) => (event)  => {
        console.log("value : ",value)
        setAppointmentDetail(value);
    }

    useEffect(() => {
        //สถานะพื้นที่ถูกเลือก + กรอกข้อมูลครบ 
        console.log("appointment : ",appointment)
        if(appointment){
            if(appointment.Day && appointment.data.appointmentDurationName) {
                props.setStep4Status('success');
                console.log('st4 props.currentStep : ',props.currentStep)
                console.log('st4 1');
                console.log('st4 2');
                // if(props.step5Status === 'default'){
                //     console.log('st4 3');
                //     props.setStep5Status('doing');
                //     //props.clickStepButton(4); 
                //     if(props.currentStep === 4){
                //         console.log('st4 4');
                //         props.setCurrentStep(5);
                //     }    
                // }
                // props.setStep5Status('default');
                if(props.step5Status === 'default'){
                    console.log('st3 6');
                    props.setStep5Status('doing');
                    //props.clickStepButton(5);
                    props.setCurrentStep(5);
                }
            }
        }
        else{
            props.setStep5Status('default');
            if(props.currentStep === 4){
                console.log('st4 7');
                props.setStep4Status('doing');
            }
            else{
                console.log('st4 8');
                props.setStep4Status('default');
            } 
        }
    },[appointment])


    useEffect(() => {
        props.updateAppointmentMoreDetail(appointmentDetail);
    },[appointmentDetail])
   
    useEffect(() => {
        setAppointment(null);
    },[])
    console.log('props.dwZoneCode',props.dwZoneCode)
    return(
        <>
            {props.dwZoneCode!==null&&<div className="card-content bg-white">
                <div style={{padding:'0 12px'}}>
                    <div className="text-cuscany" style={{fontSize:'18px',marginBottom:'8px'}}>
                        <span style={{fontWeight:'bold'}}>STEP 4&nbsp;&nbsp;&nbsp;</span>เจ้าหน้าที่ระบุวันที่และช่วงเวลานัดหมายติดตั้ง                        
                    </div>
                    <div className={`content-title ${(status_app === true)?'':'hide'}`}>
                        ระบบจะแสดงวันที่สามารถรับงานติดตั้งไม่เกิน 30 วัน รวมทั้งช่วงเวลาที่ว่างรับงาน
                    </div>                  
                    <div className={`${(status_app === true)?'':'hide'} ${appointment?(appointment.Day && appointment.data.appointmentDurationName?'hide':''):''}`} style={{color:'red'}}>
                        <InfoCircleOutlined /> กรุณาเลือก วันที่และช่วงเวลานัดหมายติดตั้ง
                    </div> 
                    <Appointment 
                        changedate={true} 
                        appoints={props.dwZoneCode}
                    />
                    <div className={`text-cuscany ${(status_app === true)?'':'hide'}`} style={{fontSize:'16px',marginTop:'8px', marginBottom:'8px'}}>
                        รายละเอียดเพิ่มเติม                        
                    </div>  
                    <TextArea 
                        className={`${(status_app === true)?'':'hide'}`}
                        rows={4} 
                        value={appointmentDetail}
                        onChange={event => setAppointmentDetail(event.target.value) } 
                        style={{color:'black',width:'100%',marginBottom:10}}
                    />

                    <div className={`${(status_app === false)?'':'hide'}`} style={{marginBottom:'26px'}}>ไม่พบข้อมูลที่สามารถนัดหมายติดตั้งได้ในโซน {props.dwZoneCode}</div>
                </div>  
            </div> }    
            {props.dwZoneCode===null&&<div className="card-content bg-white">
                <div style={{padding:'0 12px'}}>
                    <div className="text-cuscany" style={{fontSize:'18px',marginBottom:'8px'}}>
                        <span style={{fontWeight:'bold'}}>STEP 4&nbsp;&nbsp;&nbsp;</span><span  style={{color:'red'}}>กรุณาเลือกข่ายสายที่จะดำเนินการติดตั้ง</span>
                    </div>                   
                    {/* <div  style={{marginBottom:'26px',paddingLeft:'7px',color:'red'}}>กรุณาเลือกข่ายสายที่จะดำเนินการติดตั้ง</div> */}
                </div>  
            </div> }           
        </>
    )
}

export default Step4;