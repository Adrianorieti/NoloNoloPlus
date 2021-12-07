module.exports =
{
    sortByKey: function (array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
         var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })},

    sortByTime: function (array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
         var y = b[key];
        return ((x.getTime() < y.getTime()) ? -1 : ((x.getTime() > y.getTime()) ? 1 : 0));
    });
}


}

