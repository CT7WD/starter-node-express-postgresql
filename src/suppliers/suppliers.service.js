const knex = require("../db/connection");

function create(supplier) {
    return knex("suppliers")
        .insert(supplier)
        .returning("*")
        .then((createRecords) => createRecords[0]);
}

module.exports = {
    create,
};