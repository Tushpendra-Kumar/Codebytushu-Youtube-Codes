setTimeout(() => {
            const firstCard = document.querySelector('.notification-card.new');
            if (firstCard) {
                firstCard.classList.remove('new');
            }
        }, 2500);