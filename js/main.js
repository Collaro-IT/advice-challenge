class CardReader {
    constructor(jsonURL) {
        this.jsonURL = jsonURL;
        this.jsonData = []; // Property to store JSON data
        this.filters = {
            sector: null, // Example filter for sector
            aiCapabilities: null,
            grandChallange: null,
            searchText: '', // Example filter for text search
            scoreImpact: null,
            scoreAI: null,
            scoreNovelty: null,

            // Add more filters as needed
        };
    }

    async fetchData() {
        try {
            // Fetch JSON data
            const response = await fetch(this.jsonURL);
            this.jsonData = await response.json();
        } catch (error) {
            console.error('Error fetching or parsing JSON:', error);
        }
    }

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


        if (this.filters.challenge && this.filters.challenge.length > 0) {

            filteredData = filteredData.filter(item => this.filters.challenge == item.challenge.toLowerCase());
        }

        if (this.filters.scoreImpact && this.filters.scoreImpact.length > 0) {
            filteredData = filteredData.filter(item =>
                item.Impact == this.filters.scoreImpact
            );
        }

        if (this.filters.scoreAI && this.filters.scoreAI.length > 0) {
            filteredData = filteredData.filter(item =>
                item.Impact == this.filters.scoreAI
            );
        }

        if (this.filters.scoreAI && this.filters.scoreAI.length > 0) {
            filteredData = filteredData.filter(item =>
                item.AISuitability == this.filters.scoreAI
            );
        }

        if (this.filters.scoreNovelty && this.filters.scoreNovelty.length > 0) {
            filteredData = filteredData.filter(item =>
                item.Novelty == this.filters.scoreNovelty
            );
        }

        // Add more filter conditions as needed

        return filteredData;
    }


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

        // Assuming your CSV has headers and data aligns with them
        this.data = item;
    }

    // STRING Gets the colour of the card using sector
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
            default:
                return 'teal'; // You can choose a default color or handle it as needed
        }
    }

    // STRING Get the Phase Icon
    getPhaseIcon() {
        return this.getColor() + "/" + this.data.phaseTitle.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // STRING Get AI Icon 1
    getAI1Icon() {
        return this.getColor() + "/" + this.data.ai1.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // STRING Get AI Icon 2
    getAI2Icon() {
        return this.getColor() + "/" + this.data.ai2.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // STRING Get AI Icon 3
    getAI3Icon() {
        return this.getColor() + "/" + this.data.ai3.replaceAll(" ", "").replace("&", "") + '.svg';
    }

    // STRING Get Background Image
    getImg() {
        return this.data.sector + '.svg'
    }

    // BOOL Hide Icon 1 
    hideIcon1() {
        return this.data.ai1 == '' ? true : false;
    }

    // BOOL Hide Icon 2
    hideIcon2() {
        return this.data.ai2 == '' ? true : false;
    }

    // BOOL Hide Icon 3
    hideIcon3() {
        return this.data.ai3 == '' ? true : false;
    }

    // BOOL Hide GC
    hideGC() {
        return this.data.challenge == '' ? true : false;
    }

    // STRING returns HTML for the Star Ratings

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
        // Convert card data to HTML and return
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

          <div class="card-conent-img">
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



// Handles the Stars being clicked and disabled with saving the value into hidden input 
$(document).ready(function() {
    // Add click event listener to dynamically added star divs
    $('.scores-filter').on('click', '.star, .all', function() {
        var currentStar = $(this);
        var starContainer = currentStar.closest('.d-flex ').find('.star');
        var allStar = currentStar.closest('.d-flex ').find('.all');
        var hiddenInput = currentStar.closest('.d-flex ').find('input');

        if (currentStar.hasClass('all')) {
            // Clicked on the "All" star

            if (!currentStar.hasClass('all-checked')) {
                allStar.toggleClass('all-checked');
            }
            starContainer.addClass('star-checked');
            hiddenInput.val(allStar.hasClass('all-checked') ? 'all' : starContainer.index(currentStar) + 1).trigger('change');
        } else {
            // Clicked on an individual star
            var starIndex = starContainer.index(currentStar) + 1;

            // Toggle star-checked class on stars before the clicked star
            starContainer.each(function(index) {
                if (index < starIndex) {
                    $(this).addClass('star-checked');
                } else {
                    $(this).removeClass('star-checked');
                }
            });

            // Set the hidden input value based on the checked stars
            hiddenInput.val(starIndex).trigger('change');

            // Remove the "all-checked" class from the "All" star
            allStar.removeClass('all-checked');
        }
    });
});

$(document).ready(function() {
	
	$('#toggler').click(function(){
		$('#toggler').toggleClass("arrow-down");
		$('#toggler').toggleClass("arrow-up");
	});
	
	
	
	
 $(function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    });
});
