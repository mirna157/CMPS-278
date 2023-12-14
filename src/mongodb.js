const mongoose = require("mongoose");
mongoose.set('strictQuery', false);


mongoose.connect("mongodb://localhost:27017/LOGSIGN")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the application if the connection fails
  });

const LogInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const collection = mongoose.model("Collection2", LogInSchema);

module.exports = collection;

