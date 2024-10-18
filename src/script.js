let allDestinations = []; 
let displayedDestinations = []; 
// Function to fetch destinations 
function fetchDestinations() {
    fetch('http://localhost:3000/destinations')
        .then(response => response.json())
        .then(destinations => {
            allDestinations = destinations; // Store data of all destinations
            displayedDestinations = destinations.slice(0, 3); // Display the first 3 destinations in the list
            renderDestinationCards(); 
            populateDestinationDropdown(); 
        })
        .catch(error => console.error('Error fetching destinations:', error));
}

// Function to create a card for a destination
function createCard(destination) {
    const card = document.createElement('div'); //Creating a container for our card
    card.className = 'card ';
    card.style.width = '30rem';
    card.innerHTML = ` 
        <img src="${destination.imageUrl}" class="card-img-top" alt="${destination.city}">
        <div class="card-body">
            <h5 class="card-title">${destination.city}, ${destination.country}</h5>
            <p class="card-text">${destination.description}</p>
            <button class="btn btn-primary">View Details</button>
        </div>
    `;
    card.querySelector('.btn-primary').addEventListener('click', (e) => {
        e.preventDefault();
        showDestinationDetails(destination);// This button when clicked shall display all the detail pertaining a location
    });

    return card; 
}
// See All Destinations Function
function seeAllDestinations() {
    displayedDestinations= allDestinations; 
    renderDestinationCards(); 
 }
// Render destination cards
function renderDestinationCards() {
    const locationList = document.getElementById('locations-list');
    locationList.innerHTML = ''; // Clear existing content under the location list section
    displayedDestinations.forEach(destination => {
        const cards = createCard(destination);
        locationList.appendChild(cards); //creates a list of destination cards
    });

    const seeMoreBtn = document.getElementById('see-all-btn');
    seeMoreBtn.style.display = displayedDestinations.length < allDestinations.length ? 'block' : 'none'; // When selected displays all available locations for viewing..we have also added the feature if the destinations available are less than three,the button does not appear
}
// Show full details of a destination
function showDestinationDetails(destination) {
    const locationListAll = document.getElementById('locations-list');
    locationListAll.innerHTML = ''; // Clear previous content

    const detailView = document.createElement('div');
    detailView.className = 'destination-detail-view';

    detailView.innerHTML = `
        <h2>${destination.city}, ${destination.country}</h2>
        <img src="${destination.imageUrl}" alt="${destination.city}" style="max-width: 100%;">
        <p>${destination.description}</p>
        <h3>Activities:</h3>
        <ul>${destination.activities.map(activity => `<li>${activity}</li>`).join('')}</ul>
        <button class="btn btn-secondary" id="back-button">Back to All Destinations</button>
    `;

    locationListAll.appendChild(detailView); //adds all the details of a destination into 1
    
    document.getElementById('back-button').addEventListener('click', renderDestinationCards);
}
// Function to search
function Search() {
    const searchInput= document.getElementById('search-input').value.toLowerCase();
    const filteredDestinations= allDestinations.filter(destination =>
        destination.city.toLowerCase().includes(searchInput) || 
        destination.country.toLowerCase().includes(searchInput)
    );
 
    if (filteredDestinations.length === 1) {
        showDestinationDetails(filteredDestinations[0]); // Show details if one match found
    } else {
        displayDestinations(filteredDestinations); // Display filtered results otherwise
    }
 }
 
// Open itinerary creation form 
function openItineraryForm() {
    const modal = new bootstrap.Modal(document.getElementById('itinerary-modal'));
    modal.show(); // This just displays the form when clicked
}

// Close itinerary form 
function closeItineraryForm() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('itinerary-modal'));
    modal.hide(); // This closes the form once it is opened
}

// Function for destination dropdown button in the form
function populateDestinationDropdown() {
    const destinationselect = document.getElementById('destination-select');
    destinationselect.innerHTML = '<option value="">Select a destination</option>'; // Default  message that appears before a destination is picked

    allDestinations.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination.id; 
        option.textContent = `${destination.city}, ${destination.country}`; 
        destinationselect.appendChild(option);
    });
}

// Populate activities based on selected destination in the form
function populateActivities() {
    const activitiesContainer = document.getElementById('activities-container');
    const destinationId = document.getElementById('destination-select').value;

    activitiesContainer.innerHTML = ''; // Clear previous activities

    if (destinationId) {
        const selectedDestination = allDestinations.find(d => d.id == destinationId);
        
        selectedDestination.activities.forEach(activity => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `activity-${activity.replace(/\s+/g, '-').toLowerCase()}`;
            checkbox.name = 'activities';
            checkbox.value = activity;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = activity;

            activitiesContainer.appendChild(checkbox);
            activitiesContainer.appendChild(label);
            activitiesContainer.appendChild(document.createElement('br'));
        });
    }
}

// Itinerary form submission
document.getElementById('itinerary-form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const title = document.getElementById('itinerary-title').value;
    const imageUrl = document.getElementById('itinerary-image').value;
    const description = document.getElementById('itinerary-description').value;

   const selectedActivities= Array.from(document.querySelectorAll('#activities-container input:checked'))
                                   .map(checkbox => checkbox.value);

   const itineraryCard= createItineraryCard(title, imageUrl, description, selectedActivities);
    
   document.getElementById('my-collection').appendChild(itineraryCard);

   document.getElementById('itinerary-form').reset(); //resets the form
   closeItineraryForm(); // Close the form after submission
   
   
});

// Create an itinerary card for My Collection with Edit and Delete buttons
function createItineraryCard(title, imageUrl, description, activities) {
   const card= document.createElement('div');
   card.className= 'card m-2';
   card.style.width= '30rem';

   card.innerHTML= `
       <img src="${imageUrl}" class="card-img-top" alt="${title}">
       <div class="card-body">
           <h5 class="card-title">${title}</h5>
           <p class="card-text">${description.substring(0, 100)}...</p>
           <h6>Activities:</h6>
           <ul>${activities.map(activity => `<li>${activity}</li>`).join('')}</ul>
           <button class="btn btn-danger delete-button">Delete</button>
       </div>
   `;
   card.querySelector('.delete-button').addEventListener('click', () => card.remove());

   return card;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchDestinations);

