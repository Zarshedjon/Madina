document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navbar = document.getElementById('navbar');
    
    if (burgerBtn && navbar) {
        burgerBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
            burgerBtn.classList.toggle('active');
        });
        
        const navLinks = navbar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                burgerBtn.classList.remove('active');
            });
        });
    }
    
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "") return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    const modal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');
    
    const placesInfo = {
        registon: {
            name: "Площадь Регистан",
            fullInfo: "Регистан — сердце Самарканда, одна из самых величественных площадей мира. Ансамбль состоит из трех медресе: Улугбека (1417–1420), Шер-Дор (1619–1636) и Тилля-Кари (1646–1660). На протяжении веков здесь проходили народные гуляния, оглашались указы правителей. Сегодня Регистан — это музей под открытым небом и место проведения международных фестивалей. Уникальная арабская вязь, изразцы и астрономические орнаменты поражают воображение. Вечером здесь включается светомузыкальное шоу."
        },
        bukhari: {
            name: "Комплекс Имама Аль-Бухари",
            fullInfo: "Мавзолей Имама Аль-Бухари — великого исламского богослова, автора самого достоверного сборника хадисов «Аль-Джами ас-Сахих». Комплекс находится в селении Хартанг, недалеко от Самарканда. Архитектурный ансамбль включает мечеть, медресе, усыпальницу и музей. Мавзолей облицован бирюзовыми и синими изразцами. Это святое место притягивает тысячи паломников со всего мира."
        },
        shohizinda: {
            name: "Ансамбль Шахи Зинда",
            fullInfo: "Шахи Зинда («Живой царь») — некрополь из мавзолеев древней знати и родственников Тамерлана. Расположен на склоне холма Афрасиаб. Ансамбль состоит из более чем 20 сооружений XIV–XV веков. Легенда гласит, что здесь похоронен двоюродный брат пророка Мухаммеда — Кусам ибн Аббас. Узкие улочки между мавзолеями создают неповторимую атмосферу. Шахи Зинда — настоящий музей средневековой архитектуры."
        }
    };
    
    function openModal(placeId) {
        const place = placesInfo[placeId];
        if (place) {
            modalContent.innerHTML = `
                <h2>${place.name}</h2>
                <p>${place.fullInfo}</p>
                <small style="color: #666;">Источник: исторические архивы Самарканда</small>
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModalWindow() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    const infoBtns = document.querySelectorAll('.info-btn');
    infoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const placeId = btn.getAttribute('data-place');
            if (placeId) openModal(placeId);
        });
    });
    
    if (closeModal) closeModal.addEventListener('click', closeModalWindow);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModalWindow();
    });
    
    let videoReviews = [];
    
    function loadReviews() {
        const saved = localStorage.getItem('videoReviews');
        if (saved) {
            videoReviews = JSON.parse(saved);
        } else {
            videoReviews = [
                {
                    id: Date.now() + 1,
                    name: "Алишер",
                    text: "Отличное видео! Очень красиво показан Самарканд. Спасибо!",
                    rating: 5,
                    date: new Date().toLocaleString()
                },
                {
                    id: Date.now() + 2,
                    name: "Мария",
                    text: "Красивые места, хочется посетить Самарканд!",
                    rating: 4,
                    date: new Date().toLocaleString()
                }
            ];
            saveReviews();
        }
        displayReviews();
    }
    
    function saveReviews() {
        localStorage.setItem('videoReviews', JSON.stringify(videoReviews));
    }
    
    function displayReviews() {
        const container = document.getElementById('reviewsContainer');
        if (!container) return;
        
        if (videoReviews.length === 0) {
            container.innerHTML = '<div class="no-reviews">Пока нет отзывов. Будьте первым!</div>';
            return;
        }
        
        container.innerHTML = videoReviews.map(review => `
            <div class="review-item" data-id="${review.id}">
                <div class="review-header">
                    <div class="review-author">👤 ${escapeHtml(review.name)}</div>
                    <div class="review-rating">⭐ ${review.rating}/5</div>
                    <div class="review-date">📅 ${review.date}</div>
                    <button class="delete-review" onclick="deleteReview(${review.id})">🗑 Удалить</button>
                </div>
                <div class="review-text">💬 ${escapeHtml(review.text)}</div>
            </div>
        `).join('');
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    window.deleteReview = function(id) {
        if (confirm("Вы действительно хотите удалить этот отзыв?")) {
            videoReviews = videoReviews.filter(review => review.id !== id);
            saveReviews();
            displayReviews();
        }
    };
    
    function addReview(name, text, rating) {
        if (!name.trim() || !text.trim()) {
            alert("Пожалуйста, введите ваше имя и отзыв!");
            return false;
        }
        
        const newReview = {
            id: Date.now(),
            name: name.trim(),
            text: text.trim(),
            rating: parseInt(rating),
            date: new Date().toLocaleString()
        };
        
        videoReviews.unshift(newReview);
        saveReviews();
        displayReviews();
        return true;
    }
    
    const submitBtn = document.getElementById('submitReviewBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const nameInput = document.getElementById('reviewName');
            const textInput = document.getElementById('reviewText');
            const ratingSelect = document.getElementById('reviewRating');
            
            if (nameInput && textInput && ratingSelect) {
                const success = addReview(nameInput.value, textInput.value, ratingSelect.value);
                if (success) {
                    nameInput.value = '';
                    textInput.value = '';
                    ratingSelect.value = '5';
                }
            }
        });
    }
    
    loadReviews();
    
    const cards = document.querySelectorAll('.place-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
});