var myDatabase = require('../controllers/database')
var sequelize = myDatabase.sequelize
var Sequelize = myDatabase.Sequelize

const ChatMsg = sequelize.define('ChatMsg', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    name: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    }
})
ChatMsg.sync({ force: true, logging: console.log }).then(() => {
    console.log("ChatMsgs table synced");
});

module.exports = sequelize.model('ChatMsg', ChatMsg);