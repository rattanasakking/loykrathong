-- ============================================================
--  ลอยกระทงออนไลน์ — Schema สำหรับโฮสต์จริง (Hostatom ฯลฯ)
--  Import ผ่าน phpMyAdmin โดยเลือกฐานข้อมูลที่สร้างจากแผงควบคุมไว้ก่อน
--  ไม่มี CREATE DATABASE / USE และไม่มีข้อมูลตัวอย่าง
-- ============================================================

SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS krathongs (
  id          CHAR(24)     NOT NULL,
  base        ENUM('tong','stem','bread')                          NOT NULL,
  flower      ENUM('lotus','rose','marigold','jasmine','orchid')   NOT NULL,
  candle      ENUM('gold','coral','pink','blue','lavender','mint') NOT NULL,
  incense     TINYINT(1)   NOT NULL DEFAULT 1,
  message     VARCHAR(140) NOT NULL,
  author_name VARCHAR(30)  NOT NULL DEFAULT '',
  ip_hash     CHAR(64)     NOT NULL,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  KEY idx_created    (created_at),
  KEY idx_ip_created (ip_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS api_rate_limits (
  bucket  CHAR(64)     NOT NULL,
  hits    INT UNSIGNED NOT NULL DEFAULT 0,
  expires DATETIME(3)  NOT NULL,
  PRIMARY KEY (bucket),
  KEY idx_expires (expires)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
