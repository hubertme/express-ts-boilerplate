import { Request, Response } from 'express';
import ServerResponse from '../../responses/server_response'; // Path relative to src/index
import path from 'path';
import os from 'os';
import { validationResult } from 'express-validator'; // body, query will be used in router
import IndexBiz from './index_biz'; // Corrected import path

// Renamed to IndexController as per user's preference, and export it.
export class IndexController {
    // Handles the root request and serves the index.html page.
    public getRoot(req: Request, res: Response): void {
        // Path from src/index/ to project_root/public/index.html
        res.sendFile(path.join(__dirname, '../../public', 'index.html'));
    }

    // Handles the health check request.
    public getHealth(req: Request, res: Response): void {
        const healthStatus = {
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            platform: os.platform(),
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            loadavg: os.loadavg(),
        };
        res.status(200).json(ServerResponse.Success(healthStatus, 'API is healthy'));
    }

    // Handles the validation example request.
    public postValidateExample(req: Request, res: Response): void {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(ServerResponse.Error(400, 'Validation failed', { errors: errors.array() }));
            return;
        }
        res.status(200).json(ServerResponse.Success({ body: req.body, query: req.query }, 'Validation successful'));
    }

    // Handles the sum of two digits request.
    public postSumTwoDigits(req: Request, res: Response): void {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(ServerResponse.Error(400, 'Validation failed', { errors: errors.array() }));
            return;
        }

        const { a, b } = req.body; // Assumes a and b are numbers after validation
        const sum = IndexBiz.sumTwoDigits(a, b);

        res.status(200).json(ServerResponse.Success({ result: sum }, 'Sum calculated successfully'));
    }
} 