const whitelist = ['https://menu-translation-frontend.herokuapp.com/', 'http://localhost:3500'];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log('CORS Allowed: ', origin);
      callback(null, true);
    } else {
      console.log('CORS Denied: ', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
