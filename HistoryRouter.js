define(

	[
		"./Router"
	],

	function (Router) {

		"use strict";

		var HISTORY_SUPPORTED = window.history && window.history.pushState;

		return Router.extend({

			_usePushState : true,
			_selectors : "[data-route], a[href^='/']",

			init : function (routes, config) {
				this.sup.apply(this, arguments);

				this._usePushState = config && config.usePushState && HISTORY_SUPPORTED;

				if (this._usePushState) {
					window.addEventListener('popstate', this.update);
				}
			},

			getUrl : function () {
				return location.pathname + location.search;
			},

			update : function () {
				var url = this.getUrl();
				this.route(url, { route : url });
			},

			onRoute : function (path, data) {
				if (this._usePushState && this.getUrl() !== path) {
					history.pushState(null, "", path);
				}
				this.sup(path, data);
			}
		});
	}
);
