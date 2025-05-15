import { NextFunction, Request, Response } from "express";
import { logger } from '../src/utils/logger';

export function logRequest(req: Request, res: Response, next: NextFunction) {
    const ipAddress = req.ip === '::1' ? 'localhost' : req.ip;

    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: ipAddress,
        timestamp: new Date().toISOString()
    });

    next();
}
