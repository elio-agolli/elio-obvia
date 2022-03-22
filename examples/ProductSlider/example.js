var myProductSlider = new Wizard({
    id: "productSlider",
    stepPath: "attr.step",
    detailsPath: "attr.details",
    components: [
        {
            ctor: Container,
            props: {
                attr: { "step": "step", "details": "1" },
                id: "container_row",
                classes: ["row"],
                components: [{
                    ctor: Container,
                    props: {
                        id: "col_container",
                        type: ContainerType.COLUMN,
                        classes: ["col-3"],
                        components: [{
                            ctor: Container,
                            props: {
                                id: "image-container",
                                type: ContainerType.NONE,
                                classes: ["product-image"],
                                components: [{
                                    ctor: Image,
                                    props: {
                                        id: "",
                                        alt: "product-image",
                                        src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924153/alcatel-smartphones-einsteiger-mittelklasse-neu-3m.jpg"
                                    }
                                },
                                {
                                    ctor: Heading,
                                    props: {
                                        id: "",
                                        headingType: "h4",
                                        align: "center",
                                        label: "Alcatel Phone",
                                    }
                                },
                                {
                                    ctor: Heading,
                                    props: {
                                        id: "",
                                        headingType: "h5",
                                        align: "center",
                                        label: "1200 Euro"
                                    }
                                },
                                {
                                    ctor: Rating,
                                    props: {
                                        id: "product1-rating"
                                    }
                                }
                                ]
                            }
                        }]
                    }

                },
                    {
                        ctor: Container,
                        props: {
                            id: "col_container",
                            type: ContainerType.COLUMN,
                            classes: ["col-3"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "image-container",
                                    type: ContainerType.NONE,
                                    classes: ["product-image"],
                                    components: [{
                                        ctor: Image,
                                        props: {
                                            id: "",
                                            alt: "product-image",
                                            src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924221/51_be7qfhil.jpg"
                                        }
                                    },
                                        {
                                            ctor: Heading,
                                            props: {
                                                id: "",
                                                headingType: "h4",
                                                align: "center",
                                                label: "Samsung TV",
                                            }
                                        },
                                        {
                                            ctor: Heading,
                                            props: {
                                                id: "",
                                                headingType: "h5",
                                                align: "center",
                                                label: "300 Euro"
                                            }
                                        },
                                        {
                                            ctor: Rating,
                                            props: {
                                                id: "product1-rating"
                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col_container",
                            type: ContainerType.COLUMN,
                            classes: ["col-3"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "image-container",
                                    type: ContainerType.NONE,
                                    classes: ["product-image"],
                                    components: [{
                                        ctor: Image,
                                        props: {
                                            id: "",
                                            alt: "product-image",
                                            src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924241/8fbb415a2ab2a4de55bb0c8da73c4172--ps.jpg"
                                        }
                                    },
                                        {
                                            ctor: Heading,
                                            props: {
                                                id: "",
                                                headingType: "h4",
                                                align: "center",
                                                label: "iPad Phone",
                                            }
                                        },
                                        {
                                            ctor: Heading,
                                            props: {
                                                id: "",
                                                headingType: "h5",
                                                align: "center",
                                                label: "990 Euro"
                                            }
                                        },
                                        {
                                            ctor: Rating,
                                            props: {
                                                id: "product1-rating"
                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },
                    {
                        ctor: Container,
                        props: {
                            id: "col_container",
                            type: ContainerType.COLUMN,
                            classes: ["col-3"],
                            components: [{
                                ctor: Container,
                                props: {
                                    id: "image-container",
                                    type: ContainerType.NONE,
                                    classes: ["product-image"],
                                    components: [{
                                        ctor: Image,
                                        props: {
                                            id: "",
                                            alt: "product-image",
                                            src: "https://res.cloudinary.com/dxfq3iotg/image/upload/v1560924361/21HmjI5eVcL.jpg"
                                        }
                                    },
                                        {
                                            ctor: Heading,
                                            props: {
                                                id: "",
                                                headingType: "h4",
                                                align: "center",
                                                label: "Sony Power",
                                            }
                                        },
                                        {
                                            ctor: Heading,
                                            props: {
                                                id: "",
                                                headingType: "h5",
                                                align: "center",
                                                label: "1200 Euro"
                                            }
                                        },
                                        {
                                            ctor: Rating,
                                            props: {
                                                id: "product1-rating"
                                            }
                                        }
                                    ]
                                }
                            }]
                        }

                    },


                ]
            }
        }
    ]
});

myProductSlider.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);
});