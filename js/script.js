// Initialize Lucide Icons
lucide.createIcons();

// Ambient Glow Cursor & Tilt Effect
const ambientGlow = document.getElementById('ambientGlow');
if (window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Tilt the hero profile image wrapper
        const x = mouseX / window.innerWidth - 0.5;
        const y = mouseY / window.innerHeight - 0.5;
        gsap.to('.tilt-element', {
            rotationY: x * 20,
            rotationX: -y * 20,
            ease: 'power1.out',
            transformPerspective: 900,
            transformOrigin: 'center'
        });
    });
    
    const animateGlow = () => {
        let distX = mouseX - glowX;
        let distY = mouseY - glowY;
        
        glowX += distX * 0.1; // Smooth lerp speed for the glow
        glowY += distY * 0.1;
        
        if (ambientGlow) {
            ambientGlow.style.left = `${glowX}px`;
            ambientGlow.style.top = `${glowY}px`;
        }
        
        requestAnimationFrame(animateGlow);
    };
    animateGlow();
    
    // Hide glow when leaving window
    document.addEventListener('mouseleave', () => {
        if (ambientGlow) ambientGlow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        if (ambientGlow) ambientGlow.style.opacity = '1';
    });
}

// Magnetic Elements
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const strength = parseFloat(el.getAttribute('data-magnetic-strength')) || 0.3;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `translate(0px, 0px)`;
    });
});

// Lenis Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-item, .btn-contact');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
            lenis.stop();
        } else {
            icon.setAttribute('data-lucide', 'menu');
            lenis.start();
        }
        lucide.createIcons();
    });
}

// Close mobile menu on link click
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
            lucide.createIcons();
            lenis.start();
        }
    });
});

// GSAP Animations
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const tl = gsap.timeline();
    
    tl.from('.reveal-text', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
    });

    // Scroll Reveal for fade-up elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    fadeUpElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Navbar effect on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const bentoItems = document.querySelectorAll('.bento-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        bentoItems.forEach(item => {
            let shouldShow = false;
            if (filter === 'all') {
                shouldShow = item.getAttribute('data-show-in-all') === 'true';
            } else {
                shouldShow = item.getAttribute('data-category') === filter;
            }
            
            if (shouldShow) {
                gsap.to(item, { scale: 1, opacity: 1, duration: 0.4, display: 'block', ease: "power2.out" });
            } else {
                gsap.to(item, { scale: 0.8, opacity: 0, duration: 0.4, display: 'none', ease: "power2.out" });
            }
        });
        
        // Refresh ScrollTrigger after filtering
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    });
});

// Modal Logic
const projectModal = document.getElementById('projectModal');
const modalMainImage = document.getElementById('modalMainImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');

