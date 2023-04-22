import Ctrl from './ctrl'
import AuthCtrl from "@modules/auth/controller.auth"
import UserCtrl from "@modules/users/controller.user"
import AdminCtrl from "@modules/control/controllers.admin"
import GeneralCtrl from "@modules/general/controllers.general"
import ReviewCtrl from "@modules/reviews/controller.reviews"
import PropertyCtrl from "@modules/properties/properties.controller"

import { Auth, User, Media, Admin, General, Reviews, Properties } from '@modules/services'
export const ctrl = new Ctrl()

export const AuthController = new AuthCtrl(Auth)
export const PropertyController = new PropertyCtrl(Properties)
export const AdminController = new AdminCtrl(Admin)
export const ReviewController = new ReviewCtrl(Reviews)
export const GeneralController = new GeneralCtrl(General, Media)
export const UserController = new UserCtrl(User, Media)
