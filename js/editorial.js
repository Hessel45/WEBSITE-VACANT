        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
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
            } else {
                document.body.style.overflow = '';
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
            
            // Get all searchable elements
            const searchableElements = document.querySelectorAll(
                '.featured-content .tag, .featured-content h2, .featured-content p, ' +
                '.meta-item .label, .meta-item .value, ' +
                '.section-header h2, .section-header p, ' +
                '.editorial-card .card-category, .editorial-card h3, .editorial-card p, .editorial-card .card-meta span, ' +
                '.lookbook-overlay h4, .lookbook-overlay p, ' +
                '.newsletter-block h3, .newsletter-block p'
            );
            
            // Get all sections that can be hidden
            const sections = [
                document.getElementById('featuredStory'),
                document.getElementById('latestStoriesHeader'),
                document.getElementById('editorialGrid'),
                document.getElementById('lookbookHeader'),
                document.getElementById('lookbook'),
                document.getElementById('btsHeader'),
                document.getElementById('btsGrid'),
                document.getElementById('newsletter')
            ];
            
            if (currentSearchQuery === '') {
                // Remove all highlights and show all sections
                removeHighlights();
                sections.forEach(section => {
                    if (section) section.classList.remove('search-hidden');
                });
                document.getElementById('searchInfo').classList.remove('active');
                return;
            }
            
            // Remove existing highlights
            removeHighlights();
            
            let resultCount = 0;
            
            // Search in each element and highlight matches
            searchableElements.forEach(element => {
                const text = element.textContent || element.innerText;
                if (text.toLowerCase().includes(currentSearchQuery)) {
                    highlightText(element, currentSearchQuery);
                    resultCount++;
                }
            });
            
            // Hide sections that don't contain any matches
            sections.forEach(section => {
                if (section) {
                    const sectionText = section.textContent || section.innerText;
                    if (sectionText.toLowerCase().includes(currentSearchQuery)) {
                        section.classList.remove('search-hidden');
                    } else {
                        section.classList.add('search-hidden');
                    }
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

        function removeHighlights() {
            const highlightedElements = document.querySelectorAll('.search-highlight');
            highlightedElements.forEach(element => {
                const parent = element.parentNode;
                parent.replaceChild(document.createTextNode(element.textContent), element);
                parent.normalize();
            });
        }

        function highlightText(element, query) {
            const text = element.textContent || element.innerText;
            const index = text.toLowerCase().indexOf(query.toLowerCase());
            
            if (index >= 0) {
                const start = text.substring(0, index);
                const match = text.substring(index, index + query.length);
                const end = text.substring(index + query.length);
                
                const fragment = document.createDocumentFragment();
                fragment.appendChild(document.createTextNode(start));
                
                const highlightSpan = document.createElement('span');
                highlightSpan.className = 'search-highlight';
                highlightSpan.textContent = match;
                fragment.appendChild(highlightSpan);
                
                fragment.appendChild(document.createTextNode(end));
                
                element.innerHTML = '';
                element.appendChild(fragment);
            }
        }

        // ========== LOOKBOOK SLIDER ==========
        const lookbookWrapper = document.getElementById('lookbookWrapper');
        const lookbookSlides = document.querySelectorAll('.lookbook-slide');
        const dotsContainer = document.getElementById('lookbookDots');
        let lookbookIndex = 0;
        let slidesPerView = 3;
        let totalLookbookSlides = lookbookSlides.length;

        function updateSlidesPerView() {
            if (window.innerWidth <= 768) slidesPerView = 1;
            else if (window.innerWidth <= 1200) slidesPerView = 2;
            else slidesPerView = 3;
        }

        function getMaxIndex() {
            return Math.max(0, totalLookbookSlides - slidesPerView);
        }

        function updateLookbookSlider() {
            updateSlidesPerView();
            const maxIndex = getMaxIndex();
            if (lookbookIndex > maxIndex) lookbookIndex = maxIndex;
            
            const slideWidth = lookbookSlides[0].offsetWidth + 25;
            lookbookWrapper.style.transform = `translateX(-${lookbookIndex * slideWidth}px)`;
            
            const dots = document.querySelectorAll('.lookbook-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === lookbookIndex);
            });
        }

        function nextLookbookSlide() {
            const maxIndex = getMaxIndex();
            if (lookbookIndex < maxIndex) {
                lookbookIndex++;
                updateLookbookSlider();
            } else {
                lookbookIndex = 0;
                updateLookbookSlider();
            }
        }

        function prevLookbookSlide() {
            if (lookbookIndex > 0) {
                lookbookIndex--;
                updateLookbookSlider();
            } else {
                lookbookIndex = getMaxIndex();
                updateLookbookSlider();
            }
        }

        function generateDots() {
            updateSlidesPerView();
            const maxIndex = getMaxIndex();
            let dotsHtml = '';
            for (let i = 0; i <= maxIndex; i++) {
                dotsHtml += `<button class="lookbook-dot ${i === 0 ? 'active' : ''}" onclick="goToLookbookSlide(${i})"></button>`;
            }
            dotsContainer.innerHTML = dotsHtml;
        }

        function goToLookbookSlide(index) {
            lookbookIndex = Math.min(index, getMaxIndex());
            updateLookbookSlider();
        }

        // Drag functionality
        let lookbookStartX, lookbookDragging = false;
        
        lookbookWrapper.addEventListener('mousedown', (e) => {
            lookbookDragging = true;
            lookbookStartX = e.pageX;
            lookbookWrapper.style.transition = 'none';
            lookbookWrapper.style.cursor = 'grabbing';
        });

        lookbookWrapper.addEventListener('mousemove', (e) => {
            if (!lookbookDragging) return;
            e.preventDefault();
            const walk = e.pageX - lookbookStartX;
            if (Math.abs(walk) > 80) {
                if (walk > 0) {
                    prevLookbookSlide();
                } else {
                    nextLookbookSlide();
                }
                lookbookDragging = false;
                lookbookWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
                lookbookWrapper.style.cursor = 'grab';
            }
        });

        lookbookWrapper.addEventListener('mouseup', () => {
            if (lookbookDragging) {
                lookbookDragging = false;
                lookbookWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
                lookbookWrapper.style.cursor = 'grab';
            }
        });

        lookbookWrapper.addEventListener('mouseleave', () => {
            if (lookbookDragging) {
                lookbookDragging = false;
                lookbookWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
                lookbookWrapper.style.cursor = 'grab';
            }
        });

        lookbookWrapper.addEventListener('touchstart', (e) => {
            lookbookDragging = true;
            lookbookStartX = e.touches[0].pageX;
            lookbookWrapper.style.transition = 'none';
        });

        lookbookWrapper.addEventListener('touchmove', (e) => {
            if (!lookbookDragging) return;
            e.preventDefault();
            const walk = e.touches[0].pageX - lookbookStartX;
            if (Math.abs(walk) > 60) {
                if (walk > 0) {
                    prevLookbookSlide();
                } else {
                    nextLookbookSlide();
                }
                lookbookDragging = false;
                lookbookWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
            }
        });

        lookbookWrapper.addEventListener('touchend', () => {
            if (lookbookDragging) {
                lookbookDragging = false;
                lookbookWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.15, 1)';
            }
        });

        window.addEventListener('resize', () => {
            generateDots();
            updateLookbookSlider();
        });

        generateDots();
        updateLookbookSlider();

        // Expose functions
        window.toggleMenu = toggleMenu;
        window.goToLookbookSlide = goToLookbookSlide;
        window.toggleSearch = toggleSearch;
        window.clearSearch = clearSearch;
        window.clearMobileSearch = clearMobileSearch;
        window.handleSearch = handleSearch;