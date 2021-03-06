define(["underscore", "backbone"], function(_, Backbone) {
    var Config = Backbone.Model.extend({
        defaults: {
            debug: false,
            runCycles: 15,
            tweetUpdateTime: 2000,
            query: "",
            fullQuery: "",
            running: false
        },
        initialize: function() {
            _.bindAll(this, "getFullQuery", "makeFullQuery", "isRunning", "changeSearch", "startStop");
            this.getFullQuery();
            this.bind("change:query", this.changeSearch, this);
        },
        getFullQuery: function() {
            var queryEncoded = encodeURIComponent(this.get("query"));
            this.set({
                fullQuery: this.makeFullQuery(queryEncoded)
            });
        },
        makeFullQuery: function(searchCriteriaEncoded) {
            return "http://search.twitter.com/search.json?q=" + searchCriteriaEncoded + "&callback=?";
        },
        isRunning: function () {
            if (!this.get("running")) {
                return false;
            } else {
                if (this.get("debug")) {
                    var runCycles = this.get("runCycles");
                    if (runCycles > 0) {
                        this.set({
                            runCycles: runCycles - 1
                        });
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        },
        changeSearch: function () {
            var query = this.get("query");
            var queryEncoded = encodeURIComponent(query);
            this.set({
                running: false,
                query: query,
                fullQuery: this.makeFullQuery(queryEncoded)
            });
        },
        startStop: function() {
            if (this.get("query").length === 0) {
                return false;
            }
            var running = !this.get("running");
            this.set({
                running: running
            });
        }
    });
    return new Config;
});
