import React,{useContext} from 'react';
import { Row, Col } from 'antd';
import {LeftOutlined , RightOutlined} from '@ant-design/icons';
import {
  MercuryContext
} from '../../../store/MercuryContext';

const Pagination = ({ postsPerPage, totalPosts, paginate,currentPage,month,year,week}) => {
  
  const {
    selectedMenu,
    capacity,
} = useContext(MercuryContext);

  const pageNumbers = [];
  // console.log('Pagination = ',capacity)
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  let cheackNext,cheackPrev;

  //Perv
  if(currentPage-1!==0){   
    cheackPrev=currentPage-1
  }else if(currentPage-1===0){
    cheackPrev=currentPage
  }

  //Next
  if(currentPage+1<=Math.ceil(totalPosts / postsPerPage)){
    cheackNext=currentPage+1
  }else if(currentPage+1>Math.ceil(totalPosts / postsPerPage)){
    cheackNext=currentPage
  }

  const dateToday= new Date()
  const thismonth = month[dateToday.getMonth()];

  let showmonth
 
  week.map((a_month,i)=>{
    if(week.length>5&&i===3){      
      showmonth=a_month.date.substring(5, 7)
      var x = Number(showmonth)
      let num = parseInt(x);
      showmonth = month.filter((months,index) => index == (num-1));
    }else if(week.length>2&&week.length<=5&&i===2){
      showmonth=a_month.date.substring(5, 7)
      var x = Number(showmonth)
      let num = parseInt(x);
      showmonth = month.filter((months,i) => i == (num-1));
    }else if(week.length>0&&week.length<=2&&i===0){
      showmonth=a_month.date.substring(5, 7)
      var x = Number(showmonth)
      let num = parseInt(x);
      showmonth = month.filter((months,i) => i == (num-1));
    }
  })
  return (
    
    <Row style={{display:'inline-block'}}>
      {pageNumbers.map((number,i)=> {   
        return( 
          <Col key={i} span={24} style={{textAlign:'center',display:'inline-block'}}>   
             {number===cheackPrev &&<LeftOutlined onClick={() => paginate(number)}/>}
             {number===cheackPrev && <span>{showmonth} / {year}</span> }
             {number===cheackNext &&<RightOutlined onClick={() => paginate(number)}/>}      
          </Col>
        )
      })}
    </Row>
   
  );
};

export default Pagination;