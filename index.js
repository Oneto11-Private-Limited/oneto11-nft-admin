const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("express-flash-messages");
const session = require("express-session");
const app = express();
const http = require("http").createServer(app);
const conf = require("./config");

for (var key in conf.GLOBAL_CONFIG) {
    global[key] = conf.GLOBAL_CONFIG[key];
}

const mongoose = require("mongoose");

mongoose
    .connect(conf.MONGODB_CONNECTION_STRING, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Connected to MongoDB at ", conf.MONGODB_CONNECTION_STRING);

        return mongoose.connection;
    })
    .catch((err) => console.log(`Database connection error: ${err}`));

app.disable("view cache");
app.use(
    session({
        secret: "asf08389h9o8&*(BHJG&*U*B*&GFF&^&gf78",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
);

app.use(flash());
app.set("view engine", "ejs");
app.locals.moment = require("moment");
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "src/views"));

require("./src/routes/main")(app);
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err.statusCode) {
        res.status(err.statusCode);
    }
    res.send("<h1>" + err + "</h1>");
});

http.listen(process.env.PORT || conf.PORT, () => {
    console.log(`server is started on ${conf.PORT}`);
});