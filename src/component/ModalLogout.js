import React, { useState, useContext } from 'react';

/* Plugin */
import { Modal, Button, Checkbox } from 'antd';

/* Helper */
import { eraseCookie } from '../helper/UtilityFunction';

/* Store */
import {
    AuthContext
} from '../store/AuthContext';

function ModalLogout(props){
    const [checkedLogoutJas, setCheckedLogoutJas] = useState(true);

    const {
        logoutSuccess,
        openLogoutJasWindow
    } = useContext(AuthContext);

    const urlJasLogout =  process.env.REACT_APP_JASMINE_OAUTH_JAS_LOGOUT_URI;

    let { on_confirm_logout, ...original } = props;

    // const handleChangeCheckboxLogoutJas = () => (event) => {
    //     console.log("handleChangeCheckboxLogoutJas ==> event.target.checked : ", event.target.checked)
    //     setCheckedLogoutJas(event.target.checked);
    // };

    const handleSubmitClick = () => (event) => {
        console.log("handleSubmitClick ==> checkedLogoutJas : ", checkedLogoutJas);
        props.on_confirm_logout(checkedLogoutJas);
        eraseCookie('accessToken');
        logoutSuccess();
        //if (checkedLogoutJas === true){
        openLogoutJasWindow();
        //}
        window.location.href = urlJasLogout;
    };

    const handleCancel = () => (event) => {
        props.onHide()
    };

    return(
        <>
            <Modal
                {...original}
                title={<div style={{fontSize : '18px' , fontWeight : 'bold', color: '#E34625'}}>ยืนยันการออกจากระบบ</div>}
                onOk={handleSubmitClick()}
                onCancel={handleCancel()}
                footer={[
                    <Button key="submit" type="primary" onClick={handleSubmitClick()}>
                        ยืนยัน
                    </Button>,
                    <Button danger key="back" onClick={handleCancel()}>
                        ยกเลิก
                    </Button>
                ]}
            >
                <div>คุณต้องการออกจากระบบ ?</div>
                {/* <Checkbox onChange={handleChangeCheckboxLogoutJas()}>Logout from jasmine.com</Checkbox> */}
            </Modal>
        </>
    )
}

export default ModalLogout;

