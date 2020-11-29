import {NextFunction, Request, Response} from "express";

export function logRequest(req: Request, res: Response, next: NextFunction) {
    let ipAddress = req.ip;
    if (!ipAddress || ipAddress === '::1') {
        ipAddress = 'localhost';
    }

    // if (blacklistedIPs.indexOf(ipAddress) === -1) {
    //
    // } else {
    //   console.log('Request from blacklisted IP:', ipAddress);
    //   res.status(403).json({code: ErrorCodes.IP_BLACKLISTED, message: 'This IP has been blocked'});
    // }

    console.log();
    console.log("***** Request log begins *****");
    console.log('IP Address:', ipAddress);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Timestamp:", new Date().toISOString());
    console.log("***** Request log ends *****");
    console.log();

    next();
}
