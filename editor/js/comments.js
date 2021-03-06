/* this is disabled by default */

docLayer.modules.define("comments", {
	template: "<span contenteditable='false'><comment contenteditable>comment</comment></span>", //span needed to get :focus to work correctly
	add: function () {
		docLayer.caret.pasteHtmlAfterCaret(this.template);
	},
	delete: function (e) {
		var rightedge = $(e.target).offset().left + $(e.target).width();
		if (e.pageX > rightedge - 32) {
			$(e.target).parent().remove();
		}
	},
	init: function () {
		var _ = this;

		docLayer.editortooltip.createButton({
			name: "Comment",
			content: "<i class='icon-comment'></i>",
			section: "comment",
			fn: function () {
				_.add();
			},
		});

		docLayer.editregion.on("click", "comment", function (e) {
			_.delete(e);
		});
	}
});