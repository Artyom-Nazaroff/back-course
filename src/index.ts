import express from 'express';
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

const db = {
	courses: [
		{ id: 1, title: 'front-end' },
		{ id: 2, title: 'back-end' },
		{ id: 3, title: 'design' },
		{ id: 4, title: 'devops' },
	],
};

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('Hello there!');
});
app.get('/courses', (req, res) => {
	let foundCourses = db.courses;
	if (req.query.title) {
		foundCourses = foundCourses.filter(
			(el) => el.title.indexOf(req.query.title as string) > -1
		);
	}
	res.json(foundCourses);
});
app.get('/courses/:id', (req, res) => {
	const foundCourse = db.courses.find((el) => el.id === +req.params.id);

	if (!foundCourse) {
		res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
		return;
	}

	res.json(foundCourse);
});
app.post('/courses', (req, res) => {
	if (!req.body.title.trim()) {
		res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
		return;
	}

	const createdCourse = {
		id: +new Date(),
		title: req.body.title,
	};
	db.courses.push(createdCourse);
	res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});
app.delete('/courses/:id', (req, res) => {
	db.courses = db.courses.filter((el) => el.id !== +req.params.id);

	res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put('/courses/:id', (req, res) => {
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

	res.json(foundCourse);
});

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
