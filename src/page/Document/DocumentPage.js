import React, { useContext } from 'react';
import {Button, Image, Row, Col, Card } from 'antd'
import 'antd/dist/antd.css';

import MercuryAPI from '../../api/MercuryAPI'

/* Store */
import {
    MercuryContext
} from '../../store/MercuryContext';

const mercuryApi = new MercuryAPI();
function DocumentPage(props) {

    const {
        userLoginData
    } = useContext(MercuryContext);

    return(
        <>     
            ใบสมัครปิดงานติดตั้งอินเตอร์เน็ตความเร็วสูง
        </>
    )
}

export default DocumentPage;