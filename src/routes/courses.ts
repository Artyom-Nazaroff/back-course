import { type Response, Router } from 'express';
import type {
	TRequestWithBody,
	TRequestWithParams,
	TRequestWithParamsAndBody,
	TRequestWithQuery,
} from '../types/types.js';
import { HTTP_STATUSES } from '../constants/index.js';
import { type TDb } from '../db/db.js';
import type {
	TCourseCreateModel,
	TCoursesQueryModel,
	TCourseUpdateModel,
	TCourseViewModel,
	TURIParamsCourseIdModel,
} from '../models/index.js';
import { CoursesRepository } from '../repositories/courses.js';
import { body, validationResult } from 'express-validator';
import { titleValidationMiddleware } from '../middlewares/validation/inputValidation.js';

const titleValidation = body('title')
	.trim()
	.isLength({ min: 3, max: 100 })
	.withMessage('Title length should be from 3 to 100 symbols');

export const addCoursesRouter = (db: TDb) => {
	const router = Router();
	const repo = new CoursesRepository(db);

	router.get(
		'/',
		(
			req: TRequestWithQuery<TCoursesQueryModel>,
			res: Response<TCourseViewModel[]>
		) => {
			const title = req.query.title ? req.query.title.toString() : null;
			const foundCourses = repo.list(title);
			res.json(foundCourses);
		}
	);
	router.get(
		'/:id',
		(req: TRequestWithParams<TURIParamsCourseIdModel>, res: Response) => {
			const foundCourse = repo.getById(req.params.id);

			if (!foundCourse) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
				return;
			}
			res.json(foundCourse);
		}
	);
	router.post(
		'/',
		titleValidation,
		titleValidationMiddleware,
		async (
			req: TRequestWithBody<TCourseCreateModel>,
			res: Response<TCourseViewModel>
		) => {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				res.send({ errors: result.array() });
				return;
			}

			const createdCourse = await repo.create(req.body.title);
			res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
		}
	);
	router.delete(
		'/:id',
		(req: TRequestWithParams<TURIParamsCourseIdModel>, res) => {
			const isDeleted = repo.delete(req.params.id);
			if (isDeleted) res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
			else res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		}
	);
	router.put(
		'/:id',
		(
			req: TRequestWithParamsAndBody<
				TURIParamsCourseIdModel,
				TCourseUpdateModel
			>,
			res: Response<TCourseViewModel>
		) => {
			if (!req.body.title.trim()) {
				res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
				return;
			}

			const updated = { title: req.body.title };
			const foundCourse = repo.update(req.params.id, updated);

			if (!foundCourse) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
				return;
			}
			res.json(foundCourse);
		}
	);

	return router;
};
