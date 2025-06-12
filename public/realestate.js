document.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.filter-tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
            filterListings();
        });
    });

    function filterListings() {
        const selectedFilters = [];
        const selectedTags = document.querySelectorAll('.filter-tag.selected');
        selectedTags.forEach(tag => {
            selectedFilters.push(tag.textContent.trim());
        });

        console.log('Selected Filters:', selectedFilters);
        updateListings(selectedFilters);
    }
    // update listings
    function updateListings(filters) {
        const listingGrid = document.querySelector('.listing-grid');
        const listings = listingGrid.querySelectorAll('.listing-item');
        showLoadingSkeleton();

        //filtering logic
        setTimeout(() => {
            listings.forEach(listing => {
                const listingTags = listing.getAttribute('data-tags').split(',');

                // Check if listing matches any of the selected filter
                const match = filters.some(filter => listingTags.includes(filter));
                if (match || filters.length === 0) {
                    listing.style.display = 'block'; 
                } else {
                    listing.style.display = 'none'; 
                }
            });

            
            hideLoadingSkeleton();
        }, 1000);
    }

    // show skeletons..
    function showLoadingSkeleton() {
        const listingGrid = document.querySelector('.listing-grid');
        listingGrid.innerHTML = '';

        // skeleton for cards..
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('div');
            skeleton.classList.add('skeleton', 'listing-item');
            listingGrid.appendChild(skeleton);
        }
    }

    // hide skeleton
    function hideLoadingSkeleton() {
        const listingGrid = document.querySelector('.listing-grid');
        listingGrid.innerHTML = ''; 

        // load..
        loadListings();
    }

    //load listings..
    function loadListings() {
        const listingGrid = document.querySelector('.listing-grid');

        //titles and decriptions thus images also....
        const listingsData = [
            { title: 'Luxury Apartment', 
              description: 'Spacious and modern apartment with 5 bedrooms.',
              tags: 'Luxury, Apartment, City Center', 
              imageUrl: 'https://img.freepik.com/free-photo/row-houses-bristol-england_53876-143002.jpg?t=st=1746256265~exp=1746259865~hmac=13700c3b2846bc695dee0da11eded5fe9ab0842ddc2d0ba20409d810f5d43965&w=1380', 
              id: 1,
              price: 'RWF 2,500,000',
              status: 'FOR SALE',
              details: {
              beds: 5,
              baths: 4,
              size: '120m²'
        }
            },
            { title: 'Cozy Studio', 
                description: 'Perfect for singles or students, fully furnished.', 
                tags: 'Studio, Affordable, City Center', 
                imageUrl: 'https://img.freepik.com/premium-photo/suburban-street-homes_332679-26661.jpg?w=1800', 
                id: 2,
                price: 'RWF 2,500,000',
                status: 'SOLD',
                details: {
                beds: 8,
                baths: 8,
                size: '120m²'
          }
            },
            { title: 'Beachfront Villa', 
                description: 'Private villa with an ocean view.', 
                tags: 'Luxury, Villa, Beach', 
                imageUrl: 'https://img.freepik.com/premium-photo/thanksgiving-autumn-leaves-layout-with-postcard-wood-background_361349-5.jpg?w=1380', 
                id: 3,
                price: 'RWF 2,500,000',
                status: 'FOR SALE',
                details: {
                beds: 4,
                baths: 2,
                size: '120m²'
          } 
            },
            { title: 'Family Home', 
                description: 'Large house with a backyard, ideal for families.', 
                tags: 'House, Family, Suburbs', 
                imageUrl: 'https://img.freepik.com/free-photo/house-isolated-field_1303-23773.jpg?t=st=1746260731~exp=1746264331~hmac=ed04a59a3f16ef019e1b2294a493e6a47b710b422d81a4dc63ac989aaa9e3a40&w=1380', 
                id: 4,
                price: 'RWF 2,500,000',
                status: 'FOR SALE',
                details: {
                beds: 3,
                baths: 2,
                size: '120m²'
          } 
            },
            { title: 'Downtown Condo', 
                description: 'Modern condo in the heart of the city.', 
                tags: 'Condo, City Center, Modern', 
                imageUrl: 'https://img.freepik.com/free-photo/houses-river-dikes-near-sleeuwijk_181624-8207.jpg?t=st=1746260770~exp=1746264370~hmac=841554c57ffaf884602203135b5eaf3f303647214d333c6553163fce65ba15cc&w=1380', 
                id: 5,
                price: 'RWF 2,500,000',
                status: 'FOR RENT',
                details: {
                beds: 6,
                baths: 4,
                size: '120m²'
          } 
            },
            { title: 'Country Cottage', 
                description: 'Charming cottage in a rural area.', 
                tags: 'Cottage, Country, Affordable', 
                imageUrl: 'https://img.freepik.com/free-photo/charming-yellow-house-with-wooden-windows-green-grassy-garden_181624-8074.jpg?t=st=1746260825~exp=1746264425~hmac=bda5609aef439fd5425699c53071fe6c59be9e465de0e04f1591039eed022e7e&w=1380', 
                id: 6,
                price: 'RWF 2,500,000',
                status: 'SOLD',
                details: {
                beds: 2,
                baths: 2,
                size: '120m²'
          } 
            }
        ];
          

        //listings addition to the grids
        listingsData.forEach(listing => {
            const listingItem = document.createElement('div');
            listingItem.classList.add('listing-item');
            listingItem.setAttribute('data-tags', listing.tags);
            // status tag
            const statusTag = document.createElement('div');
            statusTag.classList.add('status-tag');
            statusTag.textContent = listing.status;

            // switching colors for status
    switch (listing.status.toUpperCase()) {
    case 'FOR SALE':
        statusTag.style.backgroundColor = '#10b981'; // green
        break;
    case 'SOLD':
        statusTag.style.backgroundColor = '#ef4444'; // red
        break;
    case 'FOR RENT':
        statusTag.style.backgroundColor = '#007bff'; // blue
        break;
    default:
        statusTag.style.backgroundColor = '#6b7280'; // gray-black
        }
    listingItem.appendChild(statusTag);

            const image = document.createElement('div');
            image.classList.add('property-image');
            image.style.backgroundImage = `url(${listing.imageUrl})`;
            listingItem.appendChild(image);
        
            // title and description
            const title = document.createElement('h3');
            title.textContent = listing.title;
            listingItem.appendChild(title);
        
            const description = document.createElement('p');
            description.textContent = listing.description;
            listingItem.appendChild(description);

            // Price
            const price = document.createElement('p');
            price.classList.add('property-price');
            price.textContent = listing.price;
            listingItem.appendChild(price);

        
            // details with icons
            const details = document.createElement('div');
            details.classList.add('property-details');
            details.innerHTML = `
    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M20 9.557V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.525 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.475-.811-2.75-2-3.443zM18 7v2h-5V7h5zM6 7h5v2H6V7zm14 9H4v-3c0-1.103.897-2 2-2h12c1.103 0 2 .897 2 2v3z"></path></svg> ${listing.details.beds} Beds</span>
    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M21 18.33A6.78 6.78 0 0 0 19.5 15a6.73 6.73 0 0 0-1.5 3.33 1.51 1.51 0 1 0 3 0zM11 20.33A6.78 6.78 0 0 0 9.5 17 6.73 6.73 0 0 0 8 20.33 1.59 1.59 0 0 0 9.5 22a1.59 1.59 0 0 0 1.5-1.67zM16 20.33A6.78 6.78 0 0 0 14.5 17a6.73 6.73 0 0 0-1.5 3.33A1.59 1.59 0 0 0 14.5 22a1.59 1.59 0 0 0 1.5-1.67zM6 18.33A6.78 6.78 0 0 0 4.5 15 6.73 6.73 0 0 0 3 18.33 1.59 1.59 0 0 0 4.5 20 1.59 1.59 0 0 0 6 18.33zM2 12h20v2H2zM13 4.07V2h-2v2.07A8 8 0 0 0 4.07 11h15.86A8 8 0 0 0 13 4.07z"></path></svg> ${listing.details.baths} Baths</span>
    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: scaleY(-1);msFilter:progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1);"><path d="M20.875 7H3.125C1.953 7 1 7.897 1 9v6c0 1.103.953 2 2.125 2h17.75C22.047 17 23 16.103 23 15V9c0-1.103-.953-2-2.125-2zm0 8H3.125c-.057 0-.096-.016-.113-.016-.007 0-.011.002-.012.008l-.012-5.946c.007-.01.052-.046.137-.046H5v3h2V9h2v4h2V9h2v3h2V9h2v4h2V9h1.875c.079.001.122.028.125.008l.012 5.946c-.007.01-.052.046-.137.046z"></path></svg> ${listing.details.size}</span>
`;

            listingItem.appendChild(details);
        
            listingGrid.appendChild(listingItem);
        });
        

        attachModalListeners();
        function attachModalListeners() {
            const listingItems = document.querySelectorAll('.listing-item');
            listingItems.forEach(item => {
                item.addEventListener('click', () => {
                    openPropertyModal(item);
                });
            });
        }
    }

    // open modal
    function openPropertyModal(item) {
        const modal = document.getElementById('property-popup');
    
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const imageUrl = item.querySelector('.property-image').style.backgroundImage
            .replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        
        const price = item.querySelector('.property-price')?.textContent;
        document.getElementById('popup-price').textContent = price || 'N/A';
            
    
        //update modal content
        document.getElementById('popup-title').textContent = title;
        document.getElementById('popup-desc').textContent = description;
        document.getElementById('popup-image').src = imageUrl;
        document.getElementById('popup-location').textContent = "Kigali, Rwanda";
        document.getElementById('popup-type').textContent = "House";
        modal.classList.remove('hidden');
    }

    loadListings();

    
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', () => {
        loadListings(); 
    });
});

 // Close 
 function closePropertyPopup() {
    const modal = document.getElementById('property-popup');
    modal.classList.add('hidden');
}
  
const newsletterForm = document.querySelector('.newsletter form');
newsletterForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  alert(`Thank you for subscribing with ${email}!`);
  this.reset();
});