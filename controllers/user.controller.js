const User = require("../models/user.model");
const ObjetID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  //   console.log(req.params);
  if (!ObjetID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  User.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknow : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjetID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).json({ message: err });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjetID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await User.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "successfuly deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
