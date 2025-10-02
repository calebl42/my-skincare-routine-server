import puppeteerCore from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { addExtra } from 'puppeteer-extra';
import * as cheerio from 'cheerio';

/*Searches up "productName" on amazon. Returns an object which contains
a list of product data objects from the search results.*/
async function getScrapedData(productName) {
  //set up browser environment with stealthy mode...
  const puppeteer = addExtra(puppeteerCore);
  puppeteer.use(StealthPlugin());
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.setUserAgent(userAgent);
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://www.amazon.com', {
    waitUntil: 'networkidle2',
  });
  //navigate to the desired page, and extract relevant html
  await page.locator(`input[type='text']`).fill(`${productName}\n`);
  await page.waitForNavigation();
  const body = await page.content();
  
  let productList = [];
  const $ = cheerio.load(body);
  $(`div[data-component-type="s-search-result"]`).each((index, element) => {
    let currentProduct = {
      image: '',
      title: '',
      price: '',
      stars: '',
      total_reviews: '',
      url: ''
    };
    
    //fill 'er up
    currentProduct['image'] = $(element).find(`img`).attr(`src`);
    currentProduct['title'] = $(element).find(`h2 > span`).text();
    currentProduct['price'] = $(element).find(`span:has(> span.a-price-symbol)`).text();
    currentProduct['stars'] = $(element).find(`i[data-cy="reviews-ratings-slot"]`).text().split(' ')[0];
    currentProduct['total_reviews'] = $(element).find(`span.rush-component > div > a > span`).text();
    currentProduct['url'] = 'https://www.amazon.com' + $(element).find(`a:has(h2)`).attr(`href`);
    
    if (currentProduct.title) {
      productList.push(currentProduct);
    }
  });
  
  await browser.close();
  return { 
    _id: productName, //using MongoDB _id 
    date_created: new Date(),
    productList 
  };
}

export default getScrapedData;
