import { Handler } from "express";
import { prisma } from "../database";
import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from "./schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class GroupsController {
    index: Handler = async (req, res, next) => {
        try {
            const groups = await prisma.group.findMany()
            res.json(groups)
        } catch (error) {
            next(error)
        }
    }

    create: Handler = async (req, res, next) => {
        try {
            const body = CreateGroupRequestSchema.parse(req.body)
            const newGroup = await prisma.group.create({ data: body })

            res.status(201).json(newGroup)
        } catch (error) {
            next(error)
        }
    }

    show: Handler = async (req, res, next) => {
        try {
            const { id } = req.params

            const group = await prisma.group.findUnique({
                where: { id: +id },
                include: { leads: true }
            })

            if (!group) {
                throw new HttpError(404, 'Group not found!')
            }

            res.status(200).json(group)
        } catch (error) {
            next(error)
        }
    }

    update: Handler = async (req, res, next) => {
        try {
            const { id } = req.params
            const { name, description } = req.body
            const body = UpdateGroupRequestSchema.parse({ name, description})
            
            const groupExists = await prisma.group.findUnique({
                where: {
                    id: +id
                }
            })
            if (!groupExists) {
                throw new HttpError(404, 'Group not found!')
            }

            const updatedGroup = await prisma.group.update({
                data: body,
                where: {
                    id: +id
                }
            })

            res.json(updatedGroup)
        } catch (error) {
            next(error)
        }
    }

    delete: Handler = async (req, res, next) => {
        try {
            const { id } = req.params
            
            const groupExists = await prisma.group.findUnique({
                where: {
                    id: +id
                }
            })
            if (!groupExists) {
                throw new HttpError(404, 'Group not found!')
            }

            await prisma.group.delete({
                where: {
                    id: +id
                }
            })

            res.status(200).json({ message: 'Deleted successfuly!' })
        } catch (error) {
            next(error)
        }
    }
}