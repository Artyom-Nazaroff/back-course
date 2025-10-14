import express, { type Request, type Response } from 'express';
import type {
	TRequestWithBody,
	TRequestWithParams,
	TRequestWithParamsAndBody,
	TRequestWithQuery,
} from './types/types.js';
import type { CourseCreateModel } from './models/CourseCreateModel.js';
import type { CourseUpdateModel } from './models/CourseUpdateModel.js';
import type { TCourseViewModel } from './models/CourseViewModel.js';
import type { CoursesQueryModel } from './models/GetCoursesQueryModel copy.js';
import type { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel.js';
export const app = express();
const port = process.env.PORT || 5000;

export const HTTP_STATUSES = {
	OK_200: 200,
	CREATED_201: 201,
	NO_CONTENT_204: 204,
	BAD_REQUEST_400: 400,
	NOT_FOUND_404: 404,
	INTERNAL_SERVER_ERROR_500: 500,
} as const;

const db: { courses: TCourseViewModel[] } = {
	courses: [
		{ id: 1, title: 'front-end', studentsAmount: 10 },
		{ id: 2, title: 'back-end', studentsAmount: 10 },
		{ id: 3, title: 'design', studentsAmount: 10 },
		{ id: 4, title: 'devops', studentsAmount: 10 },
	],
};

const getCourseViewModel = (course: TCourseViewModel): TCourseViewModel => {
	return {
		id: course.id,
		title: course.title,
	};
};

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
	'/courses',
	(
		req: TRequestWithQuery<CoursesQueryModel>,
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
app.get(
	'/courses/:id',
	(req: TRequestWithParams<URIParamsCourseIdModel>, res) => {
		const foundCourse = db.courses.find((el) => el.id === +req.params.id);

		if (!foundCourse) {
			res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
			return;
		}

		res.json(getCourseViewModel(foundCourse));
	}
);
app.post(
	'/courses',
	(
		req: TRequestWithBody<CourseCreateModel>,
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
app.delete(
	'/courses/:id',
	(req: TRequestWithParams<URIParamsCourseIdModel>, res) => {
		db.courses = db.courses.filter((el) => el.id !== +req.params.id);

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	}
);
app.put(
	'/courses/:id',
	(
		req: TRequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>,
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

app.delete('/__test__/data', (req, res) => {
	db.courses = [];
	res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// Обработка ошибок
app.use((err: any, req: any, res: any, next: any) => {
	console.error(err.stack);
	res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).send(
		'Что-то пошло не так!'
	);
});

app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`);
});
