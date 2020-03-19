const Contact = require("../models/Contact");

module.exports.create = (req, res) => {
  const body = req.body;
  console.log(req.user._id);
  const contact = new Contact(body);
  contact.user = req.user._id;
  console.log(contact);
  contact
    .save()
    .then(contact => {
      res.json(contact);
    })
    .catch(err => {
      res.json(err);
    });
};
module.exports.list = (req, res) => {
  Contact.find({ user: req.user._id })
    .then(contacts => {
      //  pagination part
      console.log("hir", req.query.page);
      if (req.query.page || req.query.limit) {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let result = contacts.slice(startIndex, endIndex);

        res.json(result);
      } else {
        res.json(contacts);
      }
    })
    .catch(err => res.json(err));
};

module.exports.update = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Contact.findOneAndUpdate({ user: req.user._id, _id: id }, body, {
    new: true,
    runValidators: true
  })
    .then(contact => {
      if (contact) {
        res.json(contact);
      } else {
        res.json({});
      }
    })
    .catch(err => res.json(err));
};
module.exports.destroy = (req, res) => {
  const id = req.params.id;
  Contact.findOneAndDelete({ user: req.user._id, _id: id })
    .then(contact => {
      if (contact) {
        res.json(contact);
      } else {
        res.json({});
      }
    })
    .catch(err => {
      res.json(err);
    });
};
