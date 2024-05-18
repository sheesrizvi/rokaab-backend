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
      '<tr><th style="font-size: 12px">التوقیع</th><th style="font-size: 12px">الجنسیة</th><th style="font-size: 12px">رقم الجواز/ التاش یۃ/اقامةr</th><th style="font-size: 12px">االسم</th></tr>';
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
            padding-top: 10px;
          flex: 1;
            width: 730px;
            margin: 0px auto;
            margin-top: 40px;
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
        <h2 style='text-align: center;'>إبرام عقد االتفاق ب  ني الطرف  ني</h2>  
        
       
          <h3 style="text-align:right">تحية طيبة وبعد ،،،</h3>
          <h3 style="text-align:right">${today}: إنه في يوم</h3>
  
        </div >
        
        <p style="text-align:center">بیانات السائق</p>
        <table style="text-align: center">
              <tr>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">رقم اللوحة</td>
              <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">رقم الھویة</td>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">االسم</td>
             
              </tr>
              <tr>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${plateno}</td>
              <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">${
                driver.license
              }</td>
              <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${
                driver.name
              }</td>
             
              </tr>
              
     
      </table>
      <div style="display:flex;width:100%">
      <h3 style="text-align:right">${company.companyCR}سجل تجاری ${
    company.name
  }: نحن<h3>    
      </div>
      <div style="display:flex;width:100%">
      <h3 style="text-align:right">${locto}ایل ${locfrom}: تم االتفاق مع مجموعة ضیوف الرحمان لنقلھم من<h3>    
      </div>


   
      <div style="direction:rtl;display:flex">
       <p style="text-align:right">وھم:ـ</p>

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
