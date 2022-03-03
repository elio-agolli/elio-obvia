var ApiClientGen = function (_props) {
    let _defaultParams = {
        url: "yaml_url",
        requestBodyParamMode: 1,
        title: "",
        typeNamePrefix: "o",
        forceReload: false
    };

    _props = extend(false, false, _defaultParams, _props);
    if (_props.forceReload) { 
        let parts = _props.url.split("/");        
        if (parts[parts.length - 1].contains('?')) { 
            _props.url += "&r=" + Math.random();
        } else            
            _props.url += "?r=" + Math.random();        
    }
    let _title = _props.title;
    let _typeNamePrefix = _props.typeNamePrefix;
    /**
     * When request contains more than one body parameter, we have two options:
     * 1- generated method will have only one parameter wrapping all params as type members and the type name for this object will be following method+RequestBody+path naming convention
     * 2- generated method will have as many params as the request specifies, they will be wrapped in an object before the request is sent
     */
    let requestBodyParamMode = _props.requestBodyParamMode;
    let _httpMethods = ["get", "post", "delete", "put", "patch"];
    this.generate = function () {
        return get(_props.url).then(function (r) {
            let oas = YAML.parse(r.response);
            return _generate(oas);
        });
    };

    let apiTemplate = `var {apiTitle} = function(_props){
    let _defaultParams = {
        server: "{server}"
    };

    _props = extend(false, false, _defaultParams, _props);
    let _server = _props.server, _apiClient = _props.apiClient ? _props.apiClient : new ApiClient(), _self = this;
    Object.defineProperty(this, "server", {
        get: function server() {
            return _server;
        },
        set: function server(x) {
            if (_server != x) {
                _server = x;
            }
        }
    });

    Object.defineProperty(this, "apiClient", {
        get: function apiClient() {
            return _apiClient;
        },
        set: function apiClient(x) {
            if (_apiClient != x) {
                _apiClient = x;
            }
        }
    });
{paths}
{pathInstances}
};
Poolable.call({apiTitle});
{types}`;
    let pathTemplate = `\tthis.{path} = function(apiClient) { 
        apiClient = apiClient || _apiClient;
        /*{typeMap}*/
        {methods}
        
        OAMethod.call(this, apiClient);
        this.basePath = _server + "{basePath}";
    };`;

    let methodTemplate = `
    {methodDoc}
    \tthis.{methodName} = function({params}){
        let objQuery = {};
{strObjQuery}
        let objPath = {};
{strObjPath}
        let objBody = {objBody};
        let requestContentType = "{requestContentType}";
        let responses = {responses};
        return new Promise((resolve, reject) =>
        {
            \tthis.apiCall(objQuery, objBody, objPath, requestContentType, "{methodName}").then(function(resp){
                if(responses[resp.status]){
                    let responseType = responses[resp.status].responseType.toLowerCase();
                    let ret;
                    switch(responseType)
                    {
                        case "json":
                            ret = isString(resp.response) ? JSON.parse(resp.response) : resp.response;
                            ret = new ({apiTitle}[responses[resp.status].type])(ret);
                            break;
                    }
                    //TODO: convert to specified type
                    resolve(ret);
                }else//unspecified http response code returned
                    reject();
            }).catch(function(error){
                reject(error);
            });
        });
    \t};\r`;
    //({})
    //getChainValue per marjen e $ref
    let typeNames = [];
    let types = "";
    let _generate = function (oas) {
        let strClosures = "",
            pathInstances = "";
        let typeMap = {};
        let url = oas.servers[0].url;
        let apiTitle = oas.info.title + _title;
        for (let path in oas.paths) {
            let strMethods = "";
            typeMap[path] = {};
            let responses = {};
            for (let method in oas.paths[path]) {
                if (_httpMethods.indexOf(method.toLocaleLowerCase()) < 0) {
                    throw new Error(method + " is not a valid http method.");
                }
                typeMap[path][method] = {};
                let strObjQuery = "";
                let objBody = null;
                let strObjPath = "";
                let params = [];

                let methodDoc = "\t/**\r\n\t\t*" + oas.paths[path][method].summary + "\r\n";
                if (oas.paths[path][method].parameters) {
                    let pLen = oas.paths[path][method].parameters.length;
                    for (let i = 0; i < pLen; i++) {
                        let param = oas.paths[path][method].parameters[i];
                        params.push(param.name);
                        typeMap[path][method][param.name] = {};
                        if (param.in == "query") {
                            strObjQuery += `\t\tobjQuery["${param.name}"] = ${param.name};\r\n`;
                        } else if (param.in == "path") {
                            strObjPath += `\t\tobjPath["${param.name}"] = ${param.name};\r\n`;
                        } else
                            console.log("unsupported parameter.in: value");
                        methodDoc += "\t\t* @param {" + param.schema.type + "} " + param.name + " " + param.description + "\r\n";
                    }
                }
                let requestContentType = "application/json";
                if (oas.paths[path][method].requestBody && oas.paths[path][method].requestBody.content) {
                    for (let ct in oas.paths[path][method].requestBody.content) {
                        requestContentType = ct.toLowerCase();
                        let typeInfo;
                        //TODO: emer me intuitive per parametrin, rastin me $ref
                        if (oas.paths[path][method].requestBody.content[ct].schema) {
                            typeInfo = oas.paths[path][method].requestBody.content[ct].schema;
                        } else if (oas.paths[path][method].requestBody.content[ct].$ref) {
                            let typePath = oas.paths[path][method].requestBody.content[ct].$ref;
                            let typeChain = typePath.split('/');
                            typeChain.shift();
                            typeInfo = getChainValue(oas, typeChain);
                            typeInfo.title = typeChain.last() || typeInfo.title;
                        }
                        let typeDefined = typeInfo.title != null;
                        typeInfo.title = typeInfo.title || convertToCamelCase(method + "RequestBody" + "_" + path.split("/").last());
                        typeInfo.type = typeInfo.type || "object";
                        if ((requestBodyParamMode == 2 || !typeDefined) && typeInfo.type == "object") {
                            let wrapParams = "";
                            for (let prop in typeInfo.properties) {
                                wrapParams = wrapParams == "" ? wrapParams : wrapParams + ",";
                                params.push(prop);
                                if (typeInfo.properties[prop].type == "object") {
                                    let memberTypeInfo = typeInfo.properties[prop];
                                    if (typeNames.indexOf(memberTypeInfo.title) < 0) {
                                        let t = _parseType(oas, memberTypeInfo);
                                        if (t.typeNames.length > 0) {
                                            typeNames.splicea(typeNames.length, 0, t.typeNames);
                                        }
                                        types += t.types;
                                    }
                                    methodDoc += "\t\t* @param {" + memberTypeInfo.title + "} " + prop + " " + typeInfo.properties[prop].description + "\r\n";
                                } else if (typeInfo.properties[prop].$ref) {
                                    let typePath = typeInfo.properties[prop].$ref;
                                    let typeChain = typePath.split('/');
                                    typeChain.shift();
                                    let memberTypeInfo = getChainValue(oas, typeChain);
                                    memberTypeInfo.title = typeChain.last() || memberTypeInfo.title;
                                    if (typeNames.indexOf(memberTypeInfo.title) < 0) {
                                        let t = _parseType(oas, memberTypeInfo);
                                        if (t.typeNames.length > 0)
                                            typeNames.splicea(typeNames.length, 0, t.typeNames);
                                        types += t.types;
                                    }
                                    methodDoc += "\t\t* @param {" + memberTypeInfo.title + "} " + prop + " " + typeInfo.properties[prop].description || memberTypeInfo.description + "\r\n";
                                } else
                                    methodDoc += "\t\t* @param {" + typeInfo.properties[prop].type + "} " + prop + " " + typeInfo.properties[prop].description + "\r\n";
                                wrapParams += "\"" + prop + "\":" + prop;
                            }
                            objBody = wrapParams = "{" + wrapParams + "}";
                        } else if (requestBodyParamMode == 1 || typeInfo.type == "array") {
                            let props;
                            if (isObject(typeInfo.properties))
                                props = Object.keys(typeInfo.properties);

                            if (props != null && props.length == 1) {
                                typeInfo = typeInfo.properties[props[0]];
                                typeInfo.title = typeInfo.title || props[0];
                                //objBody = '{"'+typeInfo.title+'":'+ typeInfo.title +'}';
                                objBody = typeInfo.title;
                            } else if (((typeInfo.type == "object" && typeDefined) || typeInfo.type == "array")) {
                                //objBody = '{"'+typeInfo.title+'":'+ typeInfo.title +'}';
                                objBody = typeInfo.title;
                            } else {
                                objBody = typeInfo.title;
                            }
                            let typeName = typeInfo.title;
                            if (typeNames.indexOf(typeInfo.title) < 0) {
                                let t = _parseType(oas, typeInfo);
                                if (t.typeNames.length > 0)
                                    typeNames.splicea(typeNames.length, 0, t.typeNames);
                                types += t.types;
                                typeName = t.typeName;
                            }
                            methodDoc += "\t\t* @param {" + typeName + "} " + typeInfo.title + " The request body for " + method + " " + path + " \r\n";
                            params.push(typeInfo.title);

                        }
                    }
                }
                if (oas.paths[path][method].responses) {
                    for (let r in oas.paths[path][method].responses) {
                        for (let ct in oas.paths[path][method].responses[r].content) {
                            let typeInfo;
                            if (oas.paths[path][method].responses[r].content[ct].schema) {
                                typeInfo = oas.paths[path][method].responses[r].content[ct].schema;
                            } else if (oas.paths[path][method].responses[r].content[ct].$ref) {
                                let typePath = oas.paths[path][method].responses[r].content[ct].$ref;
                                let typeChain = typePath.split('/');
                                typeChain.shift();
                                typeInfo = getChainValue(oas, typeChain);
                                typeInfo.title = typeChain.last() || typeInfo.title;
                            }
                            responses[r] = {
                                "responseType": ct,
                                "type": typeInfo.title
                            };
                            if (typeNames.indexOf(typeInfo.title) < 0) {
                                let t = _parseType(oas, typeInfo);
                                if (t.typeNames.length > 0)
                                    typeNames.splicea(typeNames.length, 0, t.typeNames);
                                types += t.types;
                                responses[r].type = t.typeName;
                            }
                        }
                    }
                }
                //FixMe
                methodDoc += "\t\t* @returns {Promise} ";
                methodDoc += "\r\n\t\t*/";
                let arrMethod = method.split("/");
                let methodName = arrMethod.last();

                strMethods += methodTemplate.formatUnicorn({
                    "methodName": methodName,
                    "methodDoc": methodDoc,
                    "params": params.join(","),
                    "requestContentType": requestContentType,
                    "strObjQuery": strObjQuery,
                    "objBody": objBody,
                    "strObjPath": strObjPath,
                    "responses": JSON.stringify(responses),
                    "apiTitle": apiTitle.replace(/ /g, '')
                });
            }
            let arrPath = path.split("/");
            let pathName = arrPath.last();
            let basePath = (url[url.length - 1] != '/' && path[0] != '/' ? '/' : '') + path;
            strClosures += pathTemplate.formatUnicorn({
                "path": pathName,
                "methods": strMethods,
                "basePath": basePath
            }) + "\r\n";
            pathInstances += `\t\tthis.${pathName}Client = new this.${pathName}();\r\n`;
        }
        types = types.formatUnicorn({
            "apiTitle": apiTitle.replace(/ /g, '')
        });
        let apiSrc = apiTemplate.formatUnicorn({
            "apiTitle": apiTitle.replace(/ /g, ''),
            "paths": strClosures,
            "pathInstances": pathInstances,
            "server": url,
            "types": types
        });
        return {
            "apiTitle": apiTitle.replace(/ /g, ''),
            "apiSrc": apiSrc
        };
    };
    let _oasjsMap = {
        "integer": "Number",
        "string": "String"
    };
    let _typeTemplate = `
    /**
{jsDoc}
    */
   {apiTitle}.{typeName} = function {typeName}(_props){
        _props = _props || {};
{properties}
    };`;

    let _propDocTemplate = "\t* @property {{jsType}}  {prop}               - {description}\r\n";
    let _propTemplate = "\t\tthis.{prop} = _props.{prop};\r\n";
    let _arrTypeTemplate = `\t{apiTitle}.{typeName} = function {typeName}()
\t{
\t\tArrayEx.apply(this, arguments);    
\t\tthis.memberType = {allowedTypes}; 
\t};
\t{apiTitle}.{typeName}.prototype = Object.create(ArrayEx.prototype);
\t{apiTitle}.{typeName}.prototype.constructor = {apiTitle}.{typeName};`;
    let subTypes = {};

    let _freeFormTemplate = `
    /**
{freeFormDoc}
{jsDoc}
    */
   {apiTitle}.{typeName} = function {typeName}(_props){
        _props = _props || {};
{properties}
        for(let prop in _props){
            if(!this.hasOwnProperty(prop)){
                this[prop] = new {apiTitle}.{childType}(_props[prop]);
            }
        }
    };`;
    let freeFormDoc = "\t* @typedef {Object.<string, {childType}>} {type}";
    //TODO: Add Validation Ex:minimum, maximum for number & pattern for string
    /**
     * 
     * @param {*} oas 
     * @param {*} typeInfo 
     */
    let _parseType = function (oas, typeInfo, propName) {
        let jsDoc = "";
        let properties = "";
        let freeFormDocInst = "";
        let jsType = _oasjsMap[typeInfo.type];
        if (!jsType)
            jsType = typeInfo.type;
        let description = typeInfo.description ? typeInfo.description : "";
        let myTypeNames = [];
        let types = "";
        propName = propName || typeInfo.title;
        if (typeInfo.type == "object") {
            if (typeNames.indexOf(propName) < 0) {
                jsType = propName;
                myTypeNames.push(propName);
                for (let prop in typeInfo.properties) {
                    let r = _parseType(oas, typeInfo.properties[prop], prop);
                    jsDoc += r.jsDoc;
                    properties += r.properties;
                    types += r.types.length > 0 ? r.types + "\r\n" : "";
                    if (r.typeNames.length > 0) {
                        myTypeNames.splicea(myTypeNames.length, 0, r.typeNames);
                    }
                }
                let childType;
                if (typeInfo.additionalProperties) {
                    for (let prop in typeInfo.additionalProperties) {
                        if (prop == "$ref") {
                            let r = _parseType(oas, typeInfo.additionalProperties);
                            //jsDoc += r.jsDoc;
                            types += r.types.length > 0 ? r.types + "\r\n" : "";
                            if (r.typeNames.length > 0) {
                                myTypeNames.splicea(myTypeNames.length, 0, r.typeNames);
                            }
                            childType = r.typeName;
                            freeFormDocInst = freeFormDoc.formatUnicorn({
                                "childType": r.typeName,
                                "type": propName
                            });
                        }
                    }
                }
                if (subTypes[propName] == null) {
                    subTypes[propName] = myTypeNames;
                    types += (typeInfo.additionalProperties ? _freeFormTemplate : _typeTemplate).formatUnicorn({
                        "jsDoc": jsDoc,
                        "typeName": propName,
                        "properties": properties,
                        "freeFormDoc": freeFormDocInst,
                        "childType": childType
                    }) + "\r\n";
                }
            } else
                myTypeNames = subTypes[propName];
        } else if (typeInfo.type == "array") {
            let allowedTypes = [];
            if (typeInfo.items.oneOf) {
                for (let i = 0; i < typeInfo.items.oneOf.length; i++) {
                    for (let prop in typeInfo.items.oneOf[i]) {
                        if (prop == "$ref" || typeInfo.items.oneOf[i][prop] == "object") {
                            let r = _parseType(oas, typeInfo.items.oneOf[i]);
                            types += r.types.length > 0 ? r.types + "\r\n" : "";
                            if (r.typeNames.length > 0) {
                                myTypeNames.splicea(myTypeNames.length, 0, r.typeNames);
                            }
                        } else {
                            allowedTypes.push(_oasjsMap[typeInfo.items.oneOf[i][prop]]);
                        }
                    }
                }
            } else if (isObject(typeInfo.items) && Object.isEmpty(typeInfo.items))
            { 
                //arbitrary type array
                allowedTypes.push("object");
            } else {
                let r = _parseType(oas, typeInfo.items);
                types += r.types.length > 0 ? r.types + "\r\n" : "";
                if (r.typeNames.length > 0) {
                    myTypeNames.splicea(myTypeNames.length, 0, r.typeNames);
                }
            }
            allowedTypes.splicea(allowedTypes.length, 0, myTypeNames);
            let arrTypeName = propName = convertToCamelCase("array-" + allowedTypes.join("-"));
            if (subTypes[arrTypeName] == null) {
                subTypes[arrTypeName] = myTypeNames;
                types += _arrTypeTemplate.formatUnicorn({
                    "typeName": arrTypeName,
                    "allowedTypes": JSON.stringify(allowedTypes)
                }) + "\r\n";
            }
        } else if (typeInfo.$ref) {
            let typePath = typeInfo.$ref;
            let typeChain = typePath.split('/');
            typeChain.shift();
            typeInfo = getChainValue(oas, typeChain);
            description = typeInfo.description;
            jsType = typeChain.last();
            propName = jsType || propName || typeInfo.title;

            let r = _parseType(oas, typeInfo, propName);
            if (r.typeNames.length > 0) {
                myTypeNames.splicea(myTypeNames.length, 0, r.typeNames);
            }
            if (typeNames.indexOf(propName) < 0) {
                types += r.types.length > 0 ? r.types + "\r\n" : "";
                //+ _typeTemplate.formatUnicorn({"jsDoc":r.jsDoc, "typeName": propName, "properties":r.properties});               
            }
        }
        properties = _propTemplate.formatUnicorn({
            "prop": propName
        });
        jsDoc = _propDocTemplate.formatUnicorn({
            "jsType": jsType,
            "prop": propName,
            "description": description
        });
        return {
            "properties": properties,
            "jsDoc": jsDoc,
            "types": types,
            "typeNames": myTypeNames,
            "typeName": propName
        };
    };
};