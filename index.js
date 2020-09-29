const express = require("express");
const app = express();
let port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello world 2");
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})