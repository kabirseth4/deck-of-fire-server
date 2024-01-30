const app = require("./server/app");

const { PORT: port } = process.env;

app.listen(port, () => {
  console.log("Server running on port " + port);
});
