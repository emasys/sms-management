import Glue from '@hapi/glue';
import Log from 'fancy-log';
import config from './config';

const options = {
  relativeTo: __dirname,
};

const app = {};

export const startServer = async () => {
  try {
    const server = await Glue.compose(
      config,
      options,
    );
    app.server = server;
    await app.server.start();
    Log(`Server running at: ${server.info.uri}`);
    Log(`docs running at ${server.info.uri}/documentation`);
  } catch (error) {
    Log.error(error);
    process.exit(1);
  }
};

startServer();

export default app;
