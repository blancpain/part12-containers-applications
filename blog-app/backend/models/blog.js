const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  comments: [
    {
      type: String,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// below transform option is applied every time we
// convert a document to JSON (i.e. in tests or in our routes responses)
// it's not automatically applied on all documents in the DB...

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();

    delete returnedObject._id;
    delete returnedObject.__v;
    returnedObject.likes ??= 0;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
