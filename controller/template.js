const Template = function ({
  userData1,
  userData2,
  driver,
  locto,
  locfrom,
  plateno,
  imgurl,
  imgurlF,
  imgurlS,
  company,
  qrUrl
}) {
  const today = new Date().toDateString();

  function generateTable(userData2) {
    let table = "<table>";
    table +=
      '<tr><th style="font-size: 12px">Name</th><th style="font-size: 12px">Passport/Iqama Number</th><th style="font-size: 12px">Nationality</th><th style="font-size: 12px">Mobile</th></tr>';
    userData2.forEach((item) => {
      table += `<tr><td style="font-size: 9px">${item.name}</td><td style="font-size: 9px">${item.passportNo}</td><td style="font-size: 9px">${item.nationality}</td><td style="font-size: 9px">${item.mobile}</td></tr>`;
    });
    table += "</table>";
    return table;
  }
  return `
      <!DOCTYPE html>
      <html>
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
      @page  {
        margin: 0;
        size: letter; 
      }
   
      html{
        font-family: "IBM Plex Sans Arabic", sans-serif;
      }
      
      body: {
        padding: 0;
        margin: 0;
      }
       
        
      .invoice-container {
         
        flex: 1;
          width: 430px;
          margin: 0px auto;
        
          }
      
      table {
        border-collapse: collapse;
        width: 100%;
       
      }
     
      table td, table th {
        border: 1px solid rgb(247, 247, 247);
        padding: 10px;
       
      }
      
      
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #FFFFFF;
        color: rgb(78, 78, 78);
      }
      table tr {
       
        text-align: center;
       
      }
      .extra-spacing-tr {
        height: 20px;
    }
          
      
     
      
      </style>
      </head>
      <div style='display:none'><img src=${imgurl} /></div>
      <div style='display:none'><img src=${imgurlF} /></div>
      <div style='display:none'><img src=${imgurlS} /></div>
      <body>
      
      <div class="invoice-container">
      <h3 style='text-align: center;'>عقد نقل على الطرق البرية</h3>  
      <img src=${qrUrl} alt="Base64 Image" style='absolute right:0px'/>
      <h4 style='text-align: right;'><span style='font-size:12px'>${today}</span>:التاريخ </h4>  
      <div style='page-break-after: always;font-size:10px;text-align:right'>

  


      <p style="text-align:right">
      
      تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة والثلاثون من اللائحة المنظمة للنشاط النقل المتخصص وتأجير وتوجيه الحافلات وبناء على الفقرة (1) من المادة (39) والتي تنص على ان يجب على الناقل ابرام عقد نقل مع الأطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية وبما لايخالف أحكام هذه اللائحة ووفقا للتلبية التي تحددها هيئة النقل 
      </p>
     
    

<p style="text-align:right" > :
وبناء على ماسبق تم ابرام عقد النقل بين الأطراف الاتية  
</p>
<p style="text-align:right" > ${company.companyLNo
    }   <span style='font-weight:bold;'>
الطرف الأول :</span> ${company.nameAr}</p>

<p style="text-align:right" >${userData1.mobile}, ${userData1.nationality}, ${userData1.passportNo
    } ,${userData1.name}
  <span style='font-weight:bold;'>

  /الطرف الثاني: السيد
  
  </span>
  </p>



<p style="text-align:right">
اتفق الطرفان على ان ينفذ الطرف الأول عملية النقل للطرف الثاني مع مرافقيه وذويهم من الموقع المحدد مسبقا مع الطرف الثاني وتوصيلهم الى الجهة المحددة بالعقد
<p style="text-align:right">
<span style='font-weight:bold;'>
 النقل من : </span> ${locfrom}

</p>
<p style="text-align:right"><span style='font-weight:bold;'>
 وصولاً الى :</span>  ${locto}

</p>


<p style="text-align:right">
في حال الغاء التعاقد لاي سبب شخصي او أسباب أخرى تتعلق في الحجوزات او الأنظمة تكون سياسة الإلغاء والاستبدال حسب نظام وزارة التجارة السعودي في حالة الحجز وتم الإلغاء قبل موعد الرحلة بأكثر من 24 ساعة يتم استرداد المبلغ كامل. 

<p>


<p style="text-align:right">

في حالة طلب الطرف الثاني الحجز من خلال الموقع الالكتروني للمؤسسة يعتبر هذا الحجز وموافقته على الشروط والاحكام بالموقع الالكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الأول بواسطة حافلات المؤسسة المرخصة والمتوافقة مع الاشتراطات المقررة من هيئة النقل. 
</p>

</div >

  










      <h3 style='text-align: center;'>بيانات السائق</h3>  
      
     
      <table style="text-align: center">
            <tr>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${driver.license
    }</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">رقم الهوية</td>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${driver.name
    }</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">اسم السائق</td>
            </tr>
            <tr>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${today}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">تاريخ</td>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${plateno}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">رقم لوحة</td>
            </tr>
            <tr>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${locto}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">الى</td>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${locfrom}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">متجه من</td>
            </tr>
   
    </table>

    <h3 style='text-align: center;'>قائمة أسماء الركاب</h3> 
      <table style="text-align: center">
            
    
      
     ${generateTable(userData2)}

    </table>
      </div>
      </body>
      </html>`;
};

module.exports = Template;
