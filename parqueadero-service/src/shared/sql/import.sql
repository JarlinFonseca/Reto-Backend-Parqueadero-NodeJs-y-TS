INSERT INTO roles(name, description) VALUES('ADMIN', 'Rol de ADMIN');
INSERT INTO roles(name, description) VALUES('SOCIO', 'Rol de SOCIO');
INSERT INTO users(name, lastname, dni, email, password, created_at, rol_id) VALUES ('Admin','Admin', '545454454', 'admin@mail.com', '$2a$10$z7Rr9.jvu2dp1.DWbrQLU.ZHFWolOARlRgfC8WnWDl0uohqG72lR2', current_timestamp, 1);