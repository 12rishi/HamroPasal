import { Request, Response } from "express";

const handleError = (fn: Function) => {
  return (req: Request, res: Response) => {
    fn(req, res).catch((err: Error) => {
      return res.status(500).json({
        message: "error has occured",
        errorMessage: err?.message,
      });
    });
  };
};
export default handleError;
