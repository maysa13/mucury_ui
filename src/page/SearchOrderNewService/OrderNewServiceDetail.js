import React, { useContext,useEffect,useState }  from 'react';
import { Row, Col, Card,Button } from 'antd';
import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import 'sweetalert2/dist/sweetalert2.css'
import {
    MercuryContext
} from '../../store/MercuryContext';

import '../../App.css'
import AppBreadcrumb from '../../component/AppBreadcrumb';
import Network from './CustomerDetails/Network';
import Installaddress from './CustomerDetails/Installaddress';
import Installarea from './CustomerDetails/Installarea';

import success from '../../icon/success.svg'
import deletes from '../../icon/delete.png'

import MercuryAPI from '../../api/MercuryAPI.js';
import { isNotError } from '../../helper/UtilityFunction';
const bodyStyleModel={padding:0,margin:0,border:0}
const headStyleModer={color:'',fontSize:20,paddingLeft:'0px',margin:'0px',border:0}
const Deleatebuttons ={
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
  'marginTop': '5px',
}
const mercuryApi = new MercuryAPI();
let Data_Orderdetails ={}

function OrderNewServiceDetail(props) {
  const {
    selectedMenu,
    setOrderId ,  
    objdata,
    setAppointment,
    appointment, 
    setDatcId,
    setObjData,
    set_Orderdetail,
    orderdetail, set_status_Model_edit,uiControlData,
} = useContext(MercuryContext);

// const [orderdetail, setOrderdetail] = useState({});
useEffect(() => {
  setAppointment(null)
  set_status_Model_edit(false)
},[]);


// const menuHandleClick = (parameter) => (event)  => {
//   console.log(parameter)
//     selectedMenu(parameter)        
// };
const showNum=(encryptData)=>{
  if(typeof encryptData === 'string'){
    encryptData=encryptData
  }else if(typeof encryptData === 'number'){
    encryptData = encryptData.toString()
  }else{
    return "รูปแบบข้อมูลไม่ถูกต้อง"
  }
  return  encryptData.substring(0, 7)+'XXXXX'
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

  let cheackArea=[
    //บ้านพักอาศัย
    [
      {
          question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีบ้านใกล้เคียงใช้บริการ 3BB หรือไม่',
          anwser : [
              { label: 'มี 3BB ให้บริการ', value: '1' },             
          ],
          moreThanOne : false
      },
      {
          question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีแนวเสาไฟฟ้าหรือไม่',
          anwser : [
              { label: 'มีแนวเสาไฟฟ้า', value: '1' },
          ],
          moreThanOne : false
      },    
      {
          question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
          anwser : [
              { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับ', value: '1' },
          ],
          moreThanOne : false
      },
      {
          question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
          anwser : [
              { label: 'พื้นที่ส่วนบุคคล', value: '6' }
          ],
          moreThanOne : true
      }
    ]
  ]
  
  let insInfo = orderdetail.insInfo
  let insContact = orderdetail.insContact
  let insAddr = orderdetail.insAddr
  let mercuryOrderStatusName = orderdetail.mercuryOrderStatusName
  let mercuryOrderID = orderdetail.mercuryOrderID

  const DeleteOrder=(OrderDelete)=>{
    console.log('OrderDelete',OrderDelete.mercuryOrderID,'reasonNote',OrderDelete.reasonNote)
    let Delete={
      mercuryOrderID:OrderDelete.mercuryOrderID,
      reasonNote:OrderDelete.reasonNote,
    }
    console.log('Delete',Delete)
    mercuryApi.delOrder(Delete).then(Apidata => {
      if(isNotError(Apidata)){
        Swal.fire({
              imageUrl:success,
              imageHeight:'100px',
              title: 'ระบบดำเนินการลบข้อมูลเรียบร้อยแล้วค่ะ',
             html:'<span style="color:#E34625;fontsize:14">เลขที่คำขอ '+orderdetail.mercuryOrderID+'</span>',
              showCancelButton: true,  
              showConfirmButton:false,                
                  confirmButtonText: 'บันทึกแก้ไข',                
                  cancelButtonText: 'ปิดหน้าต่าง',
                  buttonsStyling: false,
                  customClass: {
                  actions: 'vertical-buttons',
                  confirmButton: 'confirm-buttons',
                  cancelButton: 'cancle-buttons',                    
              },  
          }).then((result) => {
              console.log(result)
              if(result.isDismissed === true){          
                selectedMenu('MenuPage')
              }
          })
      }

      // if(Apidata){
      //   Swal.fire({
      //     imageUrl:success,
      //     imageHeight:'100px',
      //     title: 'ระบบดำเนินการลบข้อมูลเรียบร้อยแล้วค่ะ',
      //    html:'<span style="color:#E34625;fontsize:14">เลขที่คำขอ '+orderdetail.mercuryOrderID+'</span>',
      //     showCancelButton: true,  
      //     showConfirmButton:false,                
      //         confirmButtonText: 'บันทึกแก้ไข',                
      //         cancelButtonText: 'ปิดหน้าต่าง',
      //         buttonsStyling: false,
      //         customClass: {
      //         actions: 'vertical-buttons',
      //         confirmButton: 'confirm-buttons',
      //         cancelButton: 'cancle-buttons',                    
      //     },  
      // }).then((result) => {
      //     console.log(result)
      //     if(result.isDismissed === true){          
      //       selectedMenu('MenuPage')
      //     }
      // })
      // }
    })
  }
  


  const Deleate = () =>{
    
    Swal.fire({
      // icon: 'success',
      // title: 'ยกเลิกการเปลี่ยนแปลงนัดหมาย',
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
              <img src=${deletes} style="width:120" >
          </div>   
          <div style="text-align: center;font-size: 16px;" class="item1">
              <b>เจ้าหน้าที่ต้องการที่จะลบข้อมูล</b></br>
              <b>คำขอติดตั้ง ${orderdetail.mercuryOrderID} ใช่หรือไม่</b>
          </div>   
          <div style="text-align: Left;font-size: 16px;border: 1px solid #E34625;padding: 7px;" class="item1">
              <b style="padding-bottom: 7px;">ข้อมูลลูกค้า</b>              
              <div style="padding-bottom: 7px;">
                  <Text style="color:#E34625;font-size: 12px;" >ชื่อ-นามสกุล</Text><br/>
                  <Text style="font-size: 14px;">${insContact.contactTitelName+' '+insContact.contactFirstName+' '+insContact.contactLastName}</Text>
              </div>  
              <div style="padding-bottom: 7px;">
                  <Text style="color:#E34625;font-size: 12px;" >เบอร์โทรศัพท์มือถือ</Text><br/>
                  <Text style="font-size: 14px;">${showTel(insContact.contactTel)}</Text>
              </div>  
              <div style="padding-bottom: 7px;">
                  <Text style="color:#E34625;font-size: 12px;" >สถานที่ติดตั้ง</Text><br/>
                  <Text style="font-size: 14px;">${insAddr.homeNum+' '+(insAddr.moo===null?'':insAddr.moo)+' '+(insAddr.buildingName===null?'':insAddr.buildingName)+' '+(insAddr.soiName===null?'':insAddr.soiName)+' '+(insAddr.roomName===null?'':insAddr.roomName)+' '+(insAddr.streetName===null?'':insAddr.streetName)+' '+insAddr.tambolName+' '+insAddr.amphurName+' '+insAddr.provinceName+' '+insAddr.zipcode}</Text>
              </div>                                                      
          </div>            
      </div>
  </body>
      `,
      showCancelButton: true,     
      showConfirmButton: true,                
      confirmButtonText: 'ลบข้อมูล',                
      cancelButtonText: 'ไม่ต้องการลบข้อมูล',
      buttonsStyling: false,
      customClass: {
          actions: 'vertical-buttons',
          confirmButton: 'cancle-buttons',
          cancelButton: 'confirm-buttons',                    
      }
  }).then((result) => {
      console.log(result)
      if(result.isDismissed === false){
        console.log('mercuryOrderStatusName =',mercuryOrderID)
        if(mercuryOrderStatusName==='New'){
          let OrderDelete={
            'mercuryOrderID': mercuryOrderID,
            'reasonNote': ""
          }
          DeleteOrder(OrderDelete)
        }else{
          Swal.fire({
                icon:'error',
                imageHeight:'100px',
                title: 'ระบบดำเนินการลบข้อมูลไม่สำเร็จ',
                html:'<span style="color:#E34625;fontsize:14">เนื่องจากเลขที่คำขอ '+orderdetail.mercuryOrderID+' มีสถานะ '+mercuryOrderStatusName+'</span>',
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
            }).then((result) => {
                console.log(result)
                if(result.isDismissed === true){          
                  // selectedMenu('MenuPage')
                }
            })
            
        }

        
    }
  })
  }
 
  return (
  
    <>
      <Row  justify="center">
          <Col span={24}>              
            <Row>
                <Col span={24}>                               
                    <AppBreadcrumb/>                    
                </Col>
            </Row>
            <Row>
                <Col span={24}>                               
                  <Network insNetwork={orderdetail.insNetwork}/>
                </Col>
            </Row>    
            <Row>
                <Col span={24}>                               
                  <Installarea cheackArea={cheackArea} insInfo={insInfo}/>
                </Col>
            </Row>
            
          </Col>
      </Row>
      <Row justify="center">
        <Col span={4}/>
          {!(orderdetail.mercuryOrderStatusName === 'New'|| orderdetail.mercuryOrderStatusName === 'Mapping'|| orderdetail.mercuryOrderStatusName === 'Waiting'|| orderdetail.mercuryOrderStatusName === 'Success' || orderdetail.mercuryOrderStatusName === 'Cancel') &&
            <Col span={8} style={{paddingTop:7}} >  
              <Row justify="center">
                  <Button              
                    style={Deleatebuttons}  type="primary"
                    onClick={()=>{
                      if(orderdetail.mercuryOrderTypeID===1&&orderdetail.mercuryOrderStatusID===1){
                        Deleate()
                      }
                    }}
                  >
                    ลบข้อมูลคำขอ
                  </Button>
              </Row>
            </Col>
          }
          <Col span={8} style={{paddingTop:7}} >  
            <Row justify="center">
              <Button 
                // style={{ marginTop:10,borderColor:'#E34625',background:'white',color:'#E34625',borderRadius:'5px',alignSelf:'center'}}
                style={backbuttons}
                onClick={()=>{ 
                  if(uiControlData.currentMenu==='OrderNewServiceDetail'){
                    selectedMenu('SearchOrderNewService')
                  }else if(uiControlData.currentMenu==='AdvancedSearchtoListtoOrderNewServiceDetail'){
                    selectedMenu('AdvancedSearchCustomerData')
                  } 
                
                }}
              >
                ย้อนกลับ
              </Button> 
            </Row>
          </Col>
        <Col span={4}/>
      </Row>   
         
    </>
  );
};

export default OrderNewServiceDetail;