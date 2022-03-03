var myFooter = new Footer({
    id: "myFooter",
    width: 250,
    classes: ["footer"],
    components:
        [
            {
                ctor: Label,
                props: {
                    id: 'Label1',
                    label: 'Abonohu per njoftime te reja',
                    classes: ['label1']
                }
            },
            {
                ctor: TextInput,
                props: {
                    id: 'TextInput_1',
                    value: "",
                    type: "text",
                    placeholder: "Email",
                    autocomplete: "off",
                    classes: ['textInput1']
                }
            }
            ,//button
            {
                ctor: Button,
                props: {
                    id: 'buton1',
                    label: 'Regjistrohu',
                    type: 'button',
                    // click: function (e) {
                    //      console.log('1234');
                    //},
                    classes: ['button1']
                }
            },
            {
                ctor: Link,
                props: {
                    id: 'fa',
                    label: "© 2022 Kreatx",
                    href: "https://www.kreatx.com/",
                    target: "_blank",
                    classes: ['link1']
                }
            },

        ]
});

myFooter.render().then(function (cmpInstance) {

    $('#root').append(cmpInstance.$el);

    myFooter.children.buton1.on('click', function () {
        //console.log(myFooter.children.TextInput_1.value)
        myFooter.children.Label1.label = myFooter.children.TextInput_1.value
        // myFooter.children.buton1.label = myFooter.children.TextInput_1.value
    });

});
// myFooter.render().then(function (cmpInstance) {
//     $('#root').append(cmpInstance.$el);
// });