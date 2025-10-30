// CardReader Class, which handles loading of the data, filtering and generating the card objects
class CardReader {
    constructor(jsonURL) {
        this.jsonURL = jsonURL; // Where the JSON file is
        this.jsonData = []; // Property to store JSON data
        this.filters = { // Each filter, needs to be handled in appliesFilter method  
            sector: null, 
            aiCapabilities: null,
            grandChallange: null,
            searchText: '', 
            scoreImpact: null,
            scoreAI: null,
            scoreNovelty: null,
        };
    }

    // Fetch the Data as ASYNC 
    async fetchData() {
        try {
            // Fetch JSON data
            const response = await fetch(this.jsonURL);
            this.jsonData = await response.json();
        } catch (error) {
            console.error('Error fetching or parsing JSON:', error);
        }
    }

    // Applies the filters we setup 
    applyFilters() {
        // Apply filters to the data
        let filteredData = this.jsonData;

        // Sector Filter
        if (this.filters.sector && this.filters.sector.length > 0) {
            // Apply sector filter
            filteredData = filteredData.filter(item => this.filters.sector.includes(item.sector.toLowerCase()));
        }


        // AI Capability Filter
        if (this.filters.aiCapabilities && this.filters.aiCapabilities.length > 0) {
            filteredData = filteredData.filter(item =>
                this.filters.aiCapabilities.includes(item.ai1.toLowerCase()) ||
                this.filters.aiCapabilities.includes(item.ai2.toLowerCase()) ||
                this.filters.aiCapabilities.includes(item.ai3.toLowerCase())
            );
        }

        // Search Filter	
        if (this.filters.searchText) {
            // Apply text search filter to title and description
            const searchText = this.filters.searchText.toLowerCase();
            filteredData = filteredData.filter(item =>
                item.title.toLowerCase().includes(searchText) || item.description.toLowerCase().includes(searchText)
            );
        }

	// Challange Filter
        if (this.filters.challenge && this.filters.challenge.length > 0) {
            filteredData = filteredData.filter(item => this.filters.challenge == item.challenge.toLowerCase());
        }

	// Score Impact Filter
        if (this.filters.scoreImpact && this.filters.scoreImpact.length > 0) {
            filteredData = filteredData.filter(item =>
                item.Impact == this.filters.scoreImpact
            );
        }

	// Score AI Filter
        if (this.filters.scoreAI && this.filters.scoreAI.length > 0) {
            filteredData = filteredData.filter(item =>
                item.AISuitability == this.filters.scoreAI
            );
        }

	// Score Novelty
        if (this.filters.scoreNovelty && this.filters.scoreNovelty.length > 0) {
            filteredData = filteredData.filter(item =>
                item.Novelty == this.filters.scoreNovelty
            );
        }

        // Add more filter conditions as needed

        return filteredData;
    }

    // Load Cards
    loadCards() {
        try {
            // Clear the existing cards in the container
            $('.card-section').empty();

            // Apply filters to get filtered data
            const filteredData = this.applyFilters();

            // Process each item in the filtered data
            let delay = 100; // initial delay

            filteredData.forEach(item => {

                const card = new Card(item);

                // Append card to the container with a delay
                $('.card-section').append(card.toHTML());

            });

        } catch (error) {
            console.error('Error loading cards:', error);
        }
    }
}


// Card Object
class Card {
    constructor(item) {
        this.data = item;
    }

    // Gets the colour of the card using sector
    getColor() {
        const sector = this.data.sector.toLowerCase();

        switch (sector) {
            case 'energy':
                return 'teal';
            case 'agriculture':
                return 'green';
            case 'manufacturing':
                return 'orange';
            case 'built environment':
                return 'pink';
            case 'transport':
                return 'purple';
            default:
                return 'teal'; // You can choose a default color or handle it as needed
        }
    }

