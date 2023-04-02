import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import pick from '../../utils/pick';

const validate =
  (schema: Record<string, any>) =>
    (req: Request, _res: Response, next: NextFunction): void => {
      const validSchema = pick(schema, ['params', 'query', 'body']);
      const object = pick(req, Object.keys(validSchema));
      const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);

      if (error) {
        const errorMessage = error.details.map((details) => details.message.replace(/"(.+)"/g, '$1')).join(', ');
        _res.send({
          message: errorMessage
        }).status(422)
        return;
      }
      Object.assign(req, value);
      return next();
    };

export default validate;
