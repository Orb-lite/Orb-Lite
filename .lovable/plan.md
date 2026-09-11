# Terminar ventas manuales y registro de clientes

## Objetivo
Completar dentro del CRM las herramientas para registrar ventas hechas fuera de la tienda y dar de alta o actualizar clientes.

## Cambios
- Añadir pestañas visibles para **Nueva venta** y **Registrar cliente** junto a Solicitudes y Clientes.
- En cada producto de una venta manual, permitir escribir el precio unitario aplicado en ese momento.
- Precargar el precio de catálogo al elegir un producto, sin impedir que se modifique.
- Calcular y mostrar el total usando los precios capturados, más el costo de entrega.
- Validar los precios en el servidor y guardar el precio real aplicado en la solicitud y en el historial del cliente.
- Mantener la búsqueda por número de cliente, el número automático para clientes nuevos y los datos opcionales de facturación.
- Comprobar que las nuevas pantallas abran, guarden y actualicen los listados del CRM correctamente.

## Detalles técnicos
- La captura de precios estará limitada a importes válidos no negativos y cantidades de 1 a 100.
- Las operaciones seguirán protegidas por la sesión exclusiva del CRM.
- No se modificará el catálogo ni los precios públicos de la tienda.
