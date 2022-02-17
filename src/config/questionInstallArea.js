//คำถามสอบถามบริเวณรอบพื้นที่ติดตั้ง
export default
[
    //บ้านพักอาศัย
    [
        {
            question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีบ้านใกล้เคียงใช้บริการ 3BB หรือไม่',
            questionCode : '1',
            anwser : [
                { label: 'มี 3BB ให้บริการ', value: '1', anwserCode: '11'},
                { label: 'ไม่มี 3BB ให้บริการ', value: '2', anwserCode: '12' }
            ],
            subQuestion : [],
            moreThanOne : false
        },
        {
            question : 'ชุมชน หรือหมู่บ้านแบบเปิด มีแนวเสาไฟฟ้าหรือไม่',
            questionCode : '2',
            anwser : [
                { label: 'มีแนวเสาไฟฟ้า', value: '1', anwserCode: '21' },
                { label: 'ไม่มีแนวเสาไฟฟ้า', value: '2', anwserCode: '22' },
                { label: 'เดินสายไฟฟ้าใต้ดิน', value: '3', anwserCode: '23' }
            ],
            subQuestion : [],
            moreThanOne : false
        },    
        {
            question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
            questionCode : '3',
            anwser : [
                { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับสถานที่ติดตั้ง', value: '1', anwserCode: '31' },
                { label: 'เสาไฟฟ้าอยู่ฝั่งตรงข้ามกับสถานที่ติดตั้ง', value: '2', anwserCode: '32' }
            ],
            subQuestion : [],
            moreThanOne : false
        },
        {
            question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
            questionCode : '4',
            anwser : [
                { label: 'แม่น้ำ (จะไม่สามารถเดินสายข้ามตรงๆได้ ต้องข้ามตามแนว)', value: '1', anwserCode: '41' },
                { label: 'ถนนตั้งแต่ 4 เลนขึั้นไป', value: '2', anwserCode: '42' },
                { label: 'กำแพง', value: '3', anwserCode: '43' },
                { label: 'ต้นไม้ใหญ่', value: '4', anwserCode: '44' },
                { label: 'ทางตัน', value: '5', anwserCode: '45' },
                { label: 'พื้นที่ส่วนบุคคล', value: '6', anwserCode: '46' }
            ],
            subQuestion : [],
            moreThanOne : true
        }

    ],
    //โครงการหมู่บ้าน
    [
        {
            question : 'หมู่บ้าน หรือโครงการจัดสรร พื้นที่ใช้บริการ 3BB หรือไม่',
            questionCode : '5',
            anwser : [
                { label: 'มี 3BB ให้บริการ', value: '1', anwserCode: '51' },
                { label: 'ไม่มี 3BB ให้บริการ', value: '2', anwserCode: '52' }
            ],
            moreThanOne : false,
            subQuestion : [
                {label : 'ชื่อโครงการ (ถ้ามี)', required : false, anwserCode: '54'}
            ]
        },
        {
            question : 'หมู่บ้าน หรือโครงการจัดสรรจะต้องขออนุญาตนิติบุคคลหรือไม่',
            questionCode : '6',
            anwser : [
                { label: 'ไม่ต้องขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '1', anwserCode: '61' },
                { label: 'ขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '2', anwserCode: '62' }
            ],
            moreThanOne : false,
            subQuestion : [
                {label : 'ชื่อผู้ติดต่อประสานงาน', required : true, type:'String', indexAnwserForShow : 1, anwserCode: '63'}, 
                {label : 'เบอร์โทรติดต่อประสานงาน', required : true, type:'PhoneNumber', indexAnwserForShow : 1, anwserCode: '64'}
            ]
        },
        {
            question : 'หมู่บ้าน หรือโครงการจัดสรร มีแนวเสาไฟฟ้าหรือไม่',
            questionCode : '7',
            anwser : [
                { label: 'มีแนวเสาไฟฟ้า', value: '1', anwserCode: '71' },
                { label: 'ไม่มีแนวเสาไฟฟ้า', value: '2', anwserCode: '72' },
                { label: 'เดินสายไฟฟ้าใต้ดิน', value: '3', anwserCode: '73' }
            ],
            moreThanOne : false,
            subQuestion : []
        },
        {
            question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
            questionCode : '3',
            anwser : [
                { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับสถานที่ติดตั้ง', value: '1', anwserCode: '31' },
                { label: 'เสาไฟฟ้าอยู่ฝั่งตรงกันข้ามกับสถานที่ติดตั้ง', value: '2', anwserCode: '32' }
            ],
            moreThanOne : false,
            subQuestion : []
        },
        {
            question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
            questionCode : '4',
            anwser : [
                { label: 'แม่น้ำ (จะไม่สามารถเดินสายข้ามตรงๆได้ ต้องข้ามตามแนว)', value: '1', anwserCode: '41' },
                { label: 'ถนนตั้งแต่ 4 เลนขึั้นไป', value: '2', anwserCode: '42' },
                { label: 'กำแพง', value: '3', anwserCode: '43' },
                { label: 'ต้นไม้ใหญ่', value: '4', anwserCode: '44' },
                { label: 'ทางตัน', value: '5', anwserCode: '45' },
                { label: 'พื้นที่ส่วนบุคคล', value: '6', anwserCode: '46' },
            ],
            moreThanOne : true,
            subQuestion : []
        }
    ],
    //คอนโดมิเนียม
    [
        {
            question : 'คอนโดมิเนียม/อพาร์ทเม้นท์ พื้นที่ใช้บริการ 3BB หรือไม่',
            questionCode : '8',
            anwser : [
                { label: 'มี 3BB ให้บริการ', value: '1', anwserCode: '81' },
                { label: 'ไม่มี 3BB ให้บริการ', value: '2', anwserCode: '82' }
            ],
            moreThanOne : false,
            subQuestion : [
                {label : 'ชื่อโครงการ (ถ้ามี)', required : false, anwserCode: '84'}
            ]
        },
        {
            question : 'คอนโดมิเนียม/อพาร์ทเม้นท์ จะต้องขออนุญาตนิติบุคคลหรือไม่',
            questionCode : '9',
            anwser : [
                { label: 'ไม่ต้องขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '1', anwserCode: '91' },
                { label: 'ขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '2', anwserCode: '92' }
            ],
            moreThanOne : false,
            subQuestion : [
                {label : 'ชื่อผู้ติดต่อประสานงาน', required : true, type:'String', indexAnwserForShow : 1,  anwserCode: '93'}, 
                {label : 'เบอร์โทรติดต่อประสานงาน', required : true, type:'PhoneNumber', indexAnwserForShow : 1,  anwserCode: '94'}
            ]
        }
    ],
    //อาคารสำนักงาน
    [
        {
            question : 'อาคารพาณิชย์/สำนักงาน พื้นที่ใช้บริการ 3BB หรือไม่',
            questionCode : '10',
            anwser : [
                { label: 'มี 3BB ให้บริการ', value: '1', anwserCode: '101' },
                { label: 'ไม่มี 3BB ให้บริการ', value: '2', anwserCode: '102' }
            ],
            moreThanOne : false,
            subQuestion : [
                {label : 'ชื่อโครงการ (ถ้ามี)', required : false, anwserCode: '104'}
            ]
        },
        {
            question : 'อาคารพาณิชย์/สำนักงาน จะต้องขออนุญาตนิติบุคคลหรือไม่',
            questionCode : '11',
            anwser : [
                { label: 'ไม่ต้องขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '1', anwserCode: '111' },
                { label: 'ขออนุญาตนิติบุคคล หรือกรรมการดูแล', value: '2', anwserCode: '112' }
            ],
            moreThanOne : false,
            subQuestion : [
                {label : 'ชื่อผู้ติดต่อประสานงาน', required : true, type:'String', indexAnwserForShow : 1, anwserCode: '113'}, 
                {label : 'เบอร์โทรติดต่อประสานงาน', required : true, type:'PhoneNumber', indexAnwserForShow : 1, anwserCode: '114'}
            ]
        },
        {
            question : 'อาคารพาณิชย์/สำนักงาน มีแนวเสาไฟฟ้าหรือไม่',
            questionCode : '12',
            anwser : [
                { label: 'มีแนวเสาไฟฟ้า', value: '1', anwserCode: '121' },
                { label: 'ไม่มีแนวเสาไฟฟ้า', value: '2', anwserCode: '122' },
                { label: 'เดินสายไฟฟ้าใต้ดิน', value: '3', anwserCode: '123'}
            ],
            moreThanOne : false,
            subQuestion : []
        },
        {
            question : 'แนวเสาไฟฟ้าบริเวณพื้นที่ติดตั้ง',
            questionCode : '3',
            anwser : [
                { label: 'เสาไฟฟ้าอยู่ฝั่งเดียวกันกับสถานที่ติดตั้ง', value: '1', anwserCode: '31' },
                { label: 'เสาไฟฟ้าอยู่ฝั่งตรงกันข้ามกับสถานที่ติดตั้ง', value: '2', anwserCode: '32' }
            ],
            moreThanOne : false,
            subQuestion : []
        },
        {
            question : 'บริเวณพื้นที่ติดตั้งมีสิ่งกีดขวางตามแนวสายหรือไม่',
            questionCode : '4',
            anwser : [
                { label: 'แม่น้ำ (จะไม่สามารถเดินสายข้ามตรงๆได้ ต้องข้ามตามแนว)', value: '1', anwserCode: '41' },
                { label: 'ถนนตั้งแต่ 4 เลนขึั้นไป', value: '2', anwserCode: '42' },
                { label: 'กำแพง', value: '3', anwserCode: '43' },
                { label: 'ต้นไม้ใหญ่', value: '4', anwserCode: '44' },
                { label: 'ทางตัน', value: '5', anwserCode: '45' },
                { label: 'พื้นที่ส่วนบุคคล', value: '6', anwserCode: '46' },
            ],
            moreThanOne : true,
            subQuestion : []
        }
    ]

]