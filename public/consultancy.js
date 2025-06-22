window.addEventListener('DOMContentLoaded', async () => {
  const listingGrid = document.getElementById('listingGrid');

  try {
    const res = await fetch('/api/consultants');
    const consultancies = await res.json();

    if (!Array.isArray(consultancies)) throw new Error('Invalid response');

    listingGrid.innerHTML = '';

    consultancies.forEach(post => {
      const card = document.createElement('div');
      card.className = 'listing-card';

      card.innerHTML = `
        <img src="${post.photoUrl || 'default.jpg'}" alt="${post.consultantName}">
        <h3>${post.consultantName}</h3>
        <p>${post.bio?.substring(0, 100) || 'No bio provided'}</p>
        <p><strong>Location:</strong> ${post.location}</p>
        <p class="price">$${post.price || 'N/A'}</p>
        <p class="popup-badge">${post.badge || ''}</p>
        <p class="popup-rating">⭐ ${post.rating || '4.5'} | Helped ${post.clientsHelped || '0'} clients</p>
        <button class="btn" onclick="openConsultancyModal('${post._id}')">View Details</button>
      `;

      listingGrid.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading consultants:', err);
    listingGrid.innerHTML = `<p style="color:red;">Failed to load consultant posts</p>`;
  }
});


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