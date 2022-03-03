let myRating = new Rating({
    id: "customRating",
    type: ContainerType.NONE

});

myRating.on('creationComplete', function () {
    
});

myRating.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});