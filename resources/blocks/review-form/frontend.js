/**
 * Review Form Block - Frontend Script
 *
 * Handles the star rating submission form on the frontend.
 *
 * @package JankxReviewForm
 */

(function () {
    'use strict';

    const config = window.jankxReviewForm;
    if (!config) return;

    const { restUrl, nonce, postId, maxRating, i18n } = config;

    /**
     * Initialize all review forms on the page.
     */
    function initForms() {
        const forms = document.querySelectorAll('.jankx-review-form__body');
        forms.forEach(initForm);
    }

    /**
     * Initialize a single review form.
     */
    function initForm(formBody) {
        const formWrapper = formBody.closest('.wp-block-jankx-review-form');
        if (!formWrapper) return;

        const stars = formBody.querySelectorAll('.jankx-review-form__star');
        const ratingText = formBody.querySelector('.jankx-review-form__rating-text');
        const reviewTextarea = formBody.querySelector('.jankx-review-form__textarea--review');
        const prosTextarea = formBody.querySelector('.jankx-review-form__textarea--pros');
        const consTextarea = formBody.querySelector('.jankx-review-form__textarea--cons');
        const nameInput = formBody.querySelector('.jankx-review-form__input--name');
        const emailInput = formBody.querySelector('.jankx-review-form__input--email');
        const submitBtn = formBody.querySelector('.jankx-review-form__button');
        const spinner = formBody.querySelector('.jankx-review-form__spinner');
        const messageEl = formBody.querySelector('.jankx-review-form__message');

        let currentRating = 0;
        let hoverRating = 0;
        let isSubmitting = false;

        // Get star colors from CSS variables
        const computedStyle = getComputedStyle(formWrapper);
        const starColor = computedStyle.getPropertyValue('--review-star-color').trim() || '#f1c40f';
        const starEmptyColor = computedStyle.getPropertyValue('--review-star-empty-color').trim() || '#dddddd';

        // Star hover and click
        stars.forEach((star) => {
            const value = parseInt(star.dataset.value, 10);

            star.addEventListener('mouseenter', () => {
                if (isSubmitting) return;
                hoverRating = value;
                updateStars();
            });

            star.addEventListener('mouseleave', () => {
                if (isSubmitting) return;
                hoverRating = 0;
                updateStars();
            });

            star.addEventListener('click', () => {
                if (isSubmitting) return;
                currentRating = value;
                updateStars();
            });
        });

        function updateStars() {
            const displayRating = hoverRating || currentRating;
            stars.forEach((star) => {
                const value = parseInt(star.dataset.value, 10);
                star.textContent = value <= displayRating ? '★' : '☆';
                star.style.color = value <= displayRating ? starColor : starEmptyColor;
            });
            if (ratingText) {
                ratingText.textContent = displayRating > 0 ? `${displayRating}/${maxRating}` : '';
            }
        }

        // Submit handler
        if (submitBtn) {
            submitBtn.addEventListener('click', () => handleSubmit());
        }

        async function handleSubmit() {
            if (isSubmitting) return;

            // Validate rating
            if (currentRating === 0) {
                showMessage(i18n.error, 'error');
                return;
            }

            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.textContent = i18n.submitting;
            if (spinner) spinner.style.display = 'inline-block';
            hideMessage();

            const body = {
                post_id: postId,
                rating: currentRating,
                review: reviewTextarea ? reviewTextarea.value : '',
                pros: prosTextarea ? prosTextarea.value : '',
                cons: consTextarea ? consTextarea.value : '',
            };

            // Guest fields
            if (!config.isLoggedIn) {
                if (nameInput && nameInput.value) {
                    body.author_name = nameInput.value;
                }
                if (emailInput && emailInput.value) {
                    body.author_email = emailInput.value;
                }
            }

            try {
                const response = await fetch(restUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': nonce,
                    },
                    body: JSON.stringify(body),
                });

                const data = await response.json();

                if (data.success) {
                    showMessage(data.message || i18n.success, 'success');

                    // Reset form
                    currentRating = 0;
                    hoverRating = 0;
                    updateStars();
                    if (reviewTextarea) reviewTextarea.value = '';
                    if (prosTextarea) prosTextarea.value = '';
                    if (consTextarea) consTextarea.value = '';
                    if (nameInput) nameInput.value = '';
                    if (emailInput) emailInput.value = '';

                    // Update rating display if star-rating block exists on page
                    updateRatingDisplay(data.rating);
                } else {
                    showMessage(data.message || i18n.error, 'error');
                }
            } catch (err) {
                showMessage(i18n.error, 'error');
            } finally {
                isSubmitting = false;
                submitBtn.disabled = false;
                submitBtn.textContent = i18n.submit;
                if (spinner) spinner.style.display = 'none';
            }
        }

        function showMessage(text, type) {
            if (!messageEl) return;
            messageEl.textContent = text;
            messageEl.className = `jankx-review-form__message jankx-review-form__message--${type}`;
            messageEl.style.display = 'block';
        }

        function hideMessage() {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }

        function updateRatingDisplay(rating) {
            if (!rating) return;

            // Find star-rating blocks on the same post and update their display
            const ratingBlocks = document.querySelectorAll(
                `.wp-block-jankx-star-rating[data-post-id="${postId}"]`
            );
            ratingBlocks.forEach((block) => {
                const scoreEl = block.querySelector('.jankx-rating-summary__score');
                if (scoreEl) {
                    scoreEl.textContent = rating.average.toFixed(1);
                }
                const countEl = block.querySelector('.jankx-rating-summary__count');
                if (countEl) {
                    countEl.textContent = `(${rating.count})`;
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initForms);
    } else {
        initForms();
    }
})();
