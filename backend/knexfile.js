// Update with your config settings.
require('dotenv').config({silent: true});
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/finance_tracker'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }

};
