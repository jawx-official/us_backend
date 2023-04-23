import { Router as expressRouter } from 'express'
import Auth from '@src/middlewares/auth'
import { PropertyController } from '../controllers'
import { validate } from '@middlewares/validate/index';
import { createProperty, updateProperty } from '@modules/properties/properties.validators';
const auth = new Auth()
const router: expressRouter = expressRouter()

// add endpoints that need token after this line
router.post("/", auth.verifyAgents(), validate(createProperty), PropertyController.createPropertyFn());
router.put("/:id", auth.verifyAgents(), validate(updateProperty), PropertyController.updatePropertyFn());
router.get("/:id", auth.verifyAgents(), PropertyController.fetchUserPropertyFn());
router.get("/", auth.verifyAgents(), PropertyController.fetchUserPropertiesFn());
router.patch("/:id", auth.verifyAgents(), PropertyController.publishPropertyFn());
router.patch("/:id/disable", auth.verifyAgents(), PropertyController.disablePropertyFn());

export default router
