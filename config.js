module.exports = {
  JWT_SECRET: "sd54f5asd4f56as4f89w4w434",
  JWT_OPTIONS: {
    expiresIn: "1h",
    issuer: "one2iimarketplace",
  },
  SESSION_TIMEOUT_IN_SECONDS: 30000,
  USER_SOCKETS: {},
  MONGODB_CONNECTION_STRING: 'mongodb://superadmin:Virtual2010!@20.204.153.218:27017/NFT_DB?authSource=admin',
  SMTP_CONFIG: {
    host: "",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  },

  // This configuration will be public
  GLOBAL_CONFIG: {
    SRC_PATH: __dirname + "/src",
    ROOT_PATH: __dirname,
    ITEMS_PER_PAGE: 20,
    DEFAULT_TIMEZONE: "Asia/Kolkata",
    FORMAT_24HRS: "%Y-%m-%d",
    FORMAT_24HRS_WITH_TIME: "%Y-%m-%d %H:%M:%S",
    FORMAT_12HRS: "%Y-%m-%d",
    MOMENT_DATE_FORMAT: "DD/MM/YYYY",
    SITEURL: "http://localhost:3000",
    CDN: "http://localhost:3000/public",
    SITEURL: "http://localhost:3000",
    FRONTEND_URL: "http://localhost:3000",
  },
  PORT: 3000,
};
