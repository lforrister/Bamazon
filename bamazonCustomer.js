// Establish npm packages, database, and verify connection
var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection ({
	host:'localhost',
	user: 'root',
	password: 'umily8394',
	database: 'bamazon_db'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected");

// -------------------------------------------------------------------

// step 1: display all the items for sale in the bamazon_db database
function displayAll() {
	console.log("Here are all of our products for sale: \n");
	connection.query("SELECT * FROM products", function (err,res) {
		if (err) throw err;
		console.log(res);
		startInquire();
	});
}

displayAll();



// -------------------------------------------------------------------

// Step 2: Prompt the user questions

function startInquire() {
	inquirer
	.prompt([
		// list
		{
			type: "list",
			message: "What is the product ID of the item you'd like to buy?",
			choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
			name: "userIDChoice"
		},

		{
			type: "input",
			message: "How many units of the product would you like to buy?",
			name: "userUnitsChoice"
		}

		])

		// prompt is closed out
// ----------------------------------------------------------------------------

	.then(function(inquirerResponse) {
		console.log("You chose: " + inquirerResponse.userUnitsChoice + " units of product ID " + inquirerResponse.userIDChoice);


		// Step 3: Select the quantity of the product ID they selected

		function checkQuant() {
			var query = "SELECT stock_quantity FROM products WHERE ?";
			connection.query(query, { team_id: inquirerResponse.userIDChoice }, function(err,res){
				for (var i=0; i < res.length; i++) {
					// console.log("Quanitity: " + res[i].stock_quantity);

					var currentStock = res[i].stock_quantity;
					console.log(currentStock);

					// check to see if the quantity is less than the quanity they want
					if (res[i].stock_quantity < inquirerResponse.userUnitsChoice) {
						console.log("Insufficient quantity!");
					}
					else {
						// console.log("There are enough!");
						updateQuant();
					
					}
				}
		
			}) 
		};

		// checkQuant();
		// --------------------------------------------------------------------------------------

	

		function updateQuant() {
			var query = "SELECT stock_quantity FROM products WHERE ?";
			connection.query(query, { team_id: inquirerResponse.userIDChoice }, function(err,res){
				for (var i=0; i < res.length; i++) {

					var currentStock = parseInt(res[i].stock_quantity);
					console.log("Current Quantity: " + currentStock);

					var userQuant = parseInt(inquirerResponse.userUnitsChoice);
					console.log("User Quantity: " + userQuant);

					var newStock = currentStock - userQuant;
					console.log("New Stock: " + newStock);

			

					
					console.log("Updating Product Quantities... \n");
					connection.query(
						"UPDATE products SET ? WHERE ?",
						[
							{
								stock_quantity: newStock
							},
							{
								team_id: inquirerResponse.userIDChoice
							}
						],
						function(err,res) {
							console.log("Quantity Updated to " + newStock);
						});
			
				}
		
			}) 



		};

		updateQuant();

		// ----------------------------------------------------------------------

		function checkPrice() {
			var query = "SELECT price FROM products WHERE ?";
			connection.query(query, { team_id: inquirerResponse.userIDChoice }, function(err,res){
				for (var i=0; i < res.length; i++) {

					var price = parseInt(res[i].price);
					console.log("Cost Per Item: $ " + price);

					var userQuant = parseInt(inquirerResponse.userUnitsChoice);
					console.log("User Quantity: " + userQuant);

					var userPrice = price *  userQuant;
					console.log("Your total cost is: $" + userPrice);
			
				}
		
			}) 



		};
		checkPrice();

		

	// Ends the .then function and the query
	});

};




//Ends the original connection
}); 
