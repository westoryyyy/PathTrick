'use client';

import { HOUSE_1 } from '@/mocks/mockAICourses';
import HouseModal from './HouseModal';

type Props = {
  courseId?: string;
};

export default function LearningPanel({ courseId = 'house-1' }: Props) {
  return <HouseModal courseId={courseId} house={HOUSE_1} />;
}
