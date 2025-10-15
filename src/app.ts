import express from 'express';
import { HTTP_STATUSES } from './constants/index.js';
import { addCoursesRouter } from './routes/courses.js';
import { addTestRouter } from './routes/tests.js';
import { db } from './db/db.js';

export const app = express();

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/courses', addCoursesRouter(db));
app.use('/__test__', addTestRouter(db));

// Обработка ошибок
app.use((err: any, req: any, res: any, next: any) => {
	console.error(err.stack);
	res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).send(
		'Что-то пошло не так!'
	);
});
