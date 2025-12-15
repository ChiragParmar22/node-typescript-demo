import rateLimit from 'express-rate-limit';
import ApiResponse from './ApiResponse';
import config from '../configs/common.config';

const rateLimitMin = config.RATE_LIMIT_MINUTES;
const rateLimitRequestPerMin = config.RATE_LIMIT_REQUEST_PER_MINUTES;

const limiter = rateLimit({
  windowMs: parseInt(rateLimitMin) * 60 * 1000, // 5 minutes
  max: parseInt(rateLimitRequestPerMin), // limit each IP to 100 requests per windowMs
  message: ApiResponse.internalError(
    'Too many requests from this IP, please try again after 5 minutes'
  ),
  keyGenerator: (req) => req.ip, // Use the extracted IP address for rate limiting
});

export default limiter;
