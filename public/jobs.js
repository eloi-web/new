document.addEventListener("DOMContentLoaded", async () => {
  const listingsEl = document.getElementById("jobListings");
  const locationFilter = document.getElementById("locationFilter");
  const typeFilter = document.getElementById("typeFilter");
  const searchInput = document.getElementById("searchInput");

  let jobs = [];

  function showSkeletons() {
    listingsEl.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement("div");
      skeleton.classList.add("listing-item", "skeleton");
      listingsEl.appendChild(skeleton);
    }
  }

  function renderJobs(filteredJobs) {
    listingsEl.innerHTML = "";

    if (filteredJobs.length === 0) {
      listingsEl.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    filteredJobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "listing-item";
      card.innerHTML = `
        <div class="job-card-content" style="display:flex; align-items:center; gap:1rem;">
          <img src="${job.companyLogoUrl || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}" 
               alt="${job.companyName}" 
               class="job-logo">
          <div>
            <h3>${job.title}</h3>
            <div class="company">${job.companyName}</div>
            <div class="location">${capitalize(job.jobLocation)}, Rwanda</div>
            <div class="tags">
              <span class="tag">${job.jobType}</span>
              ${(job.jobTags || []).map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openJobPopup(job));
      listingsEl.appendChild(card);
    });
  }

  window.openJobPopup = function (job) {
    document.getElementById('popup-title').innerText = job.title;
    document.getElementById('popup-company').innerText = `${job.companyName} - ${capitalize(job.jobLocation)}`;
    document.getElementById('popup-type').innerText = job.jobType;
    document.getElementById('popup-desc').innerText = job.jobDescription || "No description provided.";
    document.getElementById('popup-image').src = (job.jobImageUrls && job.jobImageUrls[0]) || "img/default-job.jpg";
    document.getElementById('job-popup').classList.remove('hidden');
    document.body.style.overflow = "hidden";
  };

  window.closeJobPopup = function () {
    document.getElementById('job-popup').classList.add('hidden');
    document.body.style.overflow = "";
  };

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  function filterJobs() {
    const loc = locationFilter.value.toLowerCase();
    const type = typeFilter.value.toLowerCase();
    const keyword = searchInput.value.toLowerCase();

    const filtered = jobs.filter(job =>
      (!loc || job.jobLocation?.toLowerCase() === loc) &&
      (!type || job.jobType?.toLowerCase() === type) &&
      (!keyword || job.title?.toLowerCase().includes(keyword))
    );

    showSkeletons();
    setTimeout(() => renderJobs(filtered), 500);
  }

  async function fetchJobsFromAPI() {
    showSkeletons();

    try {
      const res = await fetch('/api/get-posts?target=jobs');
      const data = await res.json();
      jobs = Array.isArray(data) ? data : [];
      renderJobs(jobs);
    } catch (err) {
      listingsEl.innerHTML = `<p style="color:red;">Failed to load jobs. ${err.message}</p>`;
    }
  }

  await fetchJobsFromAPI();
  locationFilter.addEventListener("change", filterJobs);
  typeFilter.addEventListener("change", filterJobs);
  searchInput.addEventListener("input", filterJobs);
});
