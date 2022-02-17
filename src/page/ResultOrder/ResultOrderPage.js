import React, { useContext,useState,useEffect }  from 'react';
import { Form, Input,Card, Col, Row, Space,Button,DatePicker ,Select ,Table } from 'antd';
import Swal, { swal } from 'sweetalert2/dist/sweetalert2.js'
import 'antd/dist/antd.css';
import 'sweetalert2/src/sweetalert2.scss'
import AppBreadcrumb from '../../component/AppBreadcrumb';
import MercuryAPI from '../../api/MercuryAPI'

/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';
const { Option } = Select;
const { Column } = Table;
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
const mercuryApi = new MercuryAPI();
function  ResultOrderPage(props) {
    const {
        selectedMenu , setDataAdvsList
    } = useContext(MercuryContext);
    
    const [dataTableTest , setdataSourceTest] = useState([]);
    
    const [statustranfer , setStatusTranfer] = useState(9);
    const [dataAdvanceSearch, setDataAdvanceSearch] = useState(
        {
            dataStatust : [
                {
                    status : 9,
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
    // Date
    const dateFormat = 'DD/MM/YYYY';
    const [dateStart , setDateStart] = useState();
    const [dateEnd , setDateEnd] = useState();
    const [checkDate , setCheckDate] = useState();

    
    useEffect(() => {
        console.log(dataTableTest.lenght)
    },[])
    

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
        console.log(dateEnd)
    }

    const onClickSearch = function(){
        console.log(checkDate)
        console.log(dateEnd)
        let status=dataAdvanceSearch.dataStatust.filter(valee=>{return valee.status===statustranfer})
        console.log(status)
        
        const dataSourceTest=[
            {
                DtacID:'-',
                OrderID:'210000919',
                statusOrder:'New',
                date:'15/09/2564 08:21:11',
                status:'Fail',
            },
            {
                DtacID:'10000214',
                OrderID:'210000801',
                statusOrder:'Mapping',
                date:'14/09/2564 08:21:11',
                status:'Success',
            },
            {
                DtacID:'10000215',
                OrderID:'210000856',
                statusOrder:'Mapping',
                date:'14/09/2564 08:21:11',
                status:'Success',
            }
        ]
        if(checkDate!==undefined&&dateEnd!==undefined){
            setdataSourceTest(dataSourceTest)
        }else{
            Swal.fire({
                html:
                '<b style="font-size: 18px;color:#8e0000; font-weight: bold">ไม่สามารถดำเนินการค้นหาได้<b/><br/>'+
                '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">เนื่องจากยังไม่ได้มีการระบุช่วงเวลาที่ต้องการค้นหา</text>',
                // '<text style="font-size: 18px;color:#2B2B2B; font-weight: normal">กรุณาระบุข้อมูลการค้นหาใหม่อีกครั้งค่ะ</text>',      
                icon: 'warning',
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

    return(
        <> <Row style={{paddingTop:0, paddingBottom:7}}>
        <AppBreadcrumb />              
    </Row>
    <Row justify="center"> 
            <Col span={24}>
                <Card bordered headStyle={Card_headStyle} bodyStyle={Card_BodyStyle} bordered={false}>
                    <Row style={{marginBottom : '10px',padding:'6px 0 6px 0'}}>
                        <Col><span style={{fontWeight : 'bolder' , fontSize : '22px'}}>กรอกข้อมูลค้นหารายการ</span></Col>
                    </Row>
                    <Row>
                        <Col  xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 0}} style={{marginBottom : '8px'}}>
                            <span style={TitleStyle}>วันที่เริ่มค้นหา</span><br></br>
                            <DatePicker  
                                style={{ width: '100%' }} 
                                format={dateFormat}  
                                onChange={onClickDateStart}
                            > 
                            </DatePicker>
                            <br/>
                            <span style={{color : 'red',fontSize:'9px'}}>*** ช่วงวันที่ค้นหาจะต้องไม่เกิน 7 วัน</span>
                        </Col>
                        <Col  xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }}>
                            <span style={TitleStyle}>วันที่สิ้นสุดค้นหา</span><br></br>
                            <DatePicker  
                                style={{ width: '100%' }} 
                                format={dateFormat} 
                                onChange={onClickDateEnd} 
                                disabledDate={d => !d || d.isAfter(checkDate,'day') || d.isBefore(dateStart,'day')}
                            >
                            </DatePicker>
                        </Col>

                        <Col  xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }}>
                            <span style={TitleStyle}>Status Tranfer </span><br/>
                            <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="ALL"
                                    onChange={(value,event)=>{console.log('value',value);setStatusTranfer(value)}}
                                    defaultValue={9}                                   
                                >
                                    {dataAdvanceSearch.dataStatust.map((item , inx) => (
                                        <Option key={inx} defaultValue={9} value={item.status} item={item} >
                                            {item.statusName}
                                        </Option>
                                    ))}
                                </Select>
                        </Col>

                        <Col  xs={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 1 }}>
                            <br/><Button onClick={onClickSearch} type="primary">ค้นหา</Button>                            
                        </Col> 
                    </Row>
                    <Row>
                        <Col><span style={{fontWeight : 'bolder' , fontSize : '22px'}}>รายการส่งข้อมูลดีเทค</span></Col>
                    </Row>
                    {dataTableTest.lenght!==0&&<Table    
                            size={'small'}
                            style={{paddingTop:14,paddingBottom:0,fontSize:'12px'}}      
                            locale={{ emptyText: 'ไม่มีข้อมูล' }}  
                            dataSource={dataTableTest} 
                            rowKey={(record,i) => i}
                        >                            
                            <Column title="Dtac ref ID"  render={(text, record,inx) => (
                                    <div key={inx}>
                                        {record.DtacID}
                                    </div>
                                )}
                            />
                             <Column title="Order ref ID"   render={(text, record,inx) => (
                                    <div key={inx}>
                                       {record.OrderID}
                                    </div>
                                )}
                            />
                            <Column title="Status Order"  render={(text, record,inx) => (
                                    <div key={inx}>
                                      {record.statusOrder}
                                    </div>
                                )}
                            />
                            <Column title="วันที่สร้าง"  render={(text, record,inx) => (
                                    <div key={inx}>
                                       {record.date}
                                    </div>
                                )}
                            />  
                            <Column title="Status Tranfer"  render={(text, record,inx) => (                                    
                                    <div key={inx}>
                                       {record.status==='Fail'?<span style={{color:'red'}}>{record.status}</span>:<span style={{color:'green'}}>{record.status}</span>}
                                    </div>
                                )}
                            />                           

                            <Column title="Action"  render={(text, record,inx) => (
                                record.status==='Fail'?<Button type={'primary'} size={'small'}>RESENT</Button>:''
                             )}
                            />                        
                        </Table>}
                </Card>
                
            </Col>
                              
                        </Row>
        </>
    )
}
export default ResultOrderPage;