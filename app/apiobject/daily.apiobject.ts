
export interface DailyNoteApiObject {
	id: string;
	title: string;
	content: string;
	createAt: string;
	updatedAt: string;
}

export interface DailyNotePostApiObject {
	title: string;
	content: string;
}