import cors from "cors";
import express from "express";
import { router } from "./routes/routes";
import { errorHandlerMiddleware } from "./middlewares/error-handler";

const app = express();
app.use(express.json())

app.use('/api', router)
app.use(errorHandlerMiddleware)

app.use(cors())

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor iniciado!\nRodando em http://localhost:${PORT}`)
})