const puppeteer = require('puppeteer')
const fsExtra = require('fs-extra')
const fs = require('fs');

const fileDir = './screenshots/'
let page = null
let browser = null

let login = async () => {
  fsExtra.emptyDirSync(fileDir)

  let rawdata = fs.readFileSync('login.json');
  let data = JSON.parse(rawdata);

  browser = await puppeteer.launch({
    args: ['--start-maximized', '--window-size=1920,1080' ],
    defaultViewport: null,
    headless: true, // The browser is visible
    ignoreHTTPSErrors: true
  })    
  
  page = await browser.newPage()

  await page.goto('https://app.townsq.com.br/login')
  
  await page.type('#login--input--email',data.login)
  await page.type('#login--input--password',data.pass)
  
  await page.click('#login--button--submit')

  await page.waitFor(3000)

  await screenshot(`login.png`)

  return
}

let screenshot = async(fileName) => {
  await page.screenshot({path: `${fileDir}${fileName}`, fullPage: true})
  return
}

let menuReservas = async () => {

  const reservaLink = await page.$x("//span[contains(text(), 'Reservas')]//..");  

  reservaLink[0].click();
  
  await page.waitFor(3000)

  await screenshot(`menuReservas.png`)

  return

}

let minhasReservas = async () => {

  await page.click('#menu-my-reservations')
    
  await page.waitFor(3000)

  await screenshot(`minhasReservas.png`)

  const data = await page.$$eval('table tr td', tds => tds.map((td) => {
    return td.innerText.replace('\n', ' - ')  }));

  console.log(data);

  return
}

let newReserva = async () => {

  await page.click('#menu-amenities')
    
  await page.waitFor(3000)

  await screenshot(`dependencias.png`)

  const academiaLink = await page.$x("//div[contains(text(), 'Academia')]");

  academiaLink[0].click()

  await page.waitForSelector('.busy-day')

  await screenshot(`reservasAcademia.png`)

  return
}

login().then(() => menuReservas()
    .then(() => minhasReservas()
      .then(() => { console.log('Fim'); browser.close(); })))