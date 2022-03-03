/**
 * This is a Footer Element
 * 
 * Kreatx 2021
 */

//component definition
var Footer = function (_props, _hideComponents = false) {

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
        }
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.domID) {
        }
    };


    this.template = function () {
        return "<footer id='" + this.domID + "' class='footer'></footer>";
    };

    let _defaultParams = {
    };
    _props = extend(false, false, _defaultParams, _props);

    
    let r = Parent.call(this, _props, _hideComponents);
    return r;

    
};
Footer.prototype.ctor = 'Footer';