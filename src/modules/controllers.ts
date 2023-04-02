import Ctrl from './ctrl'
import AuthCtrl from "@modules/auth/controller.auth"
import UserCtrl from "@modules/users/controller.user"
import AdminCtrl from "@modules/control/controllers.admin"
import GeneralCtrl from "@modules/general/controllers.general"
import ReviewCtrl from "@modules/reviews/controller.reviews"

import { Auth, User, Media, Admin, General, Reviews } from '@modules/services'
export const ctrl = new Ctrl()

export const AuthController = new AuthCtrl(Auth)
export const AdminController = new AdminCtrl(Admin)
export const ReviewController = new ReviewCtrl(Reviews)
export const GeneralController = new GeneralCtrl(General)
export const UserController = new UserCtrl(User, Media)
