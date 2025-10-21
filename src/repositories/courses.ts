import type { TCourseViewModel, TCourseUpdateModel } from '../models/index.js';
import type { TDb } from '../db/db.js';
import type { Collection } from 'mongodb';
import { client } from '../db/index.js';

export class CoursesRepository {
	private db: TDb;
	private collection: Collection<TCourseViewModel>;

	constructor(db: TDb) {
		this.db = db;
		this.collection = client
			.db('samurai-backend')
			.collection<TCourseViewModel>('courses');
	}

	private toViewModel(course: TCourseViewModel): TCourseViewModel {
		return { id: course.id, title: course.title };
	}

	async list(title: string | null = null): Promise<TCourseViewModel[]> {
		const filter = title ? { title: { $regex: title } } : {};
		const items = await this.collection
			.find(filter)
			.toArray();
		return items.map((c) => this.toViewModel(c));
	}

	async getById(id: number | string): Promise<TCourseViewModel | null> {
		const product = await this.collection.findOne({ id: +id });
		return product ?? null;
	}

	async create(title: string): Promise<TCourseViewModel> {
		const created = {
			id: +new Date(),
			title,
			studentsAmount: 0,
		} as TCourseViewModel;

		await this.collection.insertOne(created);

		return this.toViewModel(created);
	}

	async update(
		id: number | string,
		data: TCourseUpdateModel
	): Promise<boolean> {
			const result = await this.collection.updateOne(
				{ id: +id },
				{ $set: { title: data.title } }
			);

		return !!result.matchedCount;
	}

	async delete(id: number | string): Promise<boolean> {
		const result = await this.collection.deleteOne({ id: +id });

		return !!result.deletedCount;
	}
}
