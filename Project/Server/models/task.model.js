module.exports = (sequelize, Sequelize) => {
    const Task = sequelize.define('task', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('pending', 'in-progress', 'completed'),
        defaultValue: 'pending'
      },
      dueDate: {
        type: Sequelize.DATE
      },
      imageUrl: {
        type: Sequelize.STRING
      }
    });
    
    return Task;
  };