//add functions for displaying error messages
//add function for submitting form through AJAX

(function ($) {
  
    let reviewForm = $("#review-form"),
        rating = $("#rating").change(
            function () {
                return $(this).children("option:selected").val();
            }),
        review = $("#content"),
        message = $("#message-container")

    if (reviewForm) {
        reviewForm.submit(function (event) {
            // console.log(reviewForm, rating, review, message)
            event.preventDefault();

            let ratingVal = rating.val();
            let reviewContent = review.val();

            console.log(`Rating:${ratingVal} \nReview:${reviewContent}`)

            if (ratingVal) {
                let useJson = true;
                if (useJson) {
                    let requestConfig = {
                        method: "POST",
                        url: "/reviewadded",
                        contentType: "application/json",
                        data: JSON.stringify({
                            ratingVal: ratingVal,
                            reviewContent: reviewContent
                        })
                    };

                    $.ajax(requestConfig).then(function (responseMessage) {
                        console.log(responseMessage);
                        message.append("<p id='review-added'>Review has been successfully added</p>");
                    });
                }
            }
        })
    }
    
})(window.jQuery)