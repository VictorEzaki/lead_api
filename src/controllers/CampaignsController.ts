import { Handler } from "express";
import { prisma } from "../database";
import { CreateCapaignsRequestSchema, UpdateCapaignsRequestSchema } from "./schemas/CampaignsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class CampaignsController {
    index: Handler = async (req, res, next) => {
        try {
            const campaigns = await prisma.campaign.findMany()
            res.status(200).json(campaigns)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const { name, description, startDate, endDate } = req.body
            const campaign = CreateCapaignsRequestSchema.parse({ name, description, startDate, endDate })

            const newCampaign = await prisma.campaign.create({ data: campaign })

            res.status(201).json(newCampaign)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const { id } = req.params

            const campaign = await prisma.campaign.findUnique({
                where: { id: +id },
                include: {
                    leads: true
                }
            })
            if (!campaign) {
                throw new HttpError(404, 'Campaign not found!')
            }

            res.status(200).json(campaign)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const { id } = req.params
            const { name, description, startDate, endDate } = req.body
            const campaign = UpdateCapaignsRequestSchema.parse({ name, description, startDate, endDate })

            const campaignExists = await prisma.campaign.findUnique({
                where: { id: +id }
            })
            if (!campaignExists) {
                throw new HttpError(404, 'Campaign not found!')
            }

            const updatedCampaign = await prisma.campaign.update({
                data: campaign,
                where: {
                    id: +id
                },
                include: {
                    leads: true
                }
            })
            if (!updatedCampaign) {
                throw new HttpError(404, 'Campaign not found!')
            }

            res.status(200).json(updatedCampaign)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const { id } = req.params

            const campaignExists = await prisma.campaign.findUnique({
                where: { id: +id }
            })
            if (!campaignExists) {
                throw new HttpError(404, 'Campaign not found!')
            }

            await prisma.campaign.delete({ where: { id: +id } })

            res.status(200).json({ message: 'Deleted successfuly!' })
        } catch (error) {
            next(error)
        }
    }
}