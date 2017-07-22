DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

use bamazon_db;
create table products(
team_id integer (11) auto_increment not null,
	product_name varchar(50) not null,
    department_name varchar (50),
	price  decimal(10,2),
	stock_quantity integer(100),
	Primary Key (team_id));
    
insert into products (product_name, department_name, price, stock_quantity)
values("Jeans","Clothing",45.00, 65);

select * from products;

update products
SET stock_quantity = 10
WHERE team_id = 3;
select * from products;
