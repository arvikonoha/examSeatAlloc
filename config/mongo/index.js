const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://arvi:cbaz6173@mycluster-u2rgd.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch(err => console.log(err));

module.exports = mongoose;
