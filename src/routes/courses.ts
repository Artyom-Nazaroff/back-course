import express, { type Response } from 'express';
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

const getCourseViewModel = (course: TCourseViewModel): TCourseViewModel => {
	return {
		id: course.id,
		title: course.title,
	};
};

export const addCoursesRouter = (db: TDb) => {
	const router = express.Router();

	router.get(
		'/',
		(
			req: TRequestWithQuery<TCoursesQueryModel>,
			res: Response<TCourseViewModel[]>
		) => {
			let foundCourses = db.courses;
			if (req.query.title) {
				foundCourses = foundCourses.filter(
					(el) => el.title.indexOf(req.query.title as string) > -1
				);
			}
			res.json(foundCourses.map(getCourseViewModel));
		}
	);
	router.get(
		'/:id',
		(req: TRequestWithParams<TURIParamsCourseIdModel>, res: Response) => {
			const foundCourse = db.courses.find((el) => el.id === +req.params.id);

			if (!foundCourse) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
				return;
			}

			res.json(getCourseViewModel(foundCourse));
		}
	);
	router.post(
		'/',
		(
			req: TRequestWithBody<TCourseCreateModel>,
			res: Response<TCourseViewModel>
		) => {
			if (!req.body.title.trim()) {
				res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
				return;
			}

			const createdCourse: TCourseViewModel = {
				id: +new Date(),
				title: req.body.title,
				studentsAmount: 0,
			};
			db.courses.push(createdCourse);
			res.status(HTTP_STATUSES.CREATED_201).json(
				getCourseViewModel(createdCourse)
			);
		}
	);
	router.delete(
		'/:id',
		(req: TRequestWithParams<TURIParamsCourseIdModel>, res) => {
			db.courses = db.courses.filter((el) => el.id !== +req.params.id);

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
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

			const foundCourse = db.courses.find((el) => el.id === +req.params.id);

			if (!foundCourse) {
				res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
				return;
			}

			foundCourse.title = req.body.title;

			res.json(getCourseViewModel(foundCourse));
		}
	);

	return router;
};
