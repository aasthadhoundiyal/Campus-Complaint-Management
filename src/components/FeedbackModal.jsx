import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  ThumbsUp,
  MessageSquare
} from 'lucide-react';

const RATING_DESCRIPTIONS = {
  1: { label: 'Poor', text: 'Issue was not properly fixed or took too long', color: 'text-red-500' },
  2: { label: 'Fair', text: 'Resolution was subpar or had delays', color: 'text-amber-500' },
  3: { label: 'Good', text: 'Issue resolved satisfactorily', color: 'text-blue-500' },
  4: { label: 'Very Good', text: 'Prompt, courteous, and effective resolution', color: 'text-indigo-500' },
  5: { label: 'Excellent', text: 'Outstanding campus service and rapid turnaround!', color: 'text-emerald-600' },
};

const SUGGESTED_TAGS = [
  '⚡ Fast Turnaround',
  '🛠️ Thorough Fix',
  '👨‍💼 Polite & Professional',
  '📢 Clear Communication',
  '🔧 Replaced Hardware',
  '🔄 Needs Minor Follow-up',
];

export default function FeedbackModal({ complaint, onClose, onSubmitFeedback, user }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comments, setComments] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!complaint) return null;

  const currentScore = hoverRating || rating;
  const ratingInfo = RATING_DESCRIPTIONS[currentScore];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating from 1 to 5.');
      return;
    }

    setError('');
    setSubmitted(true);

    const feedbackPayload = {
      complaintId: complaint.id,
      rating,
      comments: comments.trim(),
      tags: selectedTags,
      isAnonymous,
      submittedAt: new Date().toISOString(),
      submittedBy: isAnonymous
        ? 'Anonymous Student'
        : user
        ? `${user.name} (${user.role})`
        : 'Student Submitter',
    };

    setTimeout(() => {
      if (onSubmitFeedback) {
        onSubmitFeedback(complaint.id, feedbackPayload);
      }
      onClose();
    }, 1200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] modal-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-content bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1E3A8A]">
              Thank You for Your Feedback!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1 leading-relaxed">
              Your rating of <span className="font-bold text-amber-500">{rating} ★</span> has been recorded. This helps us ensure campus facilities and department queues maintain high resolution standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#DBEAFE] text-[#1E3A8A] font-bold text-xs rounded-md font-mono border border-blue-200">
                  {complaint.id}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Resolved
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {complaint.category}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                Rate Resolution: {complaint.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Help the Dean of Student Affairs assess service quality for this resolved grievance.
              </p>
            </div>

            {/* Star Rating Section */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Overall Resolution Quality (1 to 5 Stars) <span className="text-red-500">*</span>
              </label>

              {/* Stars */}
              <div 
                className="flex items-center justify-center gap-2 sm:gap-3 py-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= currentScore;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        setError('');
                      }}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 active:scale-95"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300 hover:text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Rating Label */}
              <div className="min-h-[22px] mt-2">
                {ratingInfo ? (
                  <p className="text-xs font-semibold">
                    <span className={`font-bold ${ratingInfo.color}`}>{ratingInfo.label}</span>
                    <span className="text-slate-500 font-normal"> — {ratingInfo.text}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">Click a star to assign your rating</p>
                )}
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-600 mt-2 animate-bounce">
                  {error}
                </p>
              )}
            </div>

            {/* Suggested Feedback Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Key Highlights (Optional)</span>
                <span className="text-[11px] text-slate-400 font-normal">Click to toggle</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                        isSelected
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Comments */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>Review Comments / Suggestions</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal font-mono">
                  {comments.length}/500
                </span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share specific details about how the department handled your complaint, timeliness of technicians, or further improvements needed..."
                className="w-full p-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] bg-white text-slate-900 resize-none transition shadow-2xs"
              />
            </div>

            {/* Anonymity Option */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3B82F6] border-slate-300 focus:ring-[#3B82F6] accent-[#3B82F6] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Submit anonymously
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Your name & student roll number will be concealed from staff
                  </span>
                </div>
              </label>

              <ShieldCheck className="w-4 h-4 text-[#3B82F6] shrink-0" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-[0.99]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
