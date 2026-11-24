<?php
declare(strict_types=1);

/**
 * รูปที่แนบมากับกระทง — เก็บเป็นไฟล์ app/uploads/{id}.jpg (ไม่ต้องแก้ฐานข้อมูล)
 * - รับ data URL (base64) ที่มือถือย่อมาแล้ว
 * - ตรวจว่าเป็นรูปจริง แล้ว "วาดใหม่" ด้วย GD เป็น JPEG เสมอ
 *   (ตัด EXIF/GPS และโค้ดแปลกปลอมที่ซ่อนในไฟล์ทิ้ง)
 */
final class ImageStore
{
    public const MAX_INPUT_BYTES = 400_000;   // หลัง decode base64
    private const MAX_SIDE       = 480;       // ด้านยาวสุดที่เก็บ (px)
    private const QUALITY        = 80;

    public static function dir(): string
    {
        return dirname(__DIR__, 2) . '/uploads';
    }

    /** URL ของรูปเทียบกับโฟลเดอร์ app/  หรือ null ถ้าไม่มีรูป */
    public static function urlFor(string $id): ?string
    {
        if (!preg_match('/^[a-f0-9]{24}$/', $id)) return null;
        return is_file(self::dir() . "/$id.jpg") ? "uploads/$id.jpg" : null;
    }

    /** ตรวจ + แปลงเป็น JPEG — คืน bytes ที่พร้อมเขียนไฟล์ (โยน ApiException 400 ถ้าใช้ไม่ได้) */
    public static function prepare(string $dataUrl): string
    {
        if (!preg_match('#^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$#', $dataUrl, $m)) {
            throw new ApiException(400, 'รูปแบบรูปภาพไม่ถูกต้อง (รองรับ JPG / PNG / WebP)', 'VALIDATION');
        }
        $bin = base64_decode($m[2], true);
        if ($bin === false || $bin === '') {
            throw new ApiException(400, 'อ่านรูปภาพไม่ได้', 'VALIDATION');
        }
        if (strlen($bin) > self::MAX_INPUT_BYTES) {
            throw new ApiException(400, 'รูปภาพใหญ่เกินไป', 'VALIDATION');
        }
        $info = @getimagesizefromstring($bin);
        if ($info === false || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)
            || $info[0] < 1 || $info[1] < 1 || $info[0] > 4000 || $info[1] > 4000) {
            throw new ApiException(400, 'ไฟล์ที่ส่งมาไม่ใช่รูปภาพ', 'VALIDATION');
        }

        if (!function_exists('imagecreatefromstring')) {
            // โฮสต์ไม่มี GD: รับเฉพาะ JPEG ที่ตรวจแล้ว
            if ($info[2] !== IMAGETYPE_JPEG) {
                throw new ApiException(400, 'เซิร์ฟเวอร์รับได้เฉพาะไฟล์ JPG', 'VALIDATION');
            }
            return $bin;
        }

        $src = @imagecreatefromstring($bin);
        if ($src === false) {
            throw new ApiException(400, 'ไฟล์ที่ส่งมาไม่ใช่รูปภาพ', 'VALIDATION');
        }
        [$w, $h] = [imagesx($src), imagesy($src)];
        $scale = min(1, self::MAX_SIDE / max($w, $h));
        $nw = max(1, (int)round($w * $scale));
        $nh = max(1, (int)round($h * $scale));

        $dst = imagecreatetruecolor($nw, $nh);
        imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255)); // พื้นขาวแทนส่วนโปร่งใสของ PNG
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);

        ob_start();
        imagejpeg($dst, null, self::QUALITY);
        $jpg = (string)ob_get_clean();
        imagedestroy($src);
        imagedestroy($dst);
        return $jpg;
    }

    public static function save(string $id, string $jpg): ?string
    {
        $dir = self::dir();
        if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
            error_log('[krathong] สร้างโฟลเดอร์ uploads ไม่ได้');
            return null;
        }
        if (@file_put_contents("$dir/$id.jpg", $jpg, LOCK_EX) === false) {
            error_log('[krathong] เขียนรูปไม่ได้: ' . $id);
            return null;
        }
        return "uploads/$id.jpg";
    }

    public static function delete(string $id): void
    {
        if (preg_match('/^[a-f0-9]{24}$/', $id)) {
            @unlink(self::dir() . "/$id.jpg");
        }
    }
}
