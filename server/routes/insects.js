// Instantiate router - DO NOT MODIFY
const express = require("express");
const router = express.Router();
const { Insect, Tree } = require("../db/models");

/**
 * INTERMEDIATE BONUS PHASE 2 (OPTIONAL) - Code routes for the insects
 *   by mirroring the functionality of the trees
 */
// Your code here
router.get("/", async (req, res) => {
	const insects = await Insect.findAll({
		attributes: ["id", "name", "millimeters"],
		order: [["millimeters", "desc"]],
	});
	res.json(insects);
});

router.get("/:id", async (req, res) => {
	const insects = await Insect.findOne({
		attributes: ["id", "name", "millimeters"],
		where: {
			id: req.params.id,
		},
	});
	res.json(insects);
});

router.post("/", async (req, res, next) => {
	try {
		await Insect.create(req.body);
		const newInsect = await Insect.findOne({ where: { ...req.body } });
		res.json({ status: "success", insect: newInsect.dataValues });
	} catch (error) {
		console.log(error.message);
		next(error);
	}
});

router.delete("/:id", async (req, res, next) => {
	try {
		const insect = await Insect.findOne({ where: { id: req.params.id } });
		const deletedName = insect.name;
		await insect.destroy();
		let a = await Insect.findOne({ where: { id: req.params.id } });
		console.log("--------", a);
		res.json({ status: "success deleted : " + deletedName });
	} catch (error) {
		console.log(error.message);
		next(error);
	}
});

router.put("/:id", async (req, res, next) => {
	try {
		await Insect.update(req.body, {
			where: { id: req.params.id },
			validate: true,
		});
		const I = await Insect.findOne({ where: { id: req.params.id } });
		res.json(i);
	} catch (error) {
		console.log(error.message);
		next(error);
	}
});

router.get("/search/:value", async (req, res, next) => {
	let insects = await Insect.findAll({
		attributes: ["id", "name", "millimeters"],
		order: [["millimeters", "desc"]],
		where: {
			tree: {
				[Op.like]: `%${req.params.value}%`,
			},
		},
	});

	res.json(insects);
});

router.get("/", async (req, res) => {});
// Export class - DO NOT MODIFY
module.exports = router;
