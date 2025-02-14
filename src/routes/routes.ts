import { Router } from "express";
import { HttpError } from "../errors/HttpError";

const router = Router()

router.get('/test', async (req, res, next) => {
    try {
        throw new HttpError(401, "Não autorizado!")
        res.json({ message: "ok!" })
    } catch (error) {
        next(error)
    }
})

export { router }