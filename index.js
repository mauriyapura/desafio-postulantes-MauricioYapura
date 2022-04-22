const puppeteer = require('puppeteer');
const fs = require('fs');

const url = "https://www.sii.cl/servicios_online/1047-nomina_inst_financieras-1714.html";

(async () => {
    let results = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
  
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll('table tr'));     
      return tds.map(td => td.innerText);
    });   
    
    const headersTable = data[0].split("\t");  
    
    for (let i=1; i < data.length - 1 ; i++) {        
        let text = data[i].split("\t");
        let element = {
            [headersTable[0]] : text[0], 
            [headersTable[1]] : text[1], 
            [headersTable[2]] : text[2], 
            [headersTable[3]] : text[3], 
            [headersTable[4]] : text[4], 
            [headersTable[5]] : text[5], 
            [headersTable[6]] : text[6],          
        };
        results.push(element);        
    }   

    let info = JSON.stringify({
       message: "success",
       data: results
    })
    
    fs.writeFile('results.json', info, (err) => {
        if (err) throw err;
        console.log('Datos escritos en el archivo results.json');
    });
    
    await browser.close();    
  })();