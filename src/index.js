import Glue from 'glue';
import Log from 'fancy-log';
import config from './config';

const options = {
  relativeTo: __dirname,
};

const testResource = {};

(async () => {
  try {
    const server = await Glue.compose(
      config,
      options,
    );
    testResource.server = server;
    await server.start();
    Log(`Server running at: ${server.info.uri}`);
    Log(`docs running on ${server.info.uri}/documentation`);
  } catch (error) {
    Log.error(error);
    process.exit(1);
  }
})();

export default testResource;
