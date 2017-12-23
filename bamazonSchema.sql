DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price INT NOT NULL,
	stock_quantity INT NOT NULL,
	PRIMARY KEY (item_id)
);

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("milk", "dairy", 5.00, 4), ("cheese", "dairy", 6.50, 10 ), ("football", "sportsgoods", 14.50, 4), ("frisbee", "sportsgoods", 12.00, 2), ("coke", "drinks", 1.15, 20), ("pepsi", "drinks", 1.15, 20), ("pretzels", "snacks", 4.50, 12), ("chips", "snacks", 3.75, 8), ("crackers", "snacks", 2.50, 5), ("cookies", "snacks", 5.50, 5);