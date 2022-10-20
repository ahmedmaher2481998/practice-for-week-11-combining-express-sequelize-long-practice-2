"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("InsectTrees", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			InsectId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Insects",
					key: "id",
				},
				onDelete: "cascade",
			},
			TreeId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Trees",
					key: "id",
				},
				onDelete: "cascade",
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("InsectTrees");
	},
};
