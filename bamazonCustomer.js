// HOW IT WORKS
// print items in database on startup
// prompt user for id of item they want to buy and validate
// prompt user for quantity and validate
//  if there is enough, update database and return total cost
//  if there is not enough, stp the order and notify user
// ask if they want to continue

// dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon_db"
});


app = {
  allProductID: [],
  // read all items in database then print them
  showProducts: function () {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
      if (err) throw err;
      // capture all product IDs for input error checking
      app.allProductID = [];
      for (i=0; i<res.length; i++) {
        app.allProductID.push(res[i].item_id);
      }
      // print table
      console.table(res);
      app.buyThis();
    });
  },


  // ask what item do they want to buy and how many
  buyThis: function() {
    inquirer
      .prompt([
        {
          name: "id",
       	  type: "input",
          message: "Which product would like to purchase? Enter ID",
        	validate: function(value) {
        		// if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
            if ( isNaN(value) === false && parseInt(value) > 0 && app.allProductID.includes(parseInt(value)) ) {
              return true;
            }
        		console.log('  -- Please enter a valid number.');
            return false;
        	}
        },
        {
          name: "quantity",
          type: "input",
          message: "How many?",
          validate: function(value) {
            if (isNaN(value) === false && parseInt(value) > 0) {
              return true;
            }
            console.log('  -- Please enter a valid number.');
            return false;
          }
        }
      ])
      .then(function(userRequest) {
        	// we have valid inputs so pass them to the order handler
          app.orderHandler(userRequest.id, userRequest.quantity);
    });
  },


  // process order
  orderHandler: function (userRequestID, userRequestQuantity) {
    var uProduct = parseInt(userRequestID);
    var uQuantity = parseInt(userRequestQuantity);
    // get just the requested item
    var query = "SELECT stock_quantity, product_name, price FROM products WHERE item_id = ?";
    connection.query(query, [uProduct], function(err, res) {
      
      // Path 1 - if there is enouch in stock then update database and determine cost for end user
      if (res[0].stock_quantity >= uQuantity) {
        var newQuantity = res[0].stock_quantity - uQuantity;
        var totalCost = res[0].price * uQuantity;
        var query = connection.query("UPDATE products SET ? WHERE ?",[{ stock_quantity: newQuantity},{item_id: uProduct}],
          function(err, res) {
            if (err) throw err;
            console.log("\n" + uQuantity + " items ordered. The cost is $" + totalCost + "\n");
            app.askToSearchAgain();
          }
        );
      }
      // Path 2 - if there is not enough in stock then stop order
      else {
        console.log("\nSory, there are only " + res[0].stock_quantity + " left in stock.\n");
        app.askToSearchAgain();
      }
      
    });
  },

  // ask to continue
  askToSearchAgain: function () {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "choice",
          message: "Search for products again?"
        }
      ])
      .then(function(val) {
        // If the user says yes to another game, play again, otherwise quit the game
        if (val.choice) {
          app.showProducts();
        }
        else {app.quit();}
      });
  },

  quit: function () {
    connection.end();
    console.log("\nGoodbye!\n");
    process.exit(0);
  }
}

//------------------ run applicaton --------------------
app.showProducts();

