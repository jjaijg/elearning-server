const fastify = require("fastify");
const mongoose = require("mongoose");
const multer = require("fastify-multer");
const app = fastify({ logger: true });
const path = require("path");
// app.register(require("fastify-static"), {
//   root: path.join(__dirname, ""),
//   prefix: "/uploads/", // optional: default '/'
// });
app.register(require("fastify-cors"), {
  exposedHeaders: "Content-Disposition",
  // origin: "*",
});
app.register(require("fastify-env"), {
  dotenv: true,
  schema: {
    type: "object",
    properties: {
      MONGODB: {
        type: "string",
        default: "",
      },
    },
    required: ["MONGODB"],
  },
});

app.register(multer.contentParser);
app.register(require("fastify-swagger"), {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: {
      title: "E-learning APIs",
    },
  },
});

// app.register(, {

//   prefix: "/api/v1",
// });
require("./src/routes/departments.routes")(app);
require("./src/routes/semesters.routes")(app);
require("./src/routes/papers.routes")(app);

app.after((error) =>
  error ? console.log(error) : "Plugin loaded successfully"
);
app.ready((error) =>
  error ? console.log(error) : "All plugins loaded successfully"
);

const startDB = () => {
  try {
    mongoose
      .connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("mongoose connected..."));
  } catch (e) {
    app.log.error(e);
    console.error(e);
  }
};
const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || "localhost";
    await app.listen(PORT, HOST);
    startDB();
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
