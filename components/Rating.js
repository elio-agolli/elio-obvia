/**
 * This is a Rating Element
 * 
 * Kreatx 2022
 */

//component definition
var Rating = function(_props)
{
    //is template overrided ?
    this.template = this.template || function ()
    { 
        return  '<div id="' + this.domID + '"></div>'; 
    };
    _props.type = ContainerType.NONE;
    Container.call(this, _props);
};
Rating.prototype.ctor = 'Rating';