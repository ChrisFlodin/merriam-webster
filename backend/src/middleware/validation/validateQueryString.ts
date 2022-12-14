import { NextFunction, Response } from "express";
import { UserRequest } from "../../types/user";
import { Api401Error } from "../../types/errors";

export const validateQueryString = ({ query }: UserRequest, _: Response, next: NextFunction) => {
  if (!query.search) throw new Api401Error("Must provide a search key");
  next();
};
