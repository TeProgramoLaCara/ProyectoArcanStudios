-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 10, 2026 at 01:44 AM
-- Server version: 5.7.35-0ubuntu0.18.04.2
-- PHP Version: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `BD_ARCAN`
--
CREATE DATABASE IF NOT EXISTS `BD_ARCAN` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `BD_ARCAN`;

-- --------------------------------------------------------

--
-- Table structure for table `aula`
--

CREATE TABLE `aula` (
  `id_aula` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `capacidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `aula`
--

INSERT INTO `aula` (`id_aula`, `nombre`, `capacidad`) VALUES
(1, 'Aula 101', 30),
(3, 'Aula 102', 30),
(4, 'Aula 103', 50),
(100, 'Aula 101', 30),
(101, 'Aula 202', 25),
(102, 'Laboratorio A', 20),
(103, 'Aula test 3', 30);

-- --------------------------------------------------------

--
-- Table structure for table `capacitacion`
--

CREATE TABLE `capacitacion` (
  `id_capacitacion` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `duracion` int(11) DEFAULT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `capacitacion`
--

INSERT INTO `capacitacion` (`id_capacitacion`, `nombre`, `duracion`, `descripcion`) VALUES
(100, 'Liderazgo', 10, 'Habilidades de liderazgo'),
(101, 'Negocio prueba', 6, 'Aprende a organizar tareas y priorizar.'),
(102, 'Seguridad', 6, 'Protocolos de seguridad'),
(103, 'Capacitación de prueba', 122, 'Curso avanzado para mejorar la gestión de equipos de trabajo.');

-- --------------------------------------------------------

--
-- Table structure for table `capacitacion_curso`
--

CREATE TABLE `capacitacion_curso` (
  `capacitacion_id` int(11) NOT NULL,
  `curso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `capacitacion_curso`
--

INSERT INTO `capacitacion_curso` (`capacitacion_id`, `curso_id`) VALUES
(100, 100),
(100, 101),
(101, 102);

-- --------------------------------------------------------

--
-- Table structure for table `capacitacion_profesor`
--

CREATE TABLE `capacitacion_profesor` (
  `capacitacion_id` int(11) NOT NULL,
  `profesor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `capacitacion_profesor`
--

INSERT INTO `capacitacion_profesor` (`capacitacion_id`, `profesor_id`) VALUES
(100, 100),
(101, 101),
(102, 102);

-- --------------------------------------------------------

--
-- Table structure for table `curso`
--

CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `duracion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `curso`
--

INSERT INTO `curso` (`id_curso`, `nombre`, `descripcion`, `duracion`) VALUES
(100, 'Comunicación', 'Habilidades comunicativas', 5),
(101, 'Negocio prueba', 'Aprende a organizar tareas y priorizar.', 6),
(102, 'Primeros Auxilios', 'Atención básica', 6),
(103, 'Curso de Gestión de laprueba', 'Aprende a organizar tareas y priorizar.', 6);

-- --------------------------------------------------------

--
-- Table structure for table `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `e_mail` varchar(200) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `nombre`, `e_mail`, `contraseña`) VALUES
(100, 'Arcan Studios', 'contacto@arcan.com', '1234'),
(101, 'Arcan put', 'contactoput@arcan.com', '1234123'),
(102, 'GlobalCorp', 'admin@global.com', 'pass123'),
(104, 'Arcan  ejemlo', 'contacto@arcan.com', '1234');

-- --------------------------------------------------------

--
-- Table structure for table `perfil`
--

CREATE TABLE `perfil` (
  `id_perfil` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `perfil`
--

INSERT INTO `perfil` (`id_perfil`, `nombre`, `descripcion`) VALUES
(1, 'Perfil de prueba', 'Probando API'),
(3, 'Perfil de joel prueba', 'Probando por dos'),
(100, 'Administrador', 'Acceso total'),
(101, 'carpintero', 'Acceso total al sistema del tin'),
(102, 'Estudiante', 'Recibe formación'),
(103, 'Administrador sigue prueba', 'Acceso total al sistema');

-- --------------------------------------------------------

--
-- Table structure for table `perfil_capacitacion`
--

CREATE TABLE `perfil_capacitacion` (
  `perfil_id` int(11) NOT NULL,
  `capacitacion_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `perfil_capacitacion`
--

INSERT INTO `perfil_capacitacion` (`perfil_id`, `capacitacion_id`) VALUES
(100, 100),
(101, 101),
(102, 102);

-- --------------------------------------------------------

--
-- Table structure for table `profesor`
--

CREATE TABLE `profesor` (
  `id_profesor` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `disponibilidad` text,
  `admin_sn` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `profesor`
--

INSERT INTO `profesor` (`id_profesor`, `nombre`, `contraseña`, `disponibilidad`, `admin_sn`) VALUES
(100, 'Carlos Pérez', '1234', 'Lunes a Viernes', 0),
(101, 'mari consuelo', '1234', 'Lunes a viernes', 0),
(102, 'Luis Ramírez', 'pass123', 'Fines de semana', 1),
(103, 'Carlos Ramírez', '1234', 'Lunes a viernes', 0);

-- --------------------------------------------------------

--
-- Table structure for table `reserva`
--

CREATE TABLE `reserva` (
  `id_reserva` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `curso_id` int(11) NOT NULL,
  `n_estudiantes` int(11) DEFAULT NULL,
  `fecha_ini` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `factura` varchar(200) DEFAULT NULL,
  `observaciones` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reserva`
--

INSERT INTO `reserva` (`id_reserva`, `usuario_id`, `curso_id`, `n_estudiantes`, `fecha_ini`, `fecha_fin`, `factura`, `observaciones`) VALUES
(100, 100, 100, 20, '2024-01-10 09:00:00', '2024-01-10 13:00:00', 'FAC-100', 'Sin observaciones'),
(101, 100, 100, 12, '2026-04-10 09:00:00', '2026-04-10 13:00:00', 'FAC-2026-001', 'Ahi tamo'),
(102, 102, 102, 10, '2024-01-20 08:00:00', '2024-01-20 12:00:00', 'FAC-102', 'Aula pequeña'),
(103, 100, 100, 12, '2026-04-10 09:00:00', '2026-04-10 13:00:00', 'FAC-2026-001', 'Reserva inicial');

-- --------------------------------------------------------

--
-- Table structure for table `sesion`
--

CREATE TABLE `sesion` (
  `id_sesion` int(11) NOT NULL,
  `reserva_id` int(11) NOT NULL,
  `aula_id` int(11) NOT NULL,
  `profesor_id` int(11) NOT NULL,
  `capacitacion_id` int(11) NOT NULL,
  `duracion` int(11) DEFAULT NULL,
  `fecha_ini` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `turno` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sesion`
--

INSERT INTO `sesion` (`id_sesion`, `reserva_id`, `aula_id`, `profesor_id`, `capacitacion_id`, `duracion`, `fecha_ini`, `fecha_fin`, `turno`) VALUES
(100, 100, 100, 100, 100, 4, '2024-01-10 09:00:00', '2024-01-10 13:00:00', 'Mañana'),
(101, 100, 100, 100, 100, 4, '2024-01-10 09:00:00', '2024-01-10 13:00:00', 'por la tardecita'),
(102, 102, 102, 102, 102, 4, '2024-01-20 08:00:00', '2024-01-20 12:00:00', 'Mañana'),
(103, 100, 100, 100, 100, 4, '2024-01-10 09:00:00', '2024-01-10 13:00:00', 'Mañana');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `jefe_sn` tinyint(1) DEFAULT '0',
  `empresa_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `contraseña`, `jefe_sn`, `empresa_id`) VALUES
(100, 'Juan Pedro', '1236', 1, 100),
(101, 'Elver', '1234', 1, 100),
(102, 'Pedro Sánchez', 'pass123', 0, 102),
(103, 'Juanito', '1234', 1, 100);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`id_aula`);

--
-- Indexes for table `capacitacion`
--
ALTER TABLE `capacitacion`
  ADD PRIMARY KEY (`id_capacitacion`);

--
-- Indexes for table `capacitacion_curso`
--
ALTER TABLE `capacitacion_curso`
  ADD PRIMARY KEY (`capacitacion_id`,`curso_id`),
  ADD KEY `fk_cc_curso` (`curso_id`);

--
-- Indexes for table `capacitacion_profesor`
--
ALTER TABLE `capacitacion_profesor`
  ADD PRIMARY KEY (`capacitacion_id`,`profesor_id`),
  ADD KEY `fk_cp_profesor` (`profesor_id`);

--
-- Indexes for table `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`);

--
-- Indexes for table `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`);

--
-- Indexes for table `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`id_perfil`);

--
-- Indexes for table `perfil_capacitacion`
--
ALTER TABLE `perfil_capacitacion`
  ADD PRIMARY KEY (`perfil_id`,`capacitacion_id`),
  ADD KEY `fk_pc_capacitacion` (`capacitacion_id`);

--
-- Indexes for table `profesor`
--
ALTER TABLE `profesor`
  ADD PRIMARY KEY (`id_profesor`);

--
-- Indexes for table `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `fk_reserva_usuario` (`usuario_id`),
  ADD KEY `fk_reserva_curso` (`curso_id`);

--
-- Indexes for table `sesion`
--
ALTER TABLE `sesion`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `fk_sesion_reserva` (`reserva_id`),
  ADD KEY `fk_sesion_aula` (`aula_id`),
  ADD KEY `fk_sesion_profesor` (`profesor_id`),
  ADD KEY `fk_sesion_capacitacion` (`capacitacion_id`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `fk_usuario_empresa` (`empresa_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aula`
--
ALTER TABLE `aula`
  MODIFY `id_aula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `capacitacion`
--
ALTER TABLE `capacitacion`
  MODIFY `id_capacitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `curso`
--
ALTER TABLE `curso`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `perfil`
--
ALTER TABLE `perfil`
  MODIFY `id_perfil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `profesor`
--
ALTER TABLE `profesor`
  MODIFY `id_profesor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `sesion`
--
ALTER TABLE `sesion`
  MODIFY `id_sesion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `capacitacion_curso`
--
ALTER TABLE `capacitacion_curso`
  ADD CONSTRAINT `fk_cc_capacitacion` FOREIGN KEY (`capacitacion_id`) REFERENCES `capacitacion` (`id_capacitacion`),
  ADD CONSTRAINT `fk_cc_curso` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id_curso`);

--
-- Constraints for table `capacitacion_profesor`
--
ALTER TABLE `capacitacion_profesor`
  ADD CONSTRAINT `fk_cp_capacitacion` FOREIGN KEY (`capacitacion_id`) REFERENCES `capacitacion` (`id_capacitacion`),
  ADD CONSTRAINT `fk_cp_profesor` FOREIGN KEY (`profesor_id`) REFERENCES `profesor` (`id_profesor`);

--
-- Constraints for table `perfil_capacitacion`
--
ALTER TABLE `perfil_capacitacion`
  ADD CONSTRAINT `fk_pc_capacitacion` FOREIGN KEY (`capacitacion_id`) REFERENCES `capacitacion` (`id_capacitacion`),
  ADD CONSTRAINT `fk_pc_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `perfil` (`id_perfil`);

--
-- Constraints for table `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_curso` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id_curso`),
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`);

--
-- Constraints for table `sesion`
--
ALTER TABLE `sesion`
  ADD CONSTRAINT `fk_sesion_aula` FOREIGN KEY (`aula_id`) REFERENCES `aula` (`id_aula`),
  ADD CONSTRAINT `fk_sesion_capacitacion` FOREIGN KEY (`capacitacion_id`) REFERENCES `capacitacion` (`id_capacitacion`),
  ADD CONSTRAINT `fk_sesion_profesor` FOREIGN KEY (`profesor_id`) REFERENCES `profesor` (`id_profesor`),
  ADD CONSTRAINT `fk_sesion_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id_reserva`);

--
-- Constraints for table `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
