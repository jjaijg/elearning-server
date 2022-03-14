const fastify = require("fastify");
const mongoose = require("mongoose");
const multer = require("fastify-multer");
const app = fastify({ logger: true });
// const path = require("path");
const ROUTE_CONFIG = { prefix: "/api/v1" };

app.register(require("fastify-cors"), {
  exposedHeaders: "Content-Disposition",
  // origin: "*",
});
app.register(require("fastify-env"), {
  dotenv: true,
  schema: {
    type: "object",
    // properties: {
    //   MONGODB: {
    //     type: "string",
    //     default: "",
    //   },
    //   SERVER_URL: {
    //     type: "string",
    //     default: "",
    //   },
    //   ALLOWED_FILE_SIZE_IN_MB: {
    //     type: "number",
    //     default: 1,
    //   },
    // },
    required: [
      "MONGODB",
      "SERVER_URL",
      "SUPPORTED_TYPES",
      "ALLOWED_FILE_SIZE_IN_MB",
      "JWT_SECRET",
    ],
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

app.register(require("./src/routes/users.routes"), ROUTE_CONFIG);
app.register(require("./src/routes/departments.routes"), ROUTE_CONFIG);
app.register(require("./src/routes/semesters.routes"), ROUTE_CONFIG);
app.register(require("./src/routes/papers.routes"), ROUTE_CONFIG);

// app.register();
// console.log(process.env);

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
