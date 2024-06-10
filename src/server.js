const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const routes = require('./routes/routes');
const sequelize = require('./sequelize');

const init = async () => {
  const server = Hapi.server({
    port: process.env.SERVER_PORT,
    host: process.env.MYSQL_HOST,
  });
  // const server = Hapi.server({
  //   port: 9000,
  //   host: '0.0.0.0',
  // });

  await server.register(Inert);

  server.route(routes);

  await sequelize.sync();
  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
