import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.QUERY]: Joi.object().keys({
    city: Joi.string().required(),
    uf: Joi.string().required(),
    items: Joi.alternatives().try(Joi.string(), Joi.array()).required(),
  }),
});
