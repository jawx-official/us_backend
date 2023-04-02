import { Model } from 'mongoose'
import Module from '@modules/module'
import {
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { CreateReviewInterface, ReviewInterface, ReviewServiceInputProps } from './interface.reviews'
import { UserInterface } from '../users/interfaces.users'

class ReviewService extends Module {
    private reviews: Model<ReviewInterface>
    private users: Model<UserInterface>

    constructor(props: ReviewServiceInputProps) {
        super()
        this.reviews = props.reviews
        this.users = props.users
    }



    public async saveReview(review: CreateReviewInterface, user: UserInterface): Promise<ReviewInterface> {
        const reviewData = await this.reviews.create({
            ...review,
            reviewedBy: user._id
        })

        return reviewData;
    }

}
export default ReviewService