import { Router } from 'express';
import { 
  GetAllMentors, 
  GetMentorById, 
  GetMentorsBySkill,
  GetCarouselMentors,
  CreateOrUpdateMentorProfile
} from '../controllers/mentor.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const mentorRouter = Router();

mentorRouter.get('/', GetAllMentors);
mentorRouter.get('/carousel', GetCarouselMentors);
mentorRouter.get('/:id', GetMentorById);
mentorRouter.get('/skill/:skillId', GetMentorsBySkill);

// Create or update mentor profile
mentorRouter.post('/profile', authenticateToken, CreateOrUpdateMentorProfile);

export default mentorRouter;
