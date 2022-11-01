import type { CaseConverterEnum } from '../constants/case-converter-enum.js';

export interface DefaultCaseConverter {
  readonly contentCase: CaseConverterEnum;
  readonly outputPathCase: CaseConverterEnum;
}
