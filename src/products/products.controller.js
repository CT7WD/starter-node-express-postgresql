const productsService = require("./products.service");


function list(req, res, next) {
  productsService
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

// Middleware to validate whether product exists or not based on ID.
// Create function named "productExists" that has access to
// request, response, & next middleware function in apps 
// request-response cycle.
function productExists(req, res, next) {
  productsService
  // ^ object that 'read' is being called on.
  // 'read' is a method of this object to retrieves a product
  // based on ID.
  .read(req.params.productId)
  // 'req.params.productId access the 'productId parameter from
  // URL of incoming request.
  .then((product) => {
    if (product) {
      res.locals.product = product;
      // ^ if 'product' exist, it is stored in
      // 'res.locals.product local variable to be readily accessed in the rest of middleware pipeline.
      return next();
      // ^ if 'product' does not exist, 'next' is called with an error.
    }
    next({ status: 404, message: `Product cannot be found.` });
  })
  .catch(next);
}

// READ
function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

module.exports = {
  read: [
    productExists,
    read
  ],
  list,
}
