import Joi from 'joi'

export const routeSchema = Joi.object({
    userId: Joi.number().required(),
    startLocation: Joi.string().required(),
    endLocation: Joi.string().required(),
    estimatedDuration: Joi.number().required(),
    distance: Joi.number().required(),
    totalAmount: Joi.number().required(),
    startLatitude: Joi.number().required(),
    startLongitude: Joi.number().required(),
    endLatitude: Joi.number().required(),
    endLongitude: Joi.number().required()
});