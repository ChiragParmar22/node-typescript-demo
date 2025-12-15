import ApiResponse from '../util/ApiResponse';
import responseMessages from '../constants/messages.constants';
import AppVersion from '../models/appVersion/AppVersion';

const routeMiddlewares = {
  validateRequest(requestSchema: any) {
    return (request, response, next) => {
      request.user_Ip = request.socket.remoteAddress;

      for (const key of ['headers', 'params', 'query', 'body']) {
        const schema = requestSchema[key];

        if (schema) {
          const { error } = schema.validate(request[key]);

          if (error) {
            const { details } = error;
            const message = details.map((i) => i.message).join(',');

            const apiResponse = ApiResponse.unprocessEntity(message);
            return response.status(apiResponse.statusCode).send(apiResponse);
          }
        }
      }

      next();
    };
  },

  async checkVersion(request, response, next) {
    const versionCode = request.headers.versioncode;
    const deviceType = request.headers.devicetype;

    if (!deviceType) {
      const apiResponse = ApiResponse.badRequest(
        responseMessages.DEVICE_TYPE_REQUIRED
      );
      return response.status(apiResponse.statusCode).send(apiResponse);
    }

    if (!versionCode) {
      const apiResponse = ApiResponse.badRequest(
        responseMessages.VERSION_CODE_REQUIRED
      );
      return response.status(apiResponse.statusCode).send(apiResponse);
    }

    const current_version = await AppVersion.findOne({ deviceType }).exec();

    if (
      current_version &&
      current_version.versionCode > versionCode.toString()
    ) {
      const apiResponse = ApiResponse.appUpdate(
        responseMessages.APP_UPDATE_REQUIRED
      );

      return response.status(apiResponse.statusCode).send(apiResponse);
    } else {
      return next();
    }
  },
};

export default routeMiddlewares;
