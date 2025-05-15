// This file is deprecated as CORS handling is now managed by the security middleware
// Keeping this file for backward compatibility but marking it as deprecated
import { Request, Response, NextFunction } from 'express';

/**
 * @deprecated Use security middleware's CORS handling instead
 */
export function allowOptions(req: Request, res: Response, next: NextFunction) {
    next();
}
