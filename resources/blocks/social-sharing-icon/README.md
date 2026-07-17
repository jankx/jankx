# Social Sharing Icon Block

Block con của `jankx/social-sharing` dùng để hiển thị một icon chia sẻ mạng xã hội đơn lẻ.

## Tính năng

- Hỗ trợ nhiều mạng xã hội: Facebook, Twitter, LinkedIn, WhatsApp, Telegram, Pinterest, Reddit, Email, Copy Link, Messenger, Viber, Line
- Các kiểu hiển thị: Mặc định, Có viền, Đầy màu, Tròn, Vuông
- Kích thước: Nhỏ, Trung bình, Lớn
- Hiển thị/ẩn nhãn
- Tùy chỉnh icon và nhãn

## Sử dụng

Block này được thiết kế để sử dụng bên trong block `jankx/social-sharing`. Nó cho phép tùy chỉnh từng icon riêng lẻ.

## Attributes

- `network`: Loại mạng xã hội (default: 'facebook')
- `iconStyle`: Kiểu hiển thị icon (default: 'default')
- `iconSize`: Kích thước icon (default: 'medium')
- `showLabel`: Hiển thị nhãn (default: true)
- `customIcon`: Icon tùy chỉnh (optional)
- `customLabel`: Nhãn tùy chỉnh (optional)
- `url`: URL để chia sẻ (optional, mặc định là URL trang hiện tại)
- `title`: Tiêu đề để chia sẻ (optional, mặc định là tiêu đề trang)

## Tương thích Frontend/Editor

Block này sử dụng save function để đảm bảo HTML được render giống nhau ở cả editor và frontend, giúp WYSIWYG tốt hơn.

