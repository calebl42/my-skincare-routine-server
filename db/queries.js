export async function insertProductList(db, newProductList){
  await db.collection("product_lists").insertOne(newProductList);
}