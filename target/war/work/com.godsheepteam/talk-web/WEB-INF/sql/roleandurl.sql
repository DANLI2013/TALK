/*
MySQL Data Transfer
Source Host: localhost
Source Database: fnsttalk
Target Host: localhost
Target Database: fnsttalk
Date: 2011/11/03 9:25:46
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for roleandurl
-- ----------------------------
CREATE TABLE `roleandurl` (
  `id` varchar(32) NOT NULL,
  `createTime` datetime default NULL,
  `deleted` bit(1) default NULL,
  `uniqueId` varchar(255) default NULL,
  `roles` varchar(255) default NULL,
  `rolesDescription` varchar(255) default NULL,
  `sequence` int(11) NOT NULL,
  `url` varchar(255) default NULL,
  `urlDescription` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `roleandurl` VALUES ('402881e533641dde0133641f45df0008', '2011-11-02 19:52:10', null, '402881e533641dde0133641f45df0008', 'ROLE_USER', 'User Group拥有访问权限', '0', '/chater/home.htm', '用户主页');
INSERT INTO `roleandurl` VALUES ('402881e533641dde0133641f9ab6000d', '2011-11-02 19:52:32', null, '402881e533641dde0133641f9ab6000d', 'ROLE_USER', 'User Group拥有访问权限', '0', '/chater/update.htm', '更新用户信息');
INSERT INTO `roleandurl` VALUES ('402881e533641dde0133641ff50b0011', '2011-11-02 19:52:55', null, '402881e533641dde0133641ff50b0011', 'ROLE_USER', 'User Group拥有访问权限', '0', '/chater/goUploadAvatar.htm', '上传个人头像');
INSERT INTO `roleandurl` VALUES ('402881e533641dde0133642035ce0015', '2011-11-02 19:53:12', null, '402881e533641dde0133642035ce0015', 'ROLE_ROOT,ROLE_MANAGER,ROLE_USER', 'Admin Group,Manager Group,User Group拥有访问权限', '0', '/chater/changePwd.htm', '修改密码');
INSERT INTO `roleandurl` VALUES ('402881e53364225a013364239d04000b', '2011-11-02 19:56:55', null, '402881e53364225a013364239d04000b', 'ROLE_USER', 'User Group拥有访问权限', '0', '/chatGroup/update/**', '更新群');
INSERT INTO `roleandurl` VALUES ('402881e53364225a013364242b090010', '2011-11-02 19:57:31', null, '402881e53364225a013364242b090010', 'ROLE_USER', 'User Group拥有访问权限', '0', '/chatGroup/goUploadCover/**', '上传群组头像');
INSERT INTO `roleandurl` VALUES ('402881e53364225a01336424d89b0017', '2011-11-02 19:58:16', null, '402881e53364225a01336424d89b0017', 'ROLE_USER', 'User Group拥有访问权限', '0', '/buildChatGroupApp/create.htm', '提交创建群组的申请');
INSERT INTO `roleandurl` VALUES ('402881e53364225a013364282c7b002c', '2011-11-02 20:01:54', null, '402881e53364225a013364282c7b002c', 'ROLE_USER', 'User Group拥有访问权限', '0', '/chatGroup/app2Join.htm', '申请加入群组');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb0133586634970013', '2011-10-31 13:14:13', null, '8a27029a335862fb0133586634970013', 'ROLE_ROOT,ROLE_MANAGER', 'Admin Group,Manager Group拥有访问权限', '0', '/login.htm', '进入管理界面');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb0133586690440017', '2011-10-31 13:14:36', null, '8a27029a335862fb0133586690440017', 'ROLE_ROOT', 'Admin Group拥有访问权限', '1', '/menu/**', '管理菜单');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb01335866ea2c001b', '2011-10-31 13:14:59', null, '8a27029a335862fb01335866ea2c001b', 'ROLE_ROOT', 'Admin Group拥有访问权限', '0', '/roleInfo/**', '管理角色');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb01335867b711001f', '2011-10-31 13:15:51', null, '8a27029a335862fb01335867b711001f', 'ROLE_ROOT', 'Admin Group拥有访问权限', '0', '/roleAndUrl/**', '配置资源保护列表');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb013358682d2b0023', '2011-10-31 13:16:22', null, '8a27029a335862fb013358682d2b0023', 'ROLE_ROOT', 'Admin Group拥有访问权限', '0', '/userInfo/**', '管理用户');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb01335868d0220027', '2011-10-31 13:17:03', null, '8a27029a335862fb01335868d0220027', 'ROLE_ROOT,ROLE_MANAGER', 'Admin Group,Manager Group拥有访问权限', '0', '/buildChatGroupApp/list.htm', '显示所有申请');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb0133586969f1002b', '2011-10-31 13:17:43', null, '8a27029a335862fb0133586969f1002b', 'ROLE_ROOT,ROLE_MANAGER', 'Admin Group,Manager Group拥有访问权限', '0', '/buildChatGroupApp/show/**', '显示创建群组申请');
INSERT INTO `roleandurl` VALUES ('8a27029a335862fb0133586a4751002f', '2011-10-31 13:18:39', null, '8a27029a335862fb0133586a4751002f', 'ROLE_ROOT,ROLE_MANAGER', 'Admin Group,Manager Group拥有访问权限', '0', '/buildChatGroupApp/dealWith.htm', '处理创建群组申请');
