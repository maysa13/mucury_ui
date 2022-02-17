import React, { useContext ,useCallback,useState,useEffect }  from 'react';

/* Plugin */
import { Row, Col ,Input, Button ,Image ,Modal ,Card } from 'antd';
import {LeftOutlined , RightOutlined} from '@ant-design/icons';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import moment from 'moment';
import 'moment/locale/th';
// import "~slick-carousel/slick/slick.css"; 
// import "~slick-carousel/slick/slick-theme.css";
// import { Datepicker, CalendarPrev, CalendarNav, CalendarNext, SegmentedGroup, SegmentedItem, setOptions, localeTh } from '@mobiscroll/react';

/* Store */
import {
    MercuryContext
} from '../../../store/MercuryContext';
import { isNotError } from '../../../helper/UtilityFunction';
/* Icon */
import squareBlue from '../../../icon/square_B.png'
import squarePurple from '../../../icon/square_P.png'
import squareGreen from '../../../icon/square_G.png'
import refresh from '../../../icon/refresh.svg'
import warn from '../../../icon/warn.png';
/* Style */
// import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import 'sweetalert2/src/sweetalert2.scss'
import '../../../App.css'
import Calendar from './Calendar';
import Pagination from './Pagination';
import MercuryAPI from '../../../api/MercuryAPI'
const distanceRow = {
    marginTop : '4px',
   
}
const iconColor={
    width:20,
    height:20,
    paddingRight:'3px'
}
const scheduleStyle ={paddingLeft:'14px',paddingRight:'5px'}
const selectTimeAppoinment = (data) => {
    console.log('datas',data)
}
const mercuryApi = new MercuryAPI();
const Appointment=({ appoints,changedate,appoint})=>{
    const {
        selectedMenu,
        capacity,
        orderdetai,
        set_Usage,
        // usage,
        set_Capacity,
        uiControlData,
        set_status_app,
        status_app,
        status_Model_edit,
        setAppointment,orderdetail
    } = useContext(MercuryContext);
    // console.log('ChangeAppointment==>',capacity)
    // console.log('props',props)
    // ----------------------------ตัวแปรเก็บค่าและฟังก์ชั่น set ตัวแปร
    const [orderIdSearch , setOrderIdSearch] = useState()
    const [alertSearch , setAlertSearch] = useState()
    const [showModal , setShowModal] = useState(false)
    const [showPageAppointment , setShowPageAppointment] = useState(false)
    const [StatusRefeshAppoinment,setStatusRefeshAppoinment] = useState(false)
    const [showPageConfrimAppointment , setShowPageConfrimAppointment] = useState(false)
    const [ShowCalendar , setShowCalendar] = useState(false)
    // ----------------------------ตัวแปรปฏิทัน fix new date
    moment.locale('th');
    
    // const tomorrow = new Date()
    // tomorrow.setDate(tomorrow.getDate() + 1)    
    // console.log('tomorrow',tomorrow)
    // const dateToday= tomorrow
    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    /**************************Respone data !==[]********************************** */
    // const year = dateToday.getFullYear();
    // const theDate = new Date(moment(dateToday).format('YYYY-MM-DD'));
    // const getLastday = new Date(moment(dateToday).add(29, 'days'));
    const [thDayFromDateToday , setThDayFromDateToday] = useState([])
    const [thDayFromDate_ , setthDayFromDate_] = useState([]) //ใช้กรณี API ให้ดาต้ามาไม่ครบ30วัน
    const [weekView , setWeekView] = useState([]);
    /**************************Respone data !==[] New********************************** */

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)    
    // console.log('tomorrow',tomorrow)
    const dateToday= tomorrow


    const year = dateToday.getFullYear();
    const theDate = new Date(moment(dateToday).format('YYYY-MM-DD'));
    const getLastday = new Date(moment(dateToday).add(29, 'days'));

    




      
    useEffect(() => {    
        // console.log('useEffect == ',appoints)
        if(appoints){
            Capacity(appoints)  
        }
    },[appoints]);

    const getdata=(obj)=>{  
        set_Capacity(obj.capacitys)
        let capacity=obj.capacitys
        let usage=obj.usages
       console.log('capacity',capacity)
       console.log('usage',usage)
       setAppointment(null)
       thDayFromDateToday.splice(0)
        if(thDayFromDateToday.length>=0 /*&& thDayFromDateToday.length <=30*/){
            let key = 0,Data_usage
            
            while (theDate <= getLastday) {    
                               
                if(usage==={}){
                    Data_usage=[]
                }else if(usage!=={}){    
                    console.log('usage>>>>',usage)                
                    Data_usage=usage.filter((usage) => usage.scdDate === moment(capacity[key].scdDate).format('YYYY-MM-DD'))
                }
                // if(usage===undefined){
                console.log('AAAAAAAAAAAAA',Data_usage.length)
                if(Data_usage.length===0){
                    thDayFromDateToday.push({
                        date: moment(capacity[key].scdDate).format('YYYY-MM-DD'), 
                        day : moment(capacity[key].scdDate).format('dddd'),
                        aDate : moment(capacity[key].scdDate).format('DD'),
                        key : key,
                        data: [   
                            {scdSlot:Number(capacity[key].scdSlot1), DurationCode:'1'}, 
                            {scdSlot:Number(capacity[key].scdSlot2), DurationCode:'2'},
                            {scdSlot:Number(capacity[key].scdSlot3), DurationCode:'3'},
                            
                        ],                    
                    })
                }else if(Data_usage.length===1){
                    console.log(Data_usage[0].scdDate)
                    thDayFromDateToday.push({
                        date: moment(capacity[key].scdDate).format('YYYY-MM-DD'), 
                        day : moment(capacity[key].scdDate).format('dddd'),
                        aDate : moment(capacity[key].scdDate).format('DD'),
                        key : key,
                        data: [   
                            {scdSlot:(Number(capacity[key].scdSlot1)-Number(Data_usage[0].scdSlot1)) > 0 ? (Number(capacity[key].scdSlot1)-Number(Data_usage[0].scdSlot1)) : 0, DurationCode:'1'}, 
                            {scdSlot:(Number(capacity[key].scdSlot2)-Number(Data_usage[0].scdSlot2)) > 0 ? (Number(capacity[key].scdSlot2)-Number(Data_usage[0].scdSlot2)) : 0, DurationCode:'2'},
                            {scdSlot:(Number(capacity[key].scdSlot3)-Number(Data_usage[0].scdSlot3)) > 0 ? (Number(capacity[key].scdSlot3)-Number(Data_usage[0].scdSlot3)) : 0, DurationCode:'3'},
                            
                        ],                   
                    })
                }
            // }
                theDate.setDate(theDate.getDate() + 1)
                key = key + 1
            }
            console.log('true>>>>>>>>>>>',thDayFromDateToday)
            showPageAppointmentfn() 
        }else{
            console.log('Fail',thDayFromDateToday)
            // let key = 0
            // while (theDate <= getLastday) {
            //     thDayFromDateToday.push({
            //         date: moment(capacity[key].scdDate).format('YYYY-MM-DD'), 
            //         day : moment(capacity[key].scdDate).format('dddd'),
            //         aDate : moment(capacity[key].scdDate).format('DD'),
            //         key : key,
            //         data: [capacity[key].scdSlot1,capacity[key].scdSlot2,capacity[key].scdSlot3]
            //     })
            //     theDate.setDate(theDate.getDate() + 1)
            //     key = key + 1
            // }
            
            
            // console.log('useEffthDayFromDateTodayect == ',thDayFromDateToday)
            // showPageAppointmentfn() 
            
        }
    }

    const showPageAppointmentfn = () => {
        // setShowPageAppointment(false)
        // console.log(thDayFromDateToday)
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
        setShowPageAppointment(true)
        // setShowModal(false)
    }
   
    /******************************************************************************/
     
        const [currentPage, setCurrentPage] = useState(1);
        const [postsPerPage] = useState(7);
        
        // Get current posts
        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        const currentPosts = thDayFromDateToday.slice(indexOfFirstPost, indexOfLastPost);
    // console.log('currentPosts',currentPosts)
        const paginate = pageNumber => setCurrentPage(pageNumber);
        const selectTimeAppoinment =data=>{
            // console.log('data=data=',data)            
        }
    /******************************************************************************/

    
    // const Usage=(ZoneCode)=>{
    //     console.log('ZoneCode =',ZoneCode)
    //     mercuryApi.usage(ZoneCode).then(usage => { 
    //         console.log(usage)     
    //         if(usage.length!=[]){
    //             set_Usage(usage)
    //         }else{     
    //             set_Usage(usage)
    //         }
    //     })   
        
    // }
    const Capacity=(ZoneCode)=>{
        set_status_app(false)
        
        let Objects={
            usages:{},
            capacitys:{},
        }
        /**********************************************************************/
        mercuryApi.usage(ZoneCode).then(usage => {             
            // console.log('usage.length----------------------',usage.length)
            if(isNotError(usage)){
                if(usage.length!=undefined){
                    set_Usage(usage)
                    Objects.usages=usage 
                }else{     
                    set_Usage([])
                    Objects.usages=[] 
                }
            /**********************************************************************/
                mercuryApi.capacity(ZoneCode).then(capacity => {
                    if(isNotError(capacity)){
                    console.log('',capacity.length)
                    if(capacity.length===31){
                        // console.log('31===capacity',capacity)
                        Objects.capacitys=capacity
                        getdata(Objects)                       
                        setShowCalendar(true)
                        set_status_app(true)
                        setStatusRefeshAppoinment(!StatusRefeshAppoinment)
                        // console.log('===>',Objects.capacitys)
                    }else if(capacity.length > 0&&capacity.length<=31){
                        // console.log('@--------------------ข้อมูลไม่ครบ 30 วัน--------------------!')
                        // console.log('ข้อมูลจาก API',capacity)
                        // console.log('ความยาวทั้งหมด',capacity.length)
                        // console.log('ขาด',30-capacity.length)
                        // console.log('วันที่เริ่ม',(capacity[0].scdDate))
                        // console.log('วันที่สุดท้าย',(capacity[(capacity.length-1)].scdDate))
                        // console.log('@--------------------ข้อมูลสร้างใหม่--------------------!')
                        let StartNewDate=moment(capacity[(capacity.length-1)].scdDate).add(1, 'days').format('')
                        let EndNewDate=moment(capacity[(capacity.length-1)].scdDate).add(30-capacity.length+1, 'days').format('')
                        
                        // console.log('susage =',usage)
                        // console.log('>>>>>>>>>>>>',capacity[1].scdSlot1,'-----------',usage[1].scdSlot1)
                        let arrNewdate=[],key=0
                        while (StartNewDate <= EndNewDate) {
                            if(capacity[key]!==undefined){
                                // console.log(capacity[key])
                                arrNewdate.push({
                                scdDate: moment(capacity[key].scdDate).format('YYYY-MM-DD'), 
                                scdSlot1 : capacity[key].scdSlot1,
                                scdSlot2 : capacity[key].scdSlot2,
                                scdSlot3 : capacity[key].scdSlot3,                       }
                                )
                                
                                
                            }else{
                                // console.log('else =//')
                                arrNewdate.push({
                                    scdDate: moment(StartNewDate).format('YYYY-MM-DD'), 
                                    scdSlot1 : '0',
                                    scdSlot2 : '0',
                                    scdSlot3 : '0',                       
                                })
                                StartNewDate=moment(StartNewDate).add(1, 'days').format('')
                            }                    
                            key=key+1
                        }
                        // console.log('thDayFromDate_arrNewdate',arrNewdate)
                        Objects.capacitys=arrNewdate
                        getdata(Objects)                
                        setShowCalendar(true)
                        set_status_app(true)
                        setStatusRefeshAppoinment(!StatusRefeshAppoinment)
                        // console.log('===>',Objects)
                    }else if(capacity.length===0){
                        setShowCalendar(true)  
                        if(((uiControlData.currentMenu==='CheckServiceArea'))){
                            set_status_app(false)   
                            Swal.fire({
                                imageUrl: warn,
                                imageHeight:'100px',
                                html:
                                `   <b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลตารางนัดหมายติดตั้ง<b/><br/>
                                    <div style='text-align: center';>
                                    <span style="font-size:18px;color:#2B2B2B;font-weight: normal">เนื่องจากโซนพื้นที่ `+ZoneCode+` ไม่พบตารางงานว่างสำหรับนัดหมายติดตั้งในช่วง x วันข้างหน้า</span>
                                    </div>
                                `,
                                showCancelButton: true,  
                                showConfirmButton: false,                
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
                        if((status_Model_edit===true&&(uiControlData.currentMenu==='SearchOrderNewService'))
                        // &&(orderdetail.mercuryOrderTypeID===1)
                        // &&(orderdetail.mercuryOrderStatusName!=='Mapping')
                        // &&(orderdetail.mercuryOrderStatusName!=='Waiting')
                        // &&(orderdetail.mercuryOrderStatusName!=='Cancel')
                        // &&(orderdetail.mercuryOrderStatusName!=='Fail')
                        // &&(orderdetail.mercuryOrderStatusName!=='Success') 
                        ){
                            // set_status_app(false)  
                            Swal.fire({
                                html:
                                '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลตารางนัดหมายติดตั้ง<b/><br/>'+
                                '<text style="font-size: 18px;color:#2B2B2B;font-weight: normal">เนื่องจากโซนพื้นที่ '+ZoneCode+' ไม่พบตารางงานว่างสำหรับนัดหมายติดตั้งในช่วง x วันข้างหน้า</text>',
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
                            if(thDayFromDateToday.length===0 || thDayFromDateToday.length < 30){
                                let key = 0
                                while (theDate <= getLastday) {
                                    // console.log(capacity[key].scdDate)
                                    thDayFromDateToday.push({
                                        date: moment(theDate).format('YYYY-MM-DD'), 
                                        day : moment(theDate).format('dddd'),
                                        aDate : moment(theDate).format('DD'),
                                        key : key,
                                        data: [   
                                            {scdSlot:'0', DurationCode:'1'},
                                            {scdSlot:'0', DurationCode:'2'},
                                            {scdSlot:'0', DurationCode:'3'},
                                            
                                        ],                   
                                    })
                                    theDate.setDate(theDate.getDate() + 1)
                                    key = key + 1
                                }
                                console.log('thDayFromDateToday',thDayFromDateToday)
                                showPageAppointmentfn() 
                            }
                            set_status_app(true)   
                            setStatusRefeshAppoinment(!StatusRefeshAppoinment)
                        }
                        if((status_Model_edit===true&&(uiControlData.currentMenu==='AdvancedSearchCustomerData'))
                        // &&(orderdetail.mercuryOrderTypeID===1)
                        // &&(orderdetail.mercuryOrderStatusName!=='Mapping')
                        // &&(orderdetail.mercuryOrderStatusName!=='Waiting')
                        // &&(orderdetail.mercuryOrderStatusName!=='Cancel')
                        // &&(orderdetail.mercuryOrderStatusName!=='Fail')
                        // &&(orderdetail.mercuryOrderStatusName!=='Success') 
                        ){
                            // set_status_app(false)  
                            Swal.fire({
                                html:
                                '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลตารางนัดหมายติดตั้ง<b/><br/>'+
                                '<text style="font-size: 18px;color:#2B2B2B;font-weight: normal">เนื่องจากโซนพื้นที่ '+ZoneCode+' ไม่พบตารางงานว่างสำหรับนัดหมายติดตั้งในช่วง x วันข้างหน้า</text>',
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
                            set_status_app(true)   
                            setStatusRefeshAppoinment(!StatusRefeshAppoinment)
                            if(thDayFromDateToday.length===0 || thDayFromDateToday.length < 30){
                                let key = 0
                                while (theDate <= getLastday) {
                                    // console.log(capacity[key].scdDate)
                                    thDayFromDateToday.push({
                                        date: moment(theDate).format('YYYY-MM-DD'), 
                                        day : moment(theDate).format('dddd'),
                                        aDate : moment(theDate).format('DD'),
                                        key : key,
                                        data: [   
                                            {scdSlot:'0', DurationCode:'1'},
                                            {scdSlot:'0', DurationCode:'2'},
                                            {scdSlot:'0', DurationCode:'3'},
                                            
                                        ],                   
                                    })
                                    theDate.setDate(theDate.getDate() + 1)
                                    key = key + 1
                                }
                                console.log('thDayFromDateToday',thDayFromDateToday)
                                showPageAppointmentfn() 
                            }
                            // set_status_app(false)   
                        }
                        if(status_Model_edit===false
                            &&(uiControlData.currentMenu==='SearchOrderNewService'||uiControlData.currentMenu==='AdvancedSearchCustomerData')){
                            if(thDayFromDateToday.length===0 || thDayFromDateToday.length < 30){
                                let key = 0
                                while (theDate <= getLastday) {
                                    // console.log(capacity[key].scdDate)
                                    thDayFromDateToday.push({
                                        date: moment(theDate).format('YYYY-MM-DD'), 
                                        day : moment(theDate).format('dddd'),
                                        aDate : moment(theDate).format('DD'),
                                        key : key,
                                        data: [   
                                            {scdSlot:'0', DurationCode:'1'},
                                            {scdSlot:'0', DurationCode:'2'},
                                            {scdSlot:'0', DurationCode:'3'},
                                            
                                        ],                   
                                    })
                                    theDate.setDate(theDate.getDate() + 1)
                                    key = key + 1
                                }
                                console.log('thDayFromDateToday',thDayFromDateToday)
                                showPageAppointmentfn() 
                            }
        
                        }
                        
                            
                    }
                    }
                }) 
            }

              
        })  
        /**********************************************************************/



         
        
    }




    return(
        <> 
            <Row style={distanceRow}>
               {/* <Row> */}
                   <Col span={22}/>
                   <Col span={2}>{
                    <img  src={refresh} style={{width:24,height:24,color:'#212F6A',marginLeft:14,}} onClick={()=>{
                        Capacity(appoints) 
                        setAppointment(null)
                        }}/>}
                   </Col>
               {/* </Row> */}
                <Col span={24}>
                {status_app === true&&<div>
                    {StatusRefeshAppoinment===true&&<>
                    <Col style={{textAlign:'center'}}>   
                        <Pagination
                            capacity={capacity}
                            month={monthNames}
                            year={ year}
                            week={currentPosts}
                            currentPage={currentPage}
                            postsPerPage={postsPerPage}
                            totalPosts={thDayFromDateToday.length}//{thDayFromDateToday.length}
                            paginate={paginate}
                            
                        />
                    </Col>
                    <Col >  
                        {showPageAppointment&&<Calendar posts={currentPosts}  selectTimeAppoinment={selectTimeAppoinment} changedate={changedate}/>}
                        </Col>
                        <div className={`${(status_app === true)?'':'hide'}`}>
                            <Row style={{font:'12',paddingLeft:'10px',paddingBottom:'7px'}}>                           
                                <Col style={scheduleStyle}><img src={squareGreen} style={iconColor}/>ช่วงเช้า (08:00-12:00)</Col>
                                <Col style={scheduleStyle}><img src={squarePurple} style={iconColor}/>ช่วงบ่าย (13:00-17:00)</Col>
                                <Col style={scheduleStyle}><img src={squareBlue} style={iconColor}/>ช่วงค่ำ (18:00-21:00)</Col>
                            </Row>
                        </div>
                        </>}

                    {StatusRefeshAppoinment===false&&<>
                    <Col style={{textAlign:'center'}}>   
                        <Pagination
                            capacity={capacity}
                            month={monthNames}
                            year={ year}
                            week={currentPosts}
                            currentPage={currentPage}
                            postsPerPage={postsPerPage}
                            totalPosts={thDayFromDateToday.length}//{thDayFromDateToday.length}
                            paginate={paginate}
                            
                        />
                    </Col>
                    <Col >  
                        {showPageAppointment&&<Calendar posts={currentPosts}  selectTimeAppoinment={selectTimeAppoinment} changedate={changedate}/>}
                        </Col>
                        <div className={`${(status_app === true)?'':'hide'}`}>
                            <Row style={{font:'12',paddingLeft:'10px',paddingBottom:'7px'}}>                           
                                <Col style={scheduleStyle}><img src={squareGreen} style={iconColor}/>ช่วงเช้า (08:00-12:00)</Col>
                                <Col style={scheduleStyle}><img src={squarePurple} style={iconColor}/>ช่วงบ่าย (13:00-17:00)</Col>
                                <Col style={scheduleStyle}><img src={squareBlue} style={iconColor}/>ช่วงค่ำ (18:00-21:00)</Col>
                            </Row>
                        </div>
                        </>}
                    </div>
                }                  
                </Col>
            </Row>
            
       </>
    )
}

export default Appointment;

