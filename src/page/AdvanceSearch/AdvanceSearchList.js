import React, { useContext,useState,useEffect }  from 'react';
import { Form, Input,Card, Col, Row, PageHeader,Button,Calendar,Modal,InputNumber,Radio,Divider ,DatePicker ,Select ,Tag ,Table  } from 'antd';

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
const { CheckableTag } = Tag;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;
const moment = require('moment');
const mercuryApi = new MercuryAPI();
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
      fontSize:14
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
    marginTop : '12px'
}

const bodyStyleModel={padding:0,margin:0,border:0}
const headStyleModer={color:'',fontSize:20,paddingLeft:'0px',margin:'0px',border:0}

function AdvanceSearchListPage(props) {
    const {
        selectedMenu , set_Orderdetail , dataAdvsList
    } = useContext(MercuryContext);
    const [dataAdvanceSearchList, setDataAdvanceSearch] = useState(
        {
            dtacRefId : "",
            orderId : "",
            dataSourceList : [
                {
                    refOrderID:'2021000000001',
                    tel:'0909851818',
                    name:'ทดสอบ ทดสอบ',
                    OrderId:'20211000633318',
                    DtacId:'123456789',
                    status:'Mapping',
                    statusName : 'Mapping',
                    dateCreate:"2021-05-08",
                    DurationName:'ช่วงบ่าย (13:00-17:00)',
                    address:'75/19 ต.บางเขน อ.เมือง จ.นนทบุรี 11000',
                    lang:'TH',
                    type : "xxxxx",
                    owner : "xxxxx",
                },
            ],
            selectedRowKeys : []
        }
    );

    const handelClickList = function(record){
        console.log('record',record)
        callGetDetail(record.mercuryOrderID)
      
    }
    // --------function Api-----------------------
    const callGetDetail = (mercuryOrderID) => {
        mercuryApi.orderdetails(mercuryOrderID).then(data => {
            console.log('searchUser',data)
            if(data.dtacRefID!==undefined){
                set_Orderdetail(data)  
                selectedMenu('AdvancedSearchCustomerData')
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
                    <Card headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                        <Row style={{marginBottom : '10px',padding:'6px 0 6px 0'}}>
                            <Col><span style={{fontWeight : 'bolder' , fontSize : '20px'}}>รายการที่ค้นหา</span></Col>
                        </Row>
                        <Row justify="end" style={{textAlign : 'right'}}>
                            <Col><span>รายการทั้งหมด {dataAdvsList.length} รายการ</span></Col>
                        </Row>
                        <Table 
                            dataSource={dataAdvsList} 
                            locale={{ emptyText: 'ไม่มีข้อมูลที่ค้นหา' }}
                            rowKey={record => record.mercuryOrderID}
                            onRow={(record) => ({
                                onClick: () => {
                                    handelClickList(record);
                                },
                            })}
                          
                        >
                            <Column title="ลำดับที่" dataIndex="mercuryOrderID" key="mercuryOrderID" render={(text, record ,inx) => (
                                    <div>
                                        <span>{inx+1} </span>
                                    </div>
                                )}
                            />
                            <Column title="วันที่ทำรายการ" dataIndex="createDate" key="mercuryOrderID" render={(text, record) => (
                                    <div>
                                        {/* <span>{record.dateCreate}</span> */}
                                        <span>{moment(record.createDate).format('DD/MM/YYYY  HH:mm')}</span>
                                    </div>
                                )}
                            />
                             <Column title="สถานะ" dataIndex="mercuryOrderStatusName" key="mercuryOrderID"  render={(text, record) => (
                                    <div>
                                        <span>{record.mercuryOrderStatusName} </span>
                                    </div>
                                )}
                            />
                            <Column title="Dtac ref ID" dataIndex="dtacRefID" key="mercuryOrderID" render={(text, record) => (
                                    <div>
                                        <span>{record.dtacRefID} </span>
                                    </div>
                                )}
                            />
                            <Column title="Order ref ID" dataIndex="mercuryOrderID" key="mercuryOrderID"  render={(text, record) => (
                                    <div>
                                        <span>{record.mercuryOrderID}</span>
                                    </div>
                                )}
                            />
                            <Column title="ประเภท" dataIndex="mercuryOrderTypeName" key="mercuryOrderID"  render={(text, record) => (
                                    <div>
                                        <span>{record.mercuryOrderTypeName} </span>
                                    </div>
                                )}
                            />
                            <Column title="Owner" dataIndex="createUserName" key="mercuryOrderID"  render={(text, record) => (
                                    <div>
                                        <span>{record.createUserName} </span>
                                    </div>
                                )}
                            />
                        </Table>
                        <Row style={styleRow}>
                            <Col xs={{ span: 12 , offset: 5}} lg={{ span: 10, offset: 7}}>
                                <Button block onClick={()=>{selectedMenu('AdvancedSearch')}}>กลับไปเมนูค้นหาขั้นสูง</Button>
                            </Col>
                        </Row>
                    </Card>                   
                </Col>            
            </Row>  
        </>
    )
}

export default AdvanceSearchListPage;

