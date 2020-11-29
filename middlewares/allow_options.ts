import { Request, Response, NextFunction } from 'express';

export function allowOptions(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
        res.status(204).send({});
    } else {
        next();
    }
}
