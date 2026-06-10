        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        function toggleMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('overlay');
            const burger = document.querySelector('.burger-menu');
            
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            burger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        }

        // ===== SEARCH FUNCTIONALITY =====
        let currentSearchQuery = '';

        function toggleSearch() {
            const searchBox = document.getElementById('desktopSearch');
            searchBox.classList.toggle('active');
            if (searchBox.classList.contains('active')) {
                searchBox.focus();
            } else {
                searchBox.value = '';
                handleSearch('');
            }
        }

        function handleSearchBlur() {
            const searchBox = document.getElementById('desktopSearch');
            setTimeout(() => {
                if (!searchBox.classList.contains('active')) return;
                if (searchBox.value === '') {
                    searchBox.classList.remove('active');
                }
            }, 200);
        }

        function clearSearch() {
            const desktopSearch = document.getElementById('desktopSearch');
            const mobileSearch = document.getElementById('mobileSearch');
            
            desktopSearch.value = '';
            desktopSearch.classList.remove('active');
            
            if (mobileSearch) {
                mobileSearch.value = '';
            }
            
            handleSearch('');
        }

        function clearMobileSearch() {
            const mobileSearch = document.getElementById('mobileSearch');
            mobileSearch.value = '';
            handleSearch('');
        }

        function handleSearch(query) {
            currentSearchQuery = query.toLowerCase().trim();
            
            // Sync search boxes
            const desktopSearch = document.getElementById('desktopSearch');
            const mobileSearch = document.getElementById('mobileSearch');
            
            if (desktopSearch.value !== query) {
                desktopSearch.value = query;
            }
            if (mobileSearch && mobileSearch.value !== query) {
                mobileSearch.value = query;
            }
            
            // Get all text containers
            const textContainers = document.querySelectorAll('.text-container');
            
            if (currentSearchQuery === '') {
                // Remove all highlights and show all text containers
                removeHighlights();
                textContainers.forEach(container => {
                    container.classList.remove('search-hidden');
                });
                document.getElementById('searchInfo').classList.remove('active');
                return;
            }
            
            // Remove existing highlights
            removeHighlights();
            
            let resultCount = 0;
            
            // Check each text container
            textContainers.forEach(container => {
                const containerText = container.textContent || container.innerText;
                
                if (containerText.toLowerCase().includes(currentSearchQuery)) {
                    // Container matches search - show it
                    container.classList.remove('search-hidden');
                    
                    // Highlight matching text within this container
                    const textNodes = getTextNodes(container);
                    textNodes.forEach(node => {
                        const text = node.textContent;
                        if (text.toLowerCase().includes(currentSearchQuery)) {
                            highlightTextInNode(node, currentSearchQuery);
                        }
                    });
                    
                    resultCount++;
                } else {
                    // Container doesn't match - hide it
                    container.classList.add('search-hidden');
                }
            });
            
            // Update search info
            const searchInfo = document.getElementById('searchInfo');
            const searchCount = document.getElementById('searchCount');
            const searchQuerySpan = document.getElementById('searchQuery');
            
            if (resultCount > 0) {
                searchCount.textContent = resultCount;
                searchQuerySpan.textContent = query;
                searchInfo.classList.add('active');
            } else {
                searchInfo.classList.remove('active');
            }
        }

        function getTextNodes(element) {
            const textNodes = [];
            const walk = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Skip script and style tags
                        if (node.parentElement.tagName === 'SCRIPT' || 
                            node.parentElement.tagName === 'STYLE' ||
                            node.parentElement.tagName === 'I' ||
                            node.parentElement.classList.contains('fab')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            
            let node;
            while (node = walk.nextNode()) {
                if (node.textContent.trim() !== '') {
                    textNodes.push(node);
                }
            }
            return textNodes;
        }

        function highlightTextInNode(textNode, query) {
            const text = textNode.textContent;
            const index = text.toLowerCase().indexOf(query.toLowerCase());
            
            if (index >= 0) {
                const before = text.substring(0, index);
                const match = text.substring(index, index + query.length);
                const after = text.substring(index + query.length);
                
                const fragment = document.createDocumentFragment();
                fragment.appendChild(document.createTextNode(before));
                
                const highlightSpan = document.createElement('span');
                highlightSpan.className = 'search-highlight';
                highlightSpan.textContent = match;
                fragment.appendChild(highlightSpan);
                
                fragment.appendChild(document.createTextNode(after));
                
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        }

        function removeHighlights() {
            const highlights = document.querySelectorAll('.search-highlight');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            });
        }

        // ===== FULL SCREEN SLIDER =====
        const sliderWrapper = document.getElementById('sliderWrapper');
        const sliderItems = document.querySelectorAll('.slider-item');
        const progressItems = document.querySelectorAll('.progress-item');
        
        let currentIndex = 0;
        let startX = 0;
        let startY = 0; // Menambahkan tracking untuk sumbu Y
        let isDragging = false;
        let isHorizontalDrag = false; // Menandai apakah ini drag horizontal
        let slideWidth = 0;
        let autoSlideInterval;

        const totalSlides = sliderItems.length;

        function updateSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            currentIndex = index;
            slideWidth = sliderWrapper.clientWidth;
            sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            sliderItems.forEach((item, i) => {
                if (i === currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            
            progressItems.forEach((item, i) => {
                if (i === currentIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentIndex++;
            updateSlide(currentIndex);
            resetAutoSlide();
        }

        function prevSlide() {
            currentIndex--;
            updateSlide(currentIndex);
            resetAutoSlide();
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlide(currentIndex);
            resetAutoSlide();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                currentIndex++;
                updateSlide(currentIndex);
            }, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Event handlers yang sudah diperbaiki
        sliderWrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            startY = e.pageY;
            isHorizontalDrag = false;
            sliderWrapper.style.transition = 'none';
            sliderWrapper.style.cursor = 'grabbing';
            clearInterval(autoSlideInterval);
        });

        sliderWrapper.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.pageX;
            const currentY = e.pageY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Jika pergerakan horizontal lebih dominan, tangani sebagai drag slider
            if (diffX > diffY && diffX > 20) {
                e.preventDefault();
                isHorizontalDrag = true;
                
                const walk = (currentX - startX) * 2;
                const slideWidth = sliderWrapper.clientWidth;
                
                if (Math.abs(walk) > slideWidth * 0.15) {
                    if (walk > 0 && currentIndex > 0) {
                        currentIndex--;
                        updateSlide(currentIndex);
                        isDragging = false;
                        sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    } else if (walk < 0 && currentIndex < totalSlides - 1) {
                        currentIndex++;
                        updateSlide(currentIndex);
                        isDragging = false;
                        sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }
                    isDragging = false;
                }
            }
        });

        sliderWrapper.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                sliderWrapper.style.cursor = 'grab';
                updateSlide(currentIndex);
                startAutoSlide();
            }
        });

        sliderWrapper.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                sliderWrapper.style.cursor = 'grab';
                updateSlide(currentIndex);
                startAutoSlide();
            }
        });

        // Touch events untuk mobile
        sliderWrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            isHorizontalDrag = false;
            sliderWrapper.style.transition = 'none';
            clearInterval(autoSlideInterval);
        });

        sliderWrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].pageX;
            const currentY = e.touches[0].pageY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Jika pergerakan horizontal lebih dominan, cegah scroll vertikal
            if (diffX > diffY && diffX > 15) {
                e.preventDefault(); // Mencegah scroll hanya ketika drag horizontal
                isHorizontalDrag = true;
                
                const walk = (currentX - startX) * 2;
                const slideWidth = sliderWrapper.clientWidth;
                
                if (Math.abs(walk) > slideWidth * 0.1) {
                    if (walk > 0 && currentIndex > 0) {
                        currentIndex--;
                        updateSlide(currentIndex);
                        isDragging = false;
                        sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    } else if (walk < 0 && currentIndex < totalSlides - 1) {
                        currentIndex++;
                        updateSlide(currentIndex);
                        isDragging = false;
                        sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }
                    isDragging = false;
                }
            }
            // Jika pergerakan vertikal lebih dominan, biarkan scroll terjadi (tidak perlu e.preventDefault)
        });

        sliderWrapper.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                sliderWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                updateSlide(currentIndex);
                startAutoSlide();
            }
        });

        window.addEventListener('resize', () => {
            slideWidth = sliderWrapper.clientWidth;
            updateSlide(currentIndex);
            updateInstaSlider();
        });

        updateSlide(0);
        startAutoSlide();

        // ========== MODERN INSTAGRAM SLIDER ==========
        const instaWrapper = document.getElementById('instaSliderWrapper');
        const instaSlides = document.querySelectorAll('.insta-slide');
        const dotsContainer = document.getElementById('instaDots');
        let instaIndex = 0;
        let slidesPerView = 4;
        let totalInstaSlides = instaSlides.length;

        function updateSlidesPerView() {
            if (window.innerWidth <= 500) slidesPerView = 1;
            else if (window.innerWidth <= 800) slidesPerView = 2;
            else if (window.innerWidth <= 1100) slidesPerView = 3;
            else slidesPerView = 4;
        }

        function getMaxIndex() {
            return Math.max(0, totalInstaSlides - slidesPerView);
        }

        function updateInstaSlider() {
            updateSlidesPerView();
            const maxIndex = getMaxIndex();
            if (instaIndex > maxIndex) instaIndex = maxIndex;
            
            const slideWidth = instaSlides[0].offsetWidth + 25;
            instaWrapper.style.transform = `translateX(-${instaIndex * slideWidth}px)`;
            
            const dots = document.querySelectorAll('.insta-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === instaIndex);
            });
        }

        function nextInstaSlide() {
            const maxIndex = getMaxIndex();
            if (instaIndex < maxIndex) {
                instaIndex++;
                updateInstaSlider();
            } else {
                instaIndex = 0;
                updateInstaSlider();
            }
        }

        function prevInstaSlide() {
            if (instaIndex > 0) {
                instaIndex--;
                updateInstaSlider();
            } else {
                instaIndex = getMaxIndex();
                updateInstaSlider();
            }
        }

        function generateDots() {
            updateSlidesPerView();
            const maxIndex = getMaxIndex();
            let dotsHtml = '';
            for (let i = 0; i <= maxIndex; i++) {
                dotsHtml += `<button class="insta-dot ${i === 0 ? 'active' : ''}" onclick="goToInstaSlide(${i})"></button>`;
            }
            dotsContainer.innerHTML = dotsHtml;
        }

        function goToInstaSlide(index) {
            instaIndex = Math.min(index, getMaxIndex());
            updateInstaSlider();
        }

        let instaStartX, instaDragging = false;
        instaWrapper.addEventListener('mousedown', (e) => {
            instaDragging = true;
            instaStartX = e.pageX;
            instaWrapper.style.transition = 'none';
            instaWrapper.style.cursor = 'grabbing';
        });

        instaWrapper.addEventListener('mousemove', (e) => {
            if (!instaDragging) return;
            e.preventDefault();
            const walk = e.pageX - instaStartX;
            if (Math.abs(walk) > 80) {
                if (walk > 0) {
                    prevInstaSlide();
                } else {
                    nextInstaSlide();
                }
                instaDragging = false;
                instaWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
                instaWrapper.style.cursor = 'grab';
            }
        });

        instaWrapper.addEventListener('mouseup', () => {
            if (instaDragging) {
                instaDragging = false;
                instaWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
                instaWrapper.style.cursor = 'grab';
            }
        });

        instaWrapper.addEventListener('mouseleave', () => {
            if (instaDragging) {
                instaDragging = false;
                instaWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
                instaWrapper.style.cursor = 'grab';
            }
        });

        instaWrapper.addEventListener('touchstart', (e) => {
            instaDragging = true;
            instaStartX = e.touches[0].pageX;
            instaWrapper.style.transition = 'none';
        });

        instaWrapper.addEventListener('touchmove', (e) => {
            if (!instaDragging) return;
            e.preventDefault();
            const walk = e.touches[0].pageX - instaStartX;
            if (Math.abs(walk) > 60) {
                if (walk > 0) {
                    prevInstaSlide();
                } else {
                    nextInstaSlide();
                }
                instaDragging = false;
                instaWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
            }
        });

        instaWrapper.addEventListener('touchend', () => {
            if (instaDragging) {
                instaDragging = false;
                instaWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
            }
        });

        window.addEventListener('resize', () => {
            generateDots();
            updateInstaSlider();
        });

        generateDots();
        updateInstaSlider();

        window.toggleMenu = toggleMenu;
        window.prevSlide = prevSlide;
        window.nextSlide = nextSlide;
        window.goToSlide = goToSlide;
        window.prevInstaSlide = prevInstaSlide;
        window.nextInstaSlide = nextInstaSlide;
        window.goToInstaSlide = goToInstaSlide;
        window.toggleSearch = toggleSearch;
        window.clearSearch = clearSearch;
        window.clearMobileSearch = clearMobileSearch;
        window.handleSearch = handleSearch;