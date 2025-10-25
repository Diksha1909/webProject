const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  }
});

const SareeSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Item name is required"],
    validate: {
      validator: function(v) {
        // Simple check: non-empty string
        return typeof v === "string" && v.trim().length > 0;
      },
      message: props => `Invalid itemName: "${props.value}"`
    }
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    // you can add range checks if you want
  },
  image: {
    type: ImageSchema,
    required: true
  },
  type: {
    type: String,
    required: [true, "Type is required"],
  }
});

module.exports = mongoose.model("Saree", SareeSchema);
