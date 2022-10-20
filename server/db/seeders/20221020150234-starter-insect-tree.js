("use strict");
const { Tree, Insect } = require("../models");
const { insectTress } = require("../../rawData");
module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		for (let i = 0; i < insectTress.length; i++) {
			const { insect, trees } = insectTress[i];
			const insectModel = await Insect.findOne({ where: { ...insect } });
			console.log("Insect******", insectModel.id);
			for (let j = 0; j < trees.length; j++) {
				const tree = trees[j];
				const treeModel = await Tree.findOne({ where: { ...tree } });
				console.log("tree******", treeModel.id);
				await insectModel.addTree(treeModel);
			}
		}
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		for (let i = 0; i < insectTress.length; i++) {
			const { insect, trees } = insectTress[i];
			const insectModel = await Insect.findOne({ where: { ...insect } });
			console.log("Insect******", insectModel.id);
			for (let j = 0; j < trees.length; j++) {
				const tree = trees[j];
				const treeModel = await Tree.findOne({ where: { ...tree } });
				console.log("tree******", treeModel.id);
				await insectModel.removeTree(treeModel);
			}
		}
	},
};
