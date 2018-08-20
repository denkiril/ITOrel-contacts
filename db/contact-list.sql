-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Авг 20 2018 г., 22:52
-- Версия сервера: 5.6.38
-- Версия PHP: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `contact-list`
--

-- --------------------------------------------------------

--
-- Структура таблицы `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  `email` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `phone`, `email`) VALUES
(1, 'Инфo-Сити', '+74862552003', 'reklama@infoorel.ru'),
(2, 'АктивБК', '88007707040', 'info@activebc.ru'),
(3, 'ДоксВижн', '8 800 5050565', 'job@docsvision.com'),
(4, 'СЕНЛА', '?', 'aksana_yarmak@senla.eu'),
(5, 'Braind', '+74862783630', 'mail@braind.agency'),
(6, 'ОрёлСайтСтрой', '(4862)222-018', 'mail@orelsite.ru'),
(18, 'Арксинус', '+7(495)2799047', 'welcome@arcsinus.ru'),
(22, 'Альфа.Сайт', '+7 (4862) 222-350', 'mail@alfa.site'),
(23, 'Разработка сложных систем', '8 800 777-53-73', 'hr@rubetek.com'),
(24, 'Сторк-Групп', '+7 915 502-53-37', 'contact@stork.ru'),
(25, 'Индустрия делового ПО', '+7(4862)763950', 'info@bsindustry.ru'),
(26, 'Synapse', '+7(4862)508557', 'info@synapse.company'),
(28, 'Инвентос', '+7 (4862) 599-998', 'jobs@inventos.ru'),
(32, 'BTLab', '+7 (495) 363-31-48', 'site@btlab.ru'),
(33, 'ПРОМО ТЕХ', '(495) 724-97-94', 'info@pr-webtech.com'),
(34, 'Кроникс Микросистемс', '+7 920-086-34-69', 'info@cronixms.com');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
