        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
        });

        function toggleMenu() {
            document.getElementById('mobileMenu').classList.toggle('active');
            document.getElementById('overlay').classList.toggle('active');
            document.querySelector('.burger-menu').classList.toggle('active');
        }

        // ===== SEARCH FUNCTIONALITY =====
        let currentSearchQuery = '';
        let currentFilter = 'all';
        let currentSort = 'default';

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
            
            // Apply all filters (search + category)
            applyFiltersAndSort();
        }

        // ===== FILTER & SORT =====
        const productGrid1 = document.getElementById('productGrid');
        const productGrid2 = document.getElementById('productGrid2');
        
        const filterItems = document.querySelectorAll('.filter-item');
        const sortToggle = document.getElementById('sortToggle');
        const sortDropdown = document.getElementById('sortDropdown');
        const sortArrow = document.getElementById('sortArrow');
        const sortOptions = document.querySelectorAll('.sort-option');

        // Toggle sort dropdown
        sortToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDropdown.classList.toggle('active');
            sortArrow.style.transform = sortDropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!sortToggle.contains(e.target) && !sortDropdown.contains(e.target)) {
                sortDropdown.classList.remove('active');
                sortArrow.style.transform = 'rotate(0)';
            }
        });

        sortDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Filter functionality
        filterItems.forEach(item => {
            item.addEventListener('click', function() {
                filterItems.forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                
                currentFilter = this.getAttribute('data-filter');
                applyFiltersAndSort();
            });
        });

        // Sort functionality
        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                sortOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                currentSort = this.getAttribute('data-sort');
                applyFiltersAndSort();
                
                sortDropdown.classList.remove('active');
                sortArrow.style.transform = 'rotate(0)';
            });
        });

        function applyFiltersAndSort() {
            const products = Array.from(document.querySelectorAll('.product-card'));
            
            // First, determine which products match search
            products.forEach(product => {
                const title = product.getAttribute('data-title') || '';
                const category = product.getAttribute('data-category') || '';
                const keywords = product.getAttribute('data-keywords') || '';
                const productText = (title + ' ' + category + ' ' + keywords).toLowerCase();
                
                if (currentSearchQuery === '' || productText.includes(currentSearchQuery)) {
                    product.classList.remove('hidden-by-search');
                } else {
                    product.classList.add('hidden-by-search');
                }
            });

            // Then apply filter based on category (only to products not hidden by search)
            products.forEach(product => {
                const category = product.getAttribute('data-category');
                const isHiddenBySearch = product.classList.contains('hidden-by-search');
                
                if (!isHiddenBySearch && (currentFilter === 'all' || category === currentFilter)) {
                    product.classList.remove('hidden-by-filter');
                } else {
                    product.classList.add('hidden-by-filter');
                }
            });

            // Update search info
            const visibleProducts = products.filter(p => 
                !p.classList.contains('hidden-by-search') && 
                !p.classList.contains('hidden-by-filter')
            );
            
            const searchInfo = document.getElementById('searchInfo');
            const searchCount = document.getElementById('searchCount');
            const searchQuerySpan = document.getElementById('searchQuery');
            
            if (currentSearchQuery !== '') {
                searchCount.textContent = visibleProducts.length;
                searchQuerySpan.textContent = document.getElementById('desktopSearch').value || document.getElementById('mobileSearch').value;
                searchInfo.classList.add('active');
            } else {
                searchInfo.classList.remove('active');
            }

            // Apply sort to visible products
            if (currentSort === 'price-low') {
                visibleProducts.sort((a, b) => {
                    const priceA = parseFloat(a.getAttribute('data-price'));
                    const priceB = parseFloat(b.getAttribute('data-price'));
                    return priceA - priceB;
                });
            } else if (currentSort === 'price-high') {
                visibleProducts.sort((a, b) => {
                    const priceA = parseFloat(a.getAttribute('data-price'));
                    const priceB = parseFloat(b.getAttribute('data-price'));
                    return priceB - priceA;
                });
            } else {
                // Default sort - original order
                visibleProducts.sort((a, b) => {
                    const allProductsArray = Array.from(document.querySelectorAll('.product-card'));
                    const indexA = allProductsArray.indexOf(a);
                    const indexB = allProductsArray.indexOf(b);
                    return indexA - indexB;
                });
            }

            // Reorder DOM - append ke grid masing-masing
            const grid1Products = visibleProducts.filter(p => productGrid1.contains(p));
            const grid2Products = visibleProducts.filter(p => productGrid2.contains(p));
            
            grid1Products.forEach(product => productGrid1.appendChild(product));
            grid2Products.forEach(product => productGrid2.appendChild(product));
        }

        // ===== SLIDER DENGAN SCROLL FIX =====
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

        // Mouse events untuk desktop
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
        });

        updateSlide(0);
        startAutoSlide();

        // Expose functions ke global
        window.toggleMenu = toggleMenu;
        window.prevSlide = prevSlide;
        window.nextSlide = nextSlide;
        window.goToSlide = goToSlide;
        window.toggleSearch = toggleSearch;
        window.clearSearch = clearSearch;
        window.clearMobileSearch = clearMobileSearch;
        window.handleSearch = handleSearch;