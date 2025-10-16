import type { TCourseViewModel, TCourseUpdateModel } from '../models/index.js';
import type { TDb } from '../db/db.js';

export class CoursesRepository {
	private db: TDb;

	constructor(db: TDb) {
		this.db = db;
	}

	private toViewModel(course: TCourseViewModel): TCourseViewModel {
		return { id: course.id, title: course.title };
	}

	list(title: string | null = null): TCourseViewModel[] {
		let items = this.db.courses;
		if (title) items = items.filter((c) => c.title.includes(title));
		return items.map((c) => this.toViewModel(c));
	}

	getById(id: number | string): TCourseViewModel | null {
		const c = this.db.courses.find((x) => x.id === +id);
		return c ? this.toViewModel(c) : null;
	}

	create(title: string): TCourseViewModel {
		const created = {
			id: +new Date(),
			title,
			studentsAmount: 0,
		} as TCourseViewModel;
		this.db.courses.push(created);
		return this.toViewModel(created);
	}

	update(
		id: number | string,
		data: TCourseUpdateModel
	): TCourseViewModel | null {
		const c = this.db.courses.find((x) => x.id === +id);
		if (!c) return null;
		c.title = data.title;
		return this.toViewModel(c);
	}

	delete(id: number | string): boolean {
		const before = this.db.courses.length;
		this.db.courses = this.db.courses.filter((x) => x.id !== +id);
		return this.db.courses.length < before;
	}
}
