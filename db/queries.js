export async function insertProductList(db, newProductList){
  await db.collection("product_lists").insertOne(newProductList);
  console.log('Successfully created new listing for: ' + newProductList._id);
}

export async function getProductList(db, productName) {
  return await db.collection("product_lists").findOne({ _id: productName });
}

export async function updateProductList(db, productName, newProductList){
  await db.collection("product_lists").updateOne({ _id: productName }, { $set: newProductList });
  console.log('Successfull update listing for: ' + productName);
}