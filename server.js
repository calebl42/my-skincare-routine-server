import express from 'express';
import getProductList from './scrape.js';
import { connectDB, getDB } from './db/connect.js';
import * as queries from './db/queries.js';
const app = express();

app.get('/products', async (req, res) => {
  console.log(JSON.stringify(req.query));
  const curProductList = await getProductList(req.query.name);
  const db = getDB();
  await queries.insertProductList(db, curProductList);
  res.json(JSON.stringify(curProductList));
});

connectDB('product_search_results').then(() => {
  app.listen(8080, () => {
    console.log(`server running at port 8080`);
  });
}).catch((err) => (console.error('###ERROR### ' + err)));