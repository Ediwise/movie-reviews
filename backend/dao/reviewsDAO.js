import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
          return;
        }
        try {
          reviews = await conn.db("reviews").collection("reviews");
        } catch (e) {
          console.error(`Unable to establish collection handles in ReviewsDAO: ${e}`);
          throw e;
        }
      }
      

  static async addReview(movieId, user, review) {
    try {
      const reviewDoc = {
        movieId: movieId,
        user: user,
        review: review,
      }
      console.log("adding")
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  static async getReview(reviewId) {
    if (!ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }
    try {
      return await reviews.findOne({ _id: ObjectId(reviewId) });
    } catch (e) {
      console.error(`Unable to get review: ${e}`);
      return { error: e };
    }
  }
  

  static async updateReview(reviewId, user, review) {
    try {
      const updateResponse = await reviews.updateOne(
        { _id: ObjectId(reviewId) },
        { $set: { user: user, review: review } }
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  static async deleteReview(reviewId) {

    try {
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }

  static async getReviewsByMovieId(movieId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    try {
      const cursor = await reviews
        .find({ movieId: parseInt(movieId) })
        .skip(skip)
        .limit(limit);
      return cursor.toArray();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return { error: e };
    }
  }
  

}