import logger from '../util/logger/logger';

export default (request, response, next) => {
  const startTime = Date.now();

  const xForwardedFor = (
    (request.headers['x-forwarded-for'] || '') as string
  ).replace(/:\d+$/, '');
  const ip =
    xForwardedFor || request.connection.remoteAddress?.split(':').pop();

  // Log the incoming request
  logger.info(
    `Incoming request:
    - ip: ${ip}
    - method: ${request.method}
    - url: ${request.url}
    - params: ${JSON.stringify(request.params)} 
    - query: ${JSON.stringify(request.query)} 
    - body: ${JSON.stringify(request.body)}`
  );

  // Capture the response to log it later
  const originalSend = response.send;
  response.send = function (body: any) {
    const duration = Date.now() - startTime;
    logger.info(
      `Outgoing response: ${request.method} ${request.url} - Status: ${
        response.statusCode
      } - Duration: ${duration}ms - Response: ${JSON.stringify(body)}`
    );
    originalSend.call(this, body);
  };

  next();
};
