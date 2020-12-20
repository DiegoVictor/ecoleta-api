import { Request, Response, NextFunction } from 'express';

export default (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const { originalUrl } = request;
  const host_url = `${process.env.APP_URL}:${process.env.APP_PORT}`;

  request.host_url = host_url;
  request.current_url = `${host_url + originalUrl.split('?').shift()}`;

  next();
};
