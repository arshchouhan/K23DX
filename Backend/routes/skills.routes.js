import { Router } from "express";
import { 
  GetAllSkills, 
  CreateSkill, 
  AddSkillsToMentor, 
  RemoveSkillFromMentor,
  GetMentorSkills 
} from "../controllers/skills.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createSkillSchema, addSkillsToMentorSchema } from "../utils/zodSchemas.js";

const skillsRouter = Router();

skillsRouter.get('/', GetAllSkills);
skillsRouter.post('/', authenticateToken, validateRequest(createSkillSchema), CreateSkill);
skillsRouter.get('/mentor/:mentorId', GetMentorSkills);
skillsRouter.post('/mentor/:id/skills', authenticateToken, validateRequest(addSkillsToMentorSchema), AddSkillsToMentor);
skillsRouter.delete('/mentor/:mentorId/skills/:skillId', authenticateToken, RemoveSkillFromMentor);

export default skillsRouter;
