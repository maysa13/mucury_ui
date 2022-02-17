import React, { useContext }  from 'react';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import {
    MercuryContext
} from '../../../store/MercuryContext';
import Swal from 'sweetalert2';
import warn from '../../../icon/warn.png';
const TextStyle ={
    fontSize:12
}
const numStyle ={
    fontSize:16,
}
const Calendar = ({ posts,changedate  }) => {
  
    const distanceRow = {
        marginTop : '4px'
    }
    const {
        setAppointment,
        appointment, capacity
    } = useContext(MercuryContext);
    // console.log('Calendar = ',capacity)
    const selectTimeAppoinment = (data) => {
        console.log('selectTimeAppoinment,',data)   
        if(data.data.scdSlot!==0&&data.data.scdSlot!=='0'){
            setAppointment(data)
        }else{
            setAppointment(null)
            // console.log('fail')
            Swal.fire({ 
                imageUrl: warn,
                imageHeight:'100px',
                html:
                `<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลตารางงานติดตั้ง<b/><br/>
                <div style='text-align: center';>
                <div style="font-size: 18px;color:#2B2B2B; font-weight: normal">ไม่มีตารางงานว่างสำหรับนัดหมายติดตั้ง</div>
                <div style="font-size: 18px;color:#2B2B2B; font-weight: normal">วันที่ `+moment(data.Day).format('l')+' '+data.data.appointmentDurationName+`</div>`+   
                `<div style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาเลือกช่วงเวลาอื่นใหม่อีกครั้ง</div>
                </div>`,            
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
    

    var today = new Date()
    
    var dd = String(today.getDate()+1).padStart(2, '0'); //today+1
    console.log('==',posts)
   
  return (
    <ul className='weekdays' style={{textAlign : 'center'}}>
      {posts.map((Day,i) => {       
           return(
           <>
           <li key={i}>           
                <Row /*className={Day.aDate===dd?'active':''}*/ style={{width: '90%'}} >
                     <Col span={24}>
                        <span >{Day.day} </span>
                    </Col>
                    <Col sm span={24}>
                        <span>{Day.aDate}</span>
                    </Col>                                              
                </Row>
                {Day.data.map((v,inx)=>{
                     let cheackindx=inx+1
                     let colorborder,bgcolor,DurationName,DurationCode
                     if(v.DurationCode==='1'){
                         colorborder="#228B22";
                         bgcolor='#2ECC71'
                         DurationName="ช่วงเช้า (08:00-12:00)"
                     }else if(v.DurationCode==='2'){
                         colorborder="#C71585";
                         bgcolor='#9B59B6'
                         DurationName="ช่วงบ่าย (13:00-17:00)"
                     }else if(v.DurationCode==='3'){
                         colorborder="#000080";
                         bgcolor='#3498DB'
                         DurationName='ช่วงค่ำ (18:00-21:00)'
                     }
                     let obj={
                         Day:Day.date,
                         data:{
                             scdSlot:v.scdSlot,
                             appointmentDurationName:DurationName,
                             appointmentDurationCode:v.DurationCode
                         },
                     }
                    // console.log(v)
                    // console.log('appointment',appointment)
                    var durationName=DurationName.split(' ')
                    // console.log(durationName['0'])
                    return(
                       
                        <>
                        <div  key={inx} style={{marginTop : '4px'}}>
                            <Col span={24}>
                                <Card  
                                    bodyStyle={{padding : 7 ,}} 
                                    style={{
                                        cursor: 'pointer', 
                                        width: '90%', 
                                        padding : 0 , 
                                        borderColor : colorborder ,
                                        borderStyle : '',
                                        backgroundColor:(
                                            changedate!==false
                                            &&appointment!==null&&
                                            (Day.date===appointment.Day)&&
                                            (v.scdSlot===appointment.data.scdSlot)&&
                                            (v.DurationCode===appointment.data.appointmentDurationCode)
                                            )?bgcolor:''
                                    }} 
                                    onClick={()=> { 
                                        let cheackDay=moment(Day.date).format('YYYYMMDD')===moment(today).format('YYYYMMDD') //Today
                                        let cheacktime = moment(today).format('LT')<'20:00'; 
                                        // console.log(cheacktime)
                                        if(cheackDay){
                                            console.log('cheackDay === Today')
                                            if(cheacktime){
                                                console.log('cheacktime < 20:00')
                                                changedate!==false&&selectTimeAppoinment(obj)  
                                            }else{
                                                console.log('!!!!!!cheacktime > 20:00')
                                                Swal.fire({
                                                    html:
                                                    '<b style="font-size: 18px;">เจ้าหน้าที่จะต้องดำเนินการนัดหมายติดตั้งในวันถัดไปเท่านั้นเนื่องจากไม่สามารถนัดหมายติดตั้งได้หลังเวลา 2 ทุ่ม<b/><br/>',
                                                    icon: 'warning',
                                                    imageWidth: 400,
                                                    imageHeight: 200,  
                                                    confirmButtonText: 'ปิดหน้าต่าง', 
                                                    buttonsStyling: false,
                                                    customClass: {
                                                        actions: 'vertical-buttons',
                                                        confirmButton: 'cancle-buttons',
                                                        cancelButton: 'cancle-buttons', 
                                                    },

                                                })
                                            }

                                        }else{
                                            // console.log('!!!!!!cheackDay !== Today')
                                            changedate!==false&&selectTimeAppoinment(obj)   
                                        }
                                    }} 
                                    className={changedate!==false?"":''}//cardBox
                                >
                                    <Row style={{padding : 0 }}> 
                                        <Col span={24}>
                                            <span style={TextStyle}>{durationName[0]}</span>
                                        </Col>
                                        <Col span={24}>
                                            <span style={{ fontSize:16}}><b>{v.scdSlot}</b></span>
                                        </Col>
                                    </Row>

                                </Card>
                                
                            </Col>
                        </div>
                        </>
                     )
                })

                }

           </li>
           </>    
           
        
        )})}
    </ul>
  );
};

export default Calendar;



// <li key={i}  >
//             {<>
//                 <Row className={Day.aDate===dd?'active':''} style={{width: '90%'}} >
//                      <Col span={24}>
//                         <span >{Day.day} </span>
//                     </Col>
//                     <Col sm span={24}>
//                         <span>{Day.aDate}</span>
//                     </Col>                                              
//                 </Row>
//             </>}
//             { Day.data.map((data,inx)=>{
//                console.log('Day.data.map((data,inx)=>',data)
               
//                 return(                   
                    
//                 )
//             })

//             }
//         </li>