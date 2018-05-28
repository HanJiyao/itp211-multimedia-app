var Sequelize = require('sequelize');
var sequelizeTransforms = require('sequelize-transforms');
const sequelize = new Sequelize('p4db','root','Hanjiyao38',{
    host:'localhost',
    port:'3306',
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
    operatorsAliases:false
});

/*
const sequelize =new Sequelize({
    dialect: 'mssql',
    dialectModulePath: 'tedious',
    dialectOptions: {
      driver: 'SQL Server Native Client 11.0',
      instanceName: 'SQLEXPRESS'
    },
    host: 'localhost',
    username: 'p4',
    password: 'p4pw',
    database: 'p4db',
    pool: {
        min: 0,
        max: 10,
        idle: 10000
      }
  });
*/
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

sequelizeTransforms(sequelize);

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
