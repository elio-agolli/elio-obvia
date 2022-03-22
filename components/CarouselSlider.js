/**
 * This is a CarouselSlider Element
 * 
 * Kreatx 2022
 */

//component definition
var CarouselSlider = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };
    _props.type = ContainerType.NONE;
    Container.call(this, _props);
};
CarouselSlider.prototype.ctor = 'CarouselSlider';