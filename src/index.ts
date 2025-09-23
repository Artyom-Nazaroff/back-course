import express from 'express';
const app = express();
const port = 3003;

// Middleware для парсинга JSON
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Простой маршрут для проверки
app.get('/', (req, res) => {
	const a = 4;
	if (a > 5) {
		res.send('Привет, мир!');
	} else res.send('Привет, мир!!!!');
});

// Обработка ошибок
app.use((err: any, req: any, res: any, next: any) => {
	console.error(err.stack);
	res.status(500).send('Что-то пошло не так!');
});

app.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`);
});
