# ขึ้นเว็บ loykrathong.retc.ac.th บน Hostatom ผ่าน GitHub

ภาพรวม: เก็บโค้ดไว้บน GitHub → ทุกครั้งที่ push ขึ้น branch `main` GitHub Actions จะอัปโหลดไฟล์ที่เปลี่ยนขึ้น Hostatom ทาง FTP ให้อัตโนมัติ

มี 2 อย่างที่ **ไม่ผ่าน GitHub** ต้องทำบนโฮสต์เองครั้งเดียว:
- `krathong.mp4` (351 MB เกินเพดาน 100 MB ของ GitHub)
- `app/api/config/config.php` (มีรหัสผ่านฐานข้อมูล ห้ามขึ้น GitHub)

---

## 1. เตรียมบน Hostatom (แผงควบคุม DirectAdmin / cPanel)

1. **สร้าง subdomain** `loykrathong` ใต้ `retc.ac.th` แล้วจดโฟลเดอร์เว็บของมันไว้
   เช่น `domains/retc.ac.th/public_html/loykrathong/` หรือ `public_html/loykrathong/`
   - ถ้า DNS ของ retc.ac.th ไม่ได้อยู่ที่ Hostatom ให้ผู้ดูแล DNS เพิ่ม A record `loykrathong` ชี้ไป IP ของโฮสต์
2. **เปิด SSL** (Let's Encrypt) ให้ `loykrathong.retc.ac.th`
3. **ตั้ง PHP เป็นเวอร์ชัน 8.1 ขึ้นไป** (ต้องมี `pdo_mysql` และ `mbstring`)
4. **สร้างฐานข้อมูล MySQL + ผู้ใช้** จดชื่อฐานข้อมูล / ชื่อผู้ใช้ / รหัสผ่าน
5. เข้า **phpMyAdmin** → เลือกฐานข้อมูลนั้น → Import ไฟล์ `app/api/schema-hosting.sql`
   (ไฟล์นี้ไม่มีข้อมูลตัวอย่าง และไม่มี CREATE DATABASE)
6. **บัญชี FTP**: ใช้บัญชีหลัก หรือสร้างบัญชี FTP ใหม่ที่เข้าถึงโฟลเดอร์ subdomain ได้ จด server / user / password

## 2. ขึ้น GitHub

1. สร้าง repository ใหม่ที่ https://github.com/new (แนะนำ **Private**) ไม่ต้องติ๊กสร้าง README
2. ในเครื่องนี้ (โฟลเดอร์ `C:\xampp\htdocs\loykrathong`) เปิด terminal แล้วรัน:
   ```
   git remote add origin https://github.com/<ชื่อบัญชี>/<ชื่อ-repo>.git
   git push -u origin main
   ```
   ครั้งแรก Windows จะเปิดหน้าต่างให้ล็อกอิน GitHub
3. ใน repo บน GitHub ไปที่ **Settings → Secrets and variables → Actions → New repository secret** เพิ่ม 4 ค่า:

   | Name | ค่า |
   |---|---|
   | `FTP_SERVER` | เซิร์ฟเวอร์ FTP เช่น `ftp.retc.ac.th` หรือ IP |
   | `FTP_USERNAME` | ชื่อผู้ใช้ FTP |
   | `FTP_PASSWORD` | รหัสผ่าน FTP |
   | `FTP_SERVER_DIR` | โฟลเดอร์เว็บของ subdomain **ลงท้ายด้วย /** เช่น `domains/retc.ac.th/public_html/loykrathong/` (ถ้าบัญชี FTP ถูกล็อกไว้ที่โฟลเดอร์ subdomain อยู่แล้ว ใส่ `./`) |

4. ไปที่แท็บ **Actions** → **Deploy to Hostatom** → **Run workflow** (หรือ push อะไรก็ได้) รอจนขึ้นเครื่องหมายถูกสีเขียว

## 3. ทำบนโฮสต์ครั้งเดียว (ผ่าน File Manager หรือ FileZilla)

1. **อัปโหลด `krathong.mp4`** ไปไว้ที่โฟลเดอร์เว็บ (ระดับเดียวกับ `index.html`)
   ไฟล์ใหญ่ แนะนำใช้ FileZilla แทน File Manager ซึ่งอาจจำกัดขนาดอัปโหลด
2. **สร้าง config**: ในโฟลเดอร์ `app/api/config/` คัดลอก `config.hosting.example.php` เป็น `config.php`
   แล้วแก้ 4 ค่าที่มีป้าย `← แก้` (ชื่อฐานข้อมูล, ผู้ใช้, รหัสผ่าน, app_secret)

## 4. ทดสอบ

- https://loykrathong.retc.ac.th/app/api/krathongs/stats → ต้องได้ `{"total":0,"today":0}`
- https://loykrathong.retc.ac.th/app/ → มุมขวาบนต้องขึ้น `LIVE API` ลองลอยกระทง 1 ลำ
- https://loykrathong.retc.ac.th/ → หน้าจอแสดงผล QR ต้องชี้ไป `https://loykrathong.retc.ac.th/app/` และกระทงที่ลอยต้องโผล่บนแม่น้ำ
- https://loykrathong.retc.ac.th/app/api/config/config.php → ต้องได้ **403 Forbidden**

## แก้ไขเว็บครั้งต่อไป

แก้ไฟล์ในเครื่อง → ทดสอบที่ http://localhost/loykrathong/ → แล้ว
```
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push
```
ภายใน 1–2 นาทีเว็บจริงจะอัปเดตเอง

## หมายเหตุ

- **Rate limit**: ในงาน มือถือทุกเครื่องใน Wi-Fi วิทยาลัยออกเน็ตด้วย IP เดียวกัน `config.hosting.example.php` จึงตั้งเพดานไว้สูง (อ่าน 6000/นาที, ลอย 1500/ชม.) ถ้าคนเยอะมากแล้วเจอข้อความ "ส่งรายการถี่เกินไป" ให้เพิ่มค่าใน `config.php` บนโฮสต์
- **ล้างกระทงทดสอบก่อนวันงาน**: phpMyAdmin → `DELETE FROM krathongs;`
- หน้าจอแสดงผลโหลดวิดีโอ 351 MB จากโฮสต์ ควรเปิดหน้าทิ้งไว้ก่อนเริ่มงานสักพัก ให้เบราว์เซอร์โหลดเสร็จ
- เว็บลอยกระทงใน `app/` มาจาก https://github.com/goragodwiriya/loykrathong (ดูสัญญาอนุญาตใน `app/LICENSE`)
