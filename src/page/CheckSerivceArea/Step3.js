import React, { useEffect, useState, forwardRef }  from 'react';

/* Plugin */
import { Row, Col, Form, Input, AutoComplete } from 'antd';

/* Helper */
import { isNotError } from '../../helper/UtilityFunction';

/* Icon */
import { ReactComponent as AreaIcon }  from '../../icon/area.svg';
import { ReactComponent as ThIcon} from '../../icon/thailand-svgrepo-com.svg';
import { ReactComponent as EngIcon} from '../../icon/united-kingdom-svgrepo-com.svg';

import {
    CloseCircleFilled
} from '@ant-design/icons';

/* API */
import MercuryAPI from '../../api/MercuryAPI'

const mercuryAPI = new MercuryAPI();

function Step3(props){
    const [formStep3] = Form.useForm();
    const [areaReady, setAreaReady] = useState();
    const [disableAreaReady, setDisableAreaReady] = useState(false);
    const [language, setLanguage] = useState('T');
    const [optionsAcomp, setOptionsAcomp] = useState([]);
    const [valueAutoCompleteAcompStep3, setValueAutoCompleteAcompStep3] = useState('');
    const [formStep3Valid, setFormStep3Valid] = useState(false);
    
    const clickAreaButton = (data) => (event) => {
        setAreaReady(data);
        props.updateAreaReady(data);
    }

    const clickLanguageButton = (data) => (event) => {
        setLanguage(data);
        props.updateSetLanguage(data);
    }

    const onFinish = (values) => {
        console.log('Success:', values);
      };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);


    };

    const onFieldsChange = (values) =>{
        setFormStep3Valid(!formStep3.getFieldsError().some((field) => field.errors.length > 0) );
        props.updateInstallAddress(formStep3.getFieldsValue());
        //console.log('isFieldsTouched : ' ,formStep3.isFieldsTouched());
        // console.log('filter error : ',  formStep3.getFieldsError().filter(({ errors }) => errors.length).length)
        // console.log("formStep3.isFieldTouched('a') : ",formStep3.isFieldTouched('a'))
        // console.log("formStep3.getFieldError('a').length > 0 : ",formStep3.getFieldError('a').length > 0)
        
    }
    

    function hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    const setFormStep3 = () => {
        formStep3.setFieldsValue({
            contactTitelName: 'คุณ'
        });
        formStep3.validateFields();
        console.log("props.areaReady : ",props.areaReady);
        setAreaReady(props.areaReady);
        setDisableAreaReady(props.disableAreaReady)
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
        setValueAutoCompleteAcompStep3(data);
    };

    const onSelectAcomp = (val, option) => {
        console.log("onSelectAcomp => val : ",val);
        console.log("onSelectAcomp => option : ",option);

        formStep3.setFieldsValue({
            acompStep3: option.fullvalue,
            zipcode: option.fullvalue.zipcode
        });
        formStep3.validateFields();
    };

    const clickClearAcompSearch = () => (event) => {
        setValueAutoCompleteAcompStep3('');
        formStep3.setFieldsValue({
            acompStep3: null
        });
        formStep3.validateFields();
    };

    useEffect(() => {
        //สถานะพื้นที่ถูกเลือก + กรอกข้อมูลครบ 
        if(((areaReady === true) && formStep3Valid) || areaReady === false ){
            props.setStep3Status('success');
            console.log('st3 props.currentStep : ',props.currentStep)
            console.log('st3 1');
            if(areaReady === true){
                console.log('st3 2');
                if(props.step4Status === 'default'){
                    console.log('st3 3');
                    props.setStep4Status('doing');
                    //props.clickStepButton(4); 
                    if(props.currentStep === 2 || props.currentStep === 3 ){
                        console.log('st3 4');
                        props.setCurrentStep(4);
                    }    
                }
            }
            else{
                console.log('st3 5');
                if(props.step5Status === 'default'){
                    console.log('st3 6');
                    props.setStep5Status('doing');
                    //props.setCurrentStep(5);
                }
            }
            
        }
        else{
            props.setStep5Status('default');
            if(props.currentStep === 3){
                console.log('st3 7');
                props.setStep3Status('doing');
            }
            else{
                console.log('st3 8');
                props.setStep3Status('default');
            } 
        }
    },[areaReady,formStep3Valid])

    useEffect(setFormStep3,[])

    useEffect(() => {
        console.log("asdasdasdasdsa")
        setAreaReady(props.areaReady);
        setDisableAreaReady(props.disableAreaReady);
    },[props.areaReady,props.disableAreaReady])

    return(
        <>
            <div className="card-content bg-white">
                <div style={{padding:'0 12px'}}>
                    <div className="text-cuscany" style={{fontSize:'18px',marginBottom:'8px'}}>
                        <span style={{fontWeight:'bold'}}>STEP 3&nbsp;&nbsp;&nbsp;</span>เจ้าหน้าที่ระบุที่อยู่สถานที่ติดตั้ง
                    </div>

                    <div className="content-title" style={{marginBottom:'8px'}}>
                        สถานะพื้นที่พร้อมให้บริการอินเทอร์เน็ต
                    </div>
                    <Row style={{marginBottom:'16px'}}>
                        <div className={`button-icon ${(areaReady === true)?'selected':''} ${(disableAreaReady === true)?'disabled':''}`} onClick={clickAreaButton(true)} style={{marginRight:'16px'}}>
                            <div>อยู่ในพื้นที่</div>
                            <div>พร้อมให้บริการ</div>
                            <AreaIcon className="fill-green" width="50px" height="50px"></AreaIcon>
                        </div>
                        <div className={`button-icon ${(areaReady === false)?'selected':''} ${(disableAreaReady === true)?'disabled':''}`} onClick={clickAreaButton(false)}>
                            <div>ไม่อยู่ในพื้นที่</div>
                            <div>พร้อมให้บริการ</div>
                            <AreaIcon className="fill-red" width="50px" height="50px"></AreaIcon>
                        </div>
                    </Row>

                    <div className={`${(areaReady===undefined) || (areaReady===false) ?'hide':''}`}>
                        <div className="content-title" style={{marginBottom:'8px'}}>
                            ระบุ ภาษาที่ใช้ในการติดต่อ
                        </div>
                        <Row style={{marginBottom:'16px'}}>
                            <div 
                                className={`button-icon-row ${(language === 'T')?'selected-2':''}`} 
                                onClick={clickLanguageButton('T')}
                                style={{marginRight:'16px'}}
                            >
                                    <ThIcon width="24px" height="24px"></ThIcon>
                                    <span>ภาษาไทย</span>
                            </div>
                            <div 
                                className={`button-icon-row ${(language === 'E')?'selected-2':''}`} 
                                onClick={clickLanguageButton('E')} 
                                style={{marginRight:'16px'}}
                            >
                                <EngIcon width="24px" height="24px"></EngIcon>
                                <span>English</span>
                            </div>
                        </Row>
                        <div className="content-title" style={{marginBottom:'4px'}}>
                            กรอกข้อมูลสำหรับติดต่อ และสถานที่ติดตั้ง
                        </div>
                        <Form
                            form={formStep3}
                            // onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            onFieldsChange={onFieldsChange}
                        >
                            <Row>
                                <Col span={4}>
                                    <Form.Item
                                        label="คำนำหน้า"
                                        name="contactTitelName"
                                        labelCol={{ span: 24 }}
                                        rules={[{type: 'string', required: true, message: 'กรุณาระบุ คำนำหน้า', whitespace: true }]}
                                    >
                                        <Input maxLength="10"/>
                                    </Form.Item>
                                </Col>
                                <Col span={9} offset={1}>
                                    <Form.Item
                                        label="ชื่อ"
                                        name="contactFirstName"
                                        labelCol={{ span: 24 }}
                                        rules={[
                                            {type: 'string', required: true, message: 'กรุณาระบุ ชื่อ', whitespace: true },
                                            {
                                                pattern: new RegExp(/^[\w\sก-๛]+$/),
                                                message: "ห้ามมีอักขระพิเศษ"
                                            }
                                        ]}
                                    >
                                        <Input  maxLength="80"/>
                                    </Form.Item>
                                </Col>
                                <Col span={9} offset={1}>
                                    <Form.Item
                                        label="นามสกุล"
                                        name="contactLastName"
                                        labelCol={{ span: 24 }}
                                        rules={[
                                            {type: 'string', required: true, message: 'กรุณาระบุ นามสกุล', whitespace: true },
                                            {
                                                pattern: new RegExp(/^[\w\sก-๛]+$/),
                                                message: "ห้ามมีอักขระพิเศษ"
                                            }
                                        ]}
                                    >
                                        <Input  maxLength="80"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="เบอร์โทรศัพท์มือถือ (สำหรับติดต่องานติดตั้ง)"
                                        name="contactTel"
                                        labelCol={{ span: 24 }}
                                        rules={[
                                            {required: true, message: 'กรุณาระบุ เบอร์โทรศัพท์มือถือ'},
                                            {
                                                pattern: new RegExp(/^[0][689][0-9]{8,10}$/),
                                                message: "ตัวเลข 0-9 โดยขึ้นต้นด้วย 06, 08, 09 และมีจำนวนตัวเลข 10-12 หลัก"
                                            }
                                        ]}
                                    >
                                        <Input maxLength="12"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Form.Item
                                        label="บ้านเลขที่"
                                        name="homeNum"
                                        labelCol={{ span: 24 }}
                                        rules={[{type: 'string', required: true, message: 'กรุณาระบุ บ้านเลขที่', whitespace: true }]}
                                    >
                                        <Input maxLength="80"/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        label="หมู่ที่"
                                        name="moo"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Input maxLength="10"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Form.Item
                                        label="หมู่บ้าน หรืออาคาร"
                                        name="buildingName"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Input maxLength="100"/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        label="ห้อง"
                                        name="roomName"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Input maxLength="30"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Form.Item
                                        label="ซอย"
                                        name="soiName"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Input maxLength="100"/>
                                    </Form.Item>
                                </Col>
                                <Col span={6} offset={2}>
                                    <Form.Item
                                        label="ถนน"
                                        name="streetName"
                                        labelCol={{ span: 24 }}
                                        rules={[{type: 'string', required: true, message: 'กรุณาระบุ ถนน', whitespace: true }]}
                                    >
                                        <Input maxLength="100"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18}>
                                    <Form.Item
                                        label="ตำบล,อำเภอ,จังหวัด"
                                        name="acompStep3"
                                        labelCol={{ span: 24 }}
                                        rules={[{type: 'object', required: true, message: 'กรุณาระบุ ตำบล,อำเภอ,จังหวัด', whitespace: true }]}
                                    >
                                        <div className="input-allow-clear">
                                            <AutoComplete
                                                value={valueAutoCompleteAcompStep3}
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
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6}>
                                    <Form.Item
                                        label="รหัสไปรษณีย์"
                                        name="zipcode"
                                        labelCol={{ span: 24 }}
                                        rules={[
                                            {required: true, message: 'กรุณาระบุ รหัสไปรษณีย์'},
                                            {
                                                pattern: new RegExp(/^[0-9]{5}$/), 
                                                message: "รหัสไปรษณีย์ต้องเป็นตัวเลข 0-9 และมีจำนวน 5 หลัก"
                                            }
                                        ]}
                                    >
                                        <Input maxLength="5"/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div> 
                </div>
            </div>    
        </>
    )
}

export default Step3;