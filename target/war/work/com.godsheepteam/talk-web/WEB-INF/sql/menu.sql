/*
MySQL Data Transfer
Source Host: localhost
Source Database: fnsttalk
Target Host: localhost
Target Database: fnsttalk
Date: 2011/11/03 9:25:29
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for menu
-- ----------------------------
CREATE TABLE `menu` (
  `id` varchar(32) NOT NULL,
  `createTime` datetime default NULL,
  `deleted` bit(1) default NULL,
  `uniqueId` varchar(255) default NULL,
  `description` varchar(255) default NULL,
  `icon` varchar(255) default NULL,
  `linkUrl` varchar(255) default NULL,
  `menuName` varchar(255) default NULL,
  `showOrder` int(11) NOT NULL,
  `target` varchar(255) default NULL,
  `parentMenu_id` varchar(32) default NULL,
  PRIMARY KEY  (`id`),
  KEY `FK33155FB73EF7B8` (`parentMenu_id`),
  CONSTRAINT `FK33155FB73EF7B8` FOREIGN KEY (`parentMenu_id`) REFERENCES `menu` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `menu` VALUES ('402881e532681f8b0132682029910002', '2011-09-14 21:28:50', null, '402881e532681f8b0132682029910002', '', null, 'javascript:;', 'TALK管理', '50', 'left', null);
INSERT INTO `menu` VALUES ('8a27029a326200ff01326201ffec0004', '2011-09-13 16:58:10', null, '8a27029a326200ff01326201ffec0004', '', null, 'javascript:;', '系统设定', '0', 'left', null);
INSERT INTO `menu` VALUES ('8a27029a326200ff013262021a6a0008', '2011-09-13 16:58:17', null, '8a27029a326200ff013262021a6a0008', '', null, 'javascript:;', '菜单管理', '1', '', '8a27029a326200ff01326201ffec0004');
INSERT INTO `menu` VALUES ('8a27029a326200ff0132620265f9000e', '2011-09-13 16:58:36', null, '8a27029a326200ff0132620265f9000e', '', null, '/gstTalkWeb/menu/create.htm', '添加菜单', '2', 'main', '8a27029a326200ff013262021a6a0008');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266d3dd5f000c', '2011-09-14 15:25:53', null, '8a27029a3266d0ee013266d3dd5f000c', '', null, '/gstTalkWeb/menu/list.htm', '菜单列表', '3', 'main', '8a27029a326200ff013262021a6a0008');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266d6b7e60018', '2011-09-14 15:29:00', null, '8a27029a3266d0ee013266d6b7e60018', '', null, 'javascript:;', '角色管理', '10', '', '8a27029a326200ff01326201ffec0004');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266d71ad6001d', '2011-09-14 15:29:25', null, '8a27029a3266d0ee013266d71ad6001d', '', null, '/gstTalkWeb/roleInfo/create.htm', '添加角色', '12', 'main', '8a27029a3266d0ee013266d6b7e60018');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266d78f4b0022', '2011-09-14 15:29:55', null, '8a27029a3266d0ee013266d78f4b0022', '', null, '/gstTalkWeb/roleInfo/list.htm', '角色列表', '14', 'main', '8a27029a3266d0ee013266d6b7e60018');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266d82c940027', '2011-09-14 15:30:35', null, '8a27029a3266d0ee013266d82c940027', '', null, 'javascript:;', '资源保护', '20', '', '8a27029a326200ff01326201ffec0004');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266da95760033', '2011-09-14 15:33:13', null, '8a27029a3266d0ee013266da95760033', '', null, '/gstTalkWeb/roleAndUrl/create.htm', '添加资源', '22', 'main', '8a27029a3266d0ee013266d82c940027');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266db1de00038', '2011-09-14 15:33:48', null, '8a27029a3266d0ee013266db1de00038', '', null, '/gstTalkWeb/roleAndUrl/list.htm', '资源列表', '24', 'main', '8a27029a3266d0ee013266d82c940027');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266db868d003d', '2011-09-14 15:34:15', null, '8a27029a3266d0ee013266db868d003d', '', null, 'javascript:;', '用户管理', '30', '', '8a27029a326200ff01326201ffec0004');
INSERT INTO `menu` VALUES ('8a27029a3266d0ee013266dc55d40047', '2011-09-14 15:35:08', null, '8a27029a3266d0ee013266dc55d40047', '', null, '/gstTalkWeb/userInfo/list.htm', '用户列表', '34', 'main', '8a27029a3266d0ee013266db868d003d');
INSERT INTO `menu` VALUES ('8a27029a33581cdb0133581ec6d30016', '2011-10-31 11:56:11', null, '8a27029a33581cdb0133581ec6d30016', '群组申请管理', null, 'javascript:;', '群组申请', '60', 'main', '402881e532681f8b0132682029910002');
INSERT INTO `menu` VALUES ('8a27029a33581cdb0133581f7b5e001b', '2011-10-31 11:56:58', null, '8a27029a33581cdb0133581f7b5e001b', '群组申请审批', null, '/gstTalkWeb/buildChatGroupApp/list.htm', '群组申请审批', '62', 'main', '8a27029a33581cdb0133581ec6d30016');
