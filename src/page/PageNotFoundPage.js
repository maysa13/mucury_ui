import React from 'react';

/* Plugin */
import { Row, Col, Typography, Button } from 'antd';

const { Title } = Typography;

function PageNotFoundPage(){
    return(
        <div className="page-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Row style={{textAlign: 'center'}}>
                <Col span={24}>
                    <Title style={{textAlign: 'center'}}>404</Title>
                    <Title level={5} style={{marginBottom: '20px'}}>ไม่พบหน้าเว็บที่คุณต้องการ</Title>
                    <Button onClick={() => {window.location ='./'}} >คลิกที่นี่เพื่อกลับหน้าหลัก</Button>
                </Col>
            </Row>    
        </div>
    )
}

export default PageNotFoundPage;