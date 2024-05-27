
import { Sequelize } from "sequelize";

const connection = new Sequelize("testDB", "root", "Sbo200201", {
  host: "localhost",
  dialect: "mysql",
  logging:false,
  
});

export { connection };
