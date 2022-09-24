const express = require("express");
let ejs = require("ejs");
// const date = require(__dirname + "/date.js");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

let list = ["Get food", "buy food", "cook food"];
// let workList = [];
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({ extended: true })
);
app.use(express.static("public"));
mongoose.connect(
	"mongodb://localhost:27017/todoDB"
);

const itemsSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

const Item = mongoose.model("Item", itemsSchema);
const listsSchema = new mongoose.Schema({
	name: String,
	items: [itemsSchema],
});

const List = mongoose.model("List", listsSchema);
const item1 = new Item({
	name: "Welcome to your todo list",
});
// const item2 = new Item({
// 	name: "Clean the house",
// });

// const item3 = new Item({
// 	name: "Buy books",
// });
const defaultList = [item1];

app.get("/", (req, res) => {
	Item.find({}, (err, data) => {
		if (data.length === 0) {
			Item.insertMany(
				[item1, item2, item3],
				(err) => {
					if (err) {
						console.log("error", err);
					} else {
						console.log("Items inserted");
					}
					// mongoose.connection.close();
				}
			);
			res.redirect("/");
		} else {
			res.render("todo-list", {
				list: data,
				listTitle: "Today",
			});
		}
	});
});

app.post("/", (req, res) => {
	const newTodo = req.body.todo;
	const listName = req.body.list;
	const newTask = new Item({
		name: newTodo,
	});
	if (newTodo.trim() && listName === "Today") {
		newTask.save();
		res.redirect("/");
	} else {
		List.findOne(
			{ name: listName },
			(err, data) => {
				data.items.push(newTask);
				data.save();

				res.redirect("/" + listName);
			}
		);
	}
});

app.get("/:url", (req, res) => {
	const customListName = _.capitalize(
		req.params.url
	);
	const list = new List({
		name: customListName,
		items: defaultList,
	});

	List.findOne(
		{ name: customListName },
		(err, data) => {
			if (!err) {
				if (data) {
					res.render("todo-list", {
						list: data.items,
						listTitle: data.name,
					});
				} else {
					list.save();
					res.redirect("/" + customListName);
				}
			}
		}
	);
});

app.post("/delete", (req, res) => {
	const id = req.body.checked;
	const list = req.body.list;
	if (list === "Today") {
		Item.deleteOne({ _id: id }, (err) => {
			if (err) {
				console.log("errors");
			} else {
				console.log("Deleted");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: list },
			{ $pull: { items: { _id: id } } },
			(err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("deleted");
					res.redirect("/" + list);
				}
			}
		);
	}
});

app.listen("3000", () => {
	console.log("server started");
});
