import React, { useContext }  from 'react';

/* Plugin */
import { Row, Col, Breadcrumb } from 'antd';

/* Store */
import {
    MercuryContext
} from '../store/MercuryContext';

/* Icon */

function AppBreadcrumb (props) {
    console.log('props',props)
    const {
        selectedMenu,
        uiControlData,
        setDatcId
    } = useContext(MercuryContext);

    const menuHandleClick = (parameter) => (event)  => {
        if(props.set === "setDatcIdnull"){
            setDatcId("")
        }
        if(parameter){
            selectedMenu(parameter);
        }
        else{
            selectedMenu('MenuPage');
        }
    };

    const breadcrumbItems = uiControlData.breadcrumbList[uiControlData.currentMenu].map((value,index)=>{
        return (
            <Breadcrumb.Item key={value} onClick={menuHandleClick(uiControlData.breadcrumbNameMap[value])}>
                {value}
            </Breadcrumb.Item>
        )
    });
    
    return(
        <>
            <Breadcrumb className="pointer" separator=">">{breadcrumbItems}</Breadcrumb>
        </>
    )
}

export default AppBreadcrumb;