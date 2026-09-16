import React from 'react';
import { FeedbackState } from '../../data/types';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface FeedbackBannerProps {
  feedback: FeedbackState | null;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className={`feedback-banner ${feedback.type}`}>
      {feedback.type === 'correct' && <CheckCircle2 size={20} />}
      {feedback.type === 'wrong' && <AlertTriangle size={20} />}
      {feedback.type === 'info' && <Info size={20} />}
      <div>
        <strong>{feedback.message}</strong>
        {feedback.subMessage && <p style={{ fontSize: '0.85rem', marginTop: 2 }}>{feedback.subMessage}</p>}
      </div>
    </div>
  );
};
