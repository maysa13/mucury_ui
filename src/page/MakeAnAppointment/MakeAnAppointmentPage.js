import React, { useContext ,useCallback,useState,useEffect }  from 'react';

/* Plugin */
import { Row, Col ,Input, Button ,Image ,Modal ,Card } from 'antd';
import {LeftOutlined , RightOutlined} from '@ant-design/icons';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import moment from 'moment';
import 'moment/locale/th';
// import { Datepicker, CalendarPrev, CalendarNav, CalendarNext, SegmentedGroup, SegmentedItem, setOptions, localeTh } from '@mobiscroll/react';

/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';

/* Icon */
import { ReactComponent as BackToMenuIcon } from '../../icon/left-arrow.svg'
import CalendarPage from '../../icon/exclamation-alert-sign-on-reminder-daily-calendar-page.svg'
import LightBulb from '../../icon/light-bulb.svg'
/* Style */
// import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import 'sweetalert2/src/sweetalert2.scss'
import '../../App.css'
const distanceRow = {
    marginTop : '4px'
}
const distanceRowButton = {
    marginTop : '20px'
}
const textQue = {
    fontSize : '11px',
}
const textAns = {
    color : 'MidnightBlue'
}
const styleStep = {
    color : '#f85e06'
}
/* Style */
const { TextArea } = Input;
// setOptions({
//     locale: localeTh,
//     theme: 'ios',
//     themeVariant: 'light'
// });

