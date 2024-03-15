<p align="center"><a href="https://www.linkedin.com/company/nelumbo-consultores/" target="_blank"><img src="https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-Nelumbo/assets/48332117/4a575e1d-daca-4ea9-96ed-7d77b825f5ac" width="400"></a></p>

# Reto Técnico Nelumbo Backend: Parqueadero Node.js con Ts

## Tabla de Contenido
1. [Descripción](#descripción)
2. [Tecnologías](#tecnologías)
3. [Modelo Relacional BD](#modelo-relacional-bd)
4. [Requisitos](#requisitos)
5. [Herramientas Recomendadas](#herramientas-recomendadas)
6. [Instalación y Uso](#instalación-y-uso)
7. [Autor](#autor)


___
### Descripción: 

Esta APIREST está diseñada para gestionar el control de vehículos en parqueaderos de varios socios, ofreciendo funcionalidades como el registro de vehículos, indicadores y un historial de vehículos parqueados. Además, se implementa un sistema de usuarios con roles (ADMIN, SOCIO) y protección mediante autorización JWT token con una expiración de 6 horas.

___
### Tecnologías:
#### Backend

- [TypeScript (Tsc 5.3.3)](https://www.typescriptlang.org/ "TypeScript") : TypeScript es un lenguaje de programación de código abierto desarrollado y mantenido por Microsoft. Es una extensión de JavaScript que agrega características como tipos estáticos, interfaces, clases y módulos al lenguaje, lo que permite escribir código más seguro y mantenible.
- [Node.js](https://nodejs.org/en "Node.js"):  Node.js es un entorno de ejecución de JavaScript basado en el motor V8 de Google Chrome. Permite ejecutar código JavaScript en el lado del servidor, lo que lo convierte en una herramienta muy poderosa para desarrollar aplicaciones web y de red escalables y de alto rendimiento.
- [Token JWT (JSON Web Token)](https://jwt.io/ "Token JWT (JSON Web Token)"): JWT es un estándar abierto (RFC 7519) que define una forma compacta y autocontenida de representar información entre dos partes. La información puede ser verificada y confiable, ya que está firmada digitalmente.
- [PostgreSQL](https://www.postgresql.org/ "PostgreSQL"): PostgreSQL es un sistema de gestión de bases de datos relacional y de código abierto. Es conocido por su robustez, capacidad de gestión de grandes cantidades de datos y soporte para funciones avanzadas.
- [MongoDB](https://www.mongodb.com/es): MongoDB: MongoDB es un sistema de gestión de bases de datos NoSQL (Not Only SQL) que se destaca por ser orientado a documentos. Fue desarrollado para abordar las limitaciones de los sistemas de bases de datos relacionales tradicionales y ofrece un enfoque flexible y escalable para el almacenamiento y la recuperación de datos.


___
### Modelo Relacional BD:

![Modelo relacional Parqueadero-Modelo relacional - Parqueadero Node js con Ts drawio](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/7bd18593-e8e3-4d88-8312-0266e1dab2f1)



___

### Requisitos:

- [Node.js - v20.9.0 o superior](https://nodejs.org/en "v20.9.0 o superior")
- [TypeScript - Version 5.3.3 o superior](https://www.typescriptlang.org/ "Version 5.3.3 o superior")
- [Npm - Version 10.1.0 o superior](https://www.npmjs.com/ "Version 10.1.0 o superior")
- [PostgreSQL](https://www.postgresql.org/ "PostgreSQL")
- [MongoDB](https://www.mongodb.com/e "MongoDB")
- [Git](https://git-scm.com/ "Git")

___

### Herramientas Recomendadas:

- [Visual Studio Code](https://code.visualstudio.com/ "Visual Studio Code"): recomendable instalar la extensión de sonarlint.
- [Postman](https://www.postman.com/ "Postman")
- [DBeaver Community](https://dbeaver.io/ "DBeaver Community")
- [MongoDB: Community Server y Compass](https://www.mongodb.com/try/download/community "MongoDB: Community Server y Compass")

___


### Instalación y Uso:


##### 1. Clonar el repositorio del proyecto
Para clonar el proyecto abre una terminal o consola de comandos y escribe el siguiente comando, esto es después de la instrucción git clone agrega la dirección GitHub:

```sh
git clone https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS.git
```

##### 2. Crear dos base de datos para los dos microservicios
Crear dos base de datos local:
- La primera de nombre "parqueadero_db" para el microservicio de parqueadero-service en PostgreSQL.
- La segunda de nombre "correodb" para el microservicio de correo-service en MongoDB.


##### 3.Abrir las dos carpetas de los microservicios de forma independiente en el IDE
Luego de crear las base de datos en local, se abren las carpetas de ambos microservicios de forma independiente de preferencia en el IDE de Visual Studio Code y se le da en el botón de "Trust project".
![carpetas](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/2ef43811-7fa1-4af0-93a3-39e2d73178e1)



##### 4. Instalar las dependencias con npm en ambos microservicios
Abrimos una consola de git bash o cmd en el visual studio code, y nos ubicamos en la raiz de cada microservicio y colocamos el siguiente comando para instalar las dependencias:
```sh
npm i 
```
o
```sh
npm install
```
Ejemplo:
#### Microservicio de parqueadero
![npm parqueadero](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/cc9c0183-a44c-4075-add6-eba8886c6726)

#### Microservicio de correo
![npm correo](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/7b41439c-7cdf-42b1-af31-329eb4551f95)

##### 5.Crear un archivo `.env` en el directorio raíz de cada microservicio 
Creamos un archivo `.env` en el directorio raíz de cada microservicio y configuramos las variables de entorno necesarias. Aquí tienes un ejemplo de las .env que debes crear para cada microservicio:

![visual studio code](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/3255f107-a15b-427c-9c12-51f5ca0ce1bb)
#### Microservicio de parqueadero `.env`
```sh
-> .env
PORT=8085
DB_PORT=5432
DB_HOST=localhost
DB_DATABASE=parqueadero_db
DB_USER=postgres
DB_PASSWORD=admin

JWT_SECRET=RVNURSBFUyBVTiBDT0RJR08gTVVZIFNFQ1JFVE8gTkVMVU1EGFREG4
```

#### Microservicio de correo `.env`
```sh
-> .env
PORT=8086
MONGODB_URI=mongodb://localhost:27017/correodb
```

##### 6. Generar y ejecutar las migraciones para crear las tablas en la base de datos:
Para generar las migraciones de las entidades, debes crear una carpeta en src llamada migrations: `src/migrations`  y colocar el siguiente comando:
```sh
npm run m:gen -- src/migrations/InitDB
```
Y para ejecutar esa migración generada debes ejecutar el siguiente comando:
```sh
npm run m:run
```

##### 7. Ejecutar y compilar ambos microservicios de Parqueadero y Correo
Finalmente nos ubicamos en la raiz de cada microservicio y ejecutamos el siguiente comando en cada microservicio para compilar y ejecutarlos:
```sh
npm run start:dev
```
![micros corriendo](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/573d15c1-8d3a-459e-b668-8fd5f8872fc2)


##### 8. Probar las diferentes funcionalidades importando la colección de Postman
Luego que ambos microservicios se esten ejecutando, importas la colección de Postman que estará en este repositorio para que puedas probar las funcionalidades de ambos microservicios.

NOTA: es importante que ambos corran para que no tenga errores, ya que el parqueadero usa una funcionalidad del correo.

##### 9. Siempre debe loguearse para poder acceder a los demás endpoints
Al momento de probar las funcionalidades debe hacer login como ADMIN o SOCIO, depende de lo que vaya a probar para poder generar el token JWT y ese token lo pega en el apartado de Postman en Authorization->Bearer Token->Token o en Headers agregas en Key: Authorization y en Value: Bearer tokenJWT.

##### Ejemplo:
Nos logueamos como ADMIN:

![Login ADMIN nodejs](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/986d39c4-43c4-4602-85bc-19bfaf192d32)



Copiamos el token JWT, y nos vamos al endpoint que vamos a probar, por ejemplo la primera opción para agregar el token en Postman:
![ejemplo endpoint 1](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/883f94a6-f8ff-4c84-a78c-2fb493403f91)


Y de esta forma sería la segunda opción de agregar el token JWT:
![ejemplo endpoint 2](https://github.com/JarlinFonseca/Reto-Backend-Parqueadero-NodeJs-y-TS/assets/48332117/2662fa73-096d-486a-aea3-1153a653e984)


NOTA: Cualquiera de estas dos opciónes puedes usar, ya que es necesario Autenticarse(Hacer el Login) el cual genera un token JWT y luego Autorizar los endpoints de acuerdo a los Roles(ADMIN o SOCIO) con sus permisos. 

___

### Autor:

1. Jarlin Andres Fonseca Bermón - jarlinandres5000@gmail.com

