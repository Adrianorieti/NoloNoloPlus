let sort = {
    sortByTime: function (array, key) {
        return array.sort(function (a, b) {
            var x = new Date(a[key]);
            var y = new Date(b[key]);
            return ((x.getTime() < y.getTime()) ? -1 : ((x.getTime() > y.getTime()) ? 1 : 0));
        });
    }
}

export default sort;