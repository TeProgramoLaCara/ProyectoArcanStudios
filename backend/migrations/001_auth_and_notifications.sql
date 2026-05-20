-- ============================================================
-- Migración 001: Autenticación, roles y notificaciones
-- ------------------------------------------------------------
-- Aplicar SOBRE la BD `BD_ARCAN` ya creada con BD_ARCAN.sql.
-- Idempotente: se puede ejecutar varias veces sin romper nada.
-- ============================================================

USE `BD_ARCAN`;

-- ---------- USUARIO: email + rol + ensanchado de contraseña ----------
ALTER TABLE `usuario`
  ADD COLUMN IF NOT EXISTS `email` VARCHAR(190) NULL AFTER `nombre`,
  ADD COLUMN IF NOT EXISTS `rol` VARCHAR(20) NOT NULL DEFAULT 'cliente' AFTER `contraseña`,
  MODIFY COLUMN `contraseña` VARCHAR(255) NULL;

-- Índice único sobre email (sólo si no existe)
SET @idx := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'usuario' AND index_name = 'uq_usuario_email'
);
SET @sql := IF(@idx = 0,
  'ALTER TABLE `usuario` ADD UNIQUE KEY `uq_usuario_email` (`email`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Rellenar emails vacíos con un placeholder único (para no romper UNIQUE)
UPDATE `usuario` SET `email` = CONCAT('usuario', `id_usuario`, '@arcan.local')
  WHERE `email` IS NULL OR `email` = '';

-- ---------- PROFESOR: email + rol ----------
ALTER TABLE `profesor`
  ADD COLUMN IF NOT EXISTS `email` VARCHAR(190) NULL AFTER `nombre`,
  ADD COLUMN IF NOT EXISTS `rol` VARCHAR(20) NOT NULL DEFAULT 'profesor' AFTER `contraseña`,
  MODIFY COLUMN `contraseña` VARCHAR(255) NULL;

SET @idx := (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'profesor' AND index_name = 'uq_profesor_email'
);
SET @sql := IF(@idx = 0,
  'ALTER TABLE `profesor` ADD UNIQUE KEY `uq_profesor_email` (`email`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE `profesor` SET `email` = CONCAT('profesor', `id_profesor`, '@arcan.local')
  WHERE `email` IS NULL OR `email` = '';

-- Alinear `rol` con admin_sn cuando admin_sn = 1
UPDATE `profesor` SET `rol` = 'admin' WHERE `admin_sn` = 1 AND (`rol` IS NULL OR `rol` = 'profesor');

-- ---------- RESERVA: estado + auditoría ----------
ALTER TABLE `reserva`
  ADD COLUMN IF NOT EXISTS `estado` ENUM('pendiente','confirmada','completada','cancelada')
    NOT NULL DEFAULT 'pendiente' AFTER `observaciones`,
  ADD COLUMN IF NOT EXISTS `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP;

-- Reservas existentes que ya tienen factura → confirmadas
UPDATE `reserva` SET `estado` = 'confirmada'
  WHERE `factura` IS NOT NULL AND `factura` <> '' AND `estado` = 'pendiente';

-- ---------- NOTIFICACION ----------
CREATE TABLE IF NOT EXISTS `notificacion` (
  `id_notificacion` INT(11) NOT NULL AUTO_INCREMENT,
  `destinatario_tipo` ENUM('usuario','profesor') NOT NULL,
  `destinatario_id` INT(11) NOT NULL,
  `tipo` VARCHAR(50) NOT NULL,
  `titulo` VARCHAR(200) NOT NULL,
  `mensaje` TEXT NOT NULL,
  `ref_tipo` VARCHAR(50) NULL,
  `ref_id` INT(11) NULL,
  `leida` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notificacion`),
  KEY `idx_notif_destinatario` (`destinatario_tipo`, `destinatario_id`, `leida`),
  KEY `idx_notif_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- POST-MIGRACIÓN: las contraseñas existentes están en texto plano.
-- Tras aplicar este SQL, ejecuta el seed para hashearlas con bcrypt
-- y crear el primer admin:
--
--   cd backend && npm run seed
--
-- Esto rehashea cualquier contraseña que no empiece por "$2"
-- (formato bcrypt) y crea un admin por defecto si no existe.
-- ============================================================
