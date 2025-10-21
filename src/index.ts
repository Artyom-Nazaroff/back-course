import { app } from './app.js';
import { runDb } from './db/index.js';
const port = process.env.PORT || 5001;

const startApp = async () => {
	await runDb();
	app.listen(port, () => {
		console.log(`Сервер запущен на порту ${port}`);
	});
};

startApp();
