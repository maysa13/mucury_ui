import React, { useEffect, useState, useContext, useRef }  from 'react';


/* Plugin */
import { Row, Col, Button, message } from 'antd';
import {
    CheckOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import Swal from 'sweetalert2/dist/sweetalert2.js'

/* Helper */
import { isNotError } from '../../helper/UtilityFunction';

/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';

/* Page */
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

/* Component */
import AppBreadcrumb from '../../component/AppBreadcrumb';

/* Icon */
import ConfirmIcon from '../../icon/question.svg';
import SuccessIcon from '../../icon/success.svg';
import WarnIcon from '../../icon/warn.svg'
import ThIcon from '../../icon/thailand-svgrepo-com.svg';
import EngIcon from '../../icon/united-kingdom-svgrepo-com.svg';
import { ReactComponent as SearchNetworkIcon } from '../../icon/search-network.svg';
import { ReactComponent as AskInstallAreaIcon } from '../../icon/ask-install-area.svg';
import { ReactComponent as InstallAddressIcon } from '../../icon/install-address.svg';
import { ReactComponent as AppointmentIcon } from '../../icon/appointment.svg';
import { ReactComponent as CreateSuccessIcon} from '../../icon/create-success.svg';

/* Config */
import demoQuestionDataList1V2 from '../../config/questionInstallArea.js'

/* API */
import MercuryAPI from '../../api/MercuryAPI'

const mercuryAPI = new MercuryAPI();

const SwalVrticalbutton = Swal.mixin({
    customClass: {
        actions: 'vertical-button'
    }
})


function CheckServiceAreaPage(props) {
    const moment = require('moment');
    const {
        selectedMenu,appointment, 
    } = useContext(MercuryContext);

    const [ progressBarFixTop, setProgressBarFixTop] = useState(false);
    const [ currentStep , setCurrentStep ] = useState(1);
    const [ step1Status , setStep1Status  ] = useState('doing'); //'success', 'doing', 'default'
    const [ step2Status , setStep2Status  ] = useState('default');
    const [ step3Status  , setStep3Status  ] = useState('default');
    const [ step4Status  , setStep4Status  ] = useState('default');
    const [ step5Status  , setStep5Status  ] = useState('default');

    const step1SectionRef = useRef(null);
    const step2SectionRef = useRef(null);
    const step3SectionRef = useRef(null);
    const step4SectionRef = useRef(null);

    const step2Ref = useRef();

    const [dataFromStep1, setDataFromStep1] = useState(
        {
            areaInstallTpye : {id:1, name:''},
            installLatLng : {lat : null, lng : null},
            haveCircuitList : null,
            selectedNetWork : {index : 1}
        }
    );

    const [dataFromStep2, setDataFromStep2] = useState([]);

    const [dataFromStep3, setDataFromStep3] = useState(
        {
            areaReady : null,
            disableAreaReady : false,
            language : 'T',
            installAddress : {},
            haveSomeData : false
        }
    );

    const [dataFromStep4, setDataFromStep4] = useState(
        {
            appointmentMoreDetail : ''
        }
    );

    

    //Update Data จาก Step

    //Step 1 Data
    const updateAreaInstallTpye = (areaInstallTpye) => {
        if(step2Ref && (currentStep >= 2)){
                step2Ref.current.resetFormStep2subQuestion();
        }
        setDataFromStep1(oldState => ({ ...oldState, areaInstallTpye: areaInstallTpye}));
    };
    const updateInstallLatLng = (lat,lng) => {
        setDataFromStep1(oldState => ({ ...oldState, installLatLng: {lat:lat , lng:lng}}));
    };
    const updateHaveCircuitList= (haveCircuitList) => {
        console.log("updateHaveCircuitList => haveCircuitList : ",haveCircuitList)
        setDataFromStep1(oldState => ({ ...oldState, haveCircuitList: haveCircuitList}));
    };
    const updateSelectedNetWork= (selectedNetWork) => {
        console.log("updateSelectedNetWork => selectedNetWork : ",selectedNetWork)
        setDataFromStep1(oldState => ({ ...oldState, selectedNetWork: selectedNetWork}));

        if(selectedNetWork){
            if(parseInt(selectedNetWork.distance) <= 500){
                setDataFromStep3(oldState => ({ ...oldState, areaReady: true, disableAreaReady : true}));
            }
            else{
                setDataFromStep3(oldState => ({ ...oldState, disableAreaReady : false}));
            }
        }
        else{
            setDataFromStep3(oldState => ({ ...oldState, disableAreaReady : false}));
        }
    };

    //Step 2 Data
    const updateSurveyList = (surveyListState) => {
        setDataFromStep2(surveyListState);
        genInsInfo(surveyListState);
        let insInfo = genInsInfo(surveyListState);
        console.log("updateSurveyList => insInfo : ",insInfo);
    };

    //Step 3 Data
    const updateAreaReady = (areaReady) => {
        setDataFromStep3(oldState => ({ ...oldState, areaReady: areaReady}));
    };
    const updateSetLanguage = (language) => {
        setDataFromStep3(oldState => ({ ...oldState, language: language}));
    };
    const updateInstallAddress = (installAddress) => {
        console.log("updateInstallAddress => installAddress : ",installAddress);
        let checkHaveSomeData = false;
        for (const property in installAddress) {
            //console.log(`${property}: ${installAddress[property]}`);
            if(property !== "contactTitelName"){
                if(installAddress[property]){
                    console.log("have some data");
                    checkHaveSomeData = true;
                    break;
                }
                else{
                    console.log("not have data");
                    checkHaveSomeData = false;
                }
            }
        }

        setDataFromStep3(oldState => ({ ...oldState, installAddress: installAddress, haveSomeData: checkHaveSomeData}));
    }

    //Step 4 Data
    const updateAppointmentMoreDetail = (appointmentMoreDetail) => {
        setDataFromStep4(oldState => ({ ...oldState, appointmentMoreDetail: appointmentMoreDetail}));
    };


    const menuHandleClick = (parameter) => (event)  => {
        selectedMenu(parameter)
    };
    

    const clickStepButton = (stepNumber) => {
        //setCurrentStep(stepNumber);
        setTimeout(function(){
            if(stepNumber === 1){
                scrolledToElement(step1SectionRef)
            }
            if(stepNumber === 2){
                scrolledToElement(step2SectionRef)
            }  
            if(stepNumber === 3){
                scrolledToElement(step3SectionRef)
            }  
            if(stepNumber === 4){
                scrolledToElement(step4SectionRef)
            }      
        }, 200);     
    };

    const scrolledToElement = (elementRef) => {
        if(elementRef.current){
            // scroll to element
            elementRef.current.scrollIntoView();

            //for fixed header
            const scrolledY = window.scrollY;

            if (scrolledY) {
                window.scroll(0, scrolledY - 120);
            }
        }        
    }

    const getStepIconClass = (stepStatus) => {
        return classNames({
                'icon': stepStatus === 'default',
                'icon-success': stepStatus === 'success',
                'icon-doing': stepStatus === 'doing'
            });
    }

    const getStepMarkClass = (stepStatus) =>  {
        return classNames({
                'mark': stepStatus === 'default',
                'mark-success': stepStatus === 'success',
                'mark-doing': stepStatus === 'doing'
            });
    }

    const getStepTitleClass = (stepStatus) =>  {
        return classNames({
                'title': stepStatus === 'default',
                'title-success': stepStatus === 'success',
                'title-doing': stepStatus === 'doing'
            });
    }

    const getCursorPointClass = (stepNumber) => {
        return classNames({
            'pointer': currentStep >= stepNumber 
        });
    }

    const handleScroll = () => {
        //console.log("window.pageYOffset : ",window.pageYOffset)
        if (window.pageYOffset > 5) {
            setProgressBarFixTop(true)
        }else{
            setProgressBarFixTop(false)
        }
    }

    const genInsInfo = (surveyListState) => {
        let insInfo = [];
        if(surveyListState){
            
            for(let i = 0;i < surveyListState.length;i++){
                for(let j = 0 ; j < surveyListState[i].checkboxArray.length ; j++){
                    if(surveyListState[i].checkboxArray[j]===true){
                        insInfo.push(
                            {
                                //"Q": i+1,
                                "Q": demoQuestionDataList1V2[dataFromStep1.areaInstallTpye.id-1][i].questionCode,
                                //"A": j+1,
                                "A": demoQuestionDataList1V2[dataFromStep1.areaInstallTpye.id-1][i].anwser[j].anwserCode,
                                "text1": null,
                                "text2": null,
                                "text3": null,
                                "text4": null,
                                "text5": null
                            }
                        )
                    }
                }
                for(let k = 0 ; k < surveyListState[i].subQuestion.length ; k++){
                    console.log("surveyListState["+i+"].subQuestion["+k+"] : ",surveyListState[i].subQuestion[k]);
                    console.log("surveyListState["+i+"].subQuestion["+k+"].value.length : ",surveyListState[i].subQuestion[k].value.length)
                    if(surveyListState[i].subQuestion[k].value.length > 0){
                        insInfo.push(
                            {
                                //"Q": i+1,
                                "Q": demoQuestionDataList1V2[dataFromStep1.areaInstallTpye.id-1][i].questionCode,
                                //"A": surveyListState[i].checkboxArray.length+1+k,
                                "A": demoQuestionDataList1V2[dataFromStep1.areaInstallTpye.id-1][i].subQuestion[k].anwserCode,
                                "text1": (surveyListState[i].subQuestion[k]?surveyListState[i].subQuestion[k].value:null),
                                "text2": null,
                                "text3": null,
                                "text4": null,
                                "text5": null
                            }
                        )
                    }
                }
                  
            }
            console.log("insInfo : ",insInfo);
            return insInfo;
        }
        else{
            return insInfo;
        }
    };

    const getAppointTimeStart = (appointmentDurationCode) =>{
        if(appointmentDurationCode === "1"){
            return '08:00';
        }
        else if(appointmentDurationCode === "2"){
            return '13:00';
        }
        else if(appointmentDurationCode === "3"){
            return '18:00';
        }
        else{
            return null;
        }
    }
    
    const getAppointTimeEnd = (appointmentDurationCode) =>{
        if(appointmentDurationCode === "1"){
            return '12:00';
        }
        else if(appointmentDurationCode === "2"){
            return '17:00';
        }
        else if(appointmentDurationCode === "3"){
            return '22:00';
        }
        else{
            return null;
        }
    }

    const clickSubmitCheckServiceArea = () => {
        console.log("clickSubmitCheckServiceArea => ");

        let createNewOderData = {
            insStatusID: (dataFromStep3.areaReady?1:0),
            insInfo : genInsInfo(dataFromStep2),
            insContact: {
                contactTitelName: dataFromStep3.installAddress.contactTitelName,
                contactFirstName: dataFromStep3.installAddress.contactFirstName,
                contactLastName: dataFromStep3.installAddress.contactLastName,
                contactTel: dataFromStep3.installAddress.contactTel,
                contactLang: dataFromStep3.language
            },
            insNetwork: {
                locationCode: dataFromStep1.selectedNetWork.locationCode ,
                olt: dataFromStep1.selectedNetWork.olt,
                gpon: dataFromStep1.selectedNetWork.gpon,
                splfatCode: dataFromStep1.selectedNetWork.splfatName,
                splfatDwZoneCode: dataFromStep1.selectedNetWork.dwZoneCode,
                splfatLat: dataFromStep1.selectedNetWork.splfatLat,
                splfatLng: dataFromStep1.selectedNetWork.splfatLng
            },
            insAddr: {
                mercuryAddrAreaTypeID: (dataFromStep1.areaInstallTpye.id).toString(),
                homeNum: dataFromStep3.installAddress.homeNum,
                moo: dataFromStep3.installAddress.moo,
                buildingName: dataFromStep3.installAddress.buildingName,
                roomName: dataFromStep3.installAddress.roomName,
                soiName: dataFromStep3.installAddress.soiName,
                streetName: dataFromStep3.installAddress.streetName,
                tambolCode: dataFromStep3.installAddress.acompStep3.tambolCode,
                tambolName: dataFromStep3.installAddress.acompStep3.tambolName,
                amphurCode: dataFromStep3.installAddress.acompStep3.amphurCode,
                amphurName: dataFromStep3.installAddress.acompStep3.amphurName,
                provinceCode: dataFromStep3.installAddress.acompStep3.provinceCode,
                provinceName: dataFromStep3.installAddress.acompStep3.provinceName,
                zipcode: dataFromStep3.installAddress.zipcode,
                lat: (dataFromStep1.installLatLng.lat).toString(),
                lng: (dataFromStep1.installLatLng.lng).toString()
            },
            insAppoint: {
                mercuryAppointTimeTypeID: appointment.data.appointmentDurationCode,
                appointDate: appointment.Day,
                appointTimeStart: getAppointTimeStart(appointment.data.appointmentDurationCode),
                appointTimeEnd: getAppointTimeEnd(appointment.data.appointmentDurationCode),
                appointZoneCode: dataFromStep1.selectedNetWork.dwZoneCode,
                appointNote: dataFromStep4.appointmentMoreDetail
            }
        }

        let typeInstall = dataFromStep1.areaInstallTpye.name;
        let equipmentData1 = dataFromStep1.selectedNetWork.locationCode+" - "+dataFromStep1.selectedNetWork.locationName;
        let equipmentData2 = dataFromStep1.selectedNetWork.olt;
        let equipmentData3 = dataFromStep1.selectedNetWork.gpon;
        let customerData1 = dataFromStep3.installAddress.contactTitelName+" "+dataFromStep3.installAddress.contactFirstName+" "+dataFromStep3.installAddress.contactLastName;
        let customerData2 = dataFromStep3.installAddress.contactTel;
        let customerData3 = "บ้านเลขที่ "+dataFromStep3.installAddress.homeNum+
        " หมู่ที่ "+(dataFromStep3.installAddress.moo?dataFromStep3.installAddress.moo:"-")+
        " หมู่บ้านหรืออาคาร "+(dataFromStep3.installAddress.buildingName?dataFromStep3.installAddress.buildingName:"-")+
        " ห้อง "+ (dataFromStep3.installAddress.roomName?dataFromStep3.installAddress.roomName:"-")+
        " ซอย "+(dataFromStep3.installAddress.soiName?dataFromStep3.installAddress.soiName:"-")+ 
        " ถนน "+(dataFromStep3.installAddress.streetName?dataFromStep3.installAddress.streetName:"-")+ 
        " "+
        dataFromStep3.installAddress.acompStep3.tambolName+dataFromStep3.installAddress.acompStep3.amphurName+dataFromStep3.installAddress.acompStep3.provinceName+dataFromStep3.installAddress.zipcode;
        let customerData4 =  dataFromStep3.language;
        let appointmentData1 = moment(appointment.Day).format('DD/MM/YYYY');
        let appointmentData2 = appointment.data.appointmentDurationName;
        let appointmentData3 =  (dataFromStep4.appointmentMoreDetail?dataFromStep4.appointmentMoreDetail:"-"); //"ลูกค้าแจ้งว่ากรณีติดต่อเบอร์โทรศัพท์หลักไม่ติดให้โทรอีกเบอร์ 089-495-8132 (คุณส้ม)"
        let languageHtml = '';
        if(customerData4 === "T"){
            languageHtml = '<img src="'+ThIcon+'" width="24px" height="24px"></img><span>ภาษาไทย</span>';
        }
        else if(customerData4 === "E"){
            languageHtml = '<img src="'+EngIcon+'" width="24px" height="24px"></img><span>English</span>';
        }
        SwalVrticalbutton.fire({
            imageUrl: ConfirmIcon,
            imageWidth: 64,
            imageHeight: 64,
            imageAlt: 'Confirm image',
            title: 'เจ้าหน้าทีต้องการยืนยันจะบันทึกข้อมูล</br>พื้นที่ให้บริการใช่หรือไม่',
            html: '<div style="text-align: left;">'+
            '<div class="summarize-box">'+
            '<p class="header">ข้อมูลข่ายสายที่ใช้</p>'+
            '<p class="label">ประเภทสถานที่ติดตั้ง</p>'+
            '<p class="data-last">'+typeInstall+'</p>'+
            '<p class="label">ข้อมูลข่ายสาย</p>'+
            '<p class="data">'+equipmentData1+'</p>'+
            '<p class="data">NODE: '+equipmentData2+'</p>'+
            '<p class="data-last">GPON: '+equipmentData3+'</p>'+
            '</div>'+
            '<div class="summarize-box">'+
            '<p class="header">ข้อมูลลูกค้า</p>'+
            '<p class="label">ภาษาที่ใช้ในการติดต่อ</p>'+
            '<div style="display: flex;">'+
                '<div class="button-icon-row" style="margin-right: 16px;cursor: default;">'+
                    languageHtml+
                '</div>'+
            '</div>'+
            '<p class="label">ชื่อ-นามสกุล</p>'+
            '<p class="data-last">'+customerData1+'</p>'+
            '<p class="label">เบอร์โทรศัพท์มือถือ</p>'+
            '<p class="data-last">'+customerData2+'</p>'+
            '<p class="label">สถานที่ติดตั้ง</p>'+
            '<p class="data-last">'+customerData3+'</p>'+
            '</div>'+
            '<div class="summarize-box">'+
            '<p class="header">ข้อมูลนัดหมายติดตั้ง</p>'+
            '<p class="label">วันที่นัดหมาย</p>'+
            '<p class="data-last">'+appointmentData1+'</p>'+
            '<p class="label">ช่วงเวลานัดหมาย</p>'+
            '<p class="data-last">'+appointmentData2+'</p>'+
            '<p class="label">รายละเอียดเพิ่มเติม</p>'+
            '<p class="data-last">'+appointmentData3+'</p>'+
            '</div>'+
            '</div>',
            showCancelButton: true,
            confirmButtonText: '&nbsp;&nbsp;ใช่,ยืนยันดำเนินการ&nbsp;&nbsp;',
            cancelButtonText: 'ไม่ใช่,กลับไปแก้ไขข้อมูล',
            allowEscapeKey: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
               mercuryAPI.createNewOrder(createNewOderData).then(data => {
                    if (isNotError(data)) {
                        console.log("createNewOrder => data :",data);
                        setStep5Status('success');
                        SwalVrticalbutton.fire({
                            imageUrl: SuccessIcon,
                            imageWidth: 128,
                            imageHeight: 128,
                            imageAlt: 'Confirm image',
                            title: 'ระบบดำเนินการบันทึกข้อมูลพื้นที่ให้บริการสำเร็จเรียบร้อยแล้ว',
                            html:
                            '<div class="info-result-label">เลขที่คำขอติดตั้งบริการใหม่</div>'+
                            '<div class="info-result-orderId">'+data.mercuryOrderID+'</div>'+
                            '<div class="info-result-label">สถานที่ติดตั้ง</div>'+
                            '<div class="info-result-install-address">'+customerData3+'</div>',
                            confirmButtonText: 'Save and Copy OrderId',
                            allowEscapeKey: false,
                            allowOutsideClick: false
                        }).then((result2) => {
                            if (result2.isConfirmed) {
                                const cb = navigator.clipboard;
                                cb.writeText(data.mercuryOrderID).then(() => {
                                    message.success('คัดลอก OrderId : '+data.mercuryOrderID+'สำเร็จ');
                                    //กลับไปหน้าแรก
                                    selectedMenu('MenuPage')
                                });
                            }
                        });
                    }
                })
            }
        });
    }

    const clickCancelCheckServiceArea = () => {
        SwalVrticalbutton.fire({
            imageUrl: WarnIcon,
            imageWidth: 128,
            imageHeight: 128,
            imageAlt: 'Warning image',
            title: '<div style="color:#8e0000;">คุณยืนยันที่จะลบข้อมูลใช่หรือไม่</div>',
            html:
            '<div style="text-align: left;">ข้อมูลที่เจ้าหน้าที่ระบุทั้งหมดจะไม่ถูกบันทึกในระบบ</div>'+
            '<div style="text-align: left;">คุณยืนที่จะลบข้อมูลหรือไม่คะ</div>',
            showConfirmButton: false,
            showCancelButton: true,
            showDenyButton: true,
            denyButtonText: 'กลับไปทำรายการต่อ',
            cancelButtonText:  'ลบข้อมูล',
            allowEscapeKey: false,
            allowOutsideClick: false
        }).then((result) => {
            console.log('result',result)
            if (!result.isDenied) {
                if(result.isDismissed){
                    Swal.fire({
                        imageUrl:SuccessIcon,
                        imageHeight:'100px',
                        title: 'ระบบดำเนินการลบข้อมูลเรียบร้อยแล้วค่ะ',
                        showCancelButton: true,  
                        showConfirmButton:false,                         
                            cancelButtonText: 'ตกลง',
                            buttonsStyling: false,
                            customClass: {
                            actions: 'vertical-buttons',
                            cancelButton: 'cancle-buttons',                    
                        },  
                    }).then((result) => {
                        console.log(result)
                        if(result.isDismissed === true){          
                          selectedMenu('MenuPage')
                        }
                    })
                }
                else{
                    selectedMenu('MenuPage');
                }
            }
        });
    }



    //ทดสอบรับค่า
    // useEffect(() => {
    //     console.log("dataFromStep1 : ",dataFromStep1);
    // }, [dataFromStep1])

    // useEffect(() => {
    //     console.log("dataFromStep2 : ",dataFromStep2);
    // },[dataFromStep2])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
      
        //component unmount 
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return(
        <>
             <Row>
                <Col span={24}>
                    {/* แถบขั้นตอน */}
                    <div className={`section-progress-bar ${ (progressBarFixTop === true)?'top-0-shadow':'' }`} style={{paddingTop: '12px',paddingLeft: '12px'}}>
                        <Row>
                            <Col span={24}>
                                {/* <div className="pointer" title="กลับหน้าหลัก" onClick={menuHandleClick('MenuPage')} style={{marginTop:'12px', marginLeft:'8px', display: 'inline-flex', alignItems: 'center',position:'absolute',zIndex:'999'}}>
                                    <BackToMenuIcon width="34px" height="34"></BackToMenuIcon>
                                </div> */}
                                <AppBreadcrumb/>
                                <div className="progress-bar" >
                                    <ul style={{paddingLeft: '0',marginBottom: '0'}}>
                                        <li className={getCursorPointClass(1)} onClick={() => clickStepButton(1)}>
                                            <SearchNetworkIcon className={getStepIconClass(step1Status)} width="50px" height="50px"></SearchNetworkIcon>
                                            <br/>
                                            <CheckOutlined className={getStepMarkClass(step1Status)} />
                                            <div className={getStepTitleClass(step1Status)}>ค้นหาข่ายสาย</div>
                                        </li>
                                        <li className={getCursorPointClass(2)} onClick={() => clickStepButton(2)}>
                                            <AskInstallAreaIcon className={getStepIconClass(step2Status)} width="50px" height="50px"></AskInstallAreaIcon>
                                            <br/>
                                            <CheckOutlined className={getStepMarkClass(step2Status)} />
                                            <div className={getStepTitleClass(step2Status)}>สอบถามพื้นที่ติดตั้ง</div>
                                        </li>
                                        <li className={getCursorPointClass(3)} onClick={() => clickStepButton(3)}>
                                            <InstallAddressIcon className={getStepIconClass(step3Status)} width="50px" height="50px"></InstallAddressIcon>
                                            <br/>
                                            <CheckOutlined className={getStepMarkClass(step3Status)}/>
                                            <div className={getStepTitleClass(step3Status)}>ข้อมูลสถานที่ติดตั้ง</div>
                                        </li>
                                        {(dataFromStep3.areaReady === true) &&
                                             <li className={getCursorPointClass(4)} onClick={() => clickStepButton(4)}>
                                                <AppointmentIcon className={getStepIconClass(step4Status)} width="50px" height="50px"></AppointmentIcon>
                                                <br/>
                                                <CheckOutlined className={getStepMarkClass(step4Status)}/>
                                                <div className={getStepTitleClass(step4Status)}>นัดหมายติดตั้ง</div>
                                            </li>
                                        }
                                        <li>
                                            {/* onClick={() => clickStepButton(5)} */}
                                            <CreateSuccessIcon className={getStepIconClass(step5Status)} width="50px" height="50px"></CreateSuccessIcon>
                                            <br/>
                                            <CheckOutlined className={getStepMarkClass(step5Status)}/>
                                            <div className={getStepTitleClass(step5Status)}>สร้างคำขอสำเร็จ</div>
                                        </li>
                                    </ul>
                                </div>
                                
                            </Col>
                        </Row>
                    </div>
                    <div style={{paddingTop: '122px'}}>
                        {currentStep >= 1 &&
                            <div ref={step1SectionRef}>
                                <Step1 
                                    setStep1Status={(status) => {setStep1Status(status);}} 
                                    setStep2Status={(status) => {setStep2Status(status)}}
                                    setCurrentStep={(stepNumber) =>{setCurrentStep(stepNumber)}}
                                    clickStepButton={(stepNumber) => {clickStepButton(stepNumber)}}
                                    step2Status={step2Status}
                                    currentStep={currentStep}

                                    //areaReady={dataFromStep3.areaReady}
                                    haveCircuitList={dataFromStep1.haveCircuitList}

                                    updateAreaInstallTpye={(areaInstallTpye) => {updateAreaInstallTpye(areaInstallTpye)}}
                                    updateInstallLatLng={(lat,lng) => {updateInstallLatLng(lat,lng)}}
                                    updateSelectedNetWork={(selectedNetWork) => {updateSelectedNetWork(selectedNetWork)}}
                                    updateHaveCircuitList={(haveCircuitList) => {updateHaveCircuitList(haveCircuitList)}}
                                />   
                            </div>
                        }
                        {currentStep >= 2 &&
                            <div ref={step2SectionRef}>
                                <Step2  
                                    ref={step2Ref}
                                    surveyType={dataFromStep1.areaInstallTpye.id-1}
                                    haveSomeData={dataFromStep3.haveSomeData}

                                    setStep2Status={(status) => {setStep2Status(status)}}
                                    setStep3Status={(status) => {setStep3Status(status)}}
                                    setCurrentStep={(stepNumber) =>{setCurrentStep(stepNumber)}}
                                    clickStepButton={(stepNumber) => {clickStepButton(stepNumber)}}
                                    step3Status={step3Status}
                                    currentStep={currentStep}

                                    updateSurveyList={(surveyListState) => {updateSurveyList(surveyListState)}}
                                />
                            </div>
                        }
                        {currentStep >= 3 &&
                            <div ref={step3SectionRef}>
                                <Step3
                                    areaReady={dataFromStep3.areaReady}
                                    disableAreaReady={dataFromStep3.disableAreaReady}

                                    setStep3Status={(status) => {setStep3Status(status)}}
                                    setStep4Status={(status) => {setStep4Status(status)}}
                                    setStep5Status={(status) => {setStep5Status(status)}}
                                    setCurrentStep={(stepNumber) =>{setCurrentStep(stepNumber)}}
                                    clickStepButton={(stepNumber) => {clickStepButton(stepNumber)}}
                                    step4Status={step4Status}
                                    step5Status={step5Status}
                                    currentStep={currentStep}

                                    updateAreaReady={(areaReady) => {updateAreaReady(areaReady)}}
                                    updateSetLanguage={(language) => {updateSetLanguage(language)}}
                                    updateInstallAddress={(installAddress) => {updateInstallAddress(installAddress)}}
                                />
                            </div>
                        }
                        {(currentStep >= 4) && (dataFromStep3.areaReady === true) &&
                            <div ref={step4SectionRef}>
                                <Step4
                                    dwZoneCode={(dataFromStep1.selectedNetWork?dataFromStep1.selectedNetWork.dwZoneCode:null)}

                                    setStep4Status={(status) => {setStep4Status(status)}}
                                    setStep5Status={(status) => {setStep5Status(status)}}
                                    setCurrentStep={(stepNumber) =>{setCurrentStep(stepNumber)}}
                                    step5Status={step5Status}
                                    currentStep={currentStep}

                                    updateAppointmentMoreDetail={(appointmentMoreDetail) => {updateAppointmentMoreDetail(appointmentMoreDetail)}}
                                />
                            </div>
                        }

                        <Row justify="center" style={{margin: '31px 0'}}>
                            <Col xs={24} sm={10} md={6} lg={5} xl={4} style={{margin:'5px 20px'}}>
                                {(dataFromStep3.areaReady === true || dataFromStep3.areaReady === null) && 
                                    <Button type="primary" block 
                                        onClick={() => clickSubmitCheckServiceArea()}
                                        disabled={step1Status !== 'success' || step2Status !== 'success' || step3Status !== 'success' || step4Status !== 'success'}
                                    >
                                        ลูกค้าตกลงซื้อ
                                    </Button>
                                }    
                                {dataFromStep3.areaReady === false &&
                                    <Button type="primary" block 
                                        onClick={() => clickCancelCheckServiceArea()}
                                        disabled={step1Status !== 'success' || step2Status !== 'success' || step3Status !== 'success'}
                                    >
                                        ดำเนินการต่อ
                                    </Button>
                                } 
                            </Col>
                            {dataFromStep3.areaReady !== false && 
                                <Col xs={24} sm={10} md={6} lg={5} xl={4} style={{margin:'5px 20px'}}>
                                    <Button danger block onClick={() => clickCancelCheckServiceArea()}>ยกเลิกการทำรายการ</Button>
                                </Col>
                            }
                        </Row>
                    </div>
                   
                </Col>
            </Row>
        </>
    )
}

export default CheckServiceAreaPage;
