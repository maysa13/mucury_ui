import React, { useState, useRef, useEffect, useReducer }  from 'react';

/* Plugin */
import { Row, Col, Tabs, Input, InputNumber, Form, Button, Tooltip, AutoComplete } from 'antd';
//import Script from 'react-load-script';

/* Helper */
import { isNotError } from '../../helper/UtilityFunction';

/* Icon */
import { ReactComponent as PinMarkerIcon } from '../../icon/pin-marker.svg'
import HouseIcon from '../../icon/house.png';
import VillageIcon from '../../icon/village.png';
import CondoIcon from '../../icon/condo.png';
import OfficeBuildingIcon from '../../icon/office-building.png';

import {
    CloseCircleFilled,
    InfoCircleOutlined
} from '@ant-design/icons';

/* Component */
import MapCheckService from './MapCheckService';

/* API */
import MercuryAPI from '../../api/MercuryAPI'

const mercuryAPI = new MercuryAPI();

const { TabPane } = Tabs;

function Step1(props){
    const [formPlaceName] =  Form.useForm();
    const [formLocalLocation] =  Form.useForm();
    const [formInstallLatLng] = Form.useForm();
    const [areaInstallTpye, setAreaInstallTpye] = useState();
    const [showMap, setShowMap] = useState(false);
    //const [selectedNetWork, setSelectedNetWork] = useState({id: 1});
    const [showFullListNetwork, setShowFullListNetwork] = useState(false);
    const [formInstallLatLngValid, setFormInstallLatLngValid] = useState(false);
    const [dataFromMapCheckService, setDataFromMapCheckService] = useState(
        {
            markerData : null,
            circuitListData : []
        }
    );
    const [haveMoreThan500Distance, setHaveMoreThan500Distance] = useState(0);
    const [optionsAcomp, setOptionsAcomp] = useState([]);

    const [query, setQuery] = useState("");
    const autoCompletePlaceRef = useRef(null);

    const [valueAutoCompleteAcomp, setValueAutoCompleteAcomp] = useState('');

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const mapRef = useRef();

    let autoComplete;

    
    //Update Data จาก MapCheckService
    const updateSelectedMarker = (selectedMarker) => {
        setDataFromMapCheckService(oldState => ({ ...oldState, markerData: selectedMarker}));
        props.updateSelectedNetWork(selectedMarker);
    };
    const updateCircuitListData =(circuitList) => {
        console.log("circuitList : ",circuitList); 
        setDataFromMapCheckService(oldState => ({ ...oldState, circuitListData: circuitList}));
    }
    const updateHaveCircuitListFromMap  = (haveCircuitList) => {
        props.updateHaveCircuitList(haveCircuitList);
    }
    const updateAutoCompleteQuery = (autoCompleteQuery) =>{
        setQuery(autoCompleteQuery);
    }
   

    const clickAreaInstallTpyeButton = (id,name)  => (event) =>{
        setAreaInstallTpye(id);
        props.updateAreaInstallTpye({id: id, name: name});
    }

    const clickSelectNetwork = (selectNetwork) => (event) => {
        console.log("clickSelectNetwork => selectNetwork : ",selectNetwork)
        //setSelectedNetWork(selectNetwork);
        setDataFromMapCheckService(oldState => ({ ...oldState, markerData: selectNetwork}));
        props.updateSelectedNetWork(selectNetwork);
        mapRef.current.setManualClickMarker(selectNetwork);
    }

    const clickToggleShowFullListNetwork = () => {
        setShowFullListNetwork(!showFullListNetwork);
    }

    const documentWorkData = {
        work : {
            insLat : 13.9035281,
            insLng : 100.5260591
        },
        workDetl : [ 
            {
                file : [
                    {
                        id : "1",
                        fileLat : '13.9017627',
                        fileLng : '100.5268275'
                    },
                    {
                        id : "2",
                        fileLat : '13.9052711',
                        fileLng : '100.5260587'
                    },
                    {
                        id : "3",
                        fileLat : '13.905299',
                        fileLng : '100.527869'
                    }
                ]
            } 
        ]   
    }


    const handleScriptLoad = (updateQuery) => {
        // Declare Options For Autocomplete
        const options = {
          types: ['establishment'],
          componentRestrictions: { country: "th" }
        };
    
        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        autoComplete = new window.google.maps.places.Autocomplete(
            autoCompletePlaceRef.current,
          options,
        );
    
        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components and formatted
        // address.
        //autoComplete.setFields(['address_components', 'formatted_address']);
        autoComplete.setFields(['name', 'geometry']);
    
        // Fire Event when a suggested name is selected
        autoComplete.addListener('place_changed', () => 
            handlePlaceSelect(updateQuery)
        );

        enableEnterKey(autoCompletePlaceRef.current);
    }

    async function handlePlaceSelect(updateQuery) {
        const addressObject = autoComplete.getPlace()
        const query = addressObject.name;
        setQuery(query);
        forceUpdate();
        if(addressObject.geometry){
            setShowMap(true);
            mapRef.current.setMapCenter(addressObject.geometry.location);
            mapRef.current.setMapZoom(17);
            mapRef.current.setPlaceSelectMarker(addressObject.geometry.location.lat(), addressObject.geometry.location.lng())
            // message.info({
            //     content: 'คลิกตำแหน่งที่ต้องการบนแผนที่เพื่อเลือกสถานที่ติดตั้ง'
            // });
        }
    }

    function enableEnterKey(input) {

        /* Store original event listener */
        const _addEventListener = input.addEventListener
    
        const addEventListenerWrapper = (type, listener) => {
          if (type === 'keydown') {
            /* Store existing listener function */
            const _listener = listener
            listener = (event) => {
              /* Simulate a 'down arrow' keypress if no address has been selected */
              const suggestionSelected = document.getElementsByClassName('pac-item-selected').length
              if (event.key === 'Enter' && !suggestionSelected) {
                const e = new KeyboardEvent('keydown', { 
                  key: 'ArrowDown', 
                  code: 'ArrowDown', 
                  keyCode: 40, 
                })
                _listener.apply(input, [e])
              }
              _listener.apply(input, [event])
            }
          }
          _addEventListener.apply(input, [type, listener])
        }
    
        input.addEventListener = addEventListenerWrapper
    }

    const clickClearPalceSearch = () => (event) => {
        console.log("clickClearPalceSearch !!!");
        setQuery("");
        mapRef.current.setPlaceSelectMarker('','')
    }

    const clickClearAcompSearch = () => (event) => {
        setValueAutoCompleteAcomp('');
    }

    const onFieldsChange = (values) =>{
        setFormInstallLatLngValid(!formInstallLatLng.getFieldsError().some((field) => field.errors.length > 0) );  
    }

    const submitFormInstallLatLng = (values) => {
        console.log('submitFormInstallLatLng => Success => values : ', values);
        setShowMap(true)
        setTimeout(()=>{
            mapRef.current.setMapCenter(new window.google.maps.LatLng(Number(values.lat), Number(values.lng))); 
        }, 500);
        mapRef.current.setMapZoom(16);
        mapRef.current.setInstallMarker(values.lat,values.lng);
    };

    const setInstallLatLng = (lat,lng) => {
        formInstallLatLng.setFieldsValue({
            lat : lat,
            lng : lng
        });

        formInstallLatLng.validateFields();
        
        setFormInstallLatLngValid(!formInstallLatLng.getFieldsError().some((field) => field.errors.length > 0) );

        props.updateInstallLatLng(lat,lng);
    }

    const onSearchAcomp = val => {
        console.log("onSearchAcomp => val : ",val);
        let options = [];
        if(val){
            if(val.length > 3){
                mercuryAPI.searchAcomp(val).then(data => {
                    if (isNotError(data)) {
                       console.log("searchAcomp => data :",data);
                       for(let i = 0;i < data.length;i++){
                            options.push(
                                {
                                    value : data[i].tambolName+' '+data[i].amphurName+' '+data[i].provinceName,
                                    fullvalue :  data[i]
                                }
                            )
                       }
                       setOptionsAcomp(options)
                    }
                });
            }
        }
    };

    const onChangeAcomp = (data) => {
        setValueAutoCompleteAcomp(data);
    };

    const onSelectAcomp = (val, option) => {
        console.log("onSelectAcomp => val : ",val);
        console.log("onSelectAcomp => option : ",option);

        setShowMap(true);
        mapRef.current.setMapCenter(new window.google.maps.LatLng(Number(option.fullvalue.lat), Number(option.fullvalue.lng)));
        mapRef.current.setMapZoom(17);
    };

    //การจัดการสีของ icon ขั้นตอน
    useEffect(()=> {
        //เลือกประเภทพื้นที่ติดตั้ง + ปักหมุดสถานที่ติดตั้ง + เลือกอุปกรณ์บนแผนที่ + เลือกอุปกรณ์ปลายทาง เรียบร้อยแล้ว
        //console.log("dataFromMapCheckService.markerData.index : ",dataFromMapCheckService.markerData.index)

        //ไม่ใช้ areaReady
        if(( typeof(areaInstallTpye) !== "undefined" && areaInstallTpye !== null ) && formInstallLatLngValid && dataFromMapCheckService.markerData && dataFromMapCheckService.markerData.index){
            console.log("aaaaa");
            props.setStep1Status('success');
            if(props.step2Status === 'default'){
                //props.clickStepButton(2);
                if(props.currentStep === 1){
                    props.setStep2Status('doing');
                    props.setCurrentStep(2);
                }
            }
        }
        else{
            if(props.currentStep === 1){
                console.log("bbbbb");
                props.setStep1Status('doing');
            }
            else{
                console.log("cccc");
                props.setStep1Status('default');
            } 
        }

        //ใช้ areaReady
        // if(props.areaReady === true){
        //     if(( typeof(areaInstallTpye) !== "undefined" && areaInstallTpye !== null ) && formInstallLatLngValid && dataFromMapCheckService.markerData && dataFromMapCheckService.markerData.index){
        //         console.log("aaaaa");
        //         props.setStep1Status('success');
        //         if(props.step2Status === 'default'){
        //             //props.clickStepButton(2);
        //             if(props.currentStep === 1){
        //                 props.setStep2Status('doing');
        //                 props.setCurrentStep(2);
        //             }
        //         }
        //     }
        //     else{
        //         if(props.currentStep === 1){
        //             console.log("bbbbb");
        //             props.setStep1Status('doing');
        //         }
        //         else{
        //             console.log("cccc");
        //             props.setStep1Status('default');
        //         } 
        //     }
        // }
        // else{
        //     if(( typeof(areaInstallTpye) !== "undefined" && areaInstallTpye !== null ) && formInstallLatLngValid){
        //         console.log("aaaaa");
        //         props.setStep1Status('success');
        //         if(props.step2Status === 'default'){
        //             props.setStep2Status('doing');
        //             //props.clickStepButton(2);
        //             if(props.currentStep === 1){
        //                 props.setCurrentStep(2);
        //             }    
        //         }
        //     }
        //     else{
        //         if(props.currentStep === 1){
        //             console.log("bbbbb");
        //             props.setStep1Status('doing');
        //         }
        //         else{
        //             console.log("cccc");
        //             props.setStep1Status('default');
        //         } 
        //     }
        // }
        

    },[areaInstallTpye, formInstallLatLngValid, dataFromMapCheckService])

    useEffect(() => {
        let tempHaveMoreThan500Distance = 0;
        if(dataFromMapCheckService.circuitListData.length > 0){ 
            for(let i = 0 ; i < dataFromMapCheckService.circuitListData.length ; i++){
                if(dataFromMapCheckService.circuitListData[0].distance){
                    if(dataFromMapCheckService.circuitListData[i].distance > 500){
                        tempHaveMoreThan500Distance = tempHaveMoreThan500Distance +1
                    }
                }
                else{
                    break;
                }
            }
            setHaveMoreThan500Distance(tempHaveMoreThan500Distance);
        }
        
    },[dataFromMapCheckService])



    useEffect(() => {
        handleScriptLoad(setQuery)
        setAreaInstallTpye(1);
        props.updateAreaInstallTpye({id: 1, name: 'บ้านพักอาศัย'});
        formInstallLatLng.validateFields();
    },[])

    return(
        <>
            <div className="card-content bg-white">
                <div style={{padding:'0 12px'}}>
                    <div className="text-cuscany" style={{fontSize:'18px',marginBottom:'8px'}}>
                        <span style={{fontWeight:'bold'}}>STEP 1&nbsp;&nbsp;&nbsp;</span>ค้นหาข่ายสาย
                    </div>
                    <div style={{marginBottom: '16px'}}>
                        <div className="content-title" style={{marginBottom:'8px'}}>
                            ระบุ ลักษณะประเภทพื้นที่ติดตั้ง
                        </div>
                        <Row style={{marginBottom:'4px'}}>
                            <div className={`button-icon ${(areaInstallTpye === 1)?'selected':''}`} onClick={clickAreaInstallTpyeButton(1,'บ้านพักอาศัย')} style={{marginRight:'16px'}}>
                                <div>บ้านพักอาศัย</div>
                                <img  src={HouseIcon} style={{width:70,height:70}}/>
                            </div>
                            <div className={`button-icon ${(areaInstallTpye === 2)?'selected':''}`} onClick={clickAreaInstallTpyeButton(2,'โครงการหมู่บ้าน')} style={{marginRight:'16px'}}>
                                <div>โครงการหมู่บ้าน</div>
                                <img  src={VillageIcon} style={{width:90,height:70}}/>
                            </div>
                            <div className={`button-icon ${(areaInstallTpye === 3)?'selected':''}`} onClick={clickAreaInstallTpyeButton(3,'คอนโดมิเนียม')} style={{marginRight:'16px'}}>
                                <div>คอนโดมิเนียม</div>
                                <img  src={CondoIcon} style={{width:70,height:70}}/>
                            </div>
                            <div className={`button-icon ${(areaInstallTpye === 4)?'selected':''}`} onClick={clickAreaInstallTpyeButton(4,'อาคารสำนักงาน')} style={{marginRight:'16px'}}>
                                <div>อาคารสำนักงาน</div>
                                <img  src={OfficeBuildingIcon} style={{width:70,height:70}}/>
                            </div>
                        </Row>
                    </div>
                    
                    <div className={`${(areaInstallTpye)?'':'hide'}`} style={{marginBottom: '16px'}}>
                        <div className="content-title">
                            กรอกข้อมูลที่อยู่สำหรับค้นหาที่ติดตั้ง อย่างใดอย่างหนึ่ง
                        </div>
                        <Tabs defaultActiveKey="1" centered>
                            <TabPane tab="ชื่อสถานที่ต้องการค้นหา" key="1">
                                <Row justify="center">
                                    <Col xs={{ span: 22}} lg={{ span: 8}}>
                                        <div className="input-allow-clear">
                                            <input
                                                className="ant-input"
                                                ref={autoCompletePlaceRef}
                                                onChange={event => setQuery(event.target.value)}
                                                placeholder="ระบุชื่อสถานที่ต้องการค้นหา"
                                                value={query}
                                            />
                                            <CloseCircleFilled className="clear-button ant-input-clear-icon" onClick={clickClearPalceSearch()}/>
                                        </div>
                                    </Col>
                                </Row>  
                            </TabPane>
                            <TabPane tab="ตำบล, อำเภอ, จังหวัด" key="2">
                                <Row justify="center"> 
                                
                                    <Col xs={{ span: 22}} lg={{ span: 8 }}> 
                                        <div className="input-allow-clear">
                                            <AutoComplete
                                                value={valueAutoCompleteAcomp}
                                                options={optionsAcomp}
                                                onSelect={(val, option) => onSelectAcomp(val, option)}
                                                onSearch={onSearchAcomp}
                                                onChange={onChangeAcomp}
                                                defaultActiveFirstOption={true}
                                                placeholder="ระบุ ตำบล, อำเภอ, จังหวัด ที่ต้องการค้นหา"
                                                style={{ width: '100%' }}
                                            >
                                            </AutoComplete>
                                            <CloseCircleFilled className="clear-button ant-input-clear-icon" onClick={clickClearAcompSearch()}/>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="พิกัดสถานที่" key="3">
                                <div>
                                    <Form
                                        form={formInstallLatLng}
                                        onFieldsChange={onFieldsChange}
                                        onFinish={submitFormInstallLatLng}
                                    >
                                        <Row justify="center">
                                            <Col xs={10} sm={8} lg={5} xl={4} style={{marginRight: '8px'}}>
                                                <Form.Item
                                                    label="ละติจูด"
                                                    name="lat"
                                                    labelCol={{ span: 24 }}
                                                    rules={[
                                                        {required: true,  message: 'กรุณาระบุละติจูด'},
                                                        {
                                                          pattern: new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/g),
                                                          message: "ละติจูดไม่ถูกต้อง"
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber style={{ width: '100%' }}/>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={10} sm={8}  lg={5}  xl={4} >
                                                <Form.Item
                                                    label="ลองจิจูด"
                                                    name="lng"
                                                    labelCol={{ span: 24 }}
                                                    rules={[
                                                        {required: true,  message: 'กรุณาระบุลองจิจูด'},
                                                        {
                                                          pattern: new RegExp(/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/g),
                                                          message: "ลองจิจูดไม่ถูกต้อง"
                                                        }
                                                    ]}
                                                >
                                                    <InputNumber style={{ width: '100%' }}/>
                                                </Form.Item>
                                            </Col>
                                            <Col className="submit-form-install-lat-lng" style={{paddingLeft: '15px'}}>
                                                <Form.Item>
                                                    <Tooltip title="ปักหมุดสถานที่ติดตั้ง">
                                                        <Button type="primary" shape="circle" htmlType="submit"  style={{marginTop: '30px'}}>
                                                            <PinMarkerIcon width="20px" height="20px" fill="white"/>
                                                        </Button>
                                                    </Tooltip>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                               
                            </TabPane>
                        </Tabs>
                    </div>
                       
                </div>

                {/*แผนที่*/}
                {/* <div className={`${areaInstallTpye?'':'hide'}`} > */}
                <div className={`${showMap?'':'hide'}`} style={{padding:'0 12px',color:'red'}}>
                    <div className={`${((!formInstallLatLng.getFieldValue("lat")||!formInstallLatLng.getFieldValue("lng")) )?'':'hide'}`}>
                        <InfoCircleOutlined /> คลิกตำแหน่งที่ต้องการบนแผนที่เพื่อเลือกสถานที่ติดตั้ง
                         
                    </div>
                    {props.haveCircuitList === true &&
                        <div className={`${( (formInstallLatLng.getFieldValue("lat")&&formInstallLatLng.getFieldValue("lng")) && !dataFromMapCheckService.markerData )?'':'hide'}`}>
                            <InfoCircleOutlined /> คลิกที่ไอคอนอุปกรณ์บนแผนที่เพื่อเลือกอุปกรณ์
                        </div>
                    }
                </div>
                
                <div className={`map-height ${showMap?'':'hide'}`} style={{marginBottom: '38px'}}>
                    <MapCheckService 
                        ref={mapRef}    
                        //areaReady={props.areaReady}
                        haveCircuitList={props.haveCircuitList} 
                        haveMoreThan500Distance={haveMoreThan500Distance}
                        documentWorkData={documentWorkData} 
                        formInstallLatLng={formInstallLatLng} 
                        setInstallLatLng={(lat,lng) => setInstallLatLng(lat,lng)}
                        autoCompleteQueryFromStep1={query}

                        updateSelectedMarker={(selectedMarker) => {updateSelectedMarker(selectedMarker)}}
                        updateCircuitListData={(circuitList) => {updateCircuitListData(circuitList)}}
                        updateHaveCircuitListFromMap={ (haveCircuitList) => {updateHaveCircuitListFromMap(haveCircuitList)}}
                        updateAutoCompleteQueryFromMap={(autoCompleteQuery) => {updateAutoCompleteQuery(autoCompleteQuery)}}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'cennter', margin:'8px 0', paddingRight: '8px'}}>
                        <div style={{color: 'red', fontSize: '16px'}}>*** ฟรีค่าลากข่ายสายสำหรับ 500 เมตรแรก</div>
                    </div>
                </div>
                
                {dataFromMapCheckService.circuitListData.length > 0 && dataFromMapCheckService.circuitListData.length >  haveMoreThan500Distance &&
                    <div style={{padding:'0 12px'}}>
                        <div className="content-title" style={{marginBottom: '8px'}}>
                            กรุณาเลือกอุปกรณ์ปลายทาง
                        </div>
                        {dataFromMapCheckService.markerData  &&
                            <div style={{fontSize:'16px', fontWeight:'bold', marginBottom: '8px'}}>{dataFromMapCheckService.markerData.locationCode} - {dataFromMapCheckService.markerData.locationName}</div>
                        } 
                        {dataFromMapCheckService.markerData === null &&
                            <div style={{fontSize:'16px', fontWeight:'bold', marginBottom: '8px'}}>{dataFromMapCheckService.circuitListData[0].locationCode} - {dataFromMapCheckService.circuitListData[0].locationName}</div>
                        }     
                        {dataFromMapCheckService.circuitListData
                            .filter( itemCircuitListData => (  
                                ((dataFromMapCheckService.markerData)? 
                                (itemCircuitListData.index === dataFromMapCheckService.markerData.index):
                                (itemCircuitListData.index === dataFromMapCheckService.circuitListData[0].index)) ||(showFullListNetwork === true)) )
                            .map((itemCircuitListData, indexCircuitListData) => {
                                return(
                                  
                                    <Row key={indexCircuitListData} className={
                                        ` pointer ${ (dataFromMapCheckService.markerData&&itemCircuitListData.index === dataFromMapCheckService.markerData.index)?'bg-dairycream' : '' } 
                                        ${(parseFloat(itemCircuitListData.distance) < 500?'':'hide')}
                                        `} 
                                        onClick={clickSelectNetwork(itemCircuitListData)} style={{marginBottom: '8px', padding:'8px', border:'1px solid #E34625'}}>
                                        <Col span={16}>
                                            <div className="text-hotcinnamon" style={{fontSize:'20px',fontWeight: 'bold'}}>
                                                {itemCircuitListData.splfatName} [ว่าง{itemCircuitListData.splfatAva}/{itemCircuitListData.splfatTotal}]
                                            </div>
                                            <div style={{fontSize:'14px'}}>
                                                NODE: <span>{itemCircuitListData.olt}</span>
                                            </div>  
                                            <div style={{fontSize:'14px'}}>
                                                GPON: <span>{itemCircuitListData.gpon}</span>
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
                                            {/* <div>&nbsp;</div> */}
                                            <div className="text-smalt">ระยะอุปกรณ์ไปยังสถานที่ติดตั้ง</div>
                                            <div className="text-smalt" style={{fontSize: '20px', fontWeight: 'bold'}}>{itemCircuitListData.distance} เมตร</div>
                                            <div style={{fontSize: '12px', color:'red'}}>ฟรีค่าลากข่ายสายสำหรับ 500 เมตรแรก</div>
                                        </Col>  
                                    </Row>    
                                )
                        })}
                        <Row justify="center" style={{margin: '0'}}>
                            <Col>
                                <Button type="primary" size="small"  
                                    onClick={() => clickToggleShowFullListNetwork()}
                                    style={{fontSize:'12px'}}
                                >
                                    {(showFullListNetwork === false)?'แสดงอุปกรณ์ปลายทางเพิ่มเติม':'แสดงอุปกรณ์ปลายทางน้อยลง'}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        </>
    )
}

export default Step1;

