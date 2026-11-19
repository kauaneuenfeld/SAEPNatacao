-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema SaepNatacao
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema SaepNatacao
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SaepNatacao` DEFAULT CHARACTER SET utf8 ;
USE `SaepNatacao` ;

-- -----------------------------------------------------
-- Table `SaepNatacao`.`Responsavel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SaepNatacao`.`Responsavel` (
  `id_responsavel` INT NOT NULL auto_increment,
  `Responsavel` VARCHAR(100) NOT NULL,
  `CPF` varbinary(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_responsavel`),
  UNIQUE INDEX `CPF_UNIQUE` (`CPF` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SaepNatacao`.`Filho`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SaepNatacao`.`Filho` (
  `id_filho` INT NOT NULL auto_increment,
  `Nome` VARCHAR(100) NOT NULL,
  `dataNascimento` DATE NOT NULL,
  `nivelNatacao` ENUM('Iniciante', 'Intermediario', 'Avancado') NULL,
  `id_responsavel` INT NOT NULL,
  PRIMARY KEY (`id_filho`, `id_responsavel`),
  INDEX `fk_Filho_Responsavel1_idx` (`id_responsavel` ASC) VISIBLE,
  CONSTRAINT `fk_Filho_Responsavel1`
    FOREIGN KEY (`id_responsavel`)
    REFERENCES `SaepNatacao`.`Responsavel` (`id_responsavel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SaepNatacao`.`Agendamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SaepNatacao`.`Agendamentos` (
  `id_agendamentos` INT NOT NULL auto_increment,
  `nomeProfessor` VARCHAR(100) NOT NULL,
  `dataEhorario` DATETIME NOT NULL,
  `id_filho` INT NOT NULL,
  PRIMARY KEY (`id_agendamentos`, `id_filho`),
  INDEX `fk_Agendamentos_Filho1_idx` (`id_filho` ASC) VISIBLE,
  CONSTRAINT `fk_Agendamentos_Filho1`
    FOREIGN KEY (`id_filho`)
    REFERENCES `SaepNatacao`.`Filho` (`id_filho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SaepNatacao`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SaepNatacao`.`usuarios` (
  `id` INT NOT NULL auto_increment,
  `nome` VARCHAR(100) NULL,
  `login` VARCHAR(50) NULL,
  `senha` VARCHAR(64) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

insert into `SaepNatacao`.`usuarios` (`nome`, `login`, `senha`) values
('Administrador', 'admin', sha2('123', 256)),
('Bruna Costa', 'bruna', sha2('123', 256)),
('Diego Ramos', 'Diego', sha2('123', 256));

insert into `SaepNatacao`.`Responsavel`(`Responsavel`,`CPF`,`email`, `telefone`) Values
('Helena Souza', aes_encrypt('111.222.333-44', 'chave123' ), 'helena@email.com', '(48) 99999-0001'),
('Igor martins', aes_encrypt('222.333.444-55', 'chave123'), 'igor@email.com', '(48) 99999-0002'),
('Joana Lima', aes_encrypt('333.444.555-66', 'chave123'), 'joana@email.com', '(48) 99999-0003');

insert into `SaepNatacao` . `Filho`(`nome`, `dataNascimento`, `nivelNatacao`, `id_responsavel`) Values
('Gedian', '2009-04-25', 'Iniciante', 1),
('Weslley', '2008-11-06', 'Avancado', 2),
('Kauã', '2009-08-18', 'Intermediario', 3);

insert into `SaepNatacao`.`Agendamentos`( `nomeProfessor`,`dataEhorario`,`id_filho`) Values
('Lucas', '2026-11-18 09:30:00', 1),
('Peterson', '2026-11-18 10:00:00', 2),
('André', '2026-11-18 10:30:00', 3);

select * from responsavel;
select * from usuarios;
select * from Filho;
select * from Agendamentos;
