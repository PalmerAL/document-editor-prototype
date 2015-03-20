scratchpad.modules.define("research", {
	getImages: function(query) {
		var imageSearch;
		function searchComplete() {
			var contentDiv = $(".images-results");
			contentDiv.html("");
			if (!imageSearch.results && imageSearch.results.length < 0) {
				return;	
			}
			var results = imageSearch.results;
			results.forEach(function(value) {
				var imgContainer = $("<div>");
				var title = $("<div>");
				imgContainer.addClass("gimage-result-container");
				title.addClass("gimage-result-title themeable");
				title.html(value.titleNoFormatting);
				var newImg = $("<img>");
				// a lot of the images don't exist any more, get rid of them
				newImg.on("error", function(e) {
					newImg.parent().remove(); //remove the container for images that don't exist
				});
				newImg.attr("src", value.url);
				imgContainer.append(title);
				imgContainer.append(newImg);
				contentDiv.append(imgContainer);
			});
		}
		imageSearch = new google.search.ImageSearch();
		imageSearch.setSearchCompleteCallback(this, searchComplete, null);
		imageSearch.execute(query);
	},
	show: function(data) {
		var _ = this;
		$(".infocard-content").html("");
		var infocard = new InfoCard({
			query: data,
			container: $(".infocard-content")[0],
			onEmpty: function(container) {
				container.innerHTML="<div class='secondary-text error-message'>No results found.</div>"
			},
			onError: function(container) {
				container.innerHTML="<div class='secondary-text error-message'>An error occured</div>"
			},
			appReferName: "scratchpad",
			onHeadingClick: function(e) {
				if (e.target.tagName == "H2") { //category names for meanings
					_.show(e.target.innerHTML);
				} else { //headers that will just show the same results when clicked
					window.open("https://duckduckgo.com/?q=" + encodeURIComponent(e.target.innerHTML),'_blank');
				}
			},
			horizontalScrolling: ".InfoCard-tabs",
			classNames: {
				"category-item": "themeable",
			},
			protocol: window.location.protocol.replace(":","")
		});
		$(".infocard-shell").show();
		this.getImages(data);
	},
	generateImage: function(input) {
		var imagetemplate = "<img class='extend-block image-extend-block small' src='" + input + "'/>"
		scratchpad.caret.pasteHtmlAtCaret(imagetemplate, false);
	},
	imageInsertFlow: function(e) {
		if(e.target.hasAttribute("noinsert")) {
			return;
		}
		var _ = this;
		var position = $(e.target).offset();
		var shellposition = $(".infocard-shell").offset();
		var scroll = $(".infocard-shell").scrollTop();
		$(".research-insert-button").css({left: position.left - shellposition.left, top: position.top - shellposition.top + scroll });
		$(".research-insert-button").show();
		$(".research-insert-button").off();
		$(".research-insert-button").on("mousedown", function() {
			_.generateImage(e.target.src);
		});
	},
	init: function() {
		var _ = this;
		this.imageInsertFlow = this.imageInsertFlow.bind(this);
		$(".infocard-shell").append('<div noprint hidden class="research-insert-button small fab color-green-500" title="Add image to document"><i class="icon-add"></i></div>');
		$(".infocard-shell").on("mouseover", "img", function(e) {
			_.imageInsertFlow(e);
		});
		$(document.body).on("click", function() {
			$(".research-insert-button").hide();
		});
		$("#research-close-button").on("click", function() {
			$('.infocard-shell').hide();
		})
		scratchpad.keybindings.addBinding("mod+option+shift+i", function() {
			scratchpad.research.show(window.getSelection());
		});
		scratchpad.keybindings.addBinding("esc", function() {
			$(".infocard-shell").hide();
		});
	}
});
