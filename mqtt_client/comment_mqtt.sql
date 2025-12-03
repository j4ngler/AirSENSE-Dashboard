-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 17, 2021 lúc 09:20 AM
-- Phiên bản máy phục vụ: 10.1.36-MariaDB
-- Phiên bản PHP: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `comment_mqtt`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `group_comment`
--

CREATE TABLE `group_comment` (
  `group_comment_id` int(11) NOT NULL,
  `name` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `group_chat_detail`
--

CREATE TABLE `group_comment_detail` (
  `id` int(11) NOT NULL,
  `group_comment_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `list_friend_chat`
--

CREATE TABLE `list_friend_comment` (
  `id` int(11) NOT NULL,
  `name` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `color` varchar(25) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `icon` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `user_friend_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `oauthen2`
--

CREATE TABLE `oauthen2` (
  `id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `tocken` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci DEFAULT NULL,
  `value_manifest` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `time_relase` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `oldid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `oauthen2`
--


--
-- Cấu trúc bảng cho bảng `persional_comment`
--

CREATE TABLE `persional_comment` (
  `persional_comment_id` int(11) NOT NULL,
  `name` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `color` varchar(25) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `icon` varchar(256) CHARACTER SET utf32 COLLATE utf32_vietnamese_ci NOT NULL,
  `user_friend_id1` int(11) NOT NULL,
  `user_friend_id2` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `id_created` int(11) NOT NULL,
  `id_updated` int(11) NOT NULL,
  `deleteflag` int(11) NOT NULL,
  `oldid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Đang đổ dữ liệu cho bảng `persional_chat`
--


--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `group_chat`
--
ALTER TABLE `group_comment`
  ADD PRIMARY KEY (`group_comment_id`);

--
-- Chỉ mục cho bảng `group_chat_detail`
--
ALTER TABLE `group_comment_detail`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `list_friend_chat`
--
ALTER TABLE `list_friend_comment`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `oauthen2`
--
ALTER TABLE `oauthen2`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `persional_chat`
--
ALTER TABLE `persional_comment`
  ADD PRIMARY KEY (`persional_comment_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `group_chat`
--
ALTER TABLE `group_comment`
  MODIFY `group_comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `group_chat_detail`
--
ALTER TABLE `group_comment_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `list_friend_chat`
--
ALTER TABLE `list_friend_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `oauthen2`
--
ALTER TABLE `oauthen2`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT cho bảng `persional_chat`
--
ALTER TABLE `persional_comment`
  MODIFY `persional_comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
