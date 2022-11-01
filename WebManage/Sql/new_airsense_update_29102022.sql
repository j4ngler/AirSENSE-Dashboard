-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2022 at 03:56 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `new_airsense`
--

-- --------------------------------------------------------

--
-- Table structure for table `aqi_data`
--

CREATE TABLE `aqi_data` (
  `time` int(11) NOT NULL,
  `station_id` int(18) NOT NULL,
  `aqi` float DEFAULT NULL,
  `SO2_aqi` float DEFAULT NULL,
  `PM25_aqi` float DEFAULT NULL,
  `PM10_aqi` float DEFAULT NULL,
  `NO2_aqi` float DEFAULT NULL,
  `PM1_aqi` float DEFAULT NULL,
  `CO_aqi` float DEFAULT NULL,
  `O3_aqi` float DEFAULT NULL,
  `CO2_aqi` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `content_group`
--

CREATE TABLE `content_group` (
  `content_group_id` int(11) NOT NULL,
  `title` varchar(256) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `content_page`
--

CREATE TABLE `content_page` (
  `content_page_id` int(11) NOT NULL,
  `content_sub_id` int(11) NOT NULL,
  `group_file` varchar(50) DEFAULT NULL,
  `file_save` varchar(100) DEFAULT NULL,
  `title` varchar(50) NOT NULL,
  `description` varchar(1024) NOT NULL,
  `content_img` varchar(1024) NOT NULL,
  `set_to_first` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `content_sub`
--

CREATE TABLE `content_sub` (
  `content_sub_id` int(11) NOT NULL,
  `content_group_id` int(11) NOT NULL,
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(50) NOT NULL,
  `address` int(11) DEFAULT NULL,
  `permission_id` int(11) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `data_average`
--

CREATE TABLE `data_average` (
  `time` int(11) NOT NULL,
  `station_id` int(18) NOT NULL,
  `NO2` float DEFAULT NULL,
  `O3` float DEFAULT NULL,
  `O3in8Hrs` float DEFAULT NULL,
  `SO2` float DEFAULT NULL,
  `CO` float DEFAULT NULL,
  `PM2p5` float DEFAULT NULL,
  `PM10` float DEFAULT NULL,
  `humidity` float DEFAULT NULL,
  `temperature` float DEFAULT NULL,
  `pressure` float DEFAULT NULL,
  `wind_speed` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `device_sensor`
--

CREATE TABLE `device_sensor` (
  `station_id` int(11) NOT NULL,
  `mac` varchar(50) NOT NULL,
  `longtitude` float NOT NULL,
  `latitude` float NOT NULL,
  `title` varchar(256) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `address` varchar(256) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `type_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `equipment_status`
--

CREATE TABLE `equipment_status` (
  `id` int(11) NOT NULL,
  `station_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `method` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `reason` varchar(256) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `reply_status` varchar(256) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `oauthen2`
--

CREATE TABLE `oauthen2` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `token` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `time_relase` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_flag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `oauthen2_customer`
--

CREATE TABLE `oauthen2_customer` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `token` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `time_relase` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `delete_flag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `permission_id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `regis_sensor`
--

CREATE TABLE `regis_sensor` (
  `id` int(18) NOT NULL,
  `user_id` int(18) NOT NULL,
  `user_type` int(11) NOT NULL,
  `station_id` int(18) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `reset_password`
--

CREATE TABLE `reset_password` (
  `id` int(18) NOT NULL,
  `user_type` int(18) NOT NULL,
  `user_id` int(18) NOT NULL,
  `permission_id` int(18) NOT NULL,
  `token_reset` varchar(256) NOT NULL,
  `created_at` datetime NOT NULL,
  `time_release` datetime NOT NULL,
  `delete_flag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sensor_device_type`
--

CREATE TABLE `sensor_device_type` (
  `devcie_type_id` int(11) NOT NULL,
  `content` varchar(256) CHARACTER SET utf8 COLLATE utf8_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) NOT NULL,
  `old_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(50) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `permission_id` int(11) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `delete_flag` int(11) DEFAULT NULL,
  `old_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `content_group`
--
ALTER TABLE `content_group`
  ADD PRIMARY KEY (`content_group_id`);

--
-- Indexes for table `content_sub`
--
ALTER TABLE `content_sub`
  ADD PRIMARY KEY (`content_sub_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `device_sensor`
--
ALTER TABLE `device_sensor`
  ADD PRIMARY KEY (`station_id`);

--
-- Indexes for table `oauthen2`
--
ALTER TABLE `oauthen2`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauthen2_customer`
--
ALTER TABLE `oauthen2_customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`permission_id`);

--
-- Indexes for table `regis_sensor`
--
ALTER TABLE `regis_sensor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `content_group`
--
ALTER TABLE `content_group`
  MODIFY `content_group_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `content_sub`
--
ALTER TABLE `content_sub`
  MODIFY `content_sub_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regis_sensor`
--
ALTER TABLE `regis_sensor`
  MODIFY `id` int(18) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
