module.exports = (sequelize_config, Sequelize) => {
    const Student = sequelize_config.define('student',
    {
        student_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: { type: Sequelize.STRING, allowNull: false },
        last_name: { type: Sequelize.STRING, allowNull: false },
        class: { type: Sequelize.STRING },

         
        // add age (min 10), 

        // parent_phone_number (+256789090213),
        // gender (enum M, F), 
        
        //physical_address (kampala)
        // category (enum DAY, BOARDING)
        // status (bool 1, 0)

        age: { type: Sequelize.INTEGER, allowNull: false,validate: {min: 10} },

        parent_phone_number: { type: Sequelize.STRING, allowNull: false, validate: { is: /^\+2567[^469]\d{6}$/ } },

        gender: { type: Sequelize.ENUM,  values: ['M', 'F'], allowNull: false  },

        physical_address: {  type: Sequelize.STRING,  allowNull: false, defaultValue: 'Kampala'},

        category: { type: Sequelize.ENUM,  values: ['DAY', 'BOARDING'], allowNull: false },
        
        status: { type: Sequelize.BOOLEAN,  allowNull: false,  defaultValue: true }},

        {
            defaultScope: {
                attributes: {
                    exclude: ['createdAt','updatedAt', 'student_id' ]
                }
            }
        }
    );

    return Student; 
}