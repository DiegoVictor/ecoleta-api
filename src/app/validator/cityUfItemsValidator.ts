import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.QUERY]: Joi.object().keys({
    city: Joi.string().required(),
    uf: Joi.string().required(),
    items: Joi.string().required(),
  }),
});
