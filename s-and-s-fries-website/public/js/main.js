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

        if (currentPath === "/menu") {
            fetch("/menu", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => response.text())
            .then(html => {
                $("#menu-container").html($(html).find("#menu-container").html());
            })
            .catch(error => console.error("Error fetching menu page:", error));
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
    });

})(jQuery);
