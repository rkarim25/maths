// Numbered "papers" with stable ids so each tracks its own score and can be
// picked in the parent manual-score dropdown:
//   • 5 assessments per stage  → id `assessment-s<stage>-<n>`
//   • 5 mock 11+ exams          → id `mock-<n>`

export const ASSESSMENTS_PER_STAGE = 5;
export const MOCKS_COUNT = 5;

export function getStageAssessments(stage) {
  return Array.from({ length: ASSESSMENTS_PER_STAGE }, (_, i) => ({
    id: `assessment-s${stage}-${i + 1}`, stage, n: i + 1, title: `Assessment ${i + 1}`
  }));
}

export function getMockPapers() {
  return Array.from({ length: MOCKS_COUNT }, (_, i) => ({
    id: `mock-${i + 1}`, n: i + 1, title: `Mock Paper ${i + 1}`
  }));
}
