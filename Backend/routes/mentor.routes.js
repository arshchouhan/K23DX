import { Router } from 'express';
import { 
  GetAllMentors, 
  GetMentorById, 
  GetMentorsBySkill,
  GetCarouselMentors 
} from '../controllers/mentor.controller.js';

const mentorRouter = Router();

mentorRouter.get('/', GetAllMentors);
mentorRouter.get('/carousel', GetCarouselMentors);
mentorRouter.get('/:id', GetMentorById);
mentorRouter.get('/skill/:skillId', GetMentorsBySkill);

export default mentorRouter;
