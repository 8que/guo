document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('carousel');
    const carouselItems = [
        { image: 'img/guo (2).jpg', caption: '新鲜多汁的果儿' },
        { image: 'img/guo (9).jpg', caption: '色彩缤纷的果儿' },
        { image: 'img/guo (10).jpg', caption: '健康美味的果儿' },
        { image: 'img/guo (13).jpg', caption: '热带水果的果儿' },
        { image: 'img/guo (15).jpg', caption: '营养丰富的果儿' },
        { image: 'img/guo.jpg', caption: '自然生长的果实' }
    ];

    let currentIndex = 0;

    function createCarousel() {
        carousel.innerHTML = `
            <div class="carousel-container">
                ${carouselItems.map((item, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <img src="${item.image}" alt="${item.caption}">
                        <div class="carousel-caption">${item.caption}</div>
                    </div>
                `).join('')}
            </div>
            <button class="carousel-control prev">&lt;</button>
            <button class="carousel-control next">&gt;</button>
            <div class="carousel-indicators">
                ${carouselItems.map((_, index) => `
                    <button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                `).join('')}
            </div>
        `;

        const prevButton = carousel.querySelector('.prev');
        const nextButton = carousel.querySelector('.next');
        const indicators = carousel.querySelectorAll('.carousel-indicator');

        prevButton.addEventListener('click', () => changeSlide(-1));
        nextButton.addEventListener('click', () => changeSlide(1));
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
    }

    function changeSlide(direction) {
        goToSlide((currentIndex + direction + carouselItems.length) % carouselItems.length);
    }

    function goToSlide(index) {
        const items = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.carousel-indicator');

        items[currentIndex].classList.remove('active');
        indicators[currentIndex].classList.remove('active');

        currentIndex = index;

        items[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    }

    createCarousel();

    // 自动轮播
    setInterval(() => changeSlide(1), 5000);
});