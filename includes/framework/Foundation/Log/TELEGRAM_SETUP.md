# Telegram Logger Setup

## 🚀 Hướng dẫn cài đặt

### 1. Tạo Telegram Bot

1. Mở Telegram và tìm **@BotFather**
2. Gửi lệnh `/newbot`
3. Đặt tên cho bot (ví dụ: `My Site Logger`)
4. Đặt username cho bot (phải kết thúc bằng `bot`, ví dụ: `mysite_logger_bot`)
5. BotFather sẽ trả về **Bot Token**, lưu lại token này

**Ví dụ Bot Token:**
```
6234567890:AAGHpqWertyuiopASDFGHJKLzxcvbnmQWE
```

### 2. Lấy Chat ID

**Cách 1: Sử dụng bot @userinfobot**
1. Tìm và mở chat với **@userinfobot**
2. Gửi `/start`
3. Bot sẽ trả về thông tin của bạn, bao gồm **Chat ID**

**Cách 2: Qua API**
1. Gửi tin nhắn cho bot của bạn (bot bạn vừa tạo ở bước 1)
2. Truy cập URL (thay `YOUR_BOT_TOKEN` bằng token thực):
```
https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```
3. Tìm `"chat":{"id":123456789}` trong JSON response

**Ví dụ Chat ID:**
```
123456789
```

### 3. Cấu hình trong wp-config.php

Mở file `wp-config.php` và thêm 3 constants:

```php
/**
 * Telegram Logger Configuration
 */
define('JANKX_USE_TELEGRAM_LOGGER', true); // Bật/tắt Telegram Logger
define('JANKX_TELEGRAM_BOT_TOKEN', '6234567890:AAGHpqWertyuiopASDFGHJKLzxcvbnmQWE');
define('JANKX_TELEGRAM_CHAT_ID', '123456789');
```

**Lưu ý:** Đặt constants này **TRƯỚC** dòng:
```php
/* That's all, stop editing! Happy publishing. */
```

#### Giải thích các constants:

- `JANKX_USE_TELEGRAM_LOGGER`: `true` = bật, `false` = tắt Telegram Logger
- `JANKX_TELEGRAM_BOT_TOKEN`: Token của bot Telegram
- `JANKX_TELEGRAM_CHAT_ID`: ID của chat/user nhận log

### 4. Enable Debug Logs (Optional)

Để nhận tất cả log levels (bao gồm `debug` và `info`), thêm:

```php
/**
 * Enable all Jankx logs (including debug)
 */
define('JANKX_LOG_ALL', true);
```

**Không define `JANKX_LOG_ALL`:** Chỉ nhận `warning` và cao hơn (error, critical, alert, emergency)

**Define `JANKX_LOG_ALL = true`:** Nhận tất cả logs (debug, info, notice, warning, error, ...)

## 📱 Log Levels & Emojis

Mỗi log level có emoji riêng để dễ nhận diện:

| Level | Emoji | Khi nào gửi |
|-------|-------|-------------|
| Emergency | 💥 | Luôn |
| Alert | 🔴 | Luôn |
| Critical | 🚨 | Luôn |
| Error | ❌ | Luôn |
| Warning | ⚠️ | Luôn |
| Notice | 📢 | Luôn |
| Info | ℹ️ | Chỉ khi `JANKX_LOG_ALL = true` |
| Debug | 🔍 | Chỉ khi `JANKX_LOG_ALL = true` |

## 💡 Ví dụ sử dụng

```php
use Jankx\Facades\Jankx;

// Error log (luôn gửi)
Jankx::log()->error('Payment gateway failed', [
    'order_id' => 12345,
    'amount' => 1000000,
    'gateway' => 'vnpay'
]);

// Debug log (chỉ gửi khi JANKX_LOG_ALL = true)
Jankx::log()->debug('PostLayoutDecorator::buildQuery', [
    'orderby' => 'date',
    'posts_per_page' => 10
]);
```

## ✅ Test setup

Sau khi cấu hình xong, test bằng cách:

```php
// Thêm vào functions.php tạm thời
add_action('init', function() {
    if (current_user_can('manage_options')) {
        Jankx\Facades\Jankx::log()->warning('Telegram Logger Test', [
            'status' => 'working',
            'time' => current_time('mysql')
        ]);
    }
});
```

Bạn sẽ nhận được tin nhắn trên Telegram như:

```
⚠️ WARNING

Telegram Logger Test

• status: working
• time: 2025-10-26 14:30:45

Time: 2025-10-26 14:30:45
Server: your-domain.com
```

## 🔒 Bảo mật

- **KHÔNG** commit bot token và chat ID vào Git
- **KHÔNG** share bot token với người khác
- Nếu token bị lộ, revoke bot cũ và tạo bot mới qua @BotFather

## 🚫 Tắt Telegram Logger

### Cách 1: Đặt constant về false (Khuyến nghị)

```php
define('JANKX_USE_TELEGRAM_LOGGER', false);
```

### Cách 2: Comment tất cả constants

```php
// define('JANKX_USE_TELEGRAM_LOGGER', true);
// define('JANKX_TELEGRAM_BOT_TOKEN', '...');
// define('JANKX_TELEGRAM_CHAT_ID', '...');
```

Logger sẽ tự động disable và không gửi tin nhắn nữa.

## 🎛️ Environment-based Configuration

Bạn có thể bật/tắt Telegram Logger theo môi trường:

```php
/**
 * Chỉ bật Telegram Logger trên production
 */
define('JANKX_USE_TELEGRAM_LOGGER', WP_ENV === 'production');

/**
 * Hoặc tắt trên localhost
 */
define('JANKX_USE_TELEGRAM_LOGGER', !in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1']));
```

