import { fileURLToPath } from "node:url"
import path from "node:path"
import express from "express"
import morgan from "morgan"
import homeworkRouter from "./routes/homeworkRouter.js"
import pdfRouter from "./routes/pdfRouter.js"
import compression from "compression"
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "../public")))
app.use(morgan("dev"))

app.use(compression())

// ROUTES
app.get("/", (_, res) => {
  res.redirect("https://eleno.net")
})

app.use("/homework", homeworkRouter)

app.get("*", (_, res) => {
  res.status(404).render("error")
})

export default app
