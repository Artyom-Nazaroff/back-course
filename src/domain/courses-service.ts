import type { TCourseViewModel, TCourseUpdateModel } from '../models/index.js';
import { CoursesRepository } from '../repositories/courses.js';

const repo = new CoursesRepository();

export class CoursesService {
	constructor() {}

	private toViewModel(course: TCourseViewModel): TCourseViewModel {
		return { id: course.id, title: course.title };
	}

	async list(title: string | null = null): Promise<TCourseViewModel[]> {
		const items = await repo.list(title);
		return items.map((c) => this.toViewModel(c));
	}

	async getById(id: number | string): Promise<TCourseViewModel | null> {
		const product = await repo.getById(id);
		return product ?? null;
	}

	async create(title: string): Promise<TCourseViewModel> {
		const created = {
			id: +new Date(),
			title,
			studentsAmount: 0,
		} as TCourseViewModel;

		await repo.create(created);

		return this.toViewModel(created);
	}

	async update(
		id: number | string,
		data: TCourseUpdateModel
	): Promise<boolean> {
		const result = await repo.update(id, data);
		return result;
	}

	async delete(id: number | string): Promise<boolean> {
		const result = await repo.delete(id);
		return result;
	}
}
