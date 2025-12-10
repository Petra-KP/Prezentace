// Správa prezentace podle struktury z Index.tsx
let currentSlide = 0;
let direction = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Inicializace
document.addEventListener('DOMContentLoaded', function() {
    initPresentation();
    setupKeyboardNavigation();
    createSlideIndicators();
    createSnowflakes();
    createTwinklingLights();
    updateSlideDisplay();
});

// Inicializace prezentace
function initPresentation() {
    // Zobrazíme první slide
    slides[0].classList.add('slide-active');
    
    // Nastavíme scroll listener pro detekci změny slidu
    const container = document.getElementById('presentationContainer');
    container.addEventListener('scroll', handleScroll);
}

// Vytvoření indikátorů slidů
function createSlideIndicators() {
    const indicatorsContainer = document.getElementById('slideIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Přejít na slide ${index + 1}`);
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
}

// Vytvoření animovaných vloček
function createSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakes');
    if (!snowflakesContainer) return;
    
    const snowflakeSymbols = ['❄', '❅', '❆', '✻', '✼', '✽', '✾', '✿', '❀'];
    const numSnowflakes = 50;
    
    for (let i = 0; i < numSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
        
        // Náhodná pozice vlevo
        snowflake.style.left = Math.random() * 100 + '%';
        
        // Náhodná doba animace (3-8 sekund)
        const duration = 3 + Math.random() * 5;
        snowflake.style.animationDuration = duration + 's';
        
        // Náhodné zpoždění
        snowflake.style.animationDelay = Math.random() * 2 + 's';
        
        // Náhodná velikost
        const size = 0.8 + Math.random() * 1.2;
        snowflake.style.fontSize = size + 'em';
        
        // Náhodná opacity
        snowflake.style.opacity = 0.5 + Math.random() * 0.5;
        
        snowflakesContainer.appendChild(snowflake);
    }
}

// Vytvoření blikajících světýlek
function createTwinklingLights() {
    const lightsContainer = document.getElementById('twinklingLights');
    if (!lightsContainer) return;
    
    const numLights = 30;
    const lightTypes = ['yellow', 'pink', 'blue'];
    
    for (let i = 0; i < numLights; i++) {
        const light = document.createElement('div');
        light.className = 'light ' + lightTypes[Math.floor(Math.random() * lightTypes.length)];
        
        // Náhodná pozice
        light.style.left = Math.random() * 100 + '%';
        light.style.top = Math.random() * 100 + '%';
        
        // Náhodná doba animace (1.5-3 sekundy)
        const duration = 1.5 + Math.random() * 1.5;
        light.style.animationDuration = duration + 's';
        
        // Náhodné zpoždění
        light.style.animationDelay = Math.random() * 2 + 's';
        
        lightsContainer.appendChild(light);
    }
}

// Změna slidu
function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    goToSlide(newSlide);
}

// Přejít na konkrétní slide
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    direction = index > currentSlide ? 1 : -1;
    currentSlide = index;
    
    updateSlideDisplay();
    scrollToSlide();
}

// Aktualizace zobrazení
function updateSlideDisplay() {
    slides.forEach((slide, index) => {
        slide.classList.remove('slide-active', 'slide-prev');
        
        if (index === currentSlide) {
            slide.classList.add('slide-active');
        } else if (index < currentSlide) {
            slide.classList.add('slide-prev');
        }
    });
    
    // Aktualizace navigačních tlačítek
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideInfo = document.getElementById('slideInfo');
    
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
    if (slideInfo) slideInfo.textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    // Aktualizace indikátorů
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Scroll na aktuální slide
function scrollToSlide() {
    const container = document.getElementById('presentationContainer');
    const slide = slides[currentSlide];
    
    if (container && slide) {
        const slideTop = slide.offsetTop;
        container.scrollTo({
            top: slideTop,
            behavior: 'smooth'
        });
    }
}

// Detekce scrollu pro aktualizaci aktuálního slidu
function handleScroll() {
    const container = document.getElementById('presentationContainer');
    if (!container) return;
    
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    // Najdeme slide, který je nejvíce viditelný
    let newCurrentSlide = 0;
    let maxVisible = 0;
    
    slides.forEach((slide, index) => {
        const slideTop = slide.offsetTop;
        const slideHeight = slide.offsetHeight;
        const slideBottom = slideTop + slideHeight;
        
        // Vypočítáme, kolik slidu je vidět
        const visibleTop = Math.max(0, scrollTop - slideTop);
        const visibleBottom = Math.min(slideHeight, scrollTop + containerHeight - slideTop);
        const visible = Math.max(0, visibleBottom - visibleTop);
        const visiblePercent = visible / slideHeight;
        
        if (visiblePercent > maxVisible) {
            maxVisible = visiblePercent;
            newCurrentSlide = index;
        }
    });
    
    if (newCurrentSlide !== currentSlide) {
        currentSlide = newCurrentSlide;
        direction = newCurrentSlide > currentSlide ? 1 : -1;
        updateSlideDisplay();
    }
}

// Klávesová navigace
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Ignorujeme, pokud uživatel píše do inputu
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSlide < totalSlides - 1) {
                changeSlide(1);
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSlide > 0) {
                changeSlide(-1);
            }
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }
    });
}

// Event listenery pro navigační tlačítka
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeSlide(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeSlide(1));
    }
});

// Automatické skrytí navigace při tisku
window.addEventListener('beforeprint', function() {
    const nav = document.getElementById('navigation');
    const indicators = document.getElementById('slideIndicators');
    const snowflakes = document.getElementById('snowflakes');
    const lights = document.getElementById('twinklingLights');
    if (nav) nav.style.display = 'none';
    if (indicators) indicators.style.display = 'none';
    if (snowflakes) snowflakes.style.display = 'none';
    if (lights) lights.style.display = 'none';
});

window.addEventListener('afterprint', function() {
    const nav = document.getElementById('navigation');
    const indicators = document.getElementById('slideIndicators');
    const snowflakes = document.getElementById('snowflakes');
    const lights = document.getElementById('twinklingLights');
    if (nav) nav.style.display = 'flex';
    if (indicators) indicators.style.display = 'flex';
    if (snowflakes) snowflakes.style.display = 'block';
    if (lights) lights.style.display = 'block';
});

// Export funkcí pro globální použití (pro případné onclick atributy)
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;

