import express from 'express';
import getScrapedData from './scrape.js';
import { connectDB, getDB } from './db/connect.js';
import * as queries from './db/queries.js';
import cors from 'cors';
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://my-skincare-routine.vercel.app/'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(cors(corsOptions));

app.get('/products', async (req, res) => {
  const productName = req.query.productName;
  let curDate = new Date().getTime();
  const db = getDB();
  
  const curProductList = await queries.getProductList(db, productName);

  if (!curProductList) {
    //no database entry exists
    const newProductList = await getScrapedData(productName);
    await queries.insertProductList(db, newProductList);
  } else if (curDate - new Date(curProductList.date_created).getTime() > 86400) {
    /*database entry for this product has not been updated in over a day
    therefore we need to update the db after returning the old productList*/
    res.json(curProductList);
    const newProductList = await getScrapedData(productName);
    await queries.updateProductList(db, productName, newProductList);
  } else {
    //database entry exists and is up to date
    res.json(curProductList);
  }
});

//connect to MongoDB first, then start up server
connectDB('product_search_results').then(() => {
  app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express server running at port ${process.env.PORT}`);
  });
}).catch((err) => (console.error('###ERROR### ' + err)));
