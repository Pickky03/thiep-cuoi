export const wedding = {
    groom: 'Văn Hải',
    bride: 'Kim Hường',
  
    groomFamily: [
      'Ông Đặng Văn Sơn',
      'Bà Trần Thị Quyến',
    ],
  
    brideFamily: [
      'Ông Trần Bình Trọng',
      'Bà Trương Thị Trung',
    ],
  
    // Ví dụ: 'Chủ nhật, 20 tháng 12 năm 2026'
    date: 'Thứ 6, 6 tháng 11 năm 2026',
  
    // Ví dụ: '11:00'
    time: '18:00',
  
    // Ví dụ: 'Trung tâm Tiệc cưới ABC'
    venue: 'Quán Nhậu Ngộ Quán',
  
    // Nhập địa chỉ đầy đủ để Google Maps dẫn đường chính xác.
    address: '179 - 181 Đ. 30/4, Hòa Cường, Đà Nẵng 550000, Việt Nam',
     /**
   * ISO datetime dùng cho bộ đếm ngược.
   * +07:00 = múi giờ Việt Nam.
   *
   * Nếu lễ bắt đầu lúc 11:00:
   * 2026-11-06T11:00:00+07:00
   */
  countdownDate: '2026-11-06T00:00:00+07:00',
  };
  
  
  export const gallery = [
    {
      src: '/images/DUY08867.JPG',
      alt: 'Văn Hải và Kim Hường bên nhau trong ánh nắng',
    },
    {
      src: '/images/DUY08718.JPG',
      alt: 'Kim Hường cùng bó hoa cưới',
    },
    {
      src: '/images/DUY09006.JPG',
      alt: 'Chân dung chú rể Văn Hải',
    },
    {
      src: '/images/DUY08960.JPG',
      alt: 'Chân dung cô dâu Kim Hường',
    },
    {
      src: '/images/DUY09306.JPG',
      alt: 'Văn Hải và Kim Hường trong trang phục cưới',
    },
    {
      src: '/images/DUY09430.JPG',
      alt: 'Cặp đôi trong khung cảnh lãng mạn',
    },
  ];
  
  export const mapsUrl = wedding.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        wedding.address,
      )}`
    : null;