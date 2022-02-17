import React, { createContext, useReducer } from "react"

export const MercuryContext = createContext({})

const initialState = {
    userLoginData: null,
    uiControlData: {
        currentMenu: 'MenuPage',
        breadcrumbList: {
            'MenuPage' : ['หน้าจอหลัก'],
            'CheckServiceArea' : ['หน้าจอหลัก','ตรวจสอบพื้นที่ให้บริการ'],
            'Searchdtac':['หน้าจอหลัก','เมนูค้นหาคำขอ'],
            'SearchOrderNewService' : ['หน้าจอหลัก','เมนูค้นหาคำขอ','ประวัติคำขอติดตั้ง'],
            'MakeAnAppointment' : ['หน้าจอหลัก','จองนัดหมายทีมงานติดตั้ง'],
            'OrderNewServiceDetail' : ['หน้าจอหลัก','เมนูค้นหาคำขอ','ประวัติคำขอติดตั้ง','รายละเอียดคำขอติดตั้ง'],
            'ChangeAppointment' : ['หน้าจอหลัก','เมนูคำขอติดตั้งบริการใหม่','เปลี่ยนแปลงนัดหมายนิดตั้ง'],
            'AdvancedSearch' : ['หน้าจอหลัก','ค้นหาขั้นสูง'],
            'AdvancedSearchList' : ['หน้าจอหลัก','ค้นหาขั้นสูง','รายการที่ค้นหา'],
            'AdvancedSearchCustomerData' : ['หน้าจอหลัก','ค้นหาขั้นสูง','รายการที่ค้นหา','ประวัติคำขอลูกค้า'],
            'AdvancedSearchtoListtoOrderNewServiceDetail':['หน้าจอหลัก','ค้นหาขั้นสูง','รายการที่ค้นหา','ประวัติคำขอลูกค้า','รายละเอียดคำขอติดตั้ง'],
            'ResetAccressPoint' : ['หน้าจอหลัก','แก้ไขปัญหา'],
            'AdminPage' : ['หน้าจอหลัก','ผู้ดูแลระบบ'],
            'ResultOrderPage':['หน้าจอหลัก','สรุปผลรายการคำขอ'],
        },
        breadcrumbNameMap: {
            'หน้าจอหลัก' : 'MenuPage',
            'ตรวจสอบพื้นที่ให้บริการ' : 'CheckServiceArea',
            'เมนูค้นหาคำขอ' : 'Searchdtac',
            'ประวัติคำขอติดตั้ง' : 'SearchOrderNewService',
            'จองนัดหมายทีมงานติดตั้ง' : 'MakeAnAppointment',
            'รายละเอียดคำขอติดตั้ง' : 'OrderNewServiceDetail',
            'เปลี่ยนแปลงนัดหมายนิดตั้ง' : 'ChangeAppointment',
            'ค้นหาขั้นสูง' : 'AdvancedSearch',
            'รายการที่ค้นหา' : 'AdvancedSearchList',
            'ประวัติคำขอลูกค้า' : 'AdvancedSearchCustomerData',
            'แก้ไขปัญหา' : 'ResetAccressPoint',
            'ผู้ดูแลระบบ':'AdminPage' ,
            'รายละเอียดคำขอติดตั้ง':'AdvancedSearchtoListtoOrderNewServiceDetail',
            'สรุปผลรายการคำขอ':'ResultOrderPage'
        }
    },
    orderId : "",
    appointment:null,   
    datcId:"",
    objdata:{},
    Profile_dtacRef:{},
    capacity:{},
    orderdetail:{},
    dataAdvsList : [],
    status_app:true, //สถานะการแสดงตารางนัดหมาย
    status_Model_edit:false, //สถานะแสดงป็อปอัพแก้ไขข้อมูล
}

