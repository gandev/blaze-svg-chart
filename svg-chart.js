TimeSeries = new Meteor.Collection('timeseries');

if (Meteor.isClient) {
    var Y_ZERO = 150; //px

    var last_time = -1;
    var last_x = 0;
    var last_y = 0;

    UI.body.helpers({
        series_items: function() {
            return TimeSeries.find();
        },
        first_series_item: function() {
            var series_item = this;
            if (last_time === -1 && this.event_time) {
                last_time = this.event_time.getTime();
                return true;
            }
        },
        connection: function() {
            var series_item = this;
            var current_time = series_item.event_time.getTime();

            var new_x = last_x + (current_time - last_time);
            var new_y = Y_ZERO - series_item.value;

            var coordinates = {
                x1: last_x,
                y1: last_y,
                x2: new_x,
                y2: new_y
            };

            last_time = current_time;
            last_y = new_y;
            last_x = new_x;

            return coordinates;
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

        for (var i = 0; i < 30; i++) {
            Meteor.setTimeout(addSeriesItem, i * 20);
        }
    });
}
