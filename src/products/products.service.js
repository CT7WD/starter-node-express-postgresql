const knex = require("../db/connection");

// GET a list of all products
function list() {
  return knex("products").select("*");
}

// GET a specific product, based on its ID
// SELECT all cols from PRODUCTS table where product_id col matches passed in arg.
// first() returns first row in table.
function read(productId) {
  return knex("product").select("*").where({ product_id: productId }).first()
}


module.exports = {
  list,
  read
};