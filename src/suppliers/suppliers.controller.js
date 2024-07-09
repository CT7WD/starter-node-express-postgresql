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


// Create supplier
function create(req,res,next) {
  suppliersService
      .create(req.body.data)
      .then((data) => res.stat(201).json({data}))
      .catch(next);
}



  module.exports = {
     create: [hasOnlyValidProperties, hasRequiredProperties, create],
};