const mercuryReducer = (state, { type, payload }) => {
    switch (type) {
        case 'SET_USER_LOGIN_DATA':
            return {
                ...state,
                userLoginData: payload
            }
        case 'SELECTED_MENU':
            return {
                ...state,
                uiControlData: {
                    ...state.uiControlData,
                    currentMenu: payload
                }
            }
        case 'SET_ORDER_ID':
            return {
                ...state,
                orderId: payload
            } 
        case 'SET_Appointment':
            return {
            ...state,
            appointment: payload
        }     
        case 'SET_Datc_Id':
            return {
            ...state,
            datcId: payload
        }          
        case 'SET_Obj_Data':
            return {
            ...state,
            objdata: payload
        }  
        case 'SET_Profile_dtacRef':
            return {
            ...state,
            Profile_dtacRef: payload
        }         
        case 'SET_Capacity':
            return {
            ...state,
            capacity: payload
        }  
        case 'SET_Usage':
            return {
            ...state,
            usage: payload
        }
        case 'SET_Orderdetail':
            return {
            ...state,
            orderdetail: payload
        }
        case 'SET_DataAdvsList':
            return {
            ...state,
            dataAdvsList: payload
        }
        /* สถานะการแสดงตารางนัดหมาย */
        case 'SET_STAUTS_APP':
            return {
            ...state,
            status_app: payload
        }
        /*  สถานะแสดงป็อปอัพแก้ไขข้อมูล  */
        case 'SET_STAUTS_MODEL_EDIT':
            return {
            ...state,
            status_Model_edit: payload
        }
        default:
            return state
    }
}

export const MercuryProvider = ({ children }) => {
    const [mercuryState, mercuryDispatch] = useReducer(
        mercuryReducer,
        initialState
    )

    const { userLoginData, uiControlData, orderId, appointment,datcId,objdata,Profile_dtacRef,capacity,usage,orderdetail ,dataAdvsList,status_app,status_Model_edit, } = mercuryState

    const setUserLoginData = payload =>
        mercuryDispatch({
            type: "SET_USER_LOGIN_DATA",
            payload
        })
    const selectedMenu = payload => 
        mercuryDispatch({
            type: "SELECTED_MENU",
            payload
        }) 
    const setOrderId = payload =>
        mercuryDispatch({
            type: "SET_ORDER_ID",
            payload
        })
    const setAppointment = payload =>
        mercuryDispatch({
            type: "SET_Appointment",
            payload
        })
    const setDatcId = payload =>
        mercuryDispatch({
            type: "SET_Datc_Id",
            payload
        })  
    const setObjData = payload =>
        mercuryDispatch({
            type: "SET_Obj_Data",
            payload
    })
    
    const set_Profile_dtacRef = payload =>
        mercuryDispatch({
            type: "SET_Profile_dtacRef",
            payload
    })
    const set_Capacity = payload =>
        mercuryDispatch({
            type: "SET_Capacity",
            payload
    })
    const set_Usage = payload =>
        mercuryDispatch({
            type: "SET_Usage",
            payload
    })
    const set_Orderdetail = payload =>
        mercuryDispatch({
            type: "SET_Orderdetail",
            payload
    })
    const setDataAdvsList = payload =>
        mercuryDispatch({
            type: "SET_DataAdvsList",
            payload
    })

    /*  สถานะการแสดงตารางนัดหมาย  */
    const set_status_app = payload =>
        mercuryDispatch({
            type: "SET_STAUTS_APP",
            payload
    })
    /*  สถานะแสดงป็อปอัพแก้ไขข้อมูล  */
    const set_status_Model_edit = payload =>
        mercuryDispatch({
            type: "SET_STAUTS_MODEL_EDIT",
            payload
    })

    return (
        <MercuryContext.Provider value={
                { 
                    setUserLoginData,
                    userLoginData,
                    selectedMenu, 
                    uiControlData,
                    setOrderId,
                    orderId,
                    setAppointment,
                    appointment, 
                    setDatcId,
                    datcId,
                    setObjData,
                    objdata,
                    set_Profile_dtacRef,
                    Profile_dtacRef,
                    set_Capacity,
                    capacity,
                    set_Usage,
                    usage,
                    set_Orderdetail,
                    orderdetail,
                    setDataAdvsList,
                    dataAdvsList,
                    /*  สถานะการแสดงตารางนัดหมาย  */
                    set_status_app,
                    status_app,
                    /*  สถานะแสดงป็อปอัพแก้ไขข้อมูล  */
                    set_status_Model_edit,
                    status_Model_edit,
                }
            }
        >
            {children}
        </MercuryContext.Provider>
    )
}

