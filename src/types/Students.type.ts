export type TStudent = {
  id?: number,
  firstName: string,
  lastName: string,
  instrument: string,
  durationMinutes: number,
  dayOfLesson?: string,
  startOfLesson?: string,
  endOfLesson?: string
  archive: boolean;
  location: string;
}