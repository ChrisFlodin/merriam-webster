import { NextFunction, Request, Response } from "express";
import { Api500Error, BaseError } from "../../types/errors";
import { errIsOperational } from "../../utils/error/errorTypeCheck";

export const returnError = (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (res.headersSent || !errIsOperational(err)) {
    sendGenericError(res);
    return next();
  }

  sendErrorToClient(res, err);
  next();
};

const sendGenericError = (res: Response) => {
  const internalErr = new Api500Error();
  res.status(500).send(internalErr.getError());
};

const sendErrorToClient = (res: Response, err: BaseError) => {
  res.status(err.statusCode || 500).send(err.getError() || "Internal server error");
};
