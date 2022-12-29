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
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(user);
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

module.exports.follow = async (req, res) => {
  if (!ObjetID.isValid(req.params.id) || !ObjetID.isValid(req.body.idToFollow))
    return res.status(400).send("ID unknown : " + req.params.id);
  // console.log("coucou");
  try {
    // add to the follower list
    const user1 = await User.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true }
    );
    // add to following list
    const user2 = await User.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true }
    );
    res.status(201).json({ user1, user2 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// unfollow
module.exports.unfollow = async (req, res) => {
  if (
    !ObjetID.isValid(req.params.id) ||
    !ObjetID.isValid(req.body.idToUnFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    const user1 = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { following: req.body.idToUnFollow },
      },
      { new: true, upsert: true }
    );
    // add to following list
    const user2 = await User.findByIdAndUpdate(
      req.body.idToUnFollow,
      {
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true }
    );
    res.status(201).json({ user1, user2 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};