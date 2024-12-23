const Template2 = function ({
  userData,
  driver,
  locto,
  locfrom,
  plateno,
  imgurl,
  imgurlF,
  imgurlS,
  company,
}) {
  const today = new Date().toDateString();

  function generateTable(userData) {
    let table = "<table>";
    table +=
      '<tr><th style="font-size: 12px">رقم الجوال</th><th style="font-size: 12px">الجنسیة</th><th style="font-size: 12px">رقم الجواز / التاشيرة /اقامة</th><th style="font-size: 12px">الإسم</th></tr>';
    userData.forEach((item) => {
      table += `<tr><td style="font-size: 9px">${item.mobile}</td><td style="font-size: 9px">${item.nationality}</td><td style="font-size: 9px">${item.passportNo}</td><td style="font-size: 9px">${item.name}</td></tr>`;
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
            margin: 0;
            padding: 0;
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
      
      .date-container{
        float: right;
        text-align: right;
      }
            
        
       
        
        </style>
        </head>
        <div style='display:none'><img src=${imgurl} /></div>
        <div style='display:none'><img src=${imgurlF} /></div>
        <div style='display:none'><img src=${imgurlS} /></div>
        <body>
        
        <div class="invoice-container">
        <div>
        <h2 style='text-align: center;'>أبرام عقد إتفاق بين الطرفين</h2>        
          <p style="text-align:right;font-size:9px">... تحية طيبة و بعد </p>
          <p style="text-align:right;font-size:9px">${today}: إنه في يوم</p>
        </div >
        
        <p style="text-align:center">بیانات السائق</p>
        <table style="text-align: center">
              <tr>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">رقم اللوحة</td>
              <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">رقم الھویة</td>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">الإسم</td>
             
              </tr>
              <tr>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${plateno}</td>
              <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">${driver.license
    }</td>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${driver.name
    }</td>
             
              </tr>
              
     
      </table>
      <div style="display:flex;width:100%">
      <p style="text-align:right;font-size:9px">${company.companyCR}-:نحن ${company.nameAr
    }-: سجل تجاري  
  <p>    
      </div>
      <div style="display:flex;width:100%;direction:rtl">

      <p style="text-align:right;font-size:9px">تم ألإتفاق مع جميع ضيوف الرحمان لنقلهم من :- ${locto}<p>    
        

      </div>


   
      <div style="direction:rtl;display:flex">
       <p style="text-align:right;font-size:9px">وھم:ـ</p>

      </div>
        <table style="text-align: center">
              
       
        
       ${generateTable(userData)}
  
      </table>
        </div>
        </body>
        </html>
      `;
};

module.exports = Template2;
