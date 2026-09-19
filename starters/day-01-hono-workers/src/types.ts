// DBの属性(colomn)
export type StudyLogRow = {
  id: number;
  technology: string;
  minutes: number;
  note: string;
  learned_on: string;
  created_at: string;
};

// API レスポンス用の型（キャメルケース）
export type StudyLog = {
  id: number;
  technology: string;
  minutes: number;
  note: string;
  learnedOn: string;
  createdAt: string;
};
