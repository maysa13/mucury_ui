import React, { useEffect, useState, forwardRef, useImperativeHandle }  from 'react';

/* Plugin */
import { Row, Col, Checkbox, Input, Form } from 'antd';

/* Config */
import demoQuestionDataList1V2 from '../../config/questionInstallArea.js'

const Step2 = forwardRef((props,ref)=>{
    const [surveyListState, setSurveyListState] = useState();
    const [formStep2Valid, setFormStep2Valid] = useState();
    const [formStep2subQuestion] = Form.useForm();
    const [formStep2SubQuestionValid, setFormStep2SubQuestionValid] = useState(false);
    // const [checkBoxSkipStep2, setCheckBoxSkipStep2] = useState(true);

    const [readySurveyListState, setReadySurveyListState] = useState(false);

    const phoneNumberPattern = new RegExp(/^[0-9]{10,12}$/);

    const createSurveyListState = () => {
        console.log("demoQuestionDataList1V2[",props.surveyType,"] : ",demoQuestionDataList1V2[props.surveyType])
        setReadySurveyListState(false);
        let newSurveyListState = new Array(demoQuestionDataList1V2[props.surveyType].length);
        for(let i = 0 ; i < demoQuestionDataList1V2[props.surveyType].length ; i++){
            //ถ้ามีคำถามรองให้กรอกข้อมูล
            if(demoQuestionDataList1V2[props.surveyType][i].subQuestion){
                newSurveyListState[i] = {
                    question : demoQuestionDataList1V2[props.surveyType][i].question,
                    checkboxArray : new Array(demoQuestionDataList1V2[props.surveyType][i].anwser.length).fill(false),
                    subQuestion : new Array(demoQuestionDataList1V2[props.surveyType][i].subQuestion.length).fill(null).map(()=> ({label : "",value : ""}))
                };
            }
            //ไม่มีคำถามรอง
            else{
                newSurveyListState[i] = {
                    question : demoQuestionDataList1V2[props.surveyType][i].question,
                    checkboxArray : new Array(demoQuestionDataList1V2[props.surveyType][i].anwser.length).fill(false)
                };
            }
           
        }
        setSurveyListState(newSurveyListState)
        setReadySurveyListState(true);

        setFormStep2SubQuestionValid(true);

        //result Example new (25/03/2021)
        //newSurveyListState = [
        //     {
        //         question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีบ้านใกล้เคียงใช้บริการ 3BB หรือไม่',
        //         checkboxArray : [false,false,false,false],
        //         subQuestion :  [ 
        //                          {
        //                              label : "",
        //                              value : ""
        //                          },
        //                          {
        //                              label : "",
        //                              value : ""
        //                          }
        //                       ]
        //     },
        //     {
        //         question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีแนวเสาไฟฟ้าหรือไม่',
        //         checkboxArray : [false,false,false]
        //     },
        // ]
    }

    const onChangeBox = (indexQuestion, indexAnwser) => (event) => {
        //console.log("onChangeBox => event : ",event)

        console.log("onChangeBox => surveyListState[indexQuestion] : ",surveyListState[indexQuestion])

        //onFieldsChange();
        
        let currentSurveyListStateItem = surveyListState[indexQuestion];
    
        for(let i=0 ; i<currentSurveyListStateItem.checkboxArray.length ; i++)  {
            if(i===indexAnwser){
                currentSurveyListStateItem.checkboxArray[i]= !currentSurveyListStateItem.checkboxArray[i]
            
            }
            else{
                if(demoQuestionDataList1V2[props.surveyType][indexQuestion].moreThanOne === false){
                    currentSurveyListStateItem.checkboxArray[i] = false
                } 
            }
        }

        for(let j=0 ; j<currentSurveyListStateItem.subQuestion.length ; j++){
            if(demoQuestionDataList1V2[props.surveyType][indexQuestion].subQuestion[j].required === true){
                currentSurveyListStateItem.subQuestion[j].value = ''; 
                formStep2subQuestion.setFieldsValue({
                    ["question"+indexQuestion+"subquestion"+j] : ''
                });
                
            }
        }

        const newSurveyListState = [
            ...surveyListState.slice(0, indexQuestion),
            currentSurveyListStateItem,
            ...surveyListState.slice(indexQuestion + 1)
        ];

        setSurveyListState(newSurveyListState)

        setFormStep2SubQuestion()

    };

    const onChangeSubQuestion = (indexQuestion, indexSubQuestion) => (event) => {
        //console.log("onChangeSubQuestion => indexQuestion : ",indexQuestion," indexSubQuestion : ",indexSubQuestion," event.target.value : ",event.target.value);

        let currentSurveyListStateItem = surveyListState[indexQuestion];

        currentSurveyListStateItem.subQuestion[indexSubQuestion].label = demoQuestionDataList1V2[props.surveyType][indexQuestion].subQuestion[indexSubQuestion].label;
        currentSurveyListStateItem.subQuestion[indexSubQuestion].value = event.target.value;

        const newSurveyListState = [
            ...surveyListState.slice(0, indexQuestion),
            currentSurveyListStateItem,
            ...surveyListState.slice(indexQuestion + 1)
        ];

        setSurveyListState(newSurveyListState)
    }

    const onFieldsChange = (values) =>{
        //console.log("formStep2subQuestion.getFieldsError().some((field) => field.errors.length > 0) : ",formStep2subQuestion.getFieldsError().some((field) => field.errors.length > 0))
        setFormStep2SubQuestionValid(!formStep2subQuestion.getFieldsError().some((field) => field.errors.length > 0) );
    }

    // const onChangeCheckBoxSkipStep2 = () => (event) => {
    //     setCheckBoxSkipStep2(!event.target.value)
    // }

    const setFormStep2SubQuestion = () => {
        setTimeout(function(){
            formStep2subQuestion.validateFields();     
        }, 200);    
       
    }

    useImperativeHandle(ref, () => ({

        resetFormStep2subQuestion(){
            console.log("resetFormStep2 => ");
            formStep2subQuestion.resetFields();
        }
    
    }));

    //ตรวจสอบว่า check ตัวเลือกครบทุกหัวข้อหรือยัง
    useEffect(() => {
        console.log("surveyListState : ",surveyListState);
        
        props.updateSurveyList(surveyListState);

        //check FormStep2Valid
        if(surveyListState){
            for(let i =0;i < surveyListState.length;i++){
                const haveChecked = surveyListState[i].checkboxArray.find(element => element === true);
                if(!haveChecked){
                    console.log("ยังเหลือหัวข้อที่ยังไม่ได้เลือกคำตอบ")
                    setFormStep2Valid(false)
                    break;
                }
                else{
                    if(i === (surveyListState.length-1)){
                        setFormStep2Valid(true)
                    }
                }
            }
        }

        

    },[surveyListState]);

    //การจัดการสีของ icon ขั้นตอน
    useEffect(() => {
        //check ตัวเลือกครบทุกหัวข้อแล้ว

        console.log("formStep2SubQuestionValid : ",formStep2SubQuestionValid)
        if(formStep2SubQuestionValid){
            console.log("aaaaa");
            props.setStep2Status('success');
            if(props.step3Status === 'default'){
                props.setStep3Status('doing');
                //props.clickStepButton(3);
                if(props.currentStep === 2){
                    props.setCurrentStep(3);
                }
            }
        }
        else{
            if(props.currentStep === 2){
                console.log("bbbb");
                props.setStep2Status('doing');
            }
            else{  
                if(formStep2SubQuestionValid !== true && props.haveSomeData === false){
                    console.log("dddd");
                    props.setStep2Status('default');
                    props.setStep3Status('default');
                    props.setCurrentStep(2);
                }    
                else{
                    console.log("eeee");
                    props.setStep2Status('default');
                }
            } 
        }
    },[formStep2Valid,formStep2SubQuestionValid])

    useEffect(createSurveyListState,[props.surveyType]);

    useEffect(setFormStep2SubQuestion,[]);

    return(
        <>
            <div className="card-content bg-white">
                <div style={{padding:'0 12px'}}>
                    <div className="text-cuscany" style={{fontSize:'18px',marginBottom:'8px'}}>
                        <span style={{fontWeight:'bold'}}>STEP 2&nbsp;&nbsp;&nbsp;</span>สอบถามบริเวณรอบพื้นที่ติดตั้ง
                    </div>

                    {/* สอบถามบริเวณรอบพื้นที่ติดตั้ง */}

                    {/* <Checkbox
                        checked={(checkBoxSkipStep2?true:false)}
                        onChange={onChangeCheckBoxSkipStep2()}
                        value={checkBoxSkipStep2}
                        style={{marginBottom:'4px'}}
                    >
                        ข้ามขั้นตอนทำแบบสอบถาม
                    </Checkbox> */}


                    {readySurveyListState &&
                        <div>
                            {surveyListState && demoQuestionDataList1V2[props.surveyType].map((itemQuestion, indexQuestion) => {
                        return (
                            <div key={indexQuestion} style={{marginBottom: '8px'}}>
                                <Form
                                    form={formStep2subQuestion}
                                    onFieldsChange={onFieldsChange}
                                >
                                    <div className="content-title" style={{marginBottom:'4px'}}>
                                        {itemQuestion.question}<span className={`text-hotcinnamon ${itemQuestion.moreThanOne?'show':'hide'}`}>&nbsp;(เลือกได้มากกว่า 1)</span>
                                    </div>
                                    {itemQuestion.anwser.map((itemAnwser, indexAnwser) => {
                                        return (
                                            <div key={indexAnwser} style={{marginLeft:'24px'}}>
                                                {surveyListState[indexQuestion] &&
                                                    <Checkbox
                                                        checked={(surveyListState[indexQuestion].checkboxArray[indexAnwser]?true:false)}
                                                        onChange={onChangeBox( indexQuestion, indexAnwser)}
                                                        value={itemAnwser.value}
                                                        style={{marginBottom:'4px'}}
                                                    >
                                                        {itemAnwser.label}
                                                    </Checkbox>
                                                }
                                        
                                            </div>


                                        )
                                    })}    

                                    { itemQuestion.subQuestion && itemQuestion.subQuestion.map((itemSubQuestion, indexSubQuestion) => {
                                        return (
                                            <div key={indexSubQuestion}>
                                                {
                                                    (itemSubQuestion.required === true && 
                                                    surveyListState[indexQuestion] && 
                                                    surveyListState[indexQuestion].checkboxArray[itemSubQuestion.indexAnwserForShow] === true)  &&
                                                    <Row 
                                                        key={indexSubQuestion}
                                                        style={{marginLeft:'24px', marginBottom:'4px'}}
                                                    >
                                                        <Col span={18}>
                                                            <Form.Item
                                                                label={itemSubQuestion.label}
                                                                name={`question${indexQuestion}subquestion${indexSubQuestion}`}
                                                                labelCol={{ span: 24 }}
                                                                // {required : surveyListState[indexQuestion].checkboxArray[1] === true,  message: 'กรุณาระบุ '+itemSubQuestion.label}
                                                                // {required: itemSubQuestion.required,  message: 'กรุณาระบุ '+itemSubQuestion.label },
                                                                rules={[
                                                                    {required : itemSubQuestion.required,  message: 'กรุณาระบุ '+itemSubQuestion.label },
                                                                    {
                                                                        pattern: (itemSubQuestion.type==='PhoneNumber'?phoneNumberPattern:''),
                                                                        message: (itemSubQuestion.type==='PhoneNumber'?'ต้องเป็นตัวเลข 0-9 และมี 10-12 หลัก':'')
                                                                    }
                                                                ]}
                                                            >
                                                                <Input onChange={onChangeSubQuestion(indexQuestion,indexSubQuestion)}/>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                }

                                                {itemSubQuestion.required === false &&
                                                    <Row 
                                                        key={indexSubQuestion}
                                                        style={{marginLeft:'24px', marginBottom:'4px'}}
                                                    >
                                                        <Col span={18}>
                                                            <Form.Item
                                                                label={itemSubQuestion.label}
                                                                name={`question${indexQuestion}subquestion${indexSubQuestion}`}
                                                                labelCol={{ span: 24 }}
                                                                // {required : surveyListState[indexQuestion].checkboxArray[1] === true,  message: 'กรุณาระบุ '+itemSubQuestion.label}
                                                                // {required: itemSubQuestion.required,  message: 'กรุณาระบุ '+itemSubQuestion.label },
                                                                rules={[
                                                                    {required : itemSubQuestion.required,  message: 'กรุณาระบุ '+itemSubQuestion.label },
                                                                    {
                                                                        pattern: (itemSubQuestion.type==='PhoneNumber'?phoneNumberPattern:''),
                                                                        message: (itemSubQuestion.type==='PhoneNumber'?'ต้องเป็นตัวเลข 0-9 และมี 10-12 หลัก':'')
                                                                    }
                                                                ]}
                                                            >
                                                                <Input onChange={onChangeSubQuestion(indexQuestion,indexSubQuestion)}/>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                }
                                    
                                            </div>
                                           
                                        )
                                    })}
                                </Form>
                            </div>
                        )
                    })}
                        </div>
                    }
                    
                </div>
            </div>    
        </>
    )
})

export default Step2;