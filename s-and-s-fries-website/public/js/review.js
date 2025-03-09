document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".delete-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const reviewId = this.action.split("/").pop();

            // Ask for confirmation before deleting
            const confirmDelete = confirm("Are you sure you want to delete this review?");
            if (!confirmDelete) {
                return; // If user cancels, stop the function
            }

            fetch(`/review/${reviewId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert("Review successfully deleted.");
                location.reload();
            })
            .catch(error => {
                console.error("Error deleting review:", error);
                alert("Failed to delete review. Please try again.");
            });
        });
    });
});
