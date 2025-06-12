const auctions = [
  {
    title: "Vintage Camera",
    desc: "A rare classic camera in working condition.",
    image: "https://img.freepik.com/free-photo/top-view-vintage-camera-composition_23-2148913950.jpg?t=st=1746278574~exp=1746282174~hmac=f0255333d1d27d230c7d98ceffb6f15babe8ca7ded3a8dc7be91d465bfd72847&w=1380",
    bid: 150,
    endTime: new Date().getTime() + 3600000 // 1 hour
  },
  {
    title: "Antique Clock",
    desc: "Elegant brass mantle clock from 1920.",
    image: "https://img.freepik.com/premium-photo/close-up-illuminated-statue-against-sky_1048944-16374123.jpg?w=740",
    bid: 230,
    endTime: new Date().getTime() + 7200000 // 2 hours
  },
  {
    title: "MacBook Pro 2020",
    desc: "Used MacBook Pro 13” in great condition.",
    image: "https://img.freepik.com/premium-photo/laptop-with-minimalist-design-open-display-keyboard-screen_883101-17316.jpg?w=900",
    bid: 850,
    endTime: new Date().getTime() + 10800000 // 3 hours
  },
  {
    title: "Electric Guitar",
    desc: "Red Fender Stratocaster with gig bag.",
    image: "https://img.freepik.com/free-photo/music-instrument-store_23-2150608942.jpg?t=st=1746278760~exp=1746282360~hmac=b1b538687ec2be1ea45af666a58fd906c7cd3e5e537f87b7ad207cdac1a2c93b&w=740",
    bid: 400,
    endTime: new Date().getTime() + 14400000 // 4 hours
  },
  {
    title: "Smartphone Bundle",
    desc: "iPhone X + Samsung S10 in working order.",
    image: "https://img.freepik.com/free-photo/still-life-tech-device_23-2150722663.jpg?t=st=1746278876~exp=1746282476~hmac=5db11a4dd0976ed7714145d7100b13acacc91e6b17c2d85a0025361bae002aa4&w=740",
    bid: 600,
    endTime: new Date().getTime() + 18000000 // 5 hours
  },
  {
    title: "Luxury Watch",
    desc: "Stainless steel automatic watch with box.",
    image: "https://img.freepik.com/free-photo/closeup-shot-modern-cool-black-digital-watch-with-brown-leather-strap_181624-3545.jpg?t=st=1746278913~exp=1746282513~hmac=edfaf6e362c80f77735c98c586d38d75f7119f3cc6f0fed998103ac721784ae9&w=740",
    bid: 1200,
    endTime: new Date().getTime() + 21600000 // 6 hours
  },
  {
    title: "Retro Gaming Console",
    desc: "Original PlayStation with controllers & games.",
    image: "https://img.freepik.com/free-photo/high-angle-controllers-headphones_23-2149829136.jpg?t=st=1746278975~exp=1746282575~hmac=0480bdeb1767f877fdda8b4fe0421f44516d51505751f5c2f9588110984bdce5&w=1380",
    bid: 275,
    endTime: new Date().getTime() + 25200000 // 7 hours
  },
  {
    title: "Leather Office Chair",
    desc: "Ergonomic high-back chair, barely used.",
    image: "https://img.freepik.com/free-photo/office-chair-still-life_23-2151149100.jpg?t=st=1746279062~exp=1746282662~hmac=07f3127917c5a71e00220ff1bf666835df10967bd5c2468df8fb69f624430532&w=740",
    bid: 130,
    endTime: new Date().getTime() + 28800000 // 8 hours
  }
];


const auctionGrid = document.getElementById("auctionGrid");
const popup = document.getElementById("auctionPopup");

function updateCountdown(endTime, el) {
  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = endTime - now;
    if (distance < 0) {
      clearInterval(interval);
      el.textContent = "Expired";
      return;
    }
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    el.textContent = `${h}h ${m}m ${s}s`;
  }, 1000);
}

auctions.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "listing-item";
  card.innerHTML = `
      <div class="property-image" style="background-image:url('${item.image}')"></div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <div class="property-details">
        <span><strong>Bid:</strong> $${item.bid}</span>
        <span id="countdown${index}"></span>
      </div>
      <button onclick="showPopup(${index})" class="cta-btn">View & Bid</button>
    `;
  auctionGrid.appendChild(card);
  updateCountdown(item.endTime, document.getElementById(`countdown${index}`));
});

function showPopup(index) {
  const a = auctions[index];
  document.getElementById("popupImage").style.backgroundImage = `url('${a.image}')`;
  document.getElementById("popupTitle").textContent = a.title;
  document.getElementById("popupDesc").textContent = a.desc;
  document.getElementById("popupBid").textContent = a.bid;
  updateCountdown(a.endTime, document.getElementById("popupTime"));
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
}

const newsletterForm = document.querySelector('.newsletter form');
newsletterForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with ${email}!`);
  this.reset();
});