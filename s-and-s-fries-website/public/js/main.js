(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });

    $(document).ready(function () {
        var currentPath = window.location.pathname;

        // Ensure token is sent when requesting `/menu`
        if (currentPath === "/menu") {
            const token = localStorage.getItem("token");

            if (token) {
                console.log("🔹 Sending token when requesting /menu");

                fetch("/menu", {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.text())
                .then(html => {
                    console.log("✅ Menu page fetched successfully.");
                    // Instead of reloading everything, update only sections if needed
                    $("#menu-container").html($(html).find("#menu-container").html());
                })
                .catch(error => console.error("❌ Error fetching menu page:", error));
            } else {
                console.warn("⚠️ No token found in Local Storage. User might not be logged in.");
            }
        }

        // Highlight active nav link
        $(".navbar-nav .nav-link").each(function () {
            $(this).removeClass("active");
            if ($(this).attr("href") === currentPath) {
                $(this).addClass("active");
            }
        });

        // Bootstrap Collapse: Close menu on clicking a nav link (for mobile)
        $(".navbar-nav .nav-link").click(function () {
            var navbarToggler = $(".navbar-toggler");
            if ($("#navbarCollapse").hasClass("show")) {
                new bootstrap.Collapse($("#navbarCollapse")[0]).hide();
                navbarToggler.attr("aria-expanded", "false");
            }
        });

    // Handle Authentication UI
    updateAuthUI();

    // Handle login form submission
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        const email = $("#loginEmail").val();
        const password = $("#loginPassword").val();

        fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                $("#loginModal").modal("hide");
                updateAuthUI();
            } else {
                alert(data.error || "Login failed. Please try again.");
            }
        })
        .catch(error => console.error("Login request error:", error));
    });

    // Handle register form submission
    $("#registerForm").submit(function (event) {
        event.preventDefault();
        const username = $("#registerUsername").val();
        const email = $("#registerEmail").val();
        const password = $("#registerPassword").val();

        fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.userId) {
                alert("Registration successful! You can now log in.");
                $("#registerModal").modal("hide");
            } else {
                alert("Registration failed.");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // Handle logout
    $("#logoutBtn").click(function () {
        localStorage.removeItem("token");
        updateAuthUI();
    });

    // Open login modal when clicking login
    $("#loginBtn").click(function () {
        $("#loginModal").modal("show");
    });

    // Open register modal when clicking register
    $("#registerBtn").click(function () {
        $("#registerModal").modal("show");
    });

    // 🔹 Function: Update UI based on auth state
    function updateAuthUI() {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = parseJwt(token);

            $("#accountBtn").html(`<i class="fa fa-user me-1"></i> ${decoded.username || "Account"}`);
            $("#loginRegisterOptions").addClass("d-none");
            $("#logoutOption").removeClass("d-none");
        } else {
            $("#accountBtn").html("Account <i class='fa fa-chevron-down'></i>");
            $("#loginRegisterOptions").removeClass("d-none");
            $("#logoutOption").addClass("d-none");
        }
    }

    // Helper function to decode JWT
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return {};
        }
    }
});
})(jQuery);
