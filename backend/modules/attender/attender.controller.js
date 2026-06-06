// GET Attender Profile
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = {
  getProfile
};
