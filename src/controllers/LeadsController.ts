import { Handler } from "express";
import { prisma } from "../database";
import { CreateLeadRequestSchema, GetLeadsRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "@prisma/client";

export class LeadsController {
    index: Handler = async (req, res, next) => {
        try {
            const query = GetLeadsRequestSchema.parse(req.query)
            const { page = '1', pageSize = '10', name, status, sortBy = 'name', order = 'asc' } = query

            const pageNumber = Number(page)
            const pageSizeNumber = Number(pageSize)

            const where: Prisma.LeadWhereInput = {}

            if (name) where.name = { contains: name, mode: 'insensitive' }
            if (status) where.status = status

            const leads = await prisma.lead.findMany({
                where,
                skip: (pageNumber - 1) * pageSizeNumber,
                take: pageSizeNumber,
                orderBy: { [sortBy]: order }
            })

            const total = await prisma.lead.count({ where })

            res.status(200).json({
                data: leads,
                meta: {
                    page: pageNumber,
                    pageSize: pageSizeNumber,
                    total,
                    totalPages: Math.ceil(total / pageSizeNumber)
                }
            })
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateLeadRequestSchema.parse(req.body)
            const newLead = await prisma.lead.create({
                data: body
            })
            res.status(201).json(newLead)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const lead = await prisma.lead.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    groups: true,
                    campaigns: true
                }
            })

            if (!lead) {
                throw new HttpError(404, 'Lead not found!')
            }

            res.status(200).json(lead)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const { id } = req.params
            const { name, email, phone, status } = req.body
            const body = UpdateLeadRequestSchema.parse({ name, email, phone, status })

            const updatedLead = await prisma.lead.findUnique({ where: {
                id: +id
            }})
            if (!updatedLead) {
                throw new HttpError(404, 'Lead not found!')
            }

            await prisma.lead.update({
                data: body,
                where: {
                    id: +id
                }
            })

            res.status(200).json(updatedLead)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const { id } = req.params
            const deletedLead = await prisma.lead.findUnique({ where: { id: +id } })

            if (!deletedLead) {
                throw new HttpError(404, 'Lead not found!')
            }

            await prisma.lead.delete({ where: { id: +id } })

            res.status(200).json({ message: 'Deleted successfuly' })
        } catch (error) {
            next(error)
        }
    }
}