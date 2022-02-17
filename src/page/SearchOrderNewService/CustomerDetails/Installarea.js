import React, { useContext, useState, useEffect }  from 'react';

import { Row, Col, Checkbox, Input, Form, Card, Text,Button} from 'antd';

import {
    MercuryContext
} from '../../../store/MercuryContext'
// import { info } from 'node-sass';
/* Config */
import demoQuestionDataList1V2 from '../../../config/questionInstallArea.js'

const Card_headStyle ={
    color:'#E34625',
    fontSize:20
  }
  const Card_BodyStyle ={
      paddingTop:0,
      paddingBottom:3
   }
  
  const TitleStyle ={
        color:'black',
        fontSize:14,
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


const Installarea = (props) => {
    const [SurveyListStat, setSurveyListState] = useState();
    const [readySurveyListState, setReadySurveyListState] = useState(false);
    const {
        orderdetail, 
    } = useContext(MercuryContext);

    let insInfo = orderdetail.insInfo
    const typeAddress=orderdetail.insAddr.mercuryAddrAreaTypeID
    // console.log('insInfo = ',insInfo,)
    // console.log('insInfo = ',typeAddress)

   

    //จำนวนข้อ
    const Num_Question = [...new Set(insInfo.map(q => q.Q))];
    // console.log(Num_Question);

    let arr=[]
    let result    
    const Question = [...new Set(insInfo.map(v=>{       
        result=insInfo.filter(insInfo =>  v.Q===insInfo.Q) 
        arr.push(result)
        // console.log('Question = ',result)
    }
        
    ))]
    // console.log('Question = ',arr)

    // console.log('insInfo',insInfo)

    
    //ตัวอย่างคำถาม
    const demoQuestionDataList1V2s = [
        //บ้านพักอาศัย 0
        [
            {
                question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีบ้านใกล้เคียงใช้บริการ 3BB หรือไม่',
                anwser : [
                    { label: 'มี 3BB ให้บริการ', value: '1' },
                    { label: 'ไม่มี 3BB ให้บริการ', value: '2' },
                    { label: 'ไม่ไม่แน่ใจ, เบอร์โทรตรวจสอบ XXXX 3BB', value: '3' }
                ],
                subQuestion : [],
                moreThanOne : false
            },
            {
                question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีแนวเสาไฟฟ้าหรือไม่',
                anwser : [
                    { label: 'มีแนวเสาไฟฟ้า', value: '1' },
                    { label: 'ไม่มีแนวเสาไฟฟ้า', value: '2' },
                    { label: 'เดินสายไฟฟ้าใต้ดิน', value: '3' }
                ],
                subQuestion : [],
                moreThanOne : false
            },    
            {
                question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
                anwser : [
                    { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับสถานที่ติดตั้ง', value: '1' },
                    { label: 'เสาไฟฟ้าอยู่ฝั่งตรงข้ามกับสถานที่ติดตั้ง', value: '2' }
                ],
                subQuestion : [],
                moreThanOne : false
            },
            {
                question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
                anwser : [
                    { label: 'แม่น้ำ (จะไม่สามารถเดินสายข้ามตรงๆได้ ต้องข้ามตามแนว)', value: '1' },
                    { label: 'ถนนตั้งแต่ 4 เลนขึั้นไป', value: '2' },
                    { label: 'กำแพง', value: '3' },
                    { label: 'ต้นไม้ใหญ่', value: '4' },
                    { label: 'ทางตัน', value: '5' },
                    { label: 'พื้นที่ส่วนบุคคล', value: '6' }
                ],
                subQuestion : [],
                moreThanOne : true
            }
    
        ],
        //โครงการหมู่บ้าน 1
        [
            {
                question : 'หมู่บ้าน หรือโครงการจัดสรร พื้นที่ใช้บริการ 3BB หรือไม่',
                anwser : [
                    { label: 'มี 3BB ให้บริการ', value: '1' },
                    { label: 'ไม่มี 3BB ให้บริการ', value: '2' },
                    { label: 'ไม่ไม่แน่ใจ, เบอร์โทรตรวจสอบ XXXX 3BB ', value: '3' }
                ],
                moreThanOne : false,
                subQuestion : [
                    {label : 'ชื่อโครงการ (ถ้ามี)',required : false}
                ]
            },
            {
                question : 'หมู่บ้าน หรือโครงการจัดสรรจะต้องขออนุญาตินิติบุคคลหรือไม่',
                anwser : [
                    { label: 'ไม่ต้องขออนุญาตินิติบุคคล หรือกรรมการดูแล', value: '1' },
                    { label: 'ขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '2' }
                ],
                moreThanOne : false,
                subQuestion : [
                    {label : 'ชื่อผู้ติดต่อประสานงาน', required : true, type:'String'}, 
                    {label : 'เบอร์โทรติดต่อประสานงาน', required : true, type:'PhoneNumber'}
                ]
            },
            {
                question : 'หมู่บ้าน หรือโครงการจัดสรร มีแนวเสาไฟฟ้าหรือไม่',
                anwser : [
                    { label: 'มีแนวเสาไฟฟ้า', value: '1' },
                    { label: 'ไม่มีแนวเสาไฟฟ้า', value: '2' },
                    { label: 'เดินสายไฟฟ้าใต้ดิน', value: '3' }
                ],
                moreThanOne : false,
                subQuestion : []
            },
            {
                question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
                anwser : [
                    { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับสถานที่ติดตั้ง', value: '1' },
                    { label: 'เสาไฟฟ้าอยู่ฝั่งตรงกันข้ามกับสถานที่ติดตั้ง', value: '2' }
                ],
                moreThanOne : false,
                subQuestion : []
            },
            {
                question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
                anwser : [
                    { label: 'แม่น้ำ (จะไม่สามารถเดินสายข้ามตรงๆได้ ต้องข้ามตามแนว)', value: '1' },
                    { label: 'ถนนตั้งแต่ 4 เลนขึั้นไป', value: '2' },
                    { label: 'กำแพง', value: '3' },
                    { label: 'ต้นไม้ใหญ่', value: '4' },
                    { label: 'ทางตัน', value: '5' },
                    { label: 'พื้นที่ส่วนบุคคล', value: '6' },
                ],
                moreThanOne : true,
                subQuestion : []
            }
        ],
        //คอนโดมิเนียม 2
        [
            {
                question : 'คอนโดมิเนียม/อพาร์ทเม้นท์ พื้นที่ใช้บริการ 3BB หรือไม่',
                anwser : [
                    { label: 'มี 3BB ให้บริการ', value: '81' },
                    { label: 'ไม่มี 3BB ให้บริการ', value: '82' },
                    { label: 'ไม่ไม่แน่ใจ, เบอร์โทรตรวจสอบ XXXX 3BB ', value: '83' }
                ],
                moreThanOne : false,
                subQuestion : [
                    {label : 'ชื่อโครงการ (ถ้ามี)', required : false}
                ]
            },
            {
                question : 'คอนโดมิเนียม/อพาร์ทเม้นท์ จะต้องขออนุญาตนิติบุคคลหรือไม่',
                anwser : [
                    { label: 'ไม่ต้องขออนุญาตินิติบุคคล หรือกรรมการดูแล', value: '91' },
                    { label: 'ขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '92' }
                ],
                moreThanOne : false,
                subQuestion : [
                    {label : 'ชื่อผู้ติดต่อประสานงาน', required : true, type:'String'}, 
                    {label : 'เบอร์โทรติดต่อประสานงาน', required : true, type:'PhoneNumber'}
                ]
            }
        ],
        //อาคารสำนักงาน
        [
            {
                question : 'อาคารพาณิชย์/สำนักงาน พื้นที่ใช้บริการ 3BB หรือไม่',
                anwser : [
                    { label: 'มี 3BB ให้บริการ', value: '1' },
                    { label: 'ไม่มี 3BB ให้บริการ', value: '2' },
                    { label: 'ไม่ไม่แน่ใจ, เบอร์โทรตรวจสอบ XXXX 3BB ', value: '3' }
                ],
                moreThanOne : false,
                subQuestion : [
                    {label : 'ชื่อโครงการ (ถ้ามี)', required : false}
                ]
            },
            {
                question : 'อาคารพาณิชย์/สำนักงาน จะต้องขออนุญาตนิติบุคคลหรือไม่',
                anwser : [
                    { label: 'ไม่ต้องขออนุญาตินิติบุคคล หรือกรรมการดูแล', value: '1' },
                    { label: 'ขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '2' }
                ],
                moreThanOne : false,
                subQuestion : [
                    {label : 'ชื่อผู้ติดต่อประสานงาน', required : true, type:'String'}, 
                    {label : 'เบอร์โทรติดต่อประสานงาน', required : true, type:'PhoneNumber'}
                ]
            },
            {
                question : 'อาคารพาณิชย์/สำนักงาน มีแนวเสาไฟฟ้าหรือไม่',
                anwser : [
                    { label: 'มีแนวเสาไฟฟ้า', value: '1' },
                    { label: 'ไม่มีแนวเสาไฟฟ้า', value: '2' },
                    { label: 'เดินสายไฟฟ้าใต้ดิน', value: '3' }
                ],
                moreThanOne : false,
                subQuestion : []
            },
            {
                question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
                anwser : [
                    { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับสถานที่ติดตั้ง', value: '1' },
                    { label: 'เสาไฟฟ้าอยู่ฝั่งตรงกันข้ามกับสถานที่ติดตั้ง', value: '2' }
                ],
                moreThanOne : false,
                subQuestion : []
            },
            {
                question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
                anwser : [
                    { label: 'แม่น้ำ (จะไม่สามารถเดินสายข้ามตรงๆได้ ต้องข้ามตามแนว)', value: '1' },
                    { label: 'ถนนตั้งแต่ 4 เลนขึั้นไป', value: '2' },
                    { label: 'กำแพง', value: '3' },
                    { label: 'ต้นไม้ใหญ่', value: '4' },
                    { label: 'ทางตัน', value: '5' },
                    { label: 'พื้นที่ส่วนบุคคล', value: '6' },
                ],
                moreThanOne : true,
                subQuestion : []
            }
        ]

    ]   
    const QuestionDataList = demoQuestionDataList1V2[typeAddress-1]

    const createSurveyListState = () => {
        setReadySurveyListState(false);
        //insInfo // คำตอบจาก api
        // console.log("demoQuestionDataList1V2[",typeAddress,"] : ",demoQuestionDataList1V2[typeAddress])

        let newSurveyListState = new Array(demoQuestionDataList1V2[typeAddress-1].length);
        // console.log('newSurveyListState',newSurveyListState)
        // console.log('demoQuestionDataList1V2',demoQuestionDataList1V2[typeAddress-1])
        // console.log('insInfo',insInfo)
        
        for(let i = 0 ; i < demoQuestionDataList1V2[typeAddress-1].length ; i++){
            //ถ้ามีคำถามรองให้กรอกข้อมูล
            // console.log("iii : ", i)
            // console.log("demoQuestionDataList1V2["+(typeAddress-1)+"]["+i+"] : ", demoQuestionDataList1V2[typeAddress-1][i])

            if(demoQuestionDataList1V2[typeAddress-1][i].subQuestion){
                newSurveyListState[i] = {
                    questionCode : demoQuestionDataList1V2[typeAddress-1][i].questionCode,
                    question : demoQuestionDataList1V2[typeAddress-1][i].question,
                    checkboxArray : new Array(demoQuestionDataList1V2[typeAddress-1][i].anwser.length).fill(false),
                    subQuestion : new Array(demoQuestionDataList1V2[typeAddress-1][i].subQuestion.length).fill(null).map(()=> ({label : "",value : ""}))
                };
            }
            //ไม่มีคำถามรอง
            else{
                newSurveyListState[i] = {
                    question : demoQuestionDataList1V2[typeAddress-1][i].question,
                    checkboxArray : new Array(demoQuestionDataList1V2[typeAddress-1][i].anwser.length).fill(false)
                };
            }
           
        }

        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        // console.log('newSurveyListState => ',newSurveyListState)
        // console.log("insInfo : ", insInfo)
        // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
        // console.log('newSurveyListState[8])=>',newSurveyListState[8])
        
        // for(let j = 0; j < newSurveyListState.length;j++){
        //     console.log("insInfo : ", insInfo[j])
        //     console.log("newSurveyListState[j] : ", newSurveyListState[insInfo[j].Q])
        //     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        // }
        newSurveyListState.map((newsurveyliststate,j)=>{  
            let A=0          
            insInfo.map((insinfo,inx)=>{
                
                
                if(insinfo.Q===Number(newsurveyliststate.questionCode)){ 
                    
                    // console.log('==>',insinfo)
                    // console.log((insinfo.A),'==',((insinfo.Q)*10))
                    // console.log('AAAA',newsurveyliststate.checkboxArray.length)
                    if((insinfo.A)-((insinfo.Q)*10)<=newsurveyliststate.checkboxArray.length){
                        // A=0
                        // console.log('Info Q ==>',insinfo.Q)
                        // console.log('(insinfo.A)-((insinfo.Q)*10) ==>',(insinfo.A)-((insinfo.Q)*10))
                        // console.log('Info ==>',insinfo)
                        // console.log(insinfo.Q,'Info ==>',insinfo,'>>>',(insinfo.A)-((insinfo.Q)*10))
                        // console.log(newsurveyliststate.checkboxArray[(insinfo.A)-((insinfo.Q)*10)-1])
                        // console.log(newSurveyListState[j].checkboxArray[(insinfo.A)-((insinfo.Q)*10)-1])
                        // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
                        newSurveyListState[j].checkboxArray[(insinfo.A)-((insinfo.Q)*10)-1] = true
                    }else{
                        A=A+1
                        // console.log('Info J==>',insinfo.text1)
                        // console.log('Info Q ==>',insinfo.Q)
                        // console.log('Info A ==>',insinfo.A)
                        // console.log((insinfo.A)-((insinfo.Q)*10))
                        // console.log('Info A ==>',insinfo.AName)
                        // console.log('Info A ==>',insinfo.text1)
                        // console.log(A,'newsurveyliststate.subQuestion => ',newsurveyliststate.subQuestion)
                        
                        // console.log('subQuestion => ',newsurveyliststate.subQuestion)
                        // newSurveyListState[j].subQuestion.label=insinfo.AName
                        // console.log('length',newSurveyListState[j].subQuestion.length)
                        // for(let count=0 ;count<newSurveyListState[j].subQuestion.length;count++){
                            // console.log('->',insinfo.text1)
                        //     console.log('->',newSurveyListState[j].question)
                        //     console.log('count',newSurveyListState[j].subQuestion[count])
                            newSurveyListState[j].subQuestion[A-1].label=insinfo.AName
                            newSurveyListState[j].subQuestion[A-1].value=insinfo.text1

                        // }

                        // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",newSurveyListState[j].subQuestion)
                        // newSurveyListState[j].subQuestion.map((subQuestion,index)=>{
                        //     console.log(index,'Info ==>',insinfo.AName)
                        //     console.log('Info ==>',insinfo.text1)
                        //     console.log('subQuestion J==>',subQuestion)
                            // newSurveyListState[j].subQuestion[index].label=insinfo.AName
                            // newSurveyListState[j].subQuestion[index].value=insinfo.text1
                        // })
                    
                        
                        
                    }
                    // else{
                    //     [innewSurveyListStatesInfo[j].Q-1].subQuestion[(insInfo[j].A-1)-(newSurveyListState[insInfo[j].Q-1].checkboxArray.length)].label = insInfo[j].AName;
                    //     newSurveyListState[insInfo[j].Q-1].subQuestion[(insInfo[j].A-1)-(newSurveyListState[insInfo[j].Q-1].checkboxArray.length)].value = insInfo[j].text1;
                    // }
                }
            })
            
        })
        
        // //นำค่า insInfo จาก API มาตั่งค่าใส่ newSurveyListState
        // for(let j = 0; j < insInfo.length;j++){
        //     console.log("insInfo : ", insInfo[j])
        //     console.log("insInfo["+j+"].Q : ", insInfo[j].Q)
        //     console.log("insInfo["+j+"].A : ", insInfo[j].A)
        //     console.log("newSurveyListState["+insInfo[j].Q+"] : ",newSurveyListState[j] )
        //     // console.log("newSurveyListState["+insInfo[j].Q+"] : ",newSurveyListState[j] )
        //     // console.log("newSurveyListState["+insInfo[j].Q+"] : ",newSurveyListState[j] )
        //     console.log(" ")
        //     console.log("-----------------------------------------------------")
        //     // console.log((insInfo[j].A)-((insInfo[j].Q)*10))

        //     // if((insInfo[j].A)-((insInfo[j].Q)*10) <= newSurveyListState[j].checkboxArray.length){
        //     //     console.log('In if =>>',newSurveyListState[j].checkboxArray[(insInfo[j].A)-((insInfo[j].Q)*10)-1]=true)
        //         // newSurveyListState[j].checkboxArrayinsInfo[j] = true;
        //     // }
        //     // else{
        //         // console.log('False')
        //     //     newSurveyListState[insInfo[j].Q-1].subQuestion[(insInfo[j].A-1)-(newSurveyListState[insInfo[j].Q-1].checkboxArray.length)].label = insInfo[j].AName;
        //     //     newSurveyListState[insInfo[j].Q-1].subQuestion[(insInfo[j].A-1)-(newSurveyListState[insInfo[j].Q-1].checkboxArray.length)].value = insInfo[j].text1;
        //     // }    
            
        //     ///////////////////////////////////////////////////////////////////////////////////////
        //     // if(insInfo[j].A <= newSurveyListState[insInfo[j].Q].checkboxArray.length){            
        //     //     newSurveyListState[insInfo[j].Q].checkboxArray[insInfo[j].A] = true;
        //     // }
        //     // else{
        //     //     newSurveyListState[insInfo[j].Q-1].subQuestion[(insInfo[j].A-1)-(newSurveyListState[insInfo[j].Q-1].checkboxArray.length)].label = insInfo[j].AName;
        //     //     newSurveyListState[insInfo[j].Q-1].subQuestion[(insInfo[j].A-1)-(newSurveyListState[insInfo[j].Q-1].checkboxArray.length)].value = insInfo[j].text1;
        //     // }    
        // }
        // console.log("-----------------------------------------------------")
        // console.log("EndFunction => newSurveyListState : ",newSurveyListState)
        setSurveyListState(newSurveyListState)
        setReadySurveyListState(true);
    }


    useEffect(createSurveyListState,[typeAddress]);
    
  return (   
        <Row justify="center">                                 
            {/*       */}
            <Col span={24}>
                
                <Card title="STEP 2 ข้อมูลบริเวณรอบพื้นที่ติดตั้ง"  headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                {/* <Button onClick={()=>createSurveyListState()}>refesh</Button> */}
                {!(insInfo.length > 0) &&
                    <div style={{marginTop:'6px',marginBottom:'10px'}}>เจ้าหน้าที่เลือกไม่ทำแบบสอบถามบริเวณพื้นที่ติดตั้ง</div> 
                }
                {insInfo.length > 0 && readySurveyListState &&<div>
                    {demoQuestionDataList1V2[typeAddress-1].map((itemQuestion, indexQuestion) => {
                        let statusshow=SurveyListStat[indexQuestion].checkboxArray.includes(true)
                        // console.log('',SurveyListStat[indexQuestion].question)
                        // console.log('',SurveyListStat[indexQuestion].checkboxArray.includes(true))                        
                       
                        return (
                            statusshow&&<div key={indexQuestion} style={{marginBottom: '10px'}}>
                                
                                <div className="content-title" style={{marginBottom:'10px'}}>
                                {itemQuestion.question}<span className={`text-hotcinnamon ${itemQuestion.moreThanOne?'show':'hide'}`}>&nbsp;(เลือกได้มากกว่า 1)</span>
                                </div>
                                {itemQuestion.anwser.map((itemAnwser, indexAnwser) => {

                                    return (
                                        <div key={indexAnwser} style={{marginLeft:'24px'}}>
                                            
                                            {SurveyListStat[indexQuestion] &&
                                                <Checkbox
                                                    checked={(SurveyListStat[indexQuestion].checkboxArray[indexAnwser]?true:false)}                                                    
                                                    value={itemAnwser.value}
                                                    style={{marginBottom:'8px'}}
                                                >
                                                    {itemAnwser.label}
                                                </Checkbox>
                                            }
                                            
                                        </div>


                                    )
                                })}    

                                {itemQuestion.subQuestion && itemQuestion.subQuestion.map((itemSubQuestion, indexSubQuestion) => {
                                    // console.log(SurveyListStat[indexQuestion].subQuestion[indexSubQuestion].value)
                                    return (
                                        <Row 
                                            key={indexSubQuestion}
                                            style={{marginLeft:'24px', marginBottom:'4px'}}
                                        >
                                            {SurveyListStat[indexQuestion].subQuestion[indexSubQuestion].value!==''&&<Col span={18}>
                                                <Form.Item
                                                    label={itemSubQuestion.label}
                                                    name={`question${indexQuestion}subquestion${indexSubQuestion}`}
                                                    labelCol={{ span: 24 }}
                                                    
                                                >
                                                    <Input disabled defaultValue={SurveyListStat[indexQuestion].subQuestion[indexSubQuestion].value}/>
                                                </Form.Item>
                                            </Col>}
                                        </Row>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div> }
                </Card>
            </Col>        
        </Row>  
   
  );
};

export default Installarea;

{/* {insInfo.filter((ans)=>{
                        return console.log(ans.Q===1)
                    })
                    } */}