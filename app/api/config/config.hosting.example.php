<?php
declare (strict_types = 1);

/**
 * แม่แบบ config สำหรับโฮสต์จริง (loykrathong.retc.ac.th บน Hostatom)
 * บนโฮสต์: คัดลอกไฟล์นี้เป็น config.php ในโฟลเดอร์เดียวกัน แล้วแก้ 4 ค่าที่มี ← แก้
 * config.php ไม่อยู่ใน GitHub (กันรหัสผ่านหลุด) — สร้างผ่าน File Manager ครั้งเดียว
 */
return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'CHANGE_ME_db_name',        // ← แก้: ชื่อฐานข้อมูลที่สร้างในแผงควบคุม (มักมี prefix เช่น retc_krathong)
        'user' => 'CHANGE_ME_db_user',        // ← แก้: ชื่อผู้ใช้ฐานข้อมูล
        'pass' => 'CHANGE_ME_db_password',    // ← แก้: รหัสผ่านฐานข้อมูล
        'charset' => 'utf8mb4'
    ],

    // ← แก้: สุ่ม hex 64 ตัว เช่นจาก https://www.browserling.com/tools/random-hex
    //   หรือรัน  php -r "echo bin2hex(random_bytes(32));"
    'app_secret' => 'CHANGE_ME_64_HEX_CHARS',

    // หน้าเว็บกับ API อยู่โดเมนเดียวกัน ไม่ต้องเพิ่มอะไร
    'allowed_origins' => [
        'https://loykrathong.retc.ac.th'
    ],

    'trust_proxy_headers' => false,

    /* ในงาน มือถือทุกเครื่องที่ต่อ Wi-Fi วิทยาลัยจะออกเน็ตด้วย IP สาธารณะเดียวกัน
       ค่าเริ่มต้นของโปรเจกต์ (อ่าน 120/นาที, ลอย 10/ชม. ต่อ IP) จะทำให้คนส่วนใหญ่โดนบล็อก
       จึงขยายเพดานให้รองรับคนทั้งวิทยาลัย */
    'rate_limits' => [
        'read' => ['limit' => 6000, 'window' => 60],
        'write' => ['limit' => 1500, 'window' => 3600],
        'delete' => ['limit' => 300, 'window' => 3600]
    ],

    'max_body_bytes' => 2048,
    'delete_window_hours' => 24,
    'stats_timezone' => 'Asia/Bangkok'
];
