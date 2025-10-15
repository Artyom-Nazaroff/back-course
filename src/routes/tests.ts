import express, { type Request, type Response } from 'express';
import { HTTP_STATUSES } from '../constants/index.js';
import type { TDb } from '../db/db.js';

export const addTestRouter = (db: TDb) => {
	const router = express.Router();

	router.delete('/data', (req: Request, res: Response) => {
		db.courses = [];
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	});

	return router;
};
