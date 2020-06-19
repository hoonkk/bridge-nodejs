-- MySQL dump 10.17  Distrib 10.3.17-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bridge
-- ------------------------------------------------------
-- Server version	10.3.17-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `u10_products`
--

DROP TABLE IF EXISTS `u10_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `u10_products` (
  `itemid` varchar(20) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `maker` varchar(20) DEFAULT NULL,
  `pname` varchar(30) DEFAULT NULL,
  `modelnum` varchar(20) DEFAULT NULL,
  `rdate` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `dcrate` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `event` varchar(30) DEFAULT NULL,
  `pic` varchar(200) DEFAULT NULL,
  `exp` varchar(200) DEFAULT NULL,
  `sales` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `u10_products`
--

LOCK TABLES `u10_products` WRITE;
/*!40000 ALTER TABLE `u10_products` DISABLE KEYS */;
INSERT INTO `u10_products` VALUES ('A1112','선풍기','태임','파세코','서큘레이풍기','2020-06-19',90000,0,20,'일반세일','/images/uploads/products/e7b6ac16fbdff59c87ed2a472dbbad8c','요즘 유행하는 서큘레이풍기',270000),('AI112','에어컨','(주)현재전자','벽걸다에어','AIR88','2020-06-09',780000,40,100,'일반세일','/images/uploads/products/949d35ef3aa18e9a204e293dabda333c','상품설명입니다',0),('CLC001','에어컨','클라세','클라세에어컨','AIR081','2020-06-02',700000,15,57,'특별세일','/images/uploads/products/b7754e7630c1056784813fc2db58f18c','상품설명입니다',2100000),('DAW200','에어컨','디우전자','디우에어컨','JJANG1','2020-06-02',450000,5,93,'일반세일','/images/uploads/products/014bbeb9554d0d047ca3232b2e5ad1fe','상품설명입니다',900000),('FFF061','미니선풍기','(주)탁상공론','탁상용선풍기','TTAK2','2020-06-02',15000,15,17,'이벤트세일','/images/uploads/products/cfdedf4f5c41b1db019c99b95a5286d0','상품설명입니다',270000),('III123','선풍기','일지','마루타냉풍기','ac-12','2020-06-19',120000,0,12,'일반세일','/images/uploads/products/34474c53d9610bb19f0eb345f61c28cd','가볍고 쓰기편한 냉풍기',1520000),('INO10','선풍기','아이전자(주)','아이노크','INOQ111','2020-06-02',21500,10,20,'특별세일','/images/uploads/products/6396aab9da2593d76564d192282874de','상품설명입니다',0),('INO103','선풍기','아이전자(주)','블랙선풍기','INOQ112','2020-06-02',21500,20,25,'일반세일','/images/uploads/products/ee226d5d98a509efbec420856bd39dd6','상품설명입니다',172000),('KIM110','냉장고','위니허','김치냉장고','DIMC101','2020-06-09',2000000,10,298,'이벤트세일','/images/uploads/products/3f4353d84f85ffe0d6005bfb225b2642','상품설명입니다',4000000),('NANG2','냉장고','(주)엘자전자','패밀리냉장고','NANG222','2020-06-09',2500000,20,28,'일반세일','/images/uploads/products/fcacb6a264c5bea68aa118e897999b25','상품설명입니다',5000000),('P01010','냉풍기','(주)한경전자','왕추워선풍기','HWA110','2020-06-09',43000,15,215,'일반세일','/images/uploads/products/d82d4a1e90295627d14d1e3dfe615ea2','상품설명입니다',258000),('P10231','선풍기','(주)한경전자','덜덜선풍기','DULDUL1','2020-06-09',51000,10,20,'이벤트세일','/images/uploads/products/e0a199f5d497e085a9543c7ae23b09d1','상품설명입니다',0),('RR234','냉장고','(주)엘자전자','양문형냉장고','FRIG01','2020-06-02',2000000,5,9,'일반세일','/images/uploads/products/63047d1dcdc13f09fc8b47032463a886','상품설명입니다',2000000),('SSS42','미니선풍기','손풍전자(주)','손풍기','SS003','2020-06-02',10000,10,30,'특별세일','/images/uploads/products/b29ffd944dae12ea2f9b81f96eca3ca6','상품설명입니다',50000),('STAR01','얼풍기','(주)스타리온','얼음아','ICE99','2020-06-02',90000,10,10,'특별세일','/images/uploads/products/fb52d427d852fb27b83f01b384fcc9cb','상품설명입니다',0),('UP101','에어컨','(주)삼씽전자','천장형에어컨','SS001','2020-06-02',800000,10,25,'일반세일','/images/uploads/products/c2938998f00f2a94d8901e99290fd0c6','상품설명입니다',2400000),('P0020','선풍기','스위스','스위스선풍기','SWISS-19','2020-06-19',45000,0,55,'특별세일','/images/uploads/products/58b83a2477f9f1410c45c84dbd6989af','스위스에서 들여온 선풍기',0),('P1211','선풍기','대림','에어서큘레이터','ACI-11','2020-06-19',120000,0,22,'일반세일','/images/uploads/products/b3e570a98cccf8131a247228c06dcd2e','에어 서큘레이터',0),('PA001','냉장고','오늘의집','코카콜라미니냉장고','COCO','2020-06-19',245000,0,10,'일반세일','/images/uploads/products/9dd1645f9e176d9d051b55bbe3c78f5f','너무 귀여운 냉장고',0),('P1232','냉풍기','우리인테리어','미니냉풍기','MINI112','2020-06-19',129000,10,55,'일반세일','/images/uploads/products/e963e960c94d71a4ce2d8b53b3b228b2','초미니 냉풍기',0),('P1660','미니선풍기','다이슨','미니미니선풍기','ACP-88','2020-06-19',5500,5,12,'특별세일','/images/uploads/products/08ccb199491b8e8c81a90ad125e27e84','손에 들고다니기 좋음',0),('P9899','냉장고','리차즈','레트로냉장고','RET-12','2020-06-19',595000,10,55,'이벤트세일','/images/uploads/products/f9fd8f753c4c5f6e9a2ee7b75b447229','서양풍 레트로 냉장고',0);
/*!40000 ALTER TABLE `u10_products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-19 21:45:06
