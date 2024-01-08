'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('clinics', {
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
            addressEn: {
                type: Sequelize.STRING,
            },
            addressVi: {
                type: Sequelize.STRING,
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
            image: {
                type: Sequelize.BLOB('long'),
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
        await queryInterface.dropTable('clinics');
    },
};