const projectData = {
    branding1: {
        title: 'TriKru',
        category: 'Branding',
        images: [
            'assets/branding/trikru/Artboard 1Logo Presentation Final.png',
            'assets/branding/trikru/Artboard ٢Logo Presentation Final.png',
            'assets/branding/trikru/Artboard ٣Logo Presentation Final.png',
            'assets/branding/trikru/Artboard ٤Logo Presentation Final.png',
            'assets/branding/trikru/Artboard 11 BANNER.png',
            'assets/branding/trikru/Artboard ١٢Logo Presentation Final.png',
            'assets/branding/trikru/Artboard ١٣Logo Presentation Final.png',
            'assets/branding/trikru/Artboard ١٥Logo Presentation Final.png',
            'assets/branding/trikru/Artboard ١٠ez.png',
            'assets/branding/trikru/Artboard ١٠GG.png',
            'assets/branding/trikru/Artboard ١٠lalli.png',
            'assets/branding/trikru/Artboard ١٠NT.png',
            'assets/branding/trikru/Artboard ١٠WP.png',
            'assets/branding/trikru/Brand01 PreviewLogo Presentation Final.png'
        ],
        desc: 'TriKru is a community-driven fitness brand emphasizing energy, strength, and inclusivity. A bold brand identity reflecting an empowering and fast-paced environment.'
    },
    branding2: {
        title: 'Chicken Wingz',
        category: 'Branding',
        images: [
            'assets/branding/chicken wingz/Untitled (1).png',
            'assets/branding/chicken wingz/sadasda.png',
            'assets/branding/chicken wingz/sadsadasdsd.png',
            'assets/branding/chicken wingz/sdadsad.png',
            'assets/branding/chicken wingz/سشيشسي.png',
            'assets/branding/chicken wingz/asdsadads.png',
            'assets/branding/chicken wingz/htjgkhk.png'
        ],
        desc: 'A bold, mouth-watering brand identity for Chicken Wingz, focusing on vibrant colors and appetizing visuals to capture the essence of the food industry.'
    },
    social1: {
        title: 'Crepe Kitchen',
        category: 'Social Media',
        images: [
            'assets/egyption market/Crepe Kitchen social media/Artboard 1.jpg',
            'assets/egyption market/Crepe Kitchen social media/Artboard 2.jpg',
            'assets/egyption market/Crepe Kitchen social media/Artboard 3.jpg',
            'assets/egyption market/Crepe Kitchen social media/Artboard 4.jpg',
            'assets/egyption market/Crepe Kitchen social media/Artboard 5.jpg'
        ],
        desc: 'Social media design for Crepe Kitchen, highlighting delicious offerings with a warm and inviting aesthetic.'
    },
    campaign1: {
        title: 'Hard Inn',
        category: 'Campaigns',
        images: [
            'assets/egyption market/Hard Inn social media/Artboard 1.jpg',
            'assets/egyption market/Hard Inn social media/Artboard 1.png',
            'assets/egyption market/Hard Inn social media/Artboard 2.png',
            'assets/egyption market/Hard Inn social media/Artboard 3.jpg',
            'assets/egyption market/Hard Inn social media/happy mother`s day.png',
            'assets/egyption market/Hard Inn social media/hiring.jpg',
            'assets/egyption market/Hard Inn social media/المواعيد.jpg'
        ],
        desc: 'A dynamic campaign for Hard Inn featuring engaging social media posts tailored for different events and announcements.'
    },
    social2: {
        title: 'Yemri Chicken',
        category: 'Social Media',
        images: [
            'assets/egyption market/Yemri Chicken social media/Artboard 2.jpg',
            'assets/egyption market/Yemri Chicken social media/Artboard 5.jpg',
            'assets/egyption market/Yemri Chicken social media/Artboard 7.jpg',
            'assets/egyption market/Yemri Chicken social media/عيد ام.jpg'
        ],
        desc: 'Engaging and visually striking social media content created for Yemri Chicken to boost their online presence.'
    },
    social3: {
        title: 'Hebta',
        category: 'Social Media',
        images: [
            'assets/egyption market/hebta/post 1 fb.jpg',
            'assets/egyption market/hebta/post 2 ifb.jpg',
            'assets/egyption market/hebta/post 3 fb.jpg',
            'assets/egyption market/hebta/post 4_.jpg',
            'assets/egyption market/hebta/post 5_.jpg',
            'assets/egyption market/hebta/POST 6_.jpg',
            'assets/egyption market/hebta/post 7.jpg'
        ],
        desc: 'A cohesive series of social media posts for Hebta, utilizing consistent branding elements to establish visual identity.'
    },
    social4: {
        title: 'Patch fe elkhafif',
        category: 'Social Media',
        images: [
            'assets/egyption market/Patch fe elkhafif/Artboard 1.jpg',
            'assets/egyption market/Patch fe elkhafif/Artboard 2.jpg',
            'assets/egyption market/Patch fe elkhafif/Artboard 3.jpg',
            'assets/egyption market/Patch fe elkhafif/Artboard 6.jpg',
            'assets/egyption market/Patch fe elkhafif/Artboard 7.jpg',
            'assets/egyption market/Patch fe elkhafif/Artboard 8.jpg',
            'assets/egyption market/Patch fe elkhafif/Artboard 9.jpg',
            'assets/egyption market/Patch fe elkhafif/فزورة 1.jpg',
            'assets/egyption market/Patch fe elkhafif/مواعيد رمضان.jpg'
        ],
        desc: 'Interactive and creative social media content for Patch fe elkhafif, featuring engaging designs to drive audience interaction.'
    },
    social5: {
        title: 'Zizo',
        category: 'Social Media',
        images: [
            'assets/egyption market/zizo social media/Artboard 1.jpg',
            'assets/egyption market/zizo social media/Artboard 2.jpg',
            'assets/egyption market/zizo social media/Artboard 3.jpg',
            'assets/egyption market/zizo social media/Artboard 4.jpg',
            'assets/egyption market/zizo social media/Artboard 5.jpg',
            'assets/egyption market/zizo social media/Artboard 7.jpg',
            'assets/egyption market/zizo social media/Artboard 9.jpg'
        ],
        desc: 'A robust collection of social media graphics created for Zizo to maintain a vibrant online aesthetic.'
    }
};

let currentProjectData = null;
let currentImageIndex = 0;

function updateModalNav() {
    const counter = document.getElementById('modalCounter');
    const nav = document.querySelector('.modal-nav');
    if (!currentProjectData) return;
    const total = currentProjectData.images.length;
    if (counter) counter.textContent = (currentImageIndex + 1) + ' / ' + total;
    if (nav) nav.style.display = total > 1 ? 'flex' : 'none';
}

window.openProject = function(projectId) {
    const data = projectData[projectId];
    if (data && data.images && data.images.length > 0) {
        currentProjectData = data;
        currentImageIndex = 0;

        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalDesc').textContent = data.desc;
        document.getElementById('modalMainImage').src = data.images[0];

        updateModalNav();

        document.getElementById('projectModal').classList.add('active');
        lenis.stop();

        gsap.from(document.getElementById('modalMainImage'), {
            scale: 1.1,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }
}

window.nextProjectImage = function() {
    if (currentProjectData) {
        currentImageIndex = (currentImageIndex + 1) % currentProjectData.images.length;
        const img = document.getElementById('modalMainImage');
        img.src = currentProjectData.images[currentImageIndex];
        gsap.fromTo(img, {opacity: 0}, {opacity: 1, duration: 0.4});
        updateModalNav();
    }
}

window.prevProjectImage = function() {
    if (currentProjectData) {
        currentImageIndex = (currentImageIndex - 1 + currentProjectData.images.length) % currentProjectData.images.length;
        const img = document.getElementById('modalMainImage');
        img.src = currentProjectData.images[currentImageIndex];
        gsap.fromTo(img, {opacity: 0}, {opacity: 1, duration: 0.4});
        updateModalNav();
    }
}

window.closeProject = function() {
    document.getElementById('projectModal').classList.remove('active');
    lenis.start();
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeProject();
    }
});

// Timeline Scroll Animation
if (document.querySelector('.timeline')) {
    gsap.to('.timeline-progress', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        }
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 60%',
            onEnter: () => item.classList.add('is-active'),
            onLeaveBack: () => item.classList.remove('is-active')
        });
    });
}
