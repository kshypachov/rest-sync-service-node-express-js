'use strict'
const { DataTypes } = require('sequelize')
const Sequelize = require('sequelize')

module.exports = sequelize => {
	const Person = sequelize.define(
		'Person',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			surname: {
				type: DataTypes.STRING,
				allowNull: false
			},
			patronym: {
				type: DataTypes.STRING
			},
			dateOfBirth: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			rnokpp: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			unzr: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			passportNumber: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true
			},
			gender: {
				type: DataTypes.ENUM('male', 'female'),
				allowNull: false
			}
		},
		// Other model options go here
		{
			sequelize,
			modelName: 'Person', // Explicitly specifying the model name
			tableName: 'Persons', // Explicitly specifying the table name
		}
	)

	return Person
}
