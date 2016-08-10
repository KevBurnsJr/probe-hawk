CREATE SCHEMA `probe_hawk` DEFAULT CHARACTER SET utf8;

GRANT ALL ON probe_hawk.* TO probe_hawk@'localhost' IDENTIFIED BY 'dOimOvGUpk98n0kv';

CREATE  TABLE `probe_hawk`.`agents` (
  `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `mac` VARCHAR(17) NOT NULL ,
  `name` VARCHAR(32) NOT NULL ,
  `notes` TEXT NULL ,
  `created` DATETIME NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `mac_UNIQUE` (`mac` ASC) ,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE  TABLE `probe_hawk`.`devices` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `mac` VARCHAR(17) NOT NULL ,
  `name` VARCHAR(32) NOT NULL ,
  `notes` TEXT NULL ,
  `created` DATETIME NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `mac_UNIQUE` (`mac` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `probe_hawk`.`logs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `agent_id` smallint(6) NOT NULL,
  `device_id` int(11) NOT NULL,
  `signal_strength` tinyint(3) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_agent_device_created` (`agent_id`,`device_id`,`created`),
  KEY `ix_created` (`created`),
  KEY `ix_device` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `probe_hawk`.`networks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ssid` VARCHAR(64) NOT NULL ,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_ssid` (`ssid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `probe_hawk`.`devices_networks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_device_network` (`device_id`,`network_id`),
  KEY `ix_device` (`device_id`),
  KEY `ix_network` (`network_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `probe_hawk`.`tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL ,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `probe_hawk`.`devices_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_device_tag` (`device_id`,`tag_id`),
  KEY `ix_device` (`device_id`),
  KEY `ix_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

