export interface DailyNoteDto {
  id: string;
  title: string;
  content: string;
  createAt: string;
  updatedAt: string;
}

export interface DailyNotePostDto {
  title: string;
  content: string;
}