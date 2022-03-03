var myHeader = new Header({
    id: 'myHeader',
    classes: ["header"],

    components: [
        {
            ctor: Label,
            props: {
                label: 'Miresevini ne Kreatx',
                id: 'Label1',
                classes: ['label2'],
            }
        },
        {
            ctor: Link,
            props: {
                id: 'link2',
                label: 'Menu',
                href: "https://www.acmilan.com",
                target: "_blank",
                classes: ['link3'],

            }
        },
        {
            ctor: Link,
            props: {
                id: 'link3',
                label: 'Pages',
                href: "https://www.google.com",
                target: "_blank",
                classes: ['link4'],

            }
        }
    ]
})
myHeader.render().then(function (cmpInstance) {
    $('#root').append(cmpInstance.$el);

    myHeader.children.link2.on('click', function () {
        console.log("linku u klikua")
        // myFooter.children.Label1.label = myFooter.children.TextInput_1.value
        // myFooter.children.buton1.label = myFooter.children.TextInput_1.value
    });
});
