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
/* Store */
import {
    MercuryContext,setOrderId
} from '../../store/MercuryContext';

/* Icon */
import Search from '../../icon/archive.png';
import IconAdvsearch from '../../icon/Advsearch.png';
import AppBreadcrumb from '../../component/AppBreadcrumb';
import success from '../../icon/success.svg'
import LightQuestion from '../../icon/light-question-mark.svg';
import wifi from '../../icon/wifi.png'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import warn from '../../icon/warn.png';

/*componant */
import MapCheckService from '../CheckSerivceArea/MapCheckService'
import ShowMapPage from './ShowMap'

const { CheckableTag } = Tag;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;
const moment = require('moment');

/* style */

const Card_headStyle ={
  color:'#D1410C',
  fontSize:20
}
const Card_BodyStyle ={
    paddingTop:0,
    paddingBottom:3
 }

const TitleStyle ={
    color:'tomato',
    fontSize: '13px'
}
const TextStyle ={
    fontSize: '16px',
    marginTop : 0
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
    marginTop : '12px'
}
const img = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
}
const searchbuttons ={
    color: 'rgb(255, 255, 255)',
    width: '222px',
    backgroundcolor:'#E34625'  ,
    border:'2px solid #E34625',
    borderRadius:'7px',
    padding:'0em',
    marginTop: '5px',
    marginBottom: '5px',
}
const backbuttons = {
    color: '#E34625',
    width: '222px',
    backgroundcolor:'#ffffff'  ,
    border:'2px solid #E34625',
    borderRadius:'7px',
    padding:'0em',
    margin: '0px',
}
/* style */

const bodyStyleModel={padding:0,margin:0,border:0}
const headStyleModer={color:'',fontSize:20,paddingLeft:'0px',margin:'0px',border:0}

