# ขึ้นเว็บ loykrathong.retc.ac.th บน Hostatom (อัปโหลดเอง)

GitHub ใช้เก็บโค้ดเป็นสำรองเท่านั้น การขึ้นเว็บจริงทำด้วยการอัปโหลดไฟล์เองผ่าน File Manager หรือ FileZilla

## 1. เตรียมบน Hostatom (ทำครั้งเดียว)

1. **สร้าง subdomain** `loykrathong` ใต้ `retc.ac.th`
   (ถ้า DNS ของ retc.ac.th ไม่ได้อยู่ที่ Hostatom ให้ผู้ดูแล DNS เพิ่ม A record `loykrathong` ชี้ไป IP ของโฮสต์)
2. **เปิด SSL** (Let's Encrypt) ให้ `loykrathong.retc.ac.th`
3. **ตั้ง PHP เป็น 8.1 ขึ้นไป**
4. **สร้างฐานข้อมูล MySQL + ผู้ใช้** จดชื่อฐานข้อมูล / ชื่อผู้ใช้ / รหัสผ่านไว้
5. **phpMyAdmin** → เลือกฐานข้อมูลนั้น → Import ไฟล์ `app/api/schema-hosting.sql`

## 2. อัปโหลดไฟล์

1. เปิด **File Manager** → เข้าโฟลเดอร์เว็บของ subdomain (เช่น `domains/retc.ac.th/public_html/loykrathong/`)
2. อัปโหลด **`C:\xampp\htdocs\loykrathong-upload.zip`** แล้วกด **Extract** ในโฟลเดอร์นั้น จากนั้นลบไฟล์ zip ทิ้ง
3. อัปโหลด **`krathong.mp4`** (351 MB) ไว้ในโฟลเดอร์เดียวกับ `index.html`
   ถ้า File Manager จำกัดขนาดไฟล์ ให้ใช้ **FileZilla** (ข้อมูล FTP ดูในแผงควบคุม Hostatom)
4. ในโฟลเดอร์ `app/api/config/` คัดลอก `config.hosting.example.php` เป็น **`config.php`**
   แล้วแก้ 4 ค่าที่มีป้าย `← แก้` (ชื่อฐานข้อมูล, ผู้ใช้, รหัสผ่าน, app_secret)

โครงสร้างบนโฮสต์ที่ถูกต้อง:
```
loykrathong/            ← โฟลเดอร์เว็บของ subdomain
├── .htaccess
├── index.html          ← หน้าจอแสดงผล (วิดีโอ + QR + กระทงลอย)
├── krathong.mp4
├── assets/
└── app/
    ├── index.html      ← เว็บลอยกระทง (หน้าที่ QR พาไป)
    └── api/
        ├── .htaccess
        ├── index.php
        ├── config/config.php
        └── src/
```

> ไฟล์ `.htaccess` ขึ้นต้นด้วยจุด บาง File Manager ซ่อนไว้ — ตรวจว่ามีอยู่จริง (เปิด "Show hidden files")

## 3. ทดสอบ

- https://loykrathong.retc.ac.th/app/api/krathongs/stats → ต้องได้ `{"total":0,"today":0}`
- https://loykrathong.retc.ac.th/app/ → มุมขวาบนต้องขึ้น `LIVE API` ลองลอยกระทง 1 ลำ
- https://loykrathong.retc.ac.th/ → กระทงที่ลอยต้องโผล่บนแม่น้ำ
- https://loykrathong.retc.ac.th/app/api/config/config.php → ต้องได้ **403 Forbidden**

## แก้ไขเว็บครั้งต่อไป

แก้ไฟล์ในเครื่อง → ทดสอบที่ http://localhost/loykrathong/ → อัปโหลด **เฉพาะไฟล์ที่แก้** ทับไฟล์เดิมบนโฮสต์
(ห้ามอัปโหลด `config.php` จากเครื่องทับ เพราะค่าฐานข้อมูลต่างกัน)

เก็บโค้ดขึ้น GitHub เป็นสำรอง:
```
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push
```

## หมายเหตุ

- **Rate limit**: มือถือทุกเครื่องใน Wi-Fi วิทยาลัยออกเน็ตด้วย IP เดียวกัน `config.hosting.example.php` จึงตั้งเพดานไว้สูง ถ้าคนเยอะแล้วเจอ "ส่งรายการถี่เกินไป" ให้เพิ่มค่าใน `config.php` บนโฮสต์
- **ล้างกระทงทดสอบก่อนวันงาน**: phpMyAdmin → `DELETE FROM krathongs;`
- เว็บลอยกระทงใน `app/` มาจาก https://github.com/goragodwiriya/loykrathong (สัญญาอนุญาต MIT ดู `app/LICENSE`)
