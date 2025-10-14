import { beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src';
import { HTTP_STATUSES } from '../../src';
import type { CourseCreateModel } from '../../src/models/CourseCreateModel.js';
import type { CourseUpdateModel } from '../../src/models/CourseUpdateModel.js';

describe('GET /courses', () => {
	beforeAll(async () => {
		await request(app).delete('/__test__/data');
	});
	it('returns 200 and empty array', async () => {
		await request(app).get('/courses').expect(200, []);
	});
	it('returns 404 for not existed course', async () => {
		await request(app).get('/courses/99999').expect(404);
	});

	let createdCourse: any;

	it('should create a course with correct data', async () => {
		const data: CourseCreateModel = { title: 'new course' };

		const response = await request(app)
			.post('/courses')
			.send(data)
			.expect(HTTP_STATUSES.CREATED_201);

		createdCourse = response.body;

		expect(createdCourse).toEqual({
			id: expect.any(Number),
			title: 'new course',
		});
	});

	it('should not update the course', async () => {
		const data: CourseUpdateModel = { title: 'qwerty' };

		await request(app)
			.put('/courses/' + -100)
			.send(data)
			.expect(HTTP_STATUSES.NOT_FOUND_404);
	});

	it('should update the course with correct data', async () => {
    const data: CourseUpdateModel = { title: 'new title' };

		await request(app)
			.put('/courses/' + createdCourse.id)
			.send(data)
			.expect(HTTP_STATUSES.OK_200);

		await request(app)
			.get('/courses/' + createdCourse.id)
			.expect(HTTP_STATUSES.OK_200, {
				...createdCourse,
				title: data.title,
			});
	});

	it('should delete the course', async () => {
		await request(app)
			.delete('/courses/' + createdCourse.id)
			.expect(HTTP_STATUSES.NO_CONTENT_204);

		await request(app)
			.get('/courses/' + createdCourse.id)
			.expect(HTTP_STATUSES.NOT_FOUND_404);
	});
});
