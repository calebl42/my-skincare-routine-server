import express from 'express';
import getProductData from './scrape.js';
const app = express();

app.get('/:productName', async (req, res) => {
  const dataList = await getProductData(req.params.productName);
  res.json(JSON.stringify(dataList));
});

app.listen(8080, () => {
  console.log(`server running at port 8080`);
});