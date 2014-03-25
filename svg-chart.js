TimeSeries = new Meteor.Collection('timeseries');

if (Meteor.isClient) {
    var last_time = -1;
    var last_x = 0;
    var last_y = 0;

    var Y_ZERO = 150; //px

    UI.body.helpers({
        series: function() {
            return TimeSeries.find();
        },
        first_series_item: function() {
            var current_time = this.event_time.getTime();
            if (last_time === -1) {
                last_time = current_time;
                return true;
            }
        },
        connection: function() {
            var seriesItem = this;
            var current_time = seriesItem.event_time.getTime();

            var new_x = last_x + (current_time - last_time);

            var attribute_values = {
                x1: last_x,
                y1: Y_ZERO - last_y,
                x2: new_x,
                y2: Y_ZERO - seriesItem.value
            };

            last_time = current_time;
            last_y = seriesItem.value;
            last_x = new_x;

            return attribute_values;
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        TimeSeries.remove({});

        var addSeriesItem = function() {
            TimeSeries.insert({
                event_time: new Date(),
                value: Math.random() * 100
            });
        };


        for (var i = 0; i < 20; i++) {
            Meteor.setTimeout(addSeriesItem, i * 30);
        }
    });
}
