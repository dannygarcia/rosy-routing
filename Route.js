define(

	[
		"../base/Class",
		"../utils/Utils"
	],

	function (Class, Utils) {

		"use strict";

		return Class.extend({

			path : null,
			view : null,
			config : null,

			_params : null,
			_regex : null,

			init : function (path, view, config) {
				this.path = path;
				this.view = view;
				this.config = config || {};
				this._normalize(path);
			},

			matches : function (path) {
				return this._regex.exec(path.split("?")[0]);
			},

			params : function (path) {
				var output = {},
					matches, i, param;

				if (this._params.length) {
					matches = this.matches(path);
					for (i = 1; i < matches.length; i++) {
						param = this._params[i - 1];
						output[param.name] = matches[i] || null;
					}
				}
				return output;
			},

			loadViewClass : function (cb) {
				if (typeof this.view === 'string') {
					// if we haven't required this view yet, do so now.
					require([this.view], this.proxy(function (view) {
						// set the view to the actual class so we don't need to load it again
						this.view = view;
						cb(this.view);
					}));
				} else {
					cb(this.view);
				}
			},

			_normalize : function (path) {
				var params = this._params = [],
					strict = false,
					sensitive = false;

				if (path instanceof RegExp) {
					this._regex = path;
					return;
				}

				if (path.indexOf("regex:") > -1) {
					// Convert to a regex and return...
					return [new RegExp(path.replace("regex:", "")), []];
				}

				if (path instanceof Array) {
					path = '(' + path.join('|') + ')';
				}

				path = path
					.concat(strict ? '' : '/?')
					.replace(/\/\(/g, '(?:/')
					.replace(/\+/g, '__plus__')
					.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,
						function (_, slash, format, key, capture, optional) {
							params.push({
								name : key,
								optional : !! optional
							});
							slash = slash || '';
							return '' +
							(optional ? '' : slash) +
							'(?:' +
							(optional ? slash : '') +
							(format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' +
							(optional || '');
						}
					)
					.replace(/([\/.])/g, '\\$1')
					.replace(/__plus__/g, '(.+)')
					.replace(/\*/g, '(.*)');

				this._regex = new RegExp('^' + path + '$', sensitive ? '' : 'i');
			}

		});
	}
);
