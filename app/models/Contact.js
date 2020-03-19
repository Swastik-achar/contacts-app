const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema;
const contactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  contact: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

contactSchema.plugin(mongoosePaginate)
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
