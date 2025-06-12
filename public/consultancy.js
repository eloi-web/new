const consultancies = [
  {
    title: "Business Strategy",
    location: "Kigali",
    description: "Improve your business decisions with expert strategic planning.",
    image: "https://img.freepik.com/premium-photo/portrait-handsome-africanamerican-man-wearing-glasses-looking-camera-smiling-while-posing_236854-33945.jpg?w=1380",
    price: 250,
    rating: 4.8,
    clientsHelped: 112,
    badge: "High Rated"
  },
  {
    title: "IT & Software Advice",
    location: "Musanze",
    description: "Get guidance on IT solutions for modern business needs.",
    image: "https://img.freepik.com/free-photo/beautiful-smiling-african-american-female-with-crisp-hair-broad-smile-shows-white-teeth-wears-casual-t-shirt-spectacles-stands-wall-rejoices-having-day-off-woman-journalist-indoor_273609-15511.jpg?t=st=1746265426~exp=1746269026~hmac=bfd7152b9511df242f4ce8f352251c14c0627ab5baf4a122aaa550731ba949ba&w=1380",
    price: 150,
    rating: 4.6,
    clientsHelped: 94,
    badge: "High Rated"
  },
  {
    title: "Marketing Consultant",
    location: "Huye",
    description: "Boost your brand with tailored marketing strategies.",
    image: "https://img.freepik.com/premium-photo/smile-portrait-black-man-studio-creative-career-media-company-magazine-newspaper-isolated-white-background-mockup-face-young-graduate-happy-internship-writing-job_590464-339887.jpg?w=1380",
    price: 200,
    rating: 4.7,
    clientsHelped: 107,
    badge: "High Rated"
  },
  {
    title: "Startup Legal Advisor",
    description: "Offers comprehensive legal support for new businesses, covering contracts, compliance, and IP.",
    location: "Kigali",
    image: "https://img.freepik.com/free-photo/casual-young-african-man-smiling-isolated-white_93675-128895.jpg?t=st=1746266557~exp=1746270157~hmac=5d3508d03cb9e37e6e86998075062b523bc34b3778a80c8523e658a81c230878&w=1060",
    price: 150,
    rating: 4.9,
    clientsHelped: 102,
    badge: "Top Rated"
  },
  {
    title: "Business Development Coach",
    description: "Specializes in scaling small businesses through strategic partnerships and planning.",
    location: "Rubavu",
    image: "https://img.freepik.com/free-photo/cheerful-african-guy-with-narrow-dark-eyes-fluffy-hair-dressed-elegant-white-shirt_273609-14082.jpg?t=st=1746266228~exp=1746269828~hmac=a97aedb6e1c0f8eca34e50e716cd71688d8fb0cef59063c382968518a5d6c7c7&w=1380",
    price: 200,
    rating: 4.7,
    clientsHelped: 89,
    badge: "High Rated"
  },
  {
    title: "Digital Marketing Consultant",
    description: "Boosts online presence using SEO, paid ads, and social media strategies.",
    location: "Huye",
    image: "https://img.freepik.com/free-photo/handsome-man-smiling-happy-face-portrait-close-up_53876-139608.jpg?t=st=1746266626~exp=1746270226~hmac=4b59f3be539f9899ae35e2c3a72c5264e276c80639d3e834a7f824ac4a115c6b&w=1380",
    price: 130,
    rating: 4.5,
    clientsHelped: 143,
    badge: "Recommended"
  },
  {
    title: "Financial Planning Expert",
    description: "Helps individuals and companies create investment and saving plans.",
    location: "Kigali",
    image: "https://img.freepik.com/premium-photo/business-portrait-happy-black-man-office-workplace-startup-company-job-employee-face-smile-creative-professional-entrepreneur-designer-working-career-south-africa_590464-296618.jpg?w=1380",
    price: 175,
    rating: 4.8,
    clientsHelped: 112,
    badge: "Top Rated"
  },
  {
    title: "HR & Talent Consultant",
    description: "Builds effective teams through talent acquisition, training, and HR compliance.",
    location: "Musanze",
    image: "https://img.freepik.com/free-photo/waist-up-shot-friendly-looking-charming-timid-african-american-girlfriend-with-curly-hairstyle_176420-31337.jpg?t=st=1746266703~exp=1746270303~hmac=53ad1ca28ab71d3ebbc2100750e29f7acd8ffeb75108e18fb4172527e9b7f1bd&w=1380",
    price: 100,
    rating: 4.6,
    clientsHelped: 75,
    badge: "Trusted"
  },
  {
    title: "Grant & Proposal Writer",
    description: "Crafts winning proposals and grants for NGOs and startups.",
    location: "Kigali",
    image: "https://img.freepik.com/free-photo/isolated-portrait-young-funny-dark-skinned-man-with-arms-crossed-with-afro-hairstyle-casual-white-shirt-denim-jacket-with-excited-face-expression_176420-13044.jpg?t=st=1746266407~exp=1746270007~hmac=2cddb408511deac979107cc9361f81e33e6a8c6d60ed502ebe0fda899ebee1c3&w=1380",
    price: 90,
    rating: 4.4,
    clientsHelped: 60,
    badge: "Affordable"
  }
];

const listingGrid = document.getElementById('listingGrid');
const modal = document.getElementById('consultancyModal');
const closeModal = document.getElementById('closeModal');

function showSkeletons(count = 6) {
  listingGrid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text" style="width: 70%;"></div>
        <div class="skeleton skeleton-btn"></div>
      `;
    listingGrid.appendChild(skeleton);
  }
}

function renderListings(filter = "", location = "") {
  showSkeletons();

  setTimeout(() => {
    listingGrid.innerHTML = "";
    consultancies.forEach(service => {
      if (
        (service.title.toLowerCase().includes(filter.toLowerCase()) || service.description.toLowerCase().includes(filter.toLowerCase())) &&
        (location === "" || service.location === location)
      ) {
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
          <div class="card-img" style="background-image:url('${service.image}')"></div>
          <div class="card-body">
            <h3>${service.title}</h3>
            <p>${service.location}</p>
            <p>${service.description.substring(0, 50)}...</p>
            <div class="card-extra">
              <span class="badge">${service.badge}</span>
              <span class="rating">⭐ ${service.rating}</span>
              <span class="clients">${service.clientsHelped} helped</span>
            </div>
          </div>
          <div class="card-footer">
            <span class="price">$${service.price}</span>
            <button class="btn">Book</button>
          </div>
        `;

        card.querySelector('.btn').addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(service);
        });
        card.addEventListener('click', () => openModal(service));
        listingGrid.appendChild(card);
      }
    });
  }, 1500);
}


function openModal(service) {
  document.getElementById('modalTitle').textContent = service.title;
  document.getElementById('modalLocation').textContent = service.location;
  document.getElementById('modalDesc').textContent = service.description;
  document.getElementById('modalPrice').textContent = `$${service.price}`;
  modal.classList.add('active');
  modal.querySelector('.popup-rating').textContent = `⭐ ${service.rating} (${service.clientsHelped} helped)`;
  modal.querySelector('.popup-badge').textContent = service.badge;

}

closeModal.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('active');
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderListings(e.target.value, document.getElementById('locationFilter').value);
});

document.getElementById('locationFilter').addEventListener('change', (e) => {
  renderListings(document.getElementById('searchInput').value, e.target.value);
});

flatpickr("#bookingDate", { minDate: "today" });

// Initial render
renderListings();

const newsletterForm = document.querySelector('.newsletter form');
newsletterForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with ${email}!`);
  this.reset();
});