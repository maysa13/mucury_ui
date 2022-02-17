import React, { useContext, useRef, useEffect, useReducer }  from 'react';

/* Plugin */
import { Row, Col, Tabs, Input, InputNumber, Form, Button, Tooltip, message, Card } from 'antd';
import Script from 'react-load-script';
import MapInstall from './MapInstall';
/* Icon */

import HouseIcon from '../../../icon/house.png';
import VillageIcon from '../../../icon/village.png';
import CondoIcon from '../../../icon/condo.png';
import OfficeBuildingIcon from '../../../icon/office-building.png';
import {
    MercuryContext
} from '../../../store/MercuryContext'
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
  const SubTitleStyle ={
    color:'#656565',
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
 
const Network = (props) => {
    const {
        orderdetail, 
    } = useContext(MercuryContext);
    let insNetwork =orderdetail.insNetwork
    let insAddr =orderdetail.insAddr
  return (
    
    <>
        <Row justify="center">                                 
            <Col span={24}>
                <Card title="STEP 1 ข้อมูลสถานที่ติดตั้งและข่ายสาย"  headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>                
                <div className="content-title" style={SubTitleStyle}>
                    ลักษณะประเภทพื้นที่ติดตั้ง
                </div>
                <Row style={{marginBottom:'10px'}}>
                    {insAddr.mercuryAddrAreaTypeID==1&&<div className={insAddr.mercuryAddrAreaTypeID==1?"button-icon active":"button-icon"} /*onClick={clickAreaInstallTpyeButton(1)}*/ style={{marginRight:'16px'}}>
                        <div>บ้านพักอาศัย</div>
                        <img  src={HouseIcon} style={{width:70,height:70}}/>
                        {/* <HouseIcon className="fill-green" width="70px" height="70px"></HouseIcon> */}
                    </div>}
                    {insAddr.mercuryAddrAreaTypeID==2&&<div className={insAddr.mercuryAddrAreaTypeID==2?"button-icon active":"button-icon"} /*onClick={clickAreaInstallTpyeButton(2)}*/style={{marginRight:'16px'}}>
                        <div>โครงการหมู่บ้าน</div>
                        <img  src={VillageIcon} style={{width:70,height:70}}/>
                        {/* <VillageIcon className="fill-red" width="70px" height="70px"></VillageIcon> */}
                    </div>}
                    {insAddr.mercuryAddrAreaTypeID==3&&<div className={insAddr.mercuryAddrAreaTypeID==3?"button-icon active":"button-icon"} /*onClick={clickAreaInstallTpyeButton(3)}*/ style={{marginRight:'16px'}}>
                        <div>คอนโดมิเนียม</div>
                        <img  src={CondoIcon} style={{width:70,height:70}}/>
                        {/* <CondoIcon className="fill-green" width="70px" height="70px"></CondoIcon> */}
                    </div>}
                    {insAddr.mercuryAddrAreaTypeID==4&&<div className={insAddr.mercuryAddrAreaTypeID==4?"button-icon active":"button-icon"} /*onClick={clickAreaInstallTpyeButton(4)}*/>
                        <div>อาคารสำนักงาน</div>
                        <img  src={OfficeBuildingIcon} style={{width:70,height:70}}/>
                        {/* <OfficeBuildingIcon className="fill-red" width="70px" height="70px"></OfficeBuildingIcon> */}
                    </div>}
                </Row>

                <MapInstall />
                
                <span style={SubTitleStyle}>ข้อมูลข่ายสายที่ใช้</span>
                <Row className={`pointer`} style={{marginBottom: '10px', padding:'8px', border:'1px solid #E34625'}}>
                    <Col span={16}>
                        <div className="text-hotcinnamon" style={{fontSize:'18px',}}>
                            {insNetwork.splfatCode}
                        </div>
                        <div style={{fontSize:'16px'}}>
                            NODE: <span style={{fontWeight: 'bold'}}>{insNetwork.olt}</span>
                        </div>
                        <div style={{fontSize:'16px'}}>
                            GPON: <span style={{fontWeight: 'bold'}}>{insNetwork.gpon}</span>
                        </div>
                        {/* <Row style={{fontSize:'16px'}}>
                            <Col span={4}>
                                PORT: 01
                            </Col>
                            <Col span={20}>
                                PIN: 3
                            </Col>
                        </Row> */}
                    </Col>    
                    <Col span={8}>
                        {/* <div>&nbsp;</div>
                        <div className="text-smalt">ระยะอุปกรณ์ไปยังสถานที่ติดตั้ง</div>
                        <div className="text-smalt" style={{fontSize: '20px', fontWeight: 'bold'}}>230 เมตร</div>
                        <div style={{fontSize: '16px', color:'red'}}>ฟรีค่าลากข่ายสายสำหรับ 500 เมตรแรก</div> */}
                    </Col>  
                </Row> 
                    
                </Card>
            </Col>            
        </Row>
           
    </>
   
  );
};

export default Network;