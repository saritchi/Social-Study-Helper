const app = require('./app');

var port = 8080;
app.listen(port, () => {
    console.log("Server Running on Port " + port)
})