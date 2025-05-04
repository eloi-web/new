document.addEventListener('DOMContentLoaded', function() {
  AOS.init({
      duration: 800
  });
});
  
document.addEventListener('DOMContentLoaded', function () {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  // Toggle sidebar
  hamburgerMenu?.addEventListener('click', function () {
    this.classList.toggle('active');
    mainNav?.classList.toggle('active');
    body.classList.toggle('sidebar-active');
  });

 
  document.addEventListener('click', function (event) {
    if (
      !mainNav.contains(event.target) &&
      !hamburgerMenu.contains(event.target) &&
      body.classList.contains('sidebar-active')
    ) {
      hamburgerMenu.classList.remove('active');
      mainNav.classList.remove('active');
      body.classList.remove('sidebar-active');
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 767) {
      hamburgerMenu.classList.remove('active');
      mainNav.classList.remove('active');
      body.classList.remove('sidebar-active');
    }
  });
});

// Initialize Swiper for featured categories

new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 5,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 4 }
  }
});

new Swiper('.swiperjs', {
  slidesPerView: 1,
  spaceBetween: 5,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  loop: true,
  breakpoints: {
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 4 }
  }
});

// sticky reset functionality
window.addEventListener('resize', function () {
  if (window.innerWidth > 767) {
    hamburgerMenu?.classList.remove('active');
    mainNav?.classList.remove('active');
    body.classList.remove('sidebar-active');
  }
});

// progress bar functionality
const progressBar = document.getElementById('progress-bar');
  window.addEventListener('load', () => {
    progressBar.style.width = '100%';
    setTimeout(() => {
      progressBar.style.display = 'none';
    }, 500);
  });

  document.addEventListener('DOMContentLoaded', function () {
    const searchWrapper = document.querySelector(".search-input");
    const inputBox = searchWrapper.querySelector("input");
    const suggBox = searchWrapper.querySelector(".autocom-box");
    const icon = searchWrapper.querySelector(".icon");
    const linkTag = searchWrapper.querySelector("a");
    let webLink;
  
    const suggestions = [
      "Jobs in Kigali",
      "Real Estate in Nyarugenge",
      "IT Consultancy",
      "Government Tenders",
      "Land Auctions",
      "Wedding Venues",
      "Affordable Housing",
      "Software Developer Jobs"
    ];
  
    inputBox.addEventListener("input", (e) => {
      const userData = e.target.value.trim();
      let filteredList = [];
  
      if (userData) {
        icon.onclick = () => {
          webLink = `https://www.google.com/search?q=${encodeURIComponent(userData)}`;
          linkTag.setAttribute("href", webLink);
          linkTag.click();
        };
  
        filteredList = suggestions.filter(item =>
          item.toLowerCase().startsWith(userData.toLowerCase())
        ).map(item => `<li>${item}</li>`);
  
        searchWrapper.classList.add("active");
        showSuggestions(filteredList);
  
        suggBox.querySelectorAll("li").forEach(li => {
          li.addEventListener("click", () => selectSuggestion(li.textContent));
        });
  
      } else {
        searchWrapper.classList.remove("active");
        suggBox.innerHTML = '';
      }
    });
  
    function selectSuggestion(text) {
      inputBox.value = text;
      webLink = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
      linkTag.setAttribute("href", webLink);
      linkTag.click();
      searchWrapper.classList.remove("active");
    }
  
    function showSuggestions(list) {
      suggBox.innerHTML = list.length
        ? list.join('')
        : `<li>${inputBox.value}</li>`;
    }
  
    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchWrapper.contains(e.target)) {
        searchWrapper.classList.remove("active");
      }
    });
  });
  
      // Close box if user clicks outside
      document.addEventListener("click", (e) => {
        if (!searchWrapper.contains(e.target)) {
          searchWrapper.classList.remove("active");
        }
      });
    
    

    // Card hover effects for featured listings
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', function () {
        this.querySelector('.card-hover').style.opacity = '1';
      });
      card.addEventListener('mouseleave', function () {
        this.querySelector('.card-hover').style.opacity = '0';
      });
    });


    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter form');
  newsletterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}!`);
    this.reset();
  });
    
  const closeBanner = document.querySelector('.close-banner');
  const marketBanner = document.querySelector('.market-banner');
  if (closeBanner && marketBanner) {
    closeBanner.addEventListener('click', function () {
      marketBanner.style.display = 'none';
      localStorage.setItem('bannerClosed', 'true');
    });
    if (localStorage.getItem('bannerClosed')) {
      marketBanner.style.display = 'none';
    }
  }
