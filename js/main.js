// ===========================
// MAIN.JS - FitPro Wellness
// ===========================

$(document).ready(function() {

    // ===========================
    // MENU ATIVO
    // Marca o link do menu atual como ativo
    // ===========================
    const currentPage = window.location.pathname.split('/').pop();
    $('nav a').each(function() {
        const href = $(this).attr('href');
        if (href === currentPage) {
            $(this).addClass('active');
        }
    });

    // ===========================
    // ANIMAÇÃO DE ENTRADA DOS CARDS
    // Os cards aparecem suavemente ao fazer scroll
    // ===========================
    function animateOnScroll() {
        $('.card').each(function() {
            const cardTop = $(this).offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();
            if (cardTop < windowBottom - 50) {
                $(this).addClass('visible');
            }
        });
    }

    // Roda ao carregar e ao fazer scroll
    animateOnScroll();
    $(window).on('scroll', animateOnScroll);

    // ===========================
    // SCROLL SUAVE
    // Cliques em links âncora (#) fazem scroll suave
    // ===========================
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        if ($(target).length) {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 80
            }, 600);
        }
    });

    // ===========================
    // HEADER SCROLL
    // Header fica mais escuro ao fazer scroll
    // ===========================
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 50) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

});