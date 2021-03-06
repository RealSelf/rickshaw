Rickshaw.namespace('Rickshaw.Graph.Legend');

Rickshaw.Graph.Legend = function(args) {

	var element = this.element = args.element;
	var graph = this.graph = args.graph;

	var self = this;

	element.classList.add('rickshaw_legend');

	var list = this.list = document.createElement('ul');
	element.appendChild(list);

	var series = graph.series
		.map( function(s) { return s } );

	if (!args.naturalOrder) {
		series = series.reverse();
	}

	this.lines = [];

	this.reset = function()
	{
		this.lines = [];
		this.list.innerHTML = '';
	};

	this.addLine = function (series) {
		var line = document.createElement('li');
		line.className = 'line';
		if (series.disabled) {
			line.className += ' disabled';
		}

		var swatch = document.createElement('div');
		swatch.className = 'swatch';
		swatch.style.backgroundColor = series.color;

		line.appendChild(swatch);

		var label = document.createElement('span');
		label.className = 'label';
		label.innerHTML = series.name;

		line.appendChild(label);
		list.appendChild(line);

		line.series = series;

		if (series.noLegend) {
			line.style.display = 'none';
		}

		var _line = { element: line, series: series };
		if (self.shelving) {
			self.shelving.addAnchor(_line);
			self.shelving.updateBehaviour();
		}
		if (self.highlighter) {
			self.highlighter.addHighlightEvents(_line);
		}
		self.lines.push(_line);
	};

	this.addLines = function(series)
	{
		series.forEach( function(s) {
			self.addLine(s);
		} );
	};

	this.prepareSeries = function(series)
	{
		var ser = series.map( function(s) { return s } );

		if (!args.naturalOrder) {
			ser = ser.reverse();
		}

		return ser;
	};

	graph.onUpdate(function()
	{
		self.reset();
		self.addLines(self.prepareSeries(graph.series));
	});

	this.addLines(this.prepareSeries(graph.series));
};
