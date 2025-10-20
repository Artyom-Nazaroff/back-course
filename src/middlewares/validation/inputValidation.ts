import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const titleValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(400).send({ errors: result.array() });
	} else {
		next();
	}
};
