import React, { useContext,useState,useEffect }  from 'react';
import { Form, Input,Card, Col, Row, Space,Button,Calendar,Modal,InputNumber,Radio,Divider ,DatePicker ,Select ,Tag ,AutoComplete ,Tooltip  } from 'antd';

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
import AppBreadcrumb from '../../component/AppBreadcrumb';
import success from '../../icon/success.svg'
import LightQuestion from '../../icon/light-question-mark.svg';
import warn from '../../icon/warn.png';
const { CheckableTag } = Tag;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;
const OptionAutoComplete = AutoComplete.Option
const mercuryApi = new MercuryAPI();
const moment = require('moment');

const Card_headStyle ={
  color:'#D1410C',
  fontSize:20
}
const Card_BodyStyle ={
    paddingTop:0,
    paddingBottom:3
 }

const TitleStyle ={

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

const bodyStyleModel={padding:0,margin:0,border:0}
const headStyleModer={color:'',fontSize:20,paddingLeft:'0px',margin:'0px',border:0}

function AdvanceSearchPage(props) {
    const {
        selectedMenu , setDataAdvsList
    } = useContext(MercuryContext);
    const [dataAdvanceSearch, setDataAdvanceSearch] = useState(
        {
            dataStatust : [
                {
                    status : 'all',
                    statusName : 'All'
                },
                {
                    status : 1,
                    statusName : 'New'
                },
                {
                    status : 2,
                    statusName : 'Mapping'
                },
                {
                    status : 3,
                    statusName : 'Waiting'
                },
                {
                    status : 0,
                    statusName : 'Cancel'
                },
                {
                    status : 4,
                    statusName : 'Fail'
                },
                {
                    status : 5,
                    statusName : 'Success'
                },
            ],
        }
    );
    const [dtacRefID , setDtacRefID] = useState("");
    const [mercuryOrderID , setMercuryOrderID] = useState("");
    const [createUserID , setCreateUserID] = useState("");
    const [mercuryOrderTypeID , setMercuryOrderTypeID] = useState("");
    const [mercuryOrderStatus , setMercuryOrderStatus] = useState(dataAdvanceSearch.dataStatust);
    const [optionsUser , setOptionsUser] = useState([]);
    const [optionsMercuryordertype , setOptionsMercuryordertype] = useState([]);

    // -----------------text Alert-----------
    const [titleAlertDtacRef , setTitleAlertDtacRef] = useState();
    const [titleAlertOrderId , setTitleAlertOrderId] = useState();
    
    // Date
    const dateFormat = 'DD/MM/YYYY';
    const [dateStart , setDateStart] = useState();
    const [dateEnd , setDateEnd] = useState();
    const [checkDate , setCheckDate] = useState();
    const onClickDateStart = function(date, dateString){
        console.log(date, dateString);
        setDateStart(date)
        let dateAfter = new Date(date);
        dateAfter.setDate(dateAfter.getDate() + 7)
        setCheckDate(dateAfter)
        console.log(checkDate)
        console.log(dateAfter)
    }
    const onClickDateEnd = function(date, dateString){
        console.log(date, dateString);
        setDateEnd(date)
    }
    const handleChangeDataStatus = function(tag, checked){
        console.log('tag, checked',tag, checked)
        console.log('mercuryOrderStatus',mercuryOrderStatus.length)
        if(tag.status==='all' && checked){
            setMercuryOrderStatus(dataAdvanceSearch.dataStatust)
        }
        else if(tag.status==='all' && checked===false){
            setMercuryOrderStatus([])
        }
        else{
            console.log(dataAdvanceSearch.dataStatust , mercuryOrderStatus )
            if(dataAdvanceSearch.dataStatust.length === mercuryOrderStatus.length){
                setMercuryOrderStatus([])
            }
            else{
                const selectStatus = (checked ? [...mercuryOrderStatus, tag] : mercuryOrderStatus.filter(t => t.status !== tag.status));
                if(selectStatus.length===6){
                    setMercuryOrderStatus(dataAdvanceSearch.dataStatust)
                }
                else{
                    setMercuryOrderStatus(selectStatus)
                }
            }
            
            // console.log('selectStatus',selectStatus)
            console.log('selectStatus',mercuryOrderStatus)
        }
    }
    // Date
    // --------start-----------------------
    useEffect(() => {
        callGetsearchMercuryordertype();
    },[])
    // --------start-----------------------
    // --------function -----------------------
    const onSelectUserID = (value,event) => {
        console.log('onSelect', value,event);
        setCreateUserID(event.item.userID)
    };
   
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
    const onChangeInputOrderId = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        const patternCheack = '^[0-9]*$'
        console.log(value)
        if ((!isNaN(value) && value.match(patternCheack))) {
            setMercuryOrderID(value)
            console.log('dtacRefID',dtacRefID)
            setTitleAlertOrderId("")
        }
        else {
            setMercuryOrderID(mercuryOrderID)
            setTitleAlertOrderId(`กรุณาระบุเลขที่เลขที่คำขอ ให้ถูกต้อง`)
        }   
    };
    const checkInputbeforeCallApi = () => {
        console.log('dtacRefID',dtacRefID)
        console.log('mercuryOrderID',mercuryOrderID)
        console.log('createUserID',createUserID)
        console.log('mercuryOrderTypeID',mercuryOrderTypeID)
        console.log('mercuryOrderStatus',mercuryOrderStatus)
        console.log('dateStart',dateStart)
        console.log('dateEnd',dateEnd)
        const status = mercuryOrderStatus.filter(item => {return item.status !== 'all'});
        let input = {
            dtacRefID : dtacRefID,
            mercuryOrderID : mercuryOrderID,
            createUserID : createUserID,
            mercuryOrderTypeID : mercuryOrderTypeID,
            mercuryOrderStatus : status.map(item => {return item.status}),
            startDate : "",
            endDate : ""
        }
        if(dateStart && dateEnd && mercuryOrderStatus.length!==0){
            input.startDate = moment(dateStart).format("YYYY-MM-DD");
            input.endDate = moment(dateEnd).format("YYYY-MM-DD"); 
            console.log('input',input)
            callGetAvdsList(input)
        }
        else{
            if(dtacRefID !== "" || mercuryOrderID !== ""){
                callGetAvdsList(input)
            }
        }
    }
    // --------function -----------------------
    // --------function Api-----------------------
    const callGetsearchMercuryordertype = () => {
        mercuryApi.getsearchMercuryordertype().then(data => {
            console.log('getsearchMercuryordertype',data)
            let addAll = [{ 
                mercuryOrderTypeID: "",
                mercuryOrderTypeName: "ทุกประเภทคำขอ"
            }]
            if(data.length!==undefined){
                data.map((item)=>{
                    addAll.push(item)
                })
                console.log('addAll',addAll)
                setOptionsMercuryordertype(addAll)
                setMercuryOrderTypeID("")
            }
            else{
                setOptionsMercuryordertype([])
            }
           
        });
    }

    const getcreateUserID = (searchText) => {
        console.log('searchText',searchText)
        if(searchText!=undefined && searchText.length > 1){
            console.log(searchText.length)
            let input = {userName : searchText}
            mercuryApi.searchUser(input).then(searchUser => {
                console.log('searchUser',searchUser)
                if(searchUser.length>0){
                    setOptionsUser(searchUser)
                }
            }); 
        }
        else{
            setOptionsUser([])
        }
        
    }
    const callGetAvdsList = (input) => {
        mercuryApi.searchAdvs(input).then(searchAdvs => {
            console.log('searchUser',searchAdvs)
            if(searchAdvs.length!==undefined && searchAdvs.length>0){
                const sortedActivities = searchAdvs.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
                console.log('sortedActivities',sortedActivities)
                setDataAdvsList(sortedActivities)
                selectedMenu('AdvancedSearchList')
            }
            else{
                if(dtacRefID!==""){
                    Swal.fire({
                        html:
                        '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลที่ต้องการค้นหา<b/><br/>'+
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">Dtac ref ID : '+dtacRefID+'</text><b/><br/>'+ 
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุข้อมูลการค้นหาใหม่อีกครั้งค่ะ</text>',      
                        imageUrl: warn,
                        imageWidth: 100,     
                        showCancelButton: true,
                        showConfirmButton: false,
                        // cancelButtonColor: '#d33',
                        cancelButtonText: 'ปิดหน้าต่าง',
                        buttonsStyling: false,
                        customClass: {
                            actions: 'vertical-buttons',
                            confirmButton: 'confirm-buttons',
                            cancelButton: 'cancle-buttons_2', 
                        }
                    })
                }
                else if(mercuryOrderID!==""){
                    Swal.fire({
                        html:
                        '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลที่ต้องการค้นหา<b/><br/>'+
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">Order ref ID : '+mercuryOrderID+'</text><b/><br/>'+ 
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุข้อมูลการค้นหาใหม่อีกครั้งค่ะ</text>',      
                        imageUrl: warn,
                        imageWidth: 100,     
                        showCancelButton: true,
                        showConfirmButton: false,
                        // cancelButtonColor: '#d33',
                        cancelButtonText: 'ปิดหน้าต่าง',
                        buttonsStyling: false,
                        customClass: {
                            actions: 'vertical-buttons',
                            confirmButton: 'confirm-buttons',
                            cancelButton: 'cancle-buttons_2', 
                        }
                    })
                }
                else{
                    Swal.fire({
                        html:
                        '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่พบข้อมูลที่ต้องการค้นหา<b/><br/>'+
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">ระหว่างช่วงวันที่ '+moment(dateStart).format('DD/MM/YYYY')+' จนถึง '+moment(dateEnd).format('DD/MM/YYYY')+'</text><b/><br/>'+ 
                        '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุข้อมูลการค้นหาใหม่อีกครั้งค่ะ</text>',      
                        imageUrl: warn,
                        imageWidth: 100,     
                        showCancelButton: true,
                        showConfirmButton: false,
                        // cancelButtonColor: '#d33',
                        cancelButtonText: 'ปิดหน้าต่าง',
                        buttonsStyling: false,
                        customClass: {
                            actions: 'vertical-buttons',
                            confirmButton: 'confirm-buttons',
                            cancelButton: 'cancle-buttons_2', 
                        }
                    })
                }

                
            }
           
        }); 
    }

    // --------function Api-----------------------
    
    /************************************************/
    return(
        <>              
            <Row style={{paddingTop:0, paddingBottom:7}}>
                <AppBreadcrumb />              
            </Row>
            <Row justify="center">                                 
                <Col span={24}>
                    <Card bordered headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                        <Row style={{marginBottom : '10px',padding:'6px 0 6px 0'}}>
                            <Col><span style={{fontWeight : 'bolder' , fontSize : '22px'}}>Advanced Search</span></Col>
                        </Row>
                        <Row>
                            <Col  xs={{ span: 24}} lg={{ span: 10, offset: 0}} style={{marginBottom : '8px'}}>
                                <span style={TitleStyle}>Dtac ref ID</span>
                                <Tooltip
                                    trigger={['focus']}
                                    title={titleAlertDtacRef}
                                    placement="topLeft"
                                    overlayClassName="numeric-input"
                                >
                                    <Input 
                                        value={dtacRefID}
                                        onChange={onChangeInputDtacRefId}
                                        maxLength={9}
                                    >
                                    </Input>
                                </Tooltip>
                                
                            </Col>
                            <Col  xs={{ span: 24}} lg={{ span: 10, offset: 2 }}>
                                <span style={TitleStyle}>Order ref ID</span>
                                <Tooltip
                                    trigger={['focus']}
                                    title={titleAlertOrderId}
                                    placement="topLeft"
                                    overlayClassName="numeric-input"
                                >
                                    <Input 
                                        value={mercuryOrderID}
                                        onChange={onChangeInputOrderId}
                                        maxLength={9}
                                    >
                                    </Input>
                                </Tooltip>
                            </Col>
                        </Row>
                        <Divider style={{background : '#E34625' , fontWeight : 'bolder'}}/> 
                        <Row>
                            <Col  xs={{ span: 24}} lg={{ span: 10, offset: 0}} style={{marginBottom : '8px'}}>
                                <span style={TitleStyle}>วันที่เริ่มค้นหา <span style={{color : 'red'}}>*</span></span><br></br>
                                <DatePicker  
                                    style={{ width: '100%' }} 
                                    format={dateFormat}  
                                    onChange={onClickDateStart}
                                > 
                                </DatePicker>
                            </Col>
                            <Col  xs={{ span: 24}} lg={{ span: 10, offset: 2 }}>
                                <span style={TitleStyle}>วันที่สิ้นสุดค้นหา <span style={{color : 'red'}}>*</span></span><br></br>
                                <DatePicker  
                                    style={{ width: '100%' }} 
                                    format={dateFormat} 
                                    onChange={onClickDateEnd} 
                                    disabledDate={d => !d || d.isAfter(checkDate,'day') || d.isBefore(dateStart,'day')}
                                >
                                </DatePicker>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col span={24}>
                                <span style={TitleStyle}>สถานะ <span style={{color : 'red'}}>*</span></span><br></br>
                                <Space size={[8, 16]} wrap>
                                    {dataAdvanceSearch.dataStatust.map(tag => (
                                            <CheckableTag
                                                style={{border : '1px solid gray'}}
                                                key={tag.status}
                                                checked={mercuryOrderStatus.indexOf(tag) > -1}
                                                onChange={checked => handleChangeDataStatus(tag, checked)}
                                            >
                                                {tag.statusName}
                                            </CheckableTag>
                                    ))}
                                </Space>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col span={24}>
                                <span style={TitleStyle}>ประเภทคำขอ</span><br></br>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="ประเภทคำขอ"
                                    optionFilterProp="children"
                                    onChange={(value,event)=>{console.log('value',value); setMercuryOrderTypeID(event.item.mercuryOrderTypeID)}}
                                    defaultValue={"ทุกประเภทคำขอ"}
                                    // onFocus={onFocus}
                                    // onBlur={onBlur}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {optionsMercuryordertype.map((item , inx) => (
                                        <Option key={inx} value={item.mercuryOrderTypeName} item={item} >
                                            {item.mercuryOrderTypeName}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                        <Row style={styleRow}>
                            <Col span={24}>
                                <span style={TitleStyle}>ผู้สร้าง (Owner)</span><br></br>
                                <AutoComplete
                                    // options={optionsUser}
                                    style={{ width: '100%' }}
                                    onSelect={(value,event)=>onSelectUserID(value,event)}
                                    onSearch={getcreateUserID}
                                    placeholder="ค้นหา"
                                >
                                    {optionsUser.map((item , inx) => (
                                        <OptionAutoComplete key={inx} value={item.userName} item={item} >
                                            {item.userName}
                                        </OptionAutoComplete>
                                    ))}
                                </AutoComplete>
                            </Col>
                        </Row>
                        <Row style={styleRow} justify="center">
                            <Col xs={20} sm={20} md={10} lg={8} xl={8} style={{marginBottom : '8px'}}>
                                <Button type="primary" block onClick={checkInputbeforeCallApi} disabled={(dateStart===undefined || dateEnd ===undefined)&&(dtacRefID === "" && mercuryOrderID ==="")}>ค้นหาข้อมูล</Button>
                            </Col>
                            <Col xs={20} sm={20} md={2} lg={1} xl={1}></Col>
                            <Col xs={20} sm={20} md={10} lg={8} xl={8}>
                                <Button danger block onClick={()=>{selectedMenu('MenuPage')}}>ย้อนกลับ</Button>
                            </Col>
                        </Row>
                        {/* <Row style={styleRow}>
                            <Col xs={{ span: 12 , offset: 5}} lg={{ span: 10, offset: 7}}>
                                <Button danger block onClick={()=>{selectedMenu('MenuPage')}}>ย้อนกลับ</Button>
                            </Col>
                        </Row> */}
                    </Card>                   
                </Col>            
            </Row>  
        </>
    )
}

export default AdvanceSearchPage;