const mercuryApi = new MercuryAPI();
function ResetAcressPointPage(props) {
    const {
        selectedMenu , setObjData , datcId , setDatcId , uiControlData ,setAppointment
    } = useContext(MercuryContext);
    const [map, setMap] = useState(null);
    const onLoadMap = useCallback(function callback(map) {
        // addEventClickPinInstallMarker(map);
        // setStartDrawButtonToMap(map);
        // setClearDrawButtonToMap(map);
        // setUndoDrawButtonToMap(map);
        setMap(map);
    }, [])
    const onUnmountMap = useCallback(function callback(map) {
        setMap(null)
    }, [])
    const [showPopupSearch, setShowPopupSearch] = useState(true)
    const [showPopupHistory, setShowPopupHistory] = useState(false)
    const [showPopupResetWifiRouter, setShowPopupResetWifiRouter] = useState(false)
    const [showPopupResetWifiRouterSuccess, setShowPopupResetWifiRouterSuccess] = useState(false)

    const [dtacRefID , setDtacRefID] = useState("");
    const [resetTypeID , setResetTypeID] = useState("1");
    const [wifiSSID , setWifiSSID] = useState("");
    const [wifiPass , setWifiPass] = useState("");
    const [dataResetAccressPoint , setDataResetAccressPoint] = useState();
    const [dataServiceWifiResetAccressPoint , setDataServiceWifiResetAccressPoint] = useState({});
    const [dataHistoryResetAccressPoint , setDataHistoryResetAccressPoint] = useState([]);
    const [installLatLng , setInstallLatLng] = useState({
        lat: 13.6055629,
        lng: 100.5194567
    });
    const [offsetButton,setOffsetButton] = useState("1");
   

    // -----------------text Alert-----------
    const [titleAlertDtacRef , setTitleAlertDtacRef] = useState("");
    const [alertwifi , setAlertwifi] = useState("*** รองรับตัวเลข 0-9 หรือ a-z หรือ A-Z อย่างน้อย 8-16 ตัวอักษร")

    useEffect(() => {
        console.log('datcId',datcId)
        if(datcId.dtacRefID!==undefined){
            console.log('datcId',datcId)
            setDtacRefID(datcId.dtacRefID)
            callSeachDtacRefId()
        }
    },[])

    const handelClickList = function(record){
        console.log('record',record)
        // setObjData(record)  
        // setDatcId(record.DtacId)
        // selectedMenu('AdvancedSearchCustomerData')
    }
    const onChangeInputDtacRefId = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        const patternCheack = '^[0-9]*$'
        console.log(value)
        if ((!isNaN(value) && value.match(patternCheack))) {
            setDtacRefID(value)
            console.log('dtacRefID',dtacRefID)
            setTitleAlertDtacRef("")
        }
        else {
            setDtacRefID(dtacRefID)
            setTitleAlertDtacRef(`กรุณาระบุเลขที่อ้างอิง DTAC ให้ถูกต้อง`)
        }   
    };
    const onChangeInputWifiSSID = e => {
        const { value } = e.target;
        console.log(value)
        setWifiSSID(value)
    };
    const onChangeInputWifiPass = e => {
        const { value } = e.target;
        var passw =  /^[A-Za-z0-9]{8,16}$/;
        setWifiPass(value)
        if(value.match(passw)){
            setAlertwifi("")
            console.log('match')
        }
        else{
            setAlertwifi("*** รองรับตัวเลข 0-9 หรือ a-z หรือ A-Z อย่างน้อย 8-16 ตัวอักษร")
            console.log('not')
        }
    };


    /******************** API ****************************/
    const callSeachDtacRefId = () => {
        let input = ""
        if(datcId.dtacRefID){
            input = datcId.dtacRefID
        }
        else{
            input = dtacRefID
        }
        if(datcId.dtacRefID!==undefined || titleAlertDtacRef==="" && dtacRefID!=="" && dtacRefID.length===9){
            mercuryApi.search(input).then(data => {
                console.log('callSeachDtacRefId',data)
                if(data.dtacRefID){
                    if(data.dtacRefContactTel){
                        let tel1 = data.dtacRefContactTel.substring(0,3);
                        let tel2 = data.dtacRefContactTel.substring(3,6);
                        let tel3 = data.dtacRefContactTel.substring(6,10);
                        let Tel = tel1+'-'+tel2+'-'+tel3
                        data.dtacRefContactTel = Tel
                    }
                    setDataResetAccressPoint(data)
                    const latLng = {
                        lat: parseFloat(data.insAddrLat),
                        lng: parseFloat(data.insAddrLng)
                    }
                    setInstallLatLng(latLng)
                    setShowPopupSearch(false)
                    if(data.dtacRefStatusID===4){
                        setOffsetButton("0")
                    }
                }
                else{
                    Swal.fire({
                        html:
                        '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลคำขอที่ต้องการค้นหา<b/><br/>'+
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">เลขที่อ้างอิง Dtac ref ID: '+dtacRefID+'</text>',                    
                        imageUrl: warn,
                        imageWidth: 100,                                        
                        showCancelButton: true,
                        showConfirmButton: false,                
                        // confirmButtonText: 'สร้างคำขอติดตั้งบริการใหม่',                
                        cancelButtonText: 'ปิดหน้าต่าง',
                        buttonsStyling: false,
                        customClass: {
                            actions: 'vertical-buttons',
                            confirmButton: 'confirm-buttons',
                            cancelButton: 'cancle-buttons_2', 
                        }
                    })
                }
               
            });
        }
    }
    const callServiceWifiDtacRefId = () => {
        mercuryApi.getServiceWifiDtacRef(dtacRefID).then(data => {
            console.log('getServiceWifiDtacRef',data)
            if(data){
                setDataServiceWifiResetAccressPoint(data)
                setWifiSSID(data.wifiSSID)
                setWifiPass(data.wifiPass)
                setShowPopupResetWifiRouter(true)
            }  
        });
      
    }
    const callHistoryWifiDtacRefId = () => {
        mercuryApi.getServiceWifiHistory(dtacRefID).then(data => {
            console.log('getServiceWifiHistory',data)
            if(data.length!==undefined){
                const datamap = data.map((item , index)=>{
                    return {
                        historyDtm : item.historyDtm , 
                        historyTypeID : item.historyTypeID,
                        historyTypeName : item.historyTypeName,
                        historyUser : item.historyUser,
                        key : 'A'+index
                    }
                })
                setDataHistoryResetAccressPoint(datamap)
                setShowPopupHistory(true)
            }  
        });
      
    }
    const callUpdateServiceWifi = () => {
        let input = {
            dtacRefID:dtacRefID,
            resetTypeID:resetTypeID,
            wifiSSID:wifiSSID,
            wifiPass:wifiPass
        }
        if(alertwifi===""){
            mercuryApi.updateServiceWifiDtacRef(input).then(data => {
                console.log('updateServiceWifiDtacRef',data)
                if(!data){
                    setShowPopupResetWifiRouter(false)
                    setShowPopupResetWifiRouterSuccess(true)
                    setAlertwifi("*** รองรับตัวเลข 0-9 หรือ a-z หรือ A-Z อย่างน้อย 8-16 ตัวอักษร")
                }  
            });
        }
       
      
    }
    /******************** API ****************************/
    /************************************************/
    return(
        <>              
            <Row style={{paddingTop:0, paddingBottom:7}}>
                <AppBreadcrumb set = "setDatcIdnull"/>              
            </Row>
            {showPopupSearch && 
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
                            <Form  style={{paddingTop:"14px"}} >
                                {/* <Col xs={{ span: 14 , offset: 5}} lg={{ span: 10, offset: 7}}>                            */}
                                        <label style={TitleStyle}>ระบุเลขที่อ้างอิง Dtac ref ID <span style={{color:'#b3b3b3'}}>*</span></label>
                                        <Form.Item name="dtacrefID"  
                                            rules={[
                                                {
                                                pattern: new RegExp(/^[0-9]{9}$/),
                                                message: "กรุณาระบุเลขที่อ้างอิงให้ถูกต้อง"
                                                }
                                            ]}
                                        >
                                            <Col xs={{ span: 14 , offset: 5}} lg={{ span: 10, offset: 7}}>
                                                <Input size='large' 
                                                    maxLength={9} 
                                                    style={{background:'#FFF2D3',textAlign:'center'}}  
                                                    value={dtacRefID}  
                                                    onChange={onChangeInputDtacRefId} >
                                                </Input>
                                            </Col>
                                        </Form.Item>
                                        <Col xs={{ span: 14 , offset: 5}} lg={{ span: 10, offset: 7}}>                                        
                                            <Button style={searchbuttons} block type="primary" onClick={callSeachDtacRefId} >ค้นหาคำขอ</Button>  <br/>                            
                                            <Button style={backbuttons} block onClick={()=>{selectedMenu('MenuPage')}}>ย้อนกลับ</Button>
                                        </Col>
                                    
                                {/* </Col>   */}
                            </Form>
                            {/* </div> */}
                            
                        </Card>
                        
                    </Col>
                </Row>            
            }
            <Row justify="center">                                 
                <Col span={24}>
                    {showPopupSearch===false && <Card headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                        <Row style={{marginBottom : '10px',padding:'6px 0 6px 0'}}>
                            <Col><span style={{fontWeight : 'bolder' , fontSize : '20px'}}>ข้อมูลลูกค้า</span></Col>
                        </Row>
                        <Row>
                            <Col  xs={{ span: 24}} sm={{ span: 24}} md={{ span: 10, offset: 0}} lg={{ span: 10, offset: 0}} xl={{ span: 10, offset: 0}}>
                                <span style={TitleStyle}>Dtac ref ID</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.dtacRefID}</span>
                            </Col>
                            <Col  xs={{ span: 24}} sm={{ span: 24}} md={{ span: 10, offset: 0}} lg={{ span: 10, offset: 0}} xl={{ span: 10, offset: 0}}>
                                <span style={TitleStyle}>สถานะ 3BB</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.dtacRefStatusName}</span>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col  xs={{ span: 24}} sm={{ span: 24}} md={{ span: 10, offset: 0}} lg={{ span: 10, offset: 0}} xl={{ span: 10, offset: 0}}>
                                <span style={TitleStyle}>ชื่อ-นามสกุล</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.dtacRefName?dataResetAccressPoint.dtacRefName:'-'}</span>
                            </Col>
                            <Col  xs={{ span: 24}} sm={{ span: 24}} md={{ span: 10, offset: 0}} lg={{ span: 10, offset: 0}} xl={{ span: 10, offset: 0}}>
                                <span style={TitleStyle}>เบอร์โทรศัพท์มือถือ</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.dtacRefContactTel?dataResetAccressPoint.dtacRefContactTel:'-'}</span>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col  xs={{ span: 24}} lg={{ span: 12}}>
                                <span style={TitleStyle}>สถานที่ติดตั้ง</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.insAddrFull?dataResetAccressPoint.insAddrFull:'-'}</span>
                            </Col>
                            <Col  xs={{ span: 8}} lg={{ span: 4}}>
                                <span style={TitleStyle}>ละติจูด</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.insAddrLat?dataResetAccressPoint.insAddrLat:'-'}</span>
                            </Col>
                            <Col  xs={{ span: 8}} lg={{ span: 4}}>
                                <span style={TitleStyle}>ลองติจูด</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.insAddrLng?dataResetAccressPoint.insAddrLng:'-'}</span>
                            </Col>
                        </Row>
                        <Divider style={{background : '#E34625' , fontWeight : 'bolder' ,  borderWidth: 4, }}/> 
                        <Row style={{marginBottom : '8px',marginTop : '10px',padding:'6px 0 6px 0'}}>
                            <Col xs={20} sm={20} md={22} lg={22} xl={22}>
                                <span style={{fontWeight : 'bolder' , fontSize : '20px'}}>ข้อมูลสินค้าและบริการที่ได้รับ</span>
                                
                            </Col>
                            {/* <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                <Button title="ประวัติรายการแก้ไข WIFI ROUTER" onClick={callHistoryWifiDtacRefId}>
                                    <Image 
                                        style={img}
                                        width={20}
                                        src={wifi}
                                        preview = {false}
                                    >
                                    </Image>
                                </Button>
                            </Col> */}
                        </Row>
                        {/* <Row style={styleRow}>
                            <Col span={24}>
                                <span style={TitleStyle}>Package</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.mercuryPackageID?dataResetAccressPoint.mercuryPackageID:'-'} {dataResetAccressPoint.mercuryPackageID!=="" && ':'} {dataResetAccressPoint.mercuryPackageName}</span>
                            </Col>
                        </Row> */}
                        <Row style={styleRow}>
                            <Col span={24}>
                                <span style={TitleStyle}>Package Speed</span><br></br>
                                <span style={TextStyle}>{dataResetAccressPoint.mercuryPackageSpeedDown?dataResetAccressPoint.mercuryPackageSpeedDown:'-'}{dataResetAccressPoint.mercuryPackageSpeedDown!=="" && '/'}{dataResetAccressPoint.mercuryPackageSpeedUp}</span>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col xs={{ span: 8, offset: 0 }} lg={{ span: 4, offset: 0 }}>
                                <Card style={{textAlign:'center' ,  background : '#DCDCDC'}}>
                                    <span style={TitleStyle}>ความเร็วดาวน์โหลดสูงสุด</span><br></br>
                                    <span style={{fontWeight : 'bolder' , fontSize : '18px'}}>{dataResetAccressPoint.mercuryPackageSpeedDown}</span><br></br>
                                    {/* <span>Mbps</span><br></br> */}
                                </Card>
                            </Col>
                            <Col xs={{ span: 8, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                                <Card style={{textAlign:'center' , background : '#DCDCDC'}}>
                                    <span style={TitleStyle}>ความเร็วอัปโหลดสูงสุด</span><br></br>
                                    <span style={{fontWeight : 'bolder' , fontSize : '18px'}}>{dataResetAccressPoint.mercuryPackageSpeedUp}</span><br></br>
                                    {/* <span>Mbps</span><br></br> */}
                                </Card>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            {dataResetAccressPoint.dtacRefStatusID !== 4 &&<Col xs={{ span: 8, offset: 0 }} lg={{ span: 4, offset: 0 }}>
                                <Button block type="primary" onClick={callServiceWifiDtacRefId}>Reset WIFI Router</Button>
                            </Col>}
                            <Col xs={{ span: 8, offset:offsetButton}} lg={{ span: 4, offset: offsetButton }}>
                                <Button block type="primary" onClick={callHistoryWifiDtacRefId}>ประวัติแก้ไข WIFI Router</Button>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col span={24}>
                                <ShowMapPage  latlng = {installLatLng}></ShowMapPage>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col xs={{ span: 12 , offset: 5}} lg={{ span: 10, offset: 7}}>
                                <Button block onClick={()=>{selectedMenu('MenuPage');setDatcId("")}}>กลับไปหน้าหลัก</Button>
                            </Col>
                        </Row>
                    </Card> }               
                </Col>            
            </Row>
            <Modal 
                title={<div style={{fontSize : '18px' , fontWeight : 'bold'}}>Reset Wifi Router</div>} 
                visible={showPopupResetWifiRouter}
                footer={null}
                closable={false}
            >
                <div>
                    <Row>
                        <Col  xs={{ span: 24}} lg={{ span: 24}}>
                            <span style={TitleStyle}>Dtac ref ID</span><br></br>
                            <span style={TextStyle}>{dataServiceWifiResetAccressPoint.dtacRefID}</span>
                        </Col>
                    </Row>
                    <Row style={styleRow}>
                        <Col  xs={{ span: 24}} lg={{ span: 24}}>
                            <span style={TitleStyle}>wifi SSID</span><br></br>
                            <Input value={wifiSSID} maxLength={15} onChange={onChangeInputWifiSSID}></Input>
                        </Col>
                    </Row>
                    <Row style={styleRow}>
                        <Col  xs={{ span: 24}} lg={{ span: 24}}>
                            <span style={TitleStyle}>wifi Password</span><br></br>
                            <Input.Password maxLength={16} minLength={8} value={wifiPass} onChange={onChangeInputWifiPass}></Input.Password>
                            <span style={{color : 'red' , fontSize : '11px'}}>{alertwifi}</span>
                        </Col>
                    </Row>
                    <Row style={styleRow}>
                        <Col xs={{ span: 12 , offset: 5}} lg={{ span: 10, offset: 7}}>
                            <Button block type="primary" onClick={callUpdateServiceWifi} disabled={wifiSSID==='' ||wifiPass==='' || alertwifi!==''}>Reset Wifi Router</Button>
                        </Col>
                    </Row>
                    <Row style={styleRow}>
                        <Col xs={{ span: 12 , offset: 5}} lg={{ span: 10, offset: 7}}>
                            <Button block onClick={()=>{setShowPopupResetWifiRouter(false)}}>กลับไปหน้าหลัก</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
            <Modal
                // title="Reset Wifi Router" 
                visible={showPopupResetWifiRouterSuccess}
                footer={null}
                closable={false}
            >
                <div style={{textAlign : 'center'}}>
                    <Row style={styleRow}>
                        <Col span={24}>
                            <Image
                                style={img}
                                width={100}
                                src={success}
                                preview = {false}
                            />
                        </Col>
                    </Row>
                    <Row style={styleRow}>
                        <Col span={24}>
                            <span style={{fontSize: '18px',color:'#2B2B2B', fontWeight: 'norma'}}>ระบบดำเนินการบันทึกข้อมูล Reset Wifi Router สำเร็จเรียบร้อยแล้วค่ะ</span>
                        </Col>
                    </Row>
                    <Row style={styleRow}>
                        <Col xs={{ span: 12 , offset: 6}} lg={{ span: 10, offset: 7}}>
                            <Button size="large" block style={{background : '#2B2B2B',color : 'white'}} onClick={()=>{setShowPopupResetWifiRouterSuccess(false)}}>ตกลง,ปิดหน้าต่าง</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
            <Modal 
                title={<div style={{fontSize : '18px' , fontWeight : 'bold'}}>ประวัติรายการแก้ไข WIFI Router</div>} 
                visible={showPopupHistory}
                footer={null}
                closable={false}
                width={'80%'}
            >
                <div>
                    <Table 
                        dataSource={dataHistoryResetAccressPoint} 
                        locale={{ emptyText: 'ไม่มีข้อมูลที่ค้นหา' }}
                        rowKey={record => record.key}
                        onRow={(record) => ({
                            onClick: () => {
                                handelClickList(record);
                            },
                        })}
                    
                    >
                        <Column title="Create Date" dataIndex="historyDtm" key="key" render={(text, record) => (
                            <div>
                                <span>{moment(record.historyDtm).format('DD/MM/YYYY  HH:mm')}</span>
                            </div>
                            )}
                        />
                        <Column title="ผู้ดำเนินการ" dataIndex="historyUser" key="key" render={(text, record) => (
                            <div>
                                <span>{record.historyUser} </span>
                            </div>
                            )}
                        />
                        <Column title="รายละเอียด" dataIndex="historyTypeName" key="key"  render={(text, record) => (
                            <div>
                                <span>{record.historyTypeName}</span>
                            </div>
                            )}
                        />
                    </Table>
                    <Row style={styleRow}>
                        <Col xs={{ span: 12 , offset: 6}} lg={{ span: 10, offset: 7}}>
                            <Button block type="primary" onClick={()=>{setShowPopupHistory(false)}}>กลับไปเมนูแก้ไขปัญหา</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    )
}

export default ResetAcressPointPage;