function MakeAnAppointmentPage(props) {
    console.log('props',props)
    // ----------------------------ตัวแปรเก็บค่าและฟังก์ชั่น set ตัวแปร
    const [orderIdSearch , setOrderIdSearch] = useState()
    const [alertSearch , setAlertSearch] = useState()
    const [showModal , setShowModal] = useState(false)
    const [showPageAppointment , setShowPageAppointment] = useState(false)
    const [showPageConfrimAppointment , setShowPageConfrimAppointment] = useState(false)

    // ----------------------------ตัวแปรปฏิทัน fix new date
    moment.locale('th');
    const dateToday= new Date()
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const month = monthNames[dateToday.getMonth()];
    const year = dateToday.getFullYear();
    const theDate = new Date(moment(dateToday).format('YYYY-MM-DD'));
    const getLastday = new Date(moment(dateToday).add(30, 'days'));
    const [thDayFromDateToday , setThDayFromDateToday] = useState([])
    // let weekView = [];
    const [weekView , setWeekView] = useState([]);
    console.log('getLastday',getLastday)
    console.log('theDate',theDate)
    console.log('dateToday',dateToday)
    // ----------------------------ตัวแปรเก็บค่า
    // ----------------------------ตัวแปรรองรับ API
    // const [orderId , setOrderId] = useState()
    // const [statusOrderId , setStatusOrderId] = useState()
    // const [nameCust , setNameCust] = useState()
    // const [contractCust , setContractCust] = useState()
    // const [addsInstallCust , setAddsInstallCust] = useState()
    // ----------------------------ตัวแปรรองรับ API
    // ----------------------------ตัวแปรรองรับ API ทดสอบ
    const [orderId , setOrderId] = useState('2021234567891')
    const [statusOrderId , setStatusOrderId] = useState('ปัจจุบัน DtacId ผูกกับคำขอ 3BB แล้ว')
    const [nameCust , setNameCust] = useState('ทดสอบ นัดหมายติดตั้ง')
    const [contractCust , setContractCust] = useState('093xxxxxxx')
    const [addsInstallCust , setAddsInstallCust] = useState('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxx xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    const [dataTest , setDataTest] = useState([
        {
            contactName: '2345',
            contactNum: '2345',
            licenseNum:'2345',
            scdDate: '2345',
            scdT: '2',
            scd : '2345',
            scdTypeId: '2345',
            teamCode: '2345',
            teamGroupId: '2345',
            teamName: '2345',
            teamTypeId: '2345',
            teamTypeName: '2345',
            appointmentDurationCode: "1",
            appointmentDurationName: "ช่วงเช้า(08:00-12:00)"
        },
        {
            contactName: '2345',
            contactNum: '2345',
            licenseNum:'2345',
            scdDate: '2345',
            scdT: '0',
            scd : '2345',
            scdTypeId: '2345',
            teamCode: '2345',
            teamGroupId: '2345',
            teamName: '2345',
            teamTypeId: '2345',
            teamTypeName: '2345',
            appointmentDurationCode: "2",
            appointmentDurationName: "ช่วงบ่าย(13:00-17:00)"
        },{
            contactName: '2345',
            contactNum: '2345',
            licenseNum:'2345',
            scdDate: '2345',
            scdT: '3',
            scd : '2345',
            scdTypeId: '2345',
            teamCode: '2345',
            teamGroupId: '2345',
            teamName: '2345',
            teamTypeId: '2345',
            teamTypeName: '2345',
            appointmentDurationCode: "3",
            appointmentDurationName: "ช่วงค่ำ(18:00-22:00)"
        }
    ])
    // ----------------------------ตัวแปรรองรับ API ทดสอบ
    const {
        selectedMenu
    } = useContext(MercuryContext);

    useEffect(() => {    
        console.log('thDayFromDateToday.length',thDayFromDateToday.length)
        if(thDayFromDateToday.length===0 || thDayFromDateToday.length < 31){
            let key = 1
            while (theDate <= getLastday) {
                thDayFromDateToday.push({
                    date: moment(theDate).format('YYYY-MM-DD'), 
                    day : moment(theDate).format('dddd'),
                    aDate : moment(theDate).format('DD'),
                    key : key,
                    data: dataTest 
                })
                theDate.setDate(theDate.getDate() + 1)
                key = key + 1
            }
            console.log('thDayFromDateToday',thDayFromDateToday)
        }
    });
    // -----------------------------ฟังก์ชั่น
    const menuHandleClick = (parameter) => (event)  => {
        setShowModal(false)
        selectedMenu(parameter)
    };

    const clickSearchOrderId = (type) => {
        console.log('orderIdSearch',orderIdSearch);
        setShowModal(true)
        
    }
    const onChangeInputOrderId = ({ target }) =>{
        console.log(target.value);
        console.log('orderIdSearch',orderIdSearch);
        if(target.value.match("^[0-9]*$") !== null){
            setOrderIdSearch(target.value)
            setAlertSearch(undefined)
        }
        else{
            setAlertSearch("กรุณากรอกข้อมูลให้ถูกต้อง เฉพาะตัวเลขเท่านั้น")
        }
    }
    const showPageAppointmentfn = () => {
        thDayFromDateToday.filter(function(filter){
            if(filter.key <= 7){
                weekView.push({
                    date: filter.date, 
                    day : filter.day,
                    aDate : filter.aDate,
                    key : filter.key,
                    data: filter.data 
                })
            }
        })
        console.log('weeks',weekView)
        setShowPageAppointment(true)
        setShowModal(false)
    }
    const submitAppointment = () => {

    }
    const showPageConfrimAppointmentFn = () =>{
        setShowPageConfrimAppointment(true)
    }
    const selectTimeAppoinment = (data) => {
        console.log('data',data)
    }
  
    // -----------------------------ฟังก์ชั่น
    return(
        <>
            <div>
                <Row>
                    <Col span={24}>
                        <header className="header-sub">
                            <Row>
                                <Col flex="none" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <div className="pointer" title="กลับหน้าหลัก" onClick={menuHandleClick('MenuPage')} style={{marginLeft:'24px', display: 'inline-flex', alignItems: 'center',position:'absolute',zIndex:'999'}}>
                                        <BackToMenuIcon width="34px" height="34"></BackToMenuIcon>
                                    </div>
                                </Col>
                                <Col flex="auto" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <div>
                                        <h5 className="header-sub-text">จองนัดหมายทีมงานติดตั้ง 3BB</h5>
                                    </div>
                                </Col>
                            </Row>
                        </header>
                        <div style={{padding : '8px 0 8px 0 '}}>
                            {showPageAppointment===false && <Row justify="center" className="bg-white">
                                <Col xs={24} sm={24} md={12} lg={6} xl={6} style={{borderStyle: 'groove',padding : '8px'}}>
                                    <Row justify="center">
                                        <Col span={24} style={{textAlign : 'center'}}>
                                            <Image src={CalendarPage} width={80} /> 
                                        </Col>
                                    </Row>
                                    <Row justify="center">
                                        <Col span={24} style={{textAlign : 'center'}}>เจ้าหน้าที่กรุณาระบุเลขที่คำขอติดตั้งบริการใหม่ สำหรับนัดหมายติดตั้ง</Col>
                                    </Row>
                                    <Row justify="center" style={distanceRow}>
                                        <Col span={24} style={textQue}>เลขที่คำขอติดตั้งบริการใหม่</Col>
                                        <Col span={24}>
                                            <Input onChange={onChangeInputOrderId} value={orderIdSearch}  ></Input>
                                        </Col>
                                        {alertSearch!==undefined && <Col span={24}>
                                            <span style={textQue}>{alertSearch}</span>
                                        </Col>}
                                    </Row>
                                    <Row justify="center" style={distanceRowButton}>
                                        <Col span={12}>
                                            <Button block onClick={clickSearchOrderId} disabled={orderIdSearch==='' || orderIdSearch===undefined}>ค้นหาคำขอ</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>}
                            {showPageAppointment && <div>
                                <Row className="bg-white">
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{padding : '8px'}}>
                                        <Row>
                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                <Row>
                                                    <Col span={24} style={textQue}>ชื่อ-นามสกุล (สำหรับติดต่องานติดตั้ง)</Col>
                                                    <Col span={24} style={textAns}>{nameCust}</Col>
                                                </Row>
                                            </Col>
                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                <Row>
                                                    <Col span={24} style={textQue}>เบอร์โทรศัพท์มือถือ (สำหรับติดต่องานติดตั้ง)</Col>
                                                    <Col span={24} style={textAns}>{contractCust}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row style={distanceRow}>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={24} style={textQue}>สถานที่ติดตั้ง</Col>
                                                    <Col span={24} style={textAns}>{addsInstallCust}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row className="bg-white" style={distanceRowButton}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{padding : '8px'}}>
                                        <Row>
                                            <Col span={24} style={styleStep}>
                                                STEP 1 เจ้าหน้าระบุวันที่และช่วงเวลานัดหมายติดตั้ง
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} className="spanDot">
                                                <span style={textQue}> ระบบจะแสดงวันที่สามารถรับงานติดตั้งไม่เกิน 30 วัน รวมทั้งช่วงเวลาที่ว่างรับงาน</span>
                                            </Col>
                                        </Row>
                                        <Row style={distanceRow}>
                                            <Col span={24}>
                                                <div>
                                                    <Col span={24} style={{textAlign:'center'}}>   
                                                        <LeftOutlined />
                                                        <span>{month} / {year}</span>
                                                        <RightOutlined />
                                                    </Col>
                                                    <Col span={24}>
                                                        <ul className="weekdays" style={{textAlign : 'center'}}>
                                                            {weekView.map((day,inx)=>{
                                                                return(
                                                                    <li key={inx}>
                                                                        {inx===0 &&<Row style={{width: '90%',}} className="active">
                                                                            <Col span={24}>
                                                                                <span>{day.day}</span>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <span>{day.aDate}</span>
                                                                            </Col>
                                                                        </Row>}
                                                                        {inx !== 0 && <Row style={{width: '90%',}}>
                                                                            <Col span={24}>
                                                                                <span>{day.day}</span>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                <span>{day.aDate}</span>
                                                                            </Col>
                                                                        </Row>}
                                                                        
                                                                        {day.data.map((data,inx)=>{
                                                                            let colorborder; 
                                                                            if(data.appointmentDurationCode==='1'){
                                                                                colorborder="#228B22";
                                                                            }else if(data.appointmentDurationCode==='2'){
                                                                                colorborder="#C71585";
                                                                            }else if(data.appointmentDurationCode==='3'){
                                                                                colorborder="#000080";
                                                                            }
                                                                            return(
                                                                                <div key={inx} style={{marginTop : '4px'}}>
                                                                                    <Col span={24}>
                                                                                        <Card style={{ width: '90%', padding : 0 , borderColor : colorborder ,  borderStyle : 'solid'}} onClick={()=>selectTimeAppoinment(data)} className="cardBox">
                                                                                            <Row style={{padding : 0 }}>
                                                                                                <Col span={24}>
                                                                                                    <span>{data.appointmentDurationName}</span>
                                                                                                </Col>
                                                                                                <Col span={24}>
                                                                                                    <span>{data.scdT}</span>
                                                                                                </Col>
                                                                                            </Row>  
                                                                                        </Card>
                                                                                       
                                                                                    </Col>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                    </Col>
                                                </div>
                                                {/* <Datepicker
                                                    controls={['calendar']}
                                                    calendarType={calendarType}
                                                    weeks={1}
                                                    renderCalendarHeader={calendarHeader}
                                                /> */}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row className="bg-white" style={distanceRowButton}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{padding : '8px'}}>
                                        <Row>
                                            <Col span={24} style={styleStep}>
                                                STEP 2 รายละเอียดเพิ่มเติมของงานนัดหมาย
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} className="spanDot">
                                                <span style={textQue}> รองรับข้อความไม่เกิน 5000 ตัวอักษร</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <TextArea rows={4} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row justify="center" style={distanceRowButton}>
                                    <Col span={12}>
                                        <Button block type="primary" onClick={showPageConfrimAppointmentFn}>บันทึกนัดหมายติดตั้ง</Button>
                                    </Col>
                                </Row>
                            </div>}
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={showModal}
                    footer={null}
                    closable={false}
                    title={null}
                    >
                    <div>
                        <Row justify="center" >
                            <Col span={24} style={{padding : '4px'}}>
                                <Row justify="center">
                                    <Col span={24} style={{textAlign : 'center'}}>
                                        <Image src={LightBulb} width={80} /> 
                                    </Col>
                                </Row>
                                <Row justify="center">
                                    <Col span={24} style={{textAlign : 'center'}}>ระบบตรวจสถานะคำขอ {orderId}</Col>
                                </Row>
                                <Row justify="center" style={distanceRow}>
                                    <Col span={24} style={textQue}>สถานะเลขที่คำขอติดตั้งบริการใหม่ในปัจจุบัน</Col>
                                    <Col span={24}>
                                        <Input value={statusOrderId} disabled></Input>
                                    </Col>
                                </Row>
                                <Row justify="center" style={distanceRowButton}>
                                    <Col span={12}>
                                        <Button block onClick={showPageAppointmentfn} type="primary" >นัดหมายติดตั้ง</Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button block onClick={menuHandleClick('MenuPage')} style={{background : '#696969',color : 'white'}}>กลับหน้าหลัก</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Modal>
                <Modal
                    visible={showPageConfrimAppointment}
                    footer={null}
                    closable={false}
                    title={null}
                    >
                    <div>
                        <Row justify="center" >
                            <Col span={24} style={{padding : '4px'}}>
                                <Row justify="center">
                                    <Col span={24} style={{textAlign : 'center'}}>
                                        <Image src={LightBulb} width={80} /> 
                                    </Col>
                                </Row>
                                <Row justify="center">
                                    <Col span={24} style={{textAlign : 'center'}}>เจ้าหน้าที่ตรวจสอบข้อมูลนัดหมายติดตั้ง {orderId}</Col>
                                </Row>
                                <Row style={distanceRow}>
                                    <Col span={24} style={textQue}>วันที่นัดหมาย</Col>
                                    <Col span={24}>
                                        xxxxxxxxxx
                                    </Col>
                                </Row>
                                <Row style={distanceRow}>
                                    <Col span={24} style={textQue}>ช่วงเวลานัดหมาย</Col>
                                    <Col span={24}>
                                        xxxxxxxxxx
                                    </Col>
                                </Row>
                                <Row style={distanceRow}>
                                    <Col span={24} style={textQue}>รายละเอียดเพิ่มเติมของงานนัดหมาย</Col>
                                    <Col span={24}>
                                        xxxxxxxxxx
                                    </Col>
                                </Row>
                                <Row justify="center" style={distanceRowButton}>
                                    <Col span={12}>
                                        <Button block onClick={submitAppointment} type="primary" >ยืนยันบันทึกนัดหมาย</Button>
                                    </Col>
                                    <Col span={12}>
                                        <Button block onClick={()=>setShowPageConfrimAppointment(false)} style={{background : '#696969',color : 'white'}}>กลับไปหน้านัดหมาย</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default MakeAnAppointmentPage;