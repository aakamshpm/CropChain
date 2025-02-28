import { useState } from "react";
import { Rating as MuiRating, TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { rateProduct } from "../utils/productRatingSlice";

const ProductRatings = ({
  productId,
  ratings,
  averageRating,
  refetchProduct,
}) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { userData: user } = useSelector((state) => state.user);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");

  const userRating = ratings?.find((r) => r.userId === user?.id);

  const handleSubmitRating = async () => {
    if (!user) {
      enqueueSnackbar("Please login to rate this product", {
        variant: "error",
      });
      return;
    }
    if (ratingValue === 0) {
      enqueueSnackbar("Please select a rating", { variant: "error" });
      return;
    }

    try {
      await dispatch(
        rateProduct({
          productId,
          userId: user._id,
          rating: ratingValue,
          comment,
        })
      ).unwrap();

      enqueueSnackbar("Rating submitted successfully", { variant: "success" });
      setComment("");
      setRatingValue(0);
      refetchProduct();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error || "Failed to submit rating", {
        variant: "error",
      });
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h2>

      {/* Average Rating Display */}
      <div className="flex items-center space-x-2 mb-6">
        <MuiRating value={averageRating} readOnly precision={0.5} />
        <span className="text-gray-600">({ratings?.length || 0} reviews)</span>
      </div>

      {/* Rating Form */}
      {user && !userRating && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium mb-4">Rate this product</h3>
          <div className="flex flex-col space-y-4">
            <MuiRating
              value={ratingValue}
              onChange={(e, newValue) => setRatingValue(newValue)}
              precision={1}
            />
            <TextField
              label="Add a comment (optional)"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRating}
              disabled={ratingValue === 0}
            >
              Submit Rating
            </Button>
          </div>
        </div>
      )}

      {/* Existing Ratings */}
      {ratings?.length > 0 ? (
        <div className="space-y-4">
          {ratings.map((rating, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <MuiRating value={rating.rating} readOnly precision={0.5} />
                <p className="text-sm text-gray-600">
                  by {rating.user?.name || "Anonymous"}
                  {rating.userId === user?._id && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Your rating)
                    </span>
                  )}
                </p>
              </div>
              {rating.comment && (
                <p className="text-gray-700 mt-2">{rating.comment}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(rating.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No reviews yet.</p>
      )}
    </div>
  );
};

export default ProductRatings;
