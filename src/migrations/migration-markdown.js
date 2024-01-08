'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('markdowns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            contentHTMLEn: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
            },
            contentHTMLVi: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
            },
            contentMarkdownEn: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
            },
            contentMarkdownVi: {
                allowNull: false,
                type: Sequelize.TEXT('long'),
            },
            descriptionEn: {
                allowNull: true,
                type: Sequelize.TEXT('long'),
            },
            descriptionVi: {
                allowNull: true,
                type: Sequelize.TEXT('long'),
            },
            doctorId: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            specialtyNameEn: {
                allowNull: true,
                type: Sequelize.TEXT('long'),
            },
            specialtyNameVi: {
                allowNull: true,
                type: Sequelize.TEXT('long'),
            },
            clinicId: {
                allowNull: true,
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('markdowns');
    },
};
