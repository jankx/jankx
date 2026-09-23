/**
 * Star Rating Submission Component
 *
 * Frontend React component for users to submit star ratings.
 * Can be embedded on any page via a shortcode or block.
 *
 * @package JankxStarRating
 */

import { useState, useCallback, useEffect } from 'react';

interface RatingSubmissionProps {
    postId: number;
    maxRating?: number;
    showReview?: boolean;
    showProsCons?: boolean;
    restUrl?: string;
    nonce?: string;
    onSuccess?: (data: RatingResponse) => void;
    onError?: (error: string) => void;
    translations?: {
        submit?: string;
        submitting?: string;
        success?: string;
        error?: string;
        loginRequired?: string;
        alreadyRated?: string;
        placeholder?: {
            review?: string;
            pros?: string;
            cons?: string;
        };
    };
}

interface RatingResponse {
    success: boolean;
    message: string;
    rating?: {
        average: number;
        count: number;
        user_rating: number;
        comment_id: number;
    };
    existing?: {
        rating: number;
        comment_id: number;
    };
}

interface StarProps {
    filled: boolean;
    halfFilled?: boolean;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    size?: number;
    color?: string;
    emptyColor?: string;
}

const Star: React.FC<StarProps> = ({
    filled,
    halfFilled = false,
    onClick,
    onMouseEnter,
    onMouseLeave,
    size = 24,
    color = '#f1c40f',
    emptyColor = '#ddd',
}) => {
    const gradientId = `star-grad-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {halfFilled && (
                <defs>
                    <linearGradient id={gradientId}>
                        <stop offset="50%" stopColor={color} />
                        <stop offset="50%" stopColor={emptyColor} />
                    </linearGradient>
                </defs>
            )}
            <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill={halfFilled ? `url(#${gradientId})` : filled ? color : emptyColor}
            />
        </svg>
    );
};

export const RatingSubmissionForm: React.FC<RatingSubmissionProps> = ({
    postId,
    maxRating = 5,
    showReview = true,
    showProsCons = false,
    restUrl,
    nonce,
    onSuccess,
    onError,
    translations = {},
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [alreadyRated, setAlreadyRated] = useState(false);
    const [existingRating, setExistingRating] = useState(0);

    const t = {
        submit: translations.submit || 'Gửi đánh giá',
        submitting: translations.submitting || 'Đang gửi...',
        success: translations.success || 'Đánh giá đã được gửi thành công!',
        error: translations.error || 'Có lỗi xảy ra, vui lòng thử lại.',
        loginRequired: translations.loginRequired || 'Vui lòng đăng nhập để đánh giá.',
        alreadyRated: translations.alreadyRated || 'Bạn đã đánh giá bài viết này rồi.',
        placeholder: {
            review: translations.placeholder?.review || 'Viết đánh giá của bạn...',
            pros: translations.placeholder?.pros || 'Điểm mạnh (mỗi dòng một ý)',
            cons: translations.placeholder?.cons || 'Điểm yếu (mỗi dòng một ý)',
        },
    };

    const handleSubmit = useCallback(async () => {
        if (rating === 0) {
            setMessage(t.error);
            setIsError(true);
            return;
        }

        setSubmitting(true);
        setMessage('');

        const url = restUrl || `${window.location.origin}/wp-json/jankx/v1/star-rating/submit`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce || '',
                },
                body: JSON.stringify({
                    post_id: postId,
                    rating,
                    review,
                    pros: showProsCons ? pros : undefined,
                    cons: showProsCons ? cons : undefined,
                }),
            });

            const data: RatingResponse = await response.json();

            if (data.success) {
                setMessage(data.message || t.success);
                setIsError(false);
                setAlreadyRated(false);
                onSuccess?.(data);
            } else {
                if (response.status === 409 && data.existing) {
                    setAlreadyRated(true);
                    setExistingRating(data.existing.rating);
                    setMessage(data.message || t.alreadyRated);
                } else {
                    setMessage(data.message || t.error);
                }
                setIsError(true);
                onError?.(data.message);
            }
        } catch (err) {
            setMessage(t.error);
            setIsError(true);
            onError?.(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    }, [rating, review, pros, cons, postId, restUrl, nonce, showProsCons, t, onSuccess, onError]);

    const displayRating = hoverRating || rating;

    return (
        <div className="jankx-rating-submission">
            <style>{`
                .jankx-rating-submission {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    max-width: 500px;
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    background: #fafafa;
                }
                .jankx-rating-submission__stars {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 16px;
                }
                .jankx-rating-submission__message {
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 12px;
                    font-size: 14px;
                }
                .jankx-rating-submission__message--success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                .jankx-rating-submission__message--error {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                .jankx-rating-submission__textarea {
                    width: 100%;
                    min-height: 100px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    resize: vertical;
                    margin-bottom: 12px;
                    box-sizing: border-box;
                }
                .jankx-rating-submission__textarea:focus {
                    outline: none;
                    border-color: #007cba;
                }
                .jankx-rating-submission__row {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .jankx-rating-submission__row .jankx-rating-submission__textarea {
                    flex: 1;
                    min-height: 80px;
                }
                .jankx-rating-submission__button {
                    background: #007cba;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    width: 100%;
                    transition: background 0.2s;
                }
                .jankx-rating-submission__button:hover:not(:disabled) {
                    background: #005a87;
                }
                .jankx-rating-submission__button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                .jankx-rating-submission__existing {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    padding: 10px;
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    border-radius: 4px;
                    font-size: 14px;
                }
            `}</style>

            <div className="jankx-rating-submission__stars">
                {Array.from({ length: maxRating }, (_, i) => i + 1).map((value) => (
                    <Star
                        key={value}
                        filled={value <= displayRating}
                        halfFilled={false}
                        onClick={() => !alreadyRated && setRating(value)}
                        onMouseEnter={() => !alreadyRated && setHoverRating(value)}
                        onMouseLeave={() => !alreadyRated && setHoverRating(0)}
                        size={32}
                    />
                ))}
            </div>

            {alreadyRated && (
                <div className="jankx-rating-submission__existing">
                    <span>⭐</span>
                    <span>{t.alreadyRated} ({existingRating}/{maxRating})</span>
                </div>
            )}

            {message && (
                <div className={`jankx-rating-submission__message ${isError ? 'jankx-rating-submission__message--error' : 'jankx-rating-submission__message--success'}`}>
                    {message}
                </div>
            )}

            {showReview && !alreadyRated && (
                <textarea
                    className="jankx-rating-submission__textarea"
                    placeholder={t.placeholder.review}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            )}

            {showProsCons && !alreadyRated && (
                <div className="jankx-rating-submission__row">
                    <textarea
                        className="jankx-rating-submission__textarea"
                        placeholder={t.placeholder.pros}
                        value={pros}
                        onChange={(e) => setPros(e.target.value)}
                    />
                    <textarea
                        className="jankx-rating-submission__textarea"
                        placeholder={t.placeholder.cons}
                        value={cons}
                        onChange={(e) => setCons(e.target.value)}
                    />
                </div>
            )}

            {!alreadyRated && (
                <button
                    className="jankx-rating-submission__button"
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                >
                    {submitting ? t.submitting : t.submit}
                </button>
            )}
        </div>
    );
};

export default RatingSubmissionForm;
