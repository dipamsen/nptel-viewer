export interface CourseInfo {
  id: string;
  courseId: string;
  title: string;
  abstract: string;
  professor: string;
  isPublic: boolean;
  duration: string;
  enrollment: string;
  registration: string;
  exam: string;
  syllabus: string;
  currentRun: number;
  institute: string;
  instituteLogo: string;
  certification: boolean;
  contentType: string;
  introVideoId: string;
  chapters: Chapter[];
  downloadables: Downloadables;
}

export interface Downloadables {
  videos: Video[];
  transcripts: Transcript[];
  audioTrack: AudioTrack[];
  books: Book[];
  assignments: Assignment[];
}

export interface Assignment {
  title: string;
  category: string;
  url: string;
}

export interface Book {
  title: string;
  url?: string;
  mimetype: string;
}

export interface AudioTrack {
  title: string;
  lesson_id: string;
  downloads: Download2[];
}

export interface Download2 {
  language: string;
  url?: any;
}

export interface Transcript {
  title: string;
  lesson_id: string;
  downloads: Download[];
}

export interface Download {
  language: string;
  url?: string;
}

export interface Video {
  title: string;
  url: string;
  mimetype: string;
  lesson_id: string;
}

export interface Chapter {
  id: number;
  name: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  name: string;
  videoId: string;
  description?: any;
}
