const mongoose = require("mongoose");
const express = require("express");
const app = express();

const superadminRoutes = require("./routes/superadmin/auth");
const adminRoutes = require("./routes/admin/auth");




mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
var connect = mongoose.connection.once('open', function () {
    console.log("Database Connected")
}).on('error', function (error) {
    console.log(error)
})

app.use(express.json());
app.use("/api", superadminRoutes);
app.use("/api", adminRoutes);


app.listen(80, () => {
    console.log("server is running")
})
