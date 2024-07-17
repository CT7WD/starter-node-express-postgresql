const knex = require("../db/connection");

// GET a list of all products
function list() {
  return knex("products").select("*");
}

// GET a specific product, based on its ID
// SELECT all cols from PRODUCTS table where product_id col matches passed in arg.
// first() returns first row in table.
function read(productId) {
  return knex("products").select("*")
          .where({ product_id: productId })
          .first()
}

//  PRODUCT OUT OF STOCK QUERY BUILDER
function listOutOfStockCount() {
  return knex("products")
    .select("product_quantity_in_stock as out_of_stock")
    .count("product_id")
    .where({ product_quantity_in_stock: 0 })
    .groupBy("out_of_stock");
}

// LIST PRICE SUMMARY QUERY BUILDER
function listPriceSummary() {
  return knex("products")
    .select("supplier_id")
    .min("product_price")
    .max("product_price")
    .avg("product_price")
    .groupBy("supplier_id");
}

// LIST TOTAL WEIGH BY PRODUCT QUERY BUILDER
function listTotalWeightByProduct() {
  return knex("products")
    .select(
      "product_sku",
      "product_title",
      knex.raw(
        "sum(product_weight_in_lbs * product_quantity_in_stock) as total_weight_in_lbs"
      )
    )
    .groupBy("product_title", "product_sku");
}

module.exports = {
  list,
  read,
  listOutOfStockCount,
  listPriceSummary,
  listTotalWeightByProduct,
};