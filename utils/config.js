const JWT_SECRET = process.env.SECRET_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "devOnlyDefaultSecret";

module.exports = {
  JWT_SECRET,
};