    // Get the Phase Icon
    getPhaseIcon() {
        return this.getColor() + "/" + this.data.phaseTitle.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // Get AI Icon 1
    getAI1Icon() {
        return this.getColor() + "/" + this.data.ai1.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // Get AI Icon 2
    getAI2Icon() {
        return this.getColor() + "/" + this.data.ai2.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // Get AI Icon 3
    getAI3Icon() {
        return this.getColor() + "/" + this.data.ai3.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // Get Background Image
    getImg() {
        return this.data.sector + '.svg'
    }

    // Hide Icon 1 
    hideIcon1() {
        return this.data.ai1 == '' ? true : false;
    }

    // Hide Icon 2
    hideIcon2() {
        return this.data.ai2 == '' ? true : false;
    }

    // Hide Icon 3
    hideIcon3() {
        return this.data.ai3 == '' ? true : false;
    }

    // Hide GC
    hideGC() {
        return this.data.challenge == '' ? true : false;
    }

    // HTML for the Star Ratings
    starRating(n) {
        const fillStar = '<img src="images/icons/fill-star.svg" alt="fill-star.svg" />';
        const emptyStar = '<img src="images/icons/star.svg" alt="star.svg" />';

        switch (n) {
            case 1:
                return `${fillStar} ${emptyStar} ${emptyStar}`;
            case 2:
                return `${fillStar} ${fillStar} ${emptyStar}`;
            case 3:
                return `${fillStar} ${fillStar} ${fillStar}`;
            default:
                return '';
        }
    }


    // Generate HTML for Card

    toHTML() {

        return `
      <div class="card fadeIn card-${this.getColor()}-text-bg">
        <div class="card-content">
          <div class="card-side card-${this.getColor()}-bg">
            <div class="control-system card-${this.getColor()}-bg">
			  <div class="number">
				<h5 class="card-${this.getColor()}-text-bg">${this.data.number}</h5>
			  </div>
              <span>${this.data.title}</span>
            </div>
			${!this.hideGC() ? `
            <div class="gc card-${this.getColor()}-bg">
              <h5 class="card-${this.getColor()}-text-bg">${this.data.challenge}</h5>
			</div>` : ''}
            <div class="icon icon-1 card-${this.getColor()}-bg">
              <span><img src="images/icons/${this.getPhaseIcon()}" /></span>
            </div>
		    ${!this.hideIcon1() ? `
		      <div class="icon icon-2 card-${this.getColor()}-bg">
			  <span><img src="images/icons/${this.getAI1Icon()}" /></span>
		    </div>` : ''}
		    ${!this.hideIcon2() ? `
		      <div class="icon icon-3 card-${this.getColor()}-bg">
			  <span><img src="images/icons/${this.getAI2Icon()}" /></span>
		    </div>` : ''}
		    ${!this.hideIcon3() ? `
		      <div class="icon icon-4 card-${this.getColor()}-bg">
			  <span><img src="images/icons/${this.getAI3Icon()}" /></span>
		    </div>` : ''}
          </div>

          <div class="card-content-img">
            <img src="images/${this.getImg()}" alt="" />
          </div>
          <div class="card-content-text card-${this.getColor()}-text-bg">
            <p>${this.data.description}</p>
            <div class="rating">
              <div class="rating-item card-${this.getColor()}-bg">
                <h6>Impact</h6>
                <div class="rating-icon">
                 ${this.starRating(this.data.Impact)}
                </div>
              </div>
              <div class="rating-item card-${this.getColor()}-bg">
                <h6>AI suitablity</h6>
                <div class="rating-icon">
                 ${this.starRating(this.data.AISuitability)}
                </div>
              </div>
              <div class="rating-item card-${this.getColor()}-bg">
                <h6>Novelty</h6>
                <div class="rating-icon">
                 ${this.starRating(this.data.Novelty)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>			  			  
    `;
    }
}

// Launch loading cards and filter
$(document).ready(function() {

    const cardReader = new CardReader('data.json');
    cardReader.fetchData().then(() => {
        // Load cards after fetching data
        cardReader.loadCards();
    });

    setupFilters(cardReader);

});

// Setup filters
function setupFilters(cardReader) {

    $('#searchBox').on('input', function() {
        cardReader.filters.searchText = $(this).val();
        cardReader.loadCards();
    });

    $('.sector-filter').on('change', 'input[type="checkbox"]', function() {

        // Create an array to store selected sectors
        const selectedSectors = [];

        // Loop through all checkboxes and add selected sectors to the array
        $('.sector-filter input:checked').each(function() {
            selectedSectors.push($(this).val());
        });

        // Update the sector filter in the cardReader with the selected sectors
        cardReader.filters.sector = selectedSectors.length > 0 ? selectedSectors : null;

        // Load cards with the updated filters
        cardReader.loadCards();
    });


    $('.ai-capabilities-filter').on('change', 'input[type="checkbox"]', function() {

        // Create an array to store selected sectors
        const selectedAICapabilities = [];

        // Loop through all checkboxes and add selected sectors to the array
        $('.ai-capabilities-filter input:checked').each(function() {
            selectedAICapabilities.push($(this).val());
        });

        // Update the sector filter in the cardReader with the selected sectors
        cardReader.filters.aiCapabilities = selectedAICapabilities.length > 0 ? selectedAICapabilities : null;

        // Load cards with the updated filters
        cardReader.loadCards();
    });

    $('.gc-filter').on('change', 'select', function() {

        cardReader.filters.challenge = $(this).val() == 'all' ? null : $(this).val();
        cardReader.loadCards();
    })

    $(".score").bind("change", function() {

        var name = jQuery(this).attr("name");

        if (name == "Novelty") cardReader.filters.scoreNovelty = jQuery(this).val() == "all" ? null : jQuery(this).val();
        if (name == "AISuitability") cardReader.filters.scoreAI = jQuery(this).val() == "all" ? null : jQuery(this).val();
        if (name == "Impact") cardReader.filters.scoreImpact = jQuery(this).val() == "all" ? null : jQuery(this).val();

        // Load cards with the updated filters
        cardReader.loadCards();;
    });

}

$(document).ready(function() {
    // Add click event listener to dynamically added star divs
    $('.scores-filter').on('click', '.btn-star', function() {
        var value = $(this).data("star");
        var currentStar = $(this);
        var starContainer = currentStar.closest('.d-flex');
        var hiddenInput = starContainer.find('input');

        if (currentStar.hasClass('score-selected')) {
            // Clicked on a star with the score-selected class
            // Remove score-selected class from other buttons in the same row
            starContainer.find('.btn-star').removeClass('score-selected');

            // Set the hidden input to ALL
            hiddenInput.val('all').trigger('change');
        } else {
            // Clicked on a star without the score-selected class

            // Remove score-selected class from other buttons in the same row
            starContainer.find('.btn-star').removeClass('score-selected');

            // Add score-selected class to the clicked star
            currentStar.addClass('score-selected');

            // Set the hidden input to the clicked star's number
            hiddenInput.val(value).trigger('change');
        }
    });
});

$(document).ready(function() {

    $('#toggler').click(function() {
        $('#toggler').toggleClass("arrow-down");
        $('#toggler').toggleClass("arrow-up");
    });

    $(function() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    });
});

$(document).ready(function() {
    // Show/hide the button based on scroll position
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#scrollToTopBtn').fadeIn();
        } else {
            $('#scrollToTopBtn').fadeOut();
        }
    });

    // Scroll to top when the button is clicked
    $('#scrollToTopBtn').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 'slow');
        return false;
    });

    // Scrolls to top when toggle up is clicked	
    $('#toggler').click(function() {
        if ($(this).hasClass("arrow-down")) {
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
            return false;
        }
    });
});