module.exports = (sequelize_config,Sequelize) => {
    const _Student = require("./student.model");
    const Message = sequelize_config.define('message',
        {
            message_id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                reference: {
                    model: _Student,
                    key: 'student_id'
                }
                },
            message: { type: Sequelize.STRING, allowNull: false },
            sender: { type: Sequelize.STRING, allowNull: false },
            receiver: { type: Sequelize.STRING, allowNull: false },
            status: { type: Sequelize.STRING, allowNull: false, defaultValue: true }
        },
    );
    return Message;
};