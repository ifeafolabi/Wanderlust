// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-trips`).classList.add('active');
        });
    });

    // Sample data for past trips (in a real app, when I am ready for the backend, this would come from an API)
    const pastTrips = [
      {
        id: 1,
        destination: "Barcelona, Spain",
        date: "May 5 - May 15, 2023",
        image:
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJhcmNlbG9uYSUyMHNwYWlufGVufDB8fDB8fHww",
        status: "Completed",
        price: "$1,850",
        hotel: "Hotel Arts Barcelona",
      },
      {
        id: 2,
        destination: "Kyoto, Japan",
        date: "Mar 12 - Mar 22, 2023",
        image:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3lvdG8lMjBqYXBhbnxlbnwwfHwwfHx8MA%3D%3D",
        status: "Completed",
        price: "$2,450",
        hotel: "The Ritz-Carlton Kyoto",
      },
    ];

    // Sample data for saved trips (in a real app, this would come from an API)
    const savedTrips = [
      {
        id: 1,
        destination: "Santorini, Greece",
        date: "Available: Jun - Sep 2024",
        image:
          "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U2FudG9yaW5pJTIwZ3JlZWNlfGVufDB8fDB8fHww",
        price: "From $1,299",
        hotel: "Canaves Oia Suites",
      },
      {
        id: 2,
        destination: "Maui, Hawaii",
        date: "Available: Year-round",
        image:
          "https://plus.unsplash.com/premium_photo-1669748157617-a3a83cc8ea23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWF1aSUyMGhhd2FpaXxlbnwwfHwwfHx8MA%3D%3D",
        price: "From $1,799",
        hotel: "Four Seasons Resort Maui",
      },
    ];

    // Function to create trip card HTML
    function createTripCard(trip, type = 'upcoming') {
        if (type === 'saved') {
            return `
                <div class="trip-card">
                    <div class="trip-image" style="background-image: url('${trip.image}')">
                        <button class="save-btn active" data-trip-id="${trip.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="trip-details">
                        <div class="trip-header">
                            <h3>${trip.destination}</h3>
                            <span class="trip-price">${trip.price}</span>
                        </div>
                        <div class="trip-date">
                            <i class="far fa-calendar-alt"></i>
                            <span>${trip.date}</span>
                        </div>
                        <div class="trip-info">
                            <div class="info-item">
                                <i class="fas fa-hotel"></i>
                                <span>${trip.hotel}</span>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-block">Book Now</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="trip-card">
                <div class="trip-image" style="background-image: url('${trip.image}')">
                    <span class="trip-status ${type === 'past' ? 'completed' : ''}">
                        ${type === 'past' ? 'Completed' : trip.status}
                    </span>
                    ${type === 'upcoming' ? `
                    <button class="save-btn" data-trip-id="${trip.id}">
                        <i class="far fa-heart"></i>
                    </button>` : ''}
                </div>
                <div class="trip-details">
                    <div class="trip-header">
                        <h3>${trip.destination}</h3>
                        <span class="trip-price">${trip.price}</span>
                    </div>
                    <div class="trip-date">
                        <i class="far fa-calendar-alt"></i>
                        <span>${trip.date}</span>
                    </div>
                    <div class="trip-info">
                        <div class="info-item">
                            <i class="fas fa-hotel"></i>
                            <span>${trip.hotel}</span>
                        </div>
                    </div>
                    <div class="trip-actions">
                        ${type === 'upcoming' ? `
                        <button class="btn btn-outline">View Details</button>
                        <button class="btn btn-primary">Manage Booking</button>` : ''}
                        ${type === 'past' ? `
                        <button class="btn btn-outline">View Details</button>
                        <button class="btn btn-primary">Book Again</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // Function to render trips
    function renderTrips(trips, containerId, type = 'upcoming') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const tripsContainer = container.querySelector('.trip-cards');
        if (!tripsContainer) return;

        tripsContainer.innerHTML = trips.map(trip => createTripCard(trip, type)).join('');
    }

    // Initialize tabs and load data
    function initTripsPage() {
        // Render past trips
        renderTrips(pastTrips, 'past-trips', 'past');
        
        // Render saved trips
        renderTrips(savedTrips, 'saved-trips', 'saved');

        // Handle save/unsave functionality
        document.addEventListener('click', function(e) {
            const saveBtn = e.target.closest('.save-btn');
            if (!saveBtn) return;

            const icon = saveBtn.querySelector('i');
            if (icon.classList.contains('far')) {
                // Save trip
                icon.classList.remove('far');
                icon.classList.add('fas');
                saveBtn.classList.add('active');
                // Here you would typically make an API call to save the trip
            } else {
                // Unsave trip
                icon.classList.remove('fas');
                icon.classList.add('far');
                saveBtn.classList.remove('active');
                // Here you would typically make an API call to unsave the trip
            }
        });
    }

    // Initialize the page
    initTripsPage();
});
