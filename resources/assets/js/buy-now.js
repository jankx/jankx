/**
 * Buy Now Button JavaScript
 * Handles click events and AJAX requests for the Buy Now functionality
 */

(function($) {
    'use strict';

    // Initialize when document is ready
    $(document).ready(function() {
        initBuyNowButtons();
    });

    /**
     * Initialize Buy Now buttons
     */
    function initBuyNowButtons() {
        // Bind click events to all Buy Now buttons
        $(document).on('click', '.single_buy_now_button', handleBuyNowClick);

        // Handle variation changes for variable products
        $(document).on('found_variation', '.variations_form', handleVariationChange);
        $(document).on('reset_data', '.variations_form', handleVariationReset);
    }

    /**
     * Handle Buy Now button click
     */
    function handleBuyNowClick(e) {
        e.preventDefault();

        const $button = $(this);
        const productId = $button.data('product-id');

        // Prevent multiple clicks
        if ($button.hasClass('loading')) {
            return;
        }

        // Get quantity from form
        const quantity = getQuantityFromForm();

        if (quantity <= 0) {
            showError('Vui lòng chọn số lượng sản phẩm');
            return;
        }

        // Validate product variations if it's a variable product
        if (!validateProductVariations()) {
            showError('Vui lòng chọn đầy đủ thông tin sản phẩm');
            return;
        }

        // Set loading state
        setButtonLoading($button, true);

        // Make AJAX request
        console.log('Sending Buy Now AJAX request:', {
            url: jankxBuyNow.ajaxUrl,
            product_id: productId,
            quantity: quantity,
            nonce: jankxBuyNow.nonce
        });

        $.ajax({
            url: jankxBuyNow.ajaxUrl,
            type: 'POST',
            data: {
                action: 'buy_now',
                product_id: productId,
                quantity: quantity,
                nonce: jankxBuyNow.nonce
            },
            success: function(response) {
                console.log('Buy Now AJAX response:', response);

                if (response.success) {
                    // Success - redirect to checkout
                    console.log('Redirecting to checkout:', response.data.redirect_url);
                    showSuccess('Đang chuyển đến trang thanh toán...');

                    // Small delay to show success message
                    setTimeout(function() {
                        window.location.href = response.data.redirect_url;
                    }, 1000);
                } else {
                    // Error
                    console.error('Buy Now failed:', response.data);
                    showError(response.data.message || 'Có lỗi xảy ra, vui lòng thử lại');
                    setButtonLoading($button, false);
                }
            },
            error: function(xhr, status, error) {
                // AJAX error
                console.error('Buy Now AJAX Error:', {
                    status: status,
                    error: error,
                    responseText: xhr.responseText
                });

                showError('Lỗi kết nối, vui lòng thử lại');
                setButtonLoading($button, false);
            }
        });
    }

    /**
     * Get quantity from form
     */
    function getQuantityFromForm() {
        const $quantityInput = $('.quantity input[name="quantity"]');
        if ($quantityInput.length) {
            return parseInt($quantityInput.val()) || 1;
        }
        return 1;
    }

    /**
     * Validate product variations for variable products
     */
    function validateProductVariations() {
        const $variationsForm = $('.variations_form');
        if ($variationsForm.length === 0) {
            // Simple product, no validation needed
            return true;
        }

        // Check if all required variations are selected
        const $variations = $variationsForm.find('.variations select');
        let isValid = true;

        $variations.each(function() {
            const $select = $(this);
            const value = $select.val();

            if (!$select.val() || value === '') {
                isValid = false;
                return false; // Break loop
            }
        });

        return isValid;
    }

    /**
     * Handle variation change
     */
    function handleVariationChange(event, variation) {
        // Enable Buy Now button when variation is selected
        const $buyNowButton = $('.single_buy_now_button');
        $buyNowButton.prop('disabled', false).removeClass('disabled');
    }

    /**
     * Handle variation reset
     */
    function handleVariationReset() {
        // Disable Buy Now button when variations are reset
        const $buyNowButton = $('.single_buy_now_button');
        $buyNowButton.prop('disabled', true).addClass('disabled');
    }

    /**
     * Set button loading state
     */
    function setButtonLoading($button, isLoading) {
        if (isLoading) {
            $button.addClass('loading')
                   .prop('disabled', true)
                   .text('ĐANG XỬ LÝ...');
        } else {
            $button.removeClass('loading')
                   .prop('disabled', false)
                   .text('MUA NGAY');
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        // Remove existing error messages
        $('.buy-now-error').remove();

        // Create error message element
        const $errorDiv = $('<div class="buy-now-error woocommerce-error" role="alert">' + message + '</div>');

        // Insert after the add to cart form
        $('.woocommerce-variation-add-to-cart').after($errorDiv);

        // Auto-remove after 5 seconds
        setTimeout(function() {
            $errorDiv.fadeOut(function() {
                $(this).remove();
            });
        }, 5000);

        // Scroll to error message
        $('html, body').animate({
            scrollTop: $errorDiv.offset().top - 100
        }, 500);
    }

    /**
     * Show success message
     */
    function showSuccess(message) {
        // Remove existing success messages
        $('.buy-now-success').remove();

        // Create success message element
        const $successDiv = $('<div class="buy-now-success woocommerce-message" role="alert">' + message + '</div>');

        // Insert after the add to cart form
        $('.woocommerce-variation-add-to-cart').after($successDiv);

        // Auto-remove after 3 seconds
        setTimeout(function() {
            $successDiv.fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    }

    /**
     * Utility function to check if element is in viewport
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Utility function to debounce function calls
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Expose functions globally for debugging (development only)
    if (typeof window !== 'undefined' && window.jankxBuyNowDebug) {
        window.jankxBuyNowDebug = {
            initBuyNowButtons: initBuyNowButtons,
            handleBuyNowClick: handleBuyNowClick,
            getQuantityFromForm: getQuantityFromForm,
            validateProductVariations: validateProductVariations,
            showError: showError,
            showSuccess: showSuccess
        };
    }

})(jQuery);
