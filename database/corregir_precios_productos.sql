-- Script para corregir los precios de productos
-- Ejecutar en MySQL Workbench

USE salon_sf;

-- Actualizar precios a los valores correctos
UPDATE productos SET precio = 269.00 WHERE nombre = 'Due Faccetta Lunga Durata';
UPDATE productos SET precio = 269.00 WHERE nombre = 'Due Faccetta Massimo';
UPDATE productos SET precio = 269.00 WHERE nombre = 'Due Faccetta Giorno Per Giorno';
UPDATE productos SET precio = 199.00 WHERE nombre = 'Balsami Presto Treatment';
UPDATE productos SET precio = 229.00 WHERE nombre = 'Riccioli Leave-In Cream';
UPDATE productos SET precio = 149.00 WHERE nombre = 'Silk System Shine';
UPDATE productos SET precio = 279.00 WHERE nombre = 'Perfect Blonder 1 - Shampoo';
UPDATE productos SET precio = 279.00 WHERE nombre = 'Perfect Blonder 2 - Máscara';
UPDATE productos SET precio = 269.00 WHERE nombre = 'W-One Shampoo';
UPDATE productos SET precio = 269.00 WHERE nombre = 'W-One Acondicionador 3 en 1';

-- Verificar que los precios se actualizaron correctamente
SELECT nombre, precio FROM productos ORDER BY nombre;

-- Mostrar mensaje de confirmación
SELECT 'Precios actualizados correctamente' as mensaje;
