# Thiệp cưới Văn Hải & Kim Hường

Thiệp cưới một trang xây dựng với Next.js (App Router), Ant Design và Tailwind CSS.

## Chỉnh thông tin buổi lễ

Mở `lib/wedding.ts` và điền `date`, `time`, `venue`, `address`. Nút **Xem chỉ đường Google Maps** tự xuất hiện khi `address` có giá trị. Địa chỉ nên bao gồm tên địa điểm, số nhà, đường, phường/xã, tỉnh/thành phố để dẫn đường chính xác.

Tên cô dâu, chú rể, cha mẹ và danh sách ảnh cũng nằm tại tệp này. Ảnh gốc được giữ trong `public/images/`.

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Tạo bản xuất tĩnh bằng `npm run build`; kết quả nằm trong thư mục `out/`.
# thiep-cuoi
