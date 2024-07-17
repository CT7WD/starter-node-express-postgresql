const suppliersService = require("./suppliers.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("supplier_name", "supplier_email");


const VALID_PROPERTIES = ["supplier_name",
  "supplier_address_line_1",
  "supplier_address_line_2",
  "supplier_city",
  "supplier_state",
  "supplier_zip",
  "supplier_phone",
  "supplier_email",
  "supplier_notes",
  "supplier_type_of_goods",
];


// Function checks whether the request body (req.body) contains a
// specified set of allowed fields.
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter( (field) => !VALID_PROPERTIES.includes(field) );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")} `,

    });
  }
  next();
}

// Add the supplierExists() validation middleware
async function supplierExists(req, res, next) {
  const supplier = await suppliersService.read(req.params.supplierId);
  if (supplier) {
    res.locals.supplier = supplier;
    return next();
  }
  next ({status: 404,
          message: `Supplier cannot be found.`
  });
  /*suppliersService
      .read(req.params.supplierId)
      .then((supplier) => {
        if (supplier) {
          res.locals.supplier = supplier;
          return next();
        }
        next({ status: 404, message: `Supplier cannot be found.` });
      })
      .catch(next);*/
}

// CREATE SUPPLIER
async function create(req,res,next) {
  const data = await suppliersService.create(req.body.data);
  res.status(201).json({ data });
  /*suppliersService
      .create(req.body.data)
      .then((data) => res.status(201).json({data}))
      .catch(next);*/
}


// UPDATE SUPPLIER
async function update(req, res, next) {
  const updatedSupplier = {
    ...req.body.data,
    supplier_id: res.locals.supplier.supplier_id
  };
  const data = await suppliersService.update(updatedSupplier);
  res.json({ data });
 /* const updatedSupplier = {
    ...req.body.data,
    supplier_id: res.locals.supplier.supplier_id,
  };
  suppliersService
      .update(updatedSupplier)
      .then((data) => res.json({ data }))
      .catch(next);*/
}

//DELETE (DESTROY) SUPPLIER
async function destroy(req, res, next) {
  const { supplier } = res.locals;
  await suppliersService.delete(supplier.supplier_id);
  res.sendStatus(204);
  /*suppliersService
      .delete(res.locals.supplier.supplier_id)
      .then(() => res.sendStatus(204))
      .catch(next);*/
}


  module.exports = {
    create: [hasOnlyValidProperties, hasRequiredProperties, create],
    update: [supplierExists, hasOnlyValidProperties, hasRequiredProperties, update],
    delete: [supplierExists, destroy],
};