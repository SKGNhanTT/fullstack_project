'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('specialties', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nameEn: {
                type: Sequelize.STRING,
            },
            nameVi: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.BLOB('long'),
            },
            descriptionHTMLEn: {
                type: Sequelize.TEXT,
            },
            descriptionHTMLVi: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownEn: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownVi: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('specialties');
    },
};
