"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class InsectTree extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	InsectTree.init(
		{
			InsectId: DataTypes.INTEGER,
			TreeId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "InsectTree",
		}
	);
	return InsectTree;
};
