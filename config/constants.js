const refreshTokenMaxAge = 24 * 60 * 60 * 1000;
const refreshTokenExpiresIn = '1d';
const accessTokenExpiresIn = '30m';
// TODO move into env
module.exports = {
  refreshTokenMaxAge,
  refreshTokenExpiresIn,
  accessTokenExpiresIn,
};
