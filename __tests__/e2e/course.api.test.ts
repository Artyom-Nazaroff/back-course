import { beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src';
import { HTTP_STATUSES } from '../../src';

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
		const response = await request(app)
			.post('/courses')
			.send({ title: 'new course' })
			.expect(HTTP_STATUSES.CREATED_201);

		createdCourse = response.body;

		expect(createdCourse).toEqual({
			id: expect.any(Number),
			title: 'new course',
		});
	});
	it('should not update the course', async () => {
		const response = await request(app)
			.put('/courses/' + createdCourse.id)
			.send({ title: '' })
			.expect(HTTP_STATUSES.BAD_REQUEST_400);
	});
});
