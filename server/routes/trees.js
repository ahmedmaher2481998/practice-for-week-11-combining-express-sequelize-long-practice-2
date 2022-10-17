// Instantiate router - DO NOT MODIFY
const express = require("express");
const router = express.Router();
/**
 * BASIC PHASE 1, Step A - Import model
 */
// Your code here
const { Tree } = require("../db/models");

const bodyToTree = (req, res, next) => {
	const {
		name: tree,
		height: heightFt,
		location: location,
		size: groundCircumferenceFt,
	} = req.body;
	if (tree) {
		req.body.tree = tree;
		delete req.body.name;
	}
	if (heightFt) {
		delete req.body.height;
		req.body.heightFt = heightFt;
	}
	if (location) {
		delete req.body.location;
		req.body.location = location;
	}
	if (groundCircumferenceFt) {
		delete req.body.size;
		req.body.groundCircumferenceFt = groundCircumferenceFt;
	}
	next();
};
/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step A:
 *   Import Op to perform comparison operations in WHERE clauses
 **/
// Your code here
const { Op } = require("sequelize");

/**
 * BASIC PHASE 1, Step B - List of all trees in the database
 *
 * Path: /
 * Protocol: GET
 * Parameters: None
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get("/", async (req, res, next) => {
	let trees = [];

	// Your code here
	try {
		trees = await Tree.findAll({
			attributes: ["id", "tree", "heightFt"],
			order: [["id", "DESC"]],
		});
		res.json(trees);
	} catch (err) {
		res.status(500).json(err.message);
	}
});

/**
 * BASIC PHASE 1, Step C - Retrieve one tree with the matching id
 *
 * Path: /:id
 * Protocol: GET
 * Parameter: id
 * Response: JSON Object
 *   - Properties: id, tree, location, heightFt, groundCircumferenceFt
 */
router.get("/:id", async (req, res, next) => {
	let tree;

	try {
		// Your code here
		tree = await Tree.findOne({
			attributes: [
				"id",
				"tree",
				"location",
				"heightFt",
				"groundCircumferenceFt",
			],
			where: {
				id: req.params.id,
			},
		});
		if (tree) {
			res.json(tree);
		} else {
			next({
				status: "not-found",
				message: `Could not find tree ${req.params.id}`,
				details: "Tree not found",
			});
		}
	} catch (err) {
		next({
			status: "error",
			message: `Could not find tree ${req.params.id}`,
			details: err.errors
				? err.errors.map((item) => item.message).join(", ")
				: err.message,
		});
	}
});

/**
 * BASIC PHASE 2 - INSERT tree row into the database
 *
 * Path: /trees
 * Protocol: POST
 * Parameters: None
 * Request Body: JSON Object
 *   - Properties: name, location, height, size
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully created new tree
 *   - Property: data
 *     - Value: object (the new tree)
 */
router.post("/", bodyToTree, async (req, res, next) => {
	try {
		const { tree, heightFt, location, groundCircumferenceFt } = req.body;
		const newTree = Tree.build({
			tree,
			heightFt,
			location,
			groundCircumferenceFt,
		});
		const isValid = await newTree.validate();
		console.log("*****" + isValid);
		if (isValid) {
			await newTree.save();
			await newTree.reload();
		} else {
			throw new Error("Not valid Tree...");
		}

		res.json({
			status: "success",
			message: "Successfully created new tree",
			data: newTree,
		});
	} catch (err) {
		next({
			status: "error",
			message: "Could not create new tree",
			details: err.errors
				? err.errors.map((item) => item.message).join(", ")
				: err.message,
		});
	}
});

/**
 * BASIC PHASE 3 - DELETE a tree row from the database
 *
 * Path: /trees/:id
 * Protocol: DELETE
 * Parameter: id
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully removed tree <id>
 * Custom Error Handling:
 *   If tree is not in database, call next() with error object
 *   - Property: status
 *     - Value: not-found
 *   - Property: message
 *     - Value: Could not remove tree <id>
 *   - Property: details
 *     - Value: Tree not found
 */
router.delete("/:id", async (req, res, next) => {
	try {
		const tree = await Tree.findOne({ where: { id: req.params.id } });
		if (tree) tree.destroy();
		else throw new Error("Not found in The database");
		res.json({
			status: "success",
			message: `Successfully removed tree ${req.params.id}`,
		});
	} catch (err) {
		next({
			status: "error",
			message: `Could not remove tree ${req.params.id}`,
			details: err.errors
				? err.errors.map((item) => item.message).join(", ")
				: err.message,
		});
	}
});

/**
 * INTERMEDIATE PHASE 4 - UPDATE a tree row in the database
 *   Only assign values if they are defined on the request body
 *
 * Path: /trees/:id
 * Protocol: PUT
 * Parameter: id
 * Request Body: JSON Object
 *   - Properties: id, name, location, height, size
 * Response: JSON Object
 *   - Property: status
 *     - Value: success
 *   - Property: message
 *     - Value: Successfully updated tree
 *   - Property: data
 *     - Value: object (the updated tree)
 * Custom Error Handling 1/2:
 *   If id in request params does not match id in request body,
 *   call next() with error object
 *   - Property: status
 *     - Value: error
 *   - Property: message
 *     - Value: Could not update tree <id>
 *   - Property: details
 *     - Value: <params id> does not match <body id>
 * Custom Error Handling 2/2:
 *   If tree is not in database, call next() with error object
 *   - Property: status
 *     - Value: not-found
 *   - Property: message
 *     - Value: Could not update tree <id>
 *   - Property: details
 *     - Value: Tree not found
 */
router.put("/:id", bodyToTree, async (req, res, next) => {
	try {
		// Your code here
		console.log(req.body);
		await Tree.update(req.body, {
			where: { id: req.params.id },
			validate: true,
		});
		const newTree = await Tree.findOne({ where: { id: req.params.id } });
		res.json({
			status: "Success",
			message: "Successfully updated tree",
			data: newTree,
		});
	} catch (err) {
		next({
			status: "error",
			message: "Could not update new tree",
			details: err.errors
				? err.errors.map((item) => item.message).join(", ")
				: err.message,
		});
	}
});

/**
 * INTERMEDIATE BONUS PHASE 1 (OPTIONAL), Step B:
 *   List of all trees with tree name like route parameter
 *
 * Path: /search/:value
 * Protocol: GET
 * Parameters: value
 * Response: JSON array of objects
 *   - Object properties: heightFt, tree, id
 *   - Ordered by the heightFt from tallest to shortest
 */
router.get("/search/:value", async (req, res, next) => {
	let trees = [];

	res.json(trees);
});

// Export class - DO NOT MODIFY
module.exports = router;
