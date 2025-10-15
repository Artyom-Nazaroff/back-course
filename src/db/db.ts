import type { TCourseViewModel } from "../models/index.js";

export interface TDb {
	courses: TCourseViewModel[];
}

export const db: TDb = {
	courses: [
		{ id: 1, title: 'front-end', studentsAmount: 10 },
		{ id: 2, title: 'back-end', studentsAmount: 10 },
		{ id: 3, title: 'design', studentsAmount: 10 },
		{ id: 4, title: 'devops', studentsAmount: 10 },
	],
};
