define(

	[
		"./Router"
	],

	function (Router) {

		"use strict";

		return Router.extend({

			init : function (routes, config) {
				this.sup.apply(this, arguments);

				this._pollInterval = this.setInterval(this._pollForHashChange, 100);
			},

			_lastHash : null,

			_pollForHashChange : function () {
				var hash = window.location.hash.replace("#", "");
				if (!hash) {
					return;
				}
				if (hash !== this._lastHash) {
					this.route(hash);
					this._lastHash = hash;
				}
			},

			onRoute : function (path, data) {
				this.sup(path, data);
				window.location.hash = this._lastHash = path;
			},

			close : function () {
				window.location.hash = "";
				this._lastHash = "";
				this.sup();
				this._newPath = null;
				this._lastView = null;
			}
		});
	}
);
