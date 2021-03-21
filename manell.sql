-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema manell
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema manell
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `manell` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `manell` ;

-- -----------------------------------------------------
-- Table `manell`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`categories` (
  `idCategories` INT NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`idCategories`),
  UNIQUE INDEX `idCategories_UNIQUE` (`idCategories` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `manell`.`product_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`product_detail` (
  `pid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(280) NOT NULL,
  `img` VARCHAR(300) NOT NULL,
  `prod_cat` INT NOT NULL,
  `price` INT NOT NULL,
  PRIMARY KEY (`pid`),
  UNIQUE INDEX `pid_UNIQUE` (`pid` ASC) VISIBLE,
  INDEX `cat_idx` (`prod_cat` ASC) VISIBLE,
  CONSTRAINT `cat`
    FOREIGN KEY (`prod_cat`)
    REFERENCES `manell`.`categories` (`idCategories`))
ENGINE = InnoDB
AUTO_INCREMENT = 45
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `manell`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`user` (
  `U_id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Phone` VARCHAR(14) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `Country` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`U_id`),
  UNIQUE INDEX `Phone_UNIQUE` (`Phone` ASC) VISIBLE,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `manell`.`order_details`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`order_details` (
  `uid` INT NOT NULL,
  `pid` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `qty` INT NOT NULL,
  PRIMARY KEY (`uid`, `pid`, `date`),
  INDEX `pid_idx` (`pid` ASC) VISIBLE,
  CONSTRAINT `pid`
    FOREIGN KEY (`pid`)
    REFERENCES `manell`.`product_detail` (`pid`),
  CONSTRAINT `uid`
    FOREIGN KEY (`uid`)
    REFERENCES `manell`.`user` (`U_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `manell`.`shop_shop`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`shop_shop` (
  `sid` INT NOT NULL AUTO_INCREMENT,
  `shop_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE INDEX `index_n0_UNIQUE` (`sid` ASC) VISIBLE,
  UNIQUE INDEX `shop_name_UNIQUE` (`shop_name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 52
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `manell`.`shop_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`shop_user` (
  `shop_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`shop_id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `shop_id`
    FOREIGN KEY (`shop_id`)
    REFERENCES `manell`.`shop_shop` (`sid`),
  CONSTRAINT `user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `manell`.`user` (`U_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `manell`.`shoprod`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manell`.`shoprod` (
  `prodid` INT NOT NULL,
  `shopid` INT NOT NULL,
  UNIQUE INDEX `prodid_UNIQUE` (`prodid` ASC) VISIBLE,
  INDEX `shopid_idx` (`shopid` ASC) VISIBLE,
  CONSTRAINT `prodid`
    FOREIGN KEY (`prodid`)
    REFERENCES `manell`.`product_detail` (`pid`),
  CONSTRAINT `shopid`
    FOREIGN KEY (`shopid`)
    REFERENCES `manell`.`shop_shop` (`sid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `manell` ;

-- -----------------------------------------------------
-- procedure insert_data_shop
-- -----------------------------------------------------

DELIMITER $$
USE `manell`$$
CREATE DEFINER=`new_user`@`%` PROCEDURE `insert_data_shop`(
   IN shopname VARCHAR(50), 
   In  U_id int)
BEGIN
    declare shop_id int  DEFAULT 0;
    
    START TRANSACTION;
    -- Insert account data
    INSERT INTO shop_shop(shop_name)
    values (shopname); 
  
    -- get account id
    SET shop_id = LAST_INSERT_ID();
    
    -- insert phone for the account
    IF shop_id > 0 THEN
	INSERT INTO shop_user(shop_id, user_id)
        VALUES(shop_id, U_id);
        -- commit
        COMMIT;
     ELSE
	ROLLBACK;
    END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure insert_shop_product
-- -----------------------------------------------------

DELIMITER $$
USE `manell`$$
CREATE DEFINER=`new_user`@`%` PROCEDURE `insert_shop_product`(
in uid int
   )
BEGIN
  declare shopid int default 0;
  declare prodid int default 0;
    START TRANSACTION;
  
 select shop_id into @shop_id from shop_user where user_id=uid;
   set shopid=@shop_id;

   SET prodid = LAST_INSERT_ID();
  
  
     IF prodid > 0 THEN
	INSERT INTO shoprod(prodid,shopid)
        VALUES(prodid, shopid);
        -- commit
        COMMIT;
	ELSE
	ROLLBACK;
END IF;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
