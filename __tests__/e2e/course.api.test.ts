import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src';

describe('GET /courses', () => {
	it('returns 200 and empty array', async () => {
		await request(app).get('/courses').expect(200, []);
	});
});
