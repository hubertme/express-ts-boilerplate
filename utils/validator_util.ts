export default class ValidatorUtil {
    /**
     * Check the payload body of a request and validate against a validator. Will check for "undefined, null, and wrong type"
     * @param body - req.body from Express
     * @param validator - a dictionary of ["key": "type]
     */
    static isValidPayload(body: {[key: string]: any}, validator: {[key: string]: string}): boolean {
        const acceptedTypes = ["number", "string", "boolean", "object"];

        if (Object.keys(body).length != Object.keys(validator).length) {
            return false;
        }

        for (const key of Object.keys(validator)) {
            const val = body[key];
            const actualType = validator[key];

            if (!acceptedTypes.includes(actualType)) {
                return false;
            } else if (val == undefined || val == null) {
                return false;
            } else if (actualType == "number") {
                // Special handling for number
                try {
                    const number = parseInt(val, 10);
                    return number != null;
                } catch (e) {
                    return false;
                }
            } else if (typeof val != actualType) {
                return false;
            }
        }

        return true;
    }
}
