var myCarousel = new CarouselSlider({
    id: "mySlider",
    type: ContainerType.NONE,
    components: [
        {
            ctor: Image,
            props: {
                id: "",
                classes: ["carousel__photo", "initial"],
                alt: "product-image",
                src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924153/alcatel-smartphones-einsteiger-mittelklasse-neu-3m.jpg"
            }
        },
        {
            ctor: Image,
            props: {
                id: "",
                classes: ["carousel__photo"],
                alt: "product-image",
                src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924153/alcatel-smartphones-einsteiger-mittelklasse-neu-3m.jpg"
            }
        },
        {
            ctor: Image,
            props: {
                id: "",
                classes: ["carousel__photo"],
                alt: "product-image",
                src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924153/alcatel-smartphones-einsteiger-mittelklasse-neu-3m.jpg"
            }
        },
        {
            ctor: Image,
            props: {
                id: "",
                classes: ["carousel__photo"],
                alt: "product-image",
                src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924153/alcatel-smartphones-einsteiger-mittelklasse-neu-3m.jpg"
            }
        },
    ]
});

myCarousel.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});