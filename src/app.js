const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const jobsRoutes = require("./routes/jobs.routes");
const ordersRoutes = require("./routes/order.routes");
const usersRoutes = require("./routes/users.routes");
const ocrRoutes = require("./routes/ocr.routes");
const problemRoutes = require("./routes/problems.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const paymentsRoutes = require("./routes/payments.routes");
const handsonRoutes = require("./routes/handsOn.routes");
const adminRoutes = require("./routes/admin.routes");
const supportRoutes = require("./routes/support.routes");
const ticketsRoutes = require("./routes/tickets.routes");

const { globalErrorHandler } = require("./utils/error.handler");

const app = express();

// Middleware para webhook Stripe (usando express.raw() apenas nessa rota)
app.use("/payments/webhook", express.raw({ type: "application/json" }));

// Outros middlewares para o restante das rotas

//enable cors for https://hml-limpfy.vercel.app limpfy.vercel.app

app.use(express.json({ limit: "10mb" })); // Definindo limite para o body

app.use(
  cors({
    origin: [
      "https://hml-limpfy.vercel.app",
      "https://limpfy.vercel.app",
      "https://limpfybackend-ucdppc9d.b4a.run",
      "http://localhost:3000",
      "http://localhost:8080",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middlewares para servir arquivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/models", express.static(path.join(__dirname, "public/models")));

// Rotas
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/support", supportRoutes);
app.use("/orders", ordersRoutes);
app.use("/jobs", jobsRoutes);
app.use("/users", usersRoutes);
app.use("/ocr", ocrRoutes);
app.use("/payments", paymentsRoutes);
app.use("/problems", require("./routes/problems.routes"), problemRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/handson", require("./routes/handsOn.routes"), handsonRoutes);
app.use("/tickets", ticketsRoutes);

// Manipulador de erros global
app.use(globalErrorHandler);

module.exports = app;
