
# Consideraciones

## 4 contenedores el archivo de *docker-compose.yml*:

* frontend
* backend
* db
* adminer (administrador de base de datos)

Para poder correr los cambios con los contenedores es necesario hacer lo siguiente:

1. Tener la app de docker desktop abierta
2. En la consola de comandos situarse en la ruta donde esté la carpeta raiz (frontend, backend, docker-compose.yml...) y hacer lo siguiente:

docker-compose up -d --build

verificar que los 4 contenedores estén activos aqui:
docker ps

3. Probar la URL de la tienda

API:
http://localhost:5000 

Tienda virtual:
http://localhost:8080 Tienda virtual

adminer:
http://localhost:8081/?server=db&username=root

* servidor db
* usuario: root
* contraseña: 1234
* profinal

4. Probar los datos de las tablas en la consola

docker exec -it distribuidosfinal-main-db-1 mysql -u root -p

Ingresar contraseña: 1234

teclear:
USE profinal

SELECT * FROM cliente;

Con esto podrian ver las tablas con datos....

## otros comandos utiles

* docker-compose down -v # es mas util este que elimina todo,  detiene y elimina contenedores viejos










