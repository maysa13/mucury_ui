import React, { useState, useContext, useEffect } from 'react';

/* Plugin */
import { useHistory } from "react-router-dom";
import { Layout, Row, Col, Popover} from 'antd';

/* Helper */
import { isNotError } from '../helper/UtilityFunction';

/* Store */
import {
    MercuryContext
} from '../store/MercuryContext';

/* Component */
import ModalLogout from '../component/ModalLogout';

/* Page */
import MenuPage from './Menu/MenuPage';
import CheckServiceAreaPage from  './CheckSerivceArea/CheckServiceAreaPage';
import SearchOrderNewServicePage from './SearchOrderNewService/SearchOrderNewServicePage';
import OrderNewServiceDetail from './SearchOrderNewService/OrderNewServiceDetail';
import MakeAnAppointmentPage from './MakeAnAppointment/MakeAnAppointmentPage';
import AdvanceSearchPage from './AdvanceSearch/AdvancedSearch';
import AdvanceSearchListPage from './AdvanceSearch/AdvanceSearchList';
import ResetAcressPointPage from './ResetAccressPoint/ResetAccressPointPage';
import Searchdtac from './SearchOrderNewService/Search';
import AdminPage from './Admin/AdminPage'
import ResultOrderPage from './ResultOrder/ResultOrderPage'
/* Icon */
import logoDtac from "../icon/logoDtac.jpeg";
import logoutIcon from "../icon/logout.png";

const { Content, Footer } = Layout;

function MainPage() {
    
    let history = useHistory();
    const {
        userLoginData,
        uiControlData,
        selectedMenu
    } = useContext(MercuryContext);
    const [showModalLogout, setShowModalLogout] = useState(false);

    const confirmLogout = (checkedLogoutJas) => {
        setShowModalLogout(false);
        history.push("/login");
    };

    const content = (
        <div className="text-biscay">
          <p className="m-0" style={{whiteSpace: 'nowrap'}}>Email : {userLoginData.userEmail}</p>
          <p className="m-0" style={{whiteSpace: 'nowrap'}}>Channel Name : {userLoginData.channelName}</p>
        </div>
      );

    return(
        <>
            <Layout className="layout" style={{ minHeight: '100vh' }}>
                <header className="header-main">
                    <Row>
                        <Col flex="none" style={{ display: 'inline-flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <div className="nav-link" onClick={() => {selectedMenu("MenuPage")}} style={{ display: 'inline-flex', alignItems: 'center'}}>
                                {/* <div style={{position:'absolute'}}> */}
                                <div>
                                    <img className="header-logo" src={logoDtac} width="90" alt="3BB Logo" />
                                </div>
                            </div>
                        </Col>
                        <Col flex="auto" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div>
                                <h5 className="header-text" style={{fontSize:24}} >สมัครบริการ Dtac Fiber+ <span style={{fontSize: 9}}>V{process.env.REACT_APP_VERSION}</span></h5>
                                <div className="header-text2" >เน็ตบ้านคุณภาพราคาสุดคุ้ม</div>
                            </div>
                        </Col>
                        <Col flex="none" style={{ display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                            <div>
                                <Popover placement="bottom" content={content} trigger="click">
                                    <div className="text-biscay">
                                        {userLoginData.userName}
                                        <i className="arrow down margin-left-8"></i>
                                    </div>
                                </Popover>
                                <div className="text-biscay">Role : {userLoginData.roleName}</div>
                            </div>    
                            <div className="text-center nav-link pl-0 pr-0 text-yellow"
                                onClick={() => setShowModalLogout(true)} name="logout">
                                <img className="header-logo margin-left-16" src={logoutIcon} width="28" alt="3BB Logo" />
                            </div>
                        </Col>
                    </Row>
                </header>
                <Content style={{ margin: '12px 12px 0px 12px' }}>
                    {/* หน้าเมนู */}
                    {(uiControlData.currentMenu === 'MenuPage') &&
                        <MenuPage/>
                    }

                    {/* หน้าเนื้อหาตรวจสอบพื้นที่บริการ */}
                    {(uiControlData.currentMenu === 'CheckServiceArea') &&
                        <CheckServiceAreaPage/>
                    }
                    {/* ค้นหาคำขอติดตั้งบริการใหม่ */}
                    {(uiControlData.currentMenu === 'Searchdtac')  &&//|| uiControlData.currentMenu === 'ChangeAppointment' ||  uiControlData.currentMenu === 'OrderNewServiceDetail') &&
                        <Searchdtac/>
                    }
                    {/* ค้นหาคำขอติดตั้งบริการใหม่ */}
                    {(uiControlData.currentMenu === 'SearchOrderNewService')  &&//|| uiControlData.currentMenu === 'ChangeAppointment' ||  uiControlData.currentMenu === 'OrderNewServiceDetail') &&
                        <SearchOrderNewServicePage/>
                    }

                    {/* รายละเอียดคำขอติดตั้ง */}
                    {( uiControlData.currentMenu === 'OrderNewServiceDetail') &&
                        <OrderNewServiceDetail/>

                    }
                    
                    {/* หน้าจอหลัก>ค้นหาขั้นสูง>รายการที่ค้นหา>ประวัติคำขอลูกค้า>รายละเอียดคำขอติดตั้ง*/}
                    {( uiControlData.currentMenu === 'AdvancedSearchtoListtoOrderNewServiceDetail') &&
                        <OrderNewServiceDetail/>
                    }

                    {/* Advanced Search (ค้นหาขันสูง) */}
                    {(uiControlData.currentMenu === 'AdvancedSearch' ) &&
                        <AdvanceSearchPage/>
                    }
                    {/* Advanced Search (ค้นหาขันสูง) Ordered Lists */}
                    {(uiControlData.currentMenu === 'AdvancedSearchList' ) &&
                        <AdvanceSearchListPage/>
                    }
                    {/* Advanced Search (ค้นหาขันสูง) Customer Data ใช้หน้าจอร่วมกับ SearchOrderNewServicePage*/}
                    {(uiControlData.currentMenu === 'AdvancedSearchCustomerData' ) &&
                        <SearchOrderNewServicePage/>
                    }
                     {/* RESET ACCRESS POINT (แก้ไขปัญหา) */}
                     {(uiControlData.currentMenu === 'ResetAccressPoint' ) &&
                        <ResetAcressPointPage/>
                    }

                    {/* นัดหมายติดตั้ง */}
                    {(uiControlData.currentMenu === 'MakeAnAppointment') &&
                        <MakeAnAppointmentPage/>
                    }

                    {/* AdminPage */}
                    {(uiControlData.currentMenu === 'AdminPage') &&
                        <AdminPage/>
                    }

                    {/* ResultOrderPage */}
                    {(uiControlData.currentMenu === 'ResultOrderPage') &&
                        <ResultOrderPage/>
                    }

                    {/* <Button type="primary">ตกลง</Button>
                    <Button type="primary" danger>ยกเลิก</Button> */}
                    {/* <div
                        onClick={() => setShowModalLogout(true)} name="logout">
                        ออกจากระบบ
                    </div> */}
                </Content>
                {/* <Footer style={{ textAlign: 'center', padding: '2px 0 16px 0', fontSize: '12px' }}>
                    หากพบปัญหาระหว่างการใช้งานระบบ กรุณาติดต่อที่
                </Footer> */}
            </Layout>
            <ModalLogout
                visible={showModalLogout}
                onHide={() => setShowModalLogout(false)}
                on_confirm_logout={confirmLogout}
            />
        </>
    )
}

export default MainPage;