SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- CREACIÓN Y SELECCIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS profinal;
USE profinal;

-- CREACIÓN DE TABLAS
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  correo VARCHAR(150) NOT NULL UNIQUE,
  direccion VARCHAR(255),
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150),
  contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  categoria VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS carrito (
  id_carrito INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS compras (
  id_compra INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE IF NOT EXISTS detalle_compra (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_compra INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2),
  FOREIGN KEY (id_compra) REFERENCES compras(id_compra),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- DATOS DE EJEMPLO
INSERT INTO cliente (correo, direccion, nombre, apellidos, contrasena)
VALUES
('ana@example.com', 'Calle Falsa 123', 'Ana', 'Lopez', '123456'),
('luis@example.com', 'Av. Central 234', 'Luis', 'Gomez', 'abcdef'),
('maria.perez@tienda.com', 'Calle Los Pinos 5, Apt. 2', 'María', 'Pérez Sánchez', 'pass_seguro_1'),
('roberto.g@tienda.com', 'Av. Libertad 456, Col. Sur', 'Roberto', 'García López', 'pass_seguro_2'),
('elena.v@tienda.com', 'Blvd. Principal 101, C.P. 500', 'Elena', 'Valdés', 'pass_seguro_3'),
('sara@tienda.com', 'Casa1, C.P. 1', 'Sara', 'Val', 'pas');


INSERT INTO productos (nombre, precio, categoria)
VALUES
('Mouse Gamer RGB', 520.50, 'Tecnología'),
('Audífonos Bluetooth', 899.99, 'Tecnología');

INSERT INTO carrito (id_cliente, id_producto, cantidad)
VALUES
(1, 1, 2),
(2, 2, 1);

INSERT INTO compras (id_cliente, total)
VALUES
(1, 1041.00),
(2, 899.99);

INSERT INTO detalle_compra (id_compra, id_producto, cantidad, subtotal)
VALUES
(1, 1, 2, 1041.00),
(2, 2, 1, 899.99);

COMMIT;