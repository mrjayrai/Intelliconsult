import { Suspense } from 'react';
import MatchedConsultantsPageClient from './MatchedConsultantsPageClient';

export default function MatchedConsultantsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <MatchedConsultantsPageClient />
    </Suspense>
  );
}