$(document).ready(function(){
    $('.about-us__carusel').slick({
        fade: true,
        cssEase: 'linear',
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/back.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/next.png"></button>',
        responsive: [
          {
            breakpoint: 768,
            settings: {
			  dots: true,
			  arrows: false
            }
          }
        ]
    });
  });

$(document).ready(function(){
$('.review-carusel').slick({
		dots: true,
		speed: 100,
        fade: true,
        cssEase: 'linear',
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/back.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/next.png"></button>',
        responsive: [
            {
            	breakpoint: 991,
              	settings: {
                	dots: false
			  	},
			  	breakpoint: 768,
              	settings: {
			  		dots: true,
			  		arrows: false
            	}
            }
          ]
    });
});