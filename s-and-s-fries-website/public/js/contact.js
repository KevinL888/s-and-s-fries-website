document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value,
            };

            try {
                const response = await fetch("/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                if (response.ok) {
                    alert("✅ Your message has been sent!");
                    contactForm.reset();
                } else {
                    alert(`⚠️ Error: ${data.error}`);
                }
            } catch (error) {
                console.error("❌ Error sending message:", error);
                alert("⚠️ Failed to send message. Please try again later.");
            }
        });
    }
});
