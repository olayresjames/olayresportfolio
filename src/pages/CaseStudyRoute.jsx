import CaseStudyPage from './CaseStudyPage';
import { caseStudies } from '../data/caseStudyData';

export default function CaseStudyRoute({ studyKey }) {
  return <CaseStudyPage study={caseStudies[studyKey]} />;
}
