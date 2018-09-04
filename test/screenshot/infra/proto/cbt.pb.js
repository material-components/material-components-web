/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.cbt = (function() {

    /**
     * Namespace cbt.
     * @exports cbt
     * @namespace
     */
    var cbt = {};

    cbt.proto = (function() {

        /**
         * Namespace proto.
         * @memberof cbt
         * @namespace
         */
        var proto = {};

        proto.CbtDevice = (function() {

            /**
             * Properties of a CbtDevice.
             * @memberof cbt.proto
             * @interface ICbtDevice
             * @property {string|null} [api_name] CbtDevice api_name
             * @property {string|null} [device] CbtDevice device
             * @property {string|null} [device_type] CbtDevice device_type
             * @property {string|null} [name] CbtDevice name
             * @property {string|null} [version] CbtDevice version
             * @property {string|null} [type] CbtDevice type
             * @property {string|null} [icon_class] CbtDevice icon_class
             * @property {boolean|null} [upload_file_enabled] CbtDevice upload_file_enabled
             * @property {number|null} [sort_order] CbtDevice sort_order
             * @property {boolean|null} [is_webrtc_enabled] CbtDevice is_webrtc_enabled
             * @property {Array.<selenium.proto.IRawCapabilities>|null} [caps] CbtDevice caps
             * @property {Array.<cbt.proto.ICbtBrowser>|null} [browsers] CbtDevice browsers
             * @property {Array.<cbt.proto.ICbtResolution>|null} [resolutions] CbtDevice resolutions
             */

            /**
             * Constructs a new CbtDevice.
             * @memberof cbt.proto
             * @classdesc Represents a CbtDevice.
             * @implements ICbtDevice
             * @constructor
             * @param {cbt.proto.ICbtDevice=} [properties] Properties to set
             */
            function CbtDevice(properties) {
                this.caps = [];
                this.browsers = [];
                this.resolutions = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CbtDevice api_name.
             * @member {string} api_name
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.api_name = "";

            /**
             * CbtDevice device.
             * @member {string} device
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.device = "";

            /**
             * CbtDevice device_type.
             * @member {string} device_type
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.device_type = "";

            /**
             * CbtDevice name.
             * @member {string} name
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.name = "";

            /**
             * CbtDevice version.
             * @member {string} version
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.version = "";

            /**
             * CbtDevice type.
             * @member {string} type
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.type = "";

            /**
             * CbtDevice icon_class.
             * @member {string} icon_class
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.icon_class = "";

            /**
             * CbtDevice upload_file_enabled.
             * @member {boolean} upload_file_enabled
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.upload_file_enabled = false;

            /**
             * CbtDevice sort_order.
             * @member {number} sort_order
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.sort_order = 0;

            /**
             * CbtDevice is_webrtc_enabled.
             * @member {boolean} is_webrtc_enabled
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.is_webrtc_enabled = false;

            /**
             * CbtDevice caps.
             * @member {Array.<selenium.proto.IRawCapabilities>} caps
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.caps = $util.emptyArray;

            /**
             * CbtDevice browsers.
             * @member {Array.<cbt.proto.ICbtBrowser>} browsers
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.browsers = $util.emptyArray;

            /**
             * CbtDevice resolutions.
             * @member {Array.<cbt.proto.ICbtResolution>} resolutions
             * @memberof cbt.proto.CbtDevice
             * @instance
             */
            CbtDevice.prototype.resolutions = $util.emptyArray;

            /**
             * Creates a new CbtDevice instance using the specified properties.
             * @function create
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {cbt.proto.ICbtDevice=} [properties] Properties to set
             * @returns {cbt.proto.CbtDevice} CbtDevice instance
             */
            CbtDevice.create = function create(properties) {
                return new CbtDevice(properties);
            };

            /**
             * Encodes the specified CbtDevice message. Does not implicitly {@link cbt.proto.CbtDevice.verify|verify} messages.
             * @function encode
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {cbt.proto.ICbtDevice} message CbtDevice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtDevice.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.api_name != null && message.hasOwnProperty("api_name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.api_name);
                if (message.device != null && message.hasOwnProperty("device"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.device);
                if (message.device_type != null && message.hasOwnProperty("device_type"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.device_type);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.name);
                if (message.version != null && message.hasOwnProperty("version"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.version);
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.type);
                if (message.icon_class != null && message.hasOwnProperty("icon_class"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.icon_class);
                if (message.upload_file_enabled != null && message.hasOwnProperty("upload_file_enabled"))
                    writer.uint32(/* id 8, wireType 0 =*/64).bool(message.upload_file_enabled);
                if (message.sort_order != null && message.hasOwnProperty("sort_order"))
                    writer.uint32(/* id 9, wireType 1 =*/73).double(message.sort_order);
                if (message.is_webrtc_enabled != null && message.hasOwnProperty("is_webrtc_enabled"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.is_webrtc_enabled);
                if (message.caps != null && message.caps.length)
                    for (var i = 0; i < message.caps.length; ++i)
                        $root.selenium.proto.RawCapabilities.encode(message.caps[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.browsers != null && message.browsers.length)
                    for (var i = 0; i < message.browsers.length; ++i)
                        $root.cbt.proto.CbtBrowser.encode(message.browsers[i], writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.resolutions != null && message.resolutions.length)
                    for (var i = 0; i < message.resolutions.length; ++i)
                        $root.cbt.proto.CbtResolution.encode(message.resolutions[i], writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CbtDevice message, length delimited. Does not implicitly {@link cbt.proto.CbtDevice.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {cbt.proto.ICbtDevice} message CbtDevice message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtDevice.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CbtDevice message from the specified reader or buffer.
             * @function decode
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cbt.proto.CbtDevice} CbtDevice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtDevice.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtDevice();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.api_name = reader.string();
                        break;
                    case 2:
                        message.device = reader.string();
                        break;
                    case 3:
                        message.device_type = reader.string();
                        break;
                    case 4:
                        message.name = reader.string();
                        break;
                    case 5:
                        message.version = reader.string();
                        break;
                    case 6:
                        message.type = reader.string();
                        break;
                    case 7:
                        message.icon_class = reader.string();
                        break;
                    case 8:
                        message.upload_file_enabled = reader.bool();
                        break;
                    case 9:
                        message.sort_order = reader.double();
                        break;
                    case 10:
                        message.is_webrtc_enabled = reader.bool();
                        break;
                    case 11:
                        if (!(message.caps && message.caps.length))
                            message.caps = [];
                        message.caps.push($root.selenium.proto.RawCapabilities.decode(reader, reader.uint32()));
                        break;
                    case 12:
                        if (!(message.browsers && message.browsers.length))
                            message.browsers = [];
                        message.browsers.push($root.cbt.proto.CbtBrowser.decode(reader, reader.uint32()));
                        break;
                    case 13:
                        if (!(message.resolutions && message.resolutions.length))
                            message.resolutions = [];
                        message.resolutions.push($root.cbt.proto.CbtResolution.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CbtDevice message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cbt.proto.CbtDevice} CbtDevice
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtDevice.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CbtDevice message.
             * @function verify
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CbtDevice.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.api_name != null && message.hasOwnProperty("api_name"))
                    if (!$util.isString(message.api_name))
                        return "api_name: string expected";
                if (message.device != null && message.hasOwnProperty("device"))
                    if (!$util.isString(message.device))
                        return "device: string expected";
                if (message.device_type != null && message.hasOwnProperty("device_type"))
                    if (!$util.isString(message.device_type))
                        return "device_type: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isString(message.type))
                        return "type: string expected";
                if (message.icon_class != null && message.hasOwnProperty("icon_class"))
                    if (!$util.isString(message.icon_class))
                        return "icon_class: string expected";
                if (message.upload_file_enabled != null && message.hasOwnProperty("upload_file_enabled"))
                    if (typeof message.upload_file_enabled !== "boolean")
                        return "upload_file_enabled: boolean expected";
                if (message.sort_order != null && message.hasOwnProperty("sort_order"))
                    if (typeof message.sort_order !== "number")
                        return "sort_order: number expected";
                if (message.is_webrtc_enabled != null && message.hasOwnProperty("is_webrtc_enabled"))
                    if (typeof message.is_webrtc_enabled !== "boolean")
                        return "is_webrtc_enabled: boolean expected";
                if (message.caps != null && message.hasOwnProperty("caps")) {
                    if (!Array.isArray(message.caps))
                        return "caps: array expected";
                    for (var i = 0; i < message.caps.length; ++i) {
                        var error = $root.selenium.proto.RawCapabilities.verify(message.caps[i]);
                        if (error)
                            return "caps." + error;
                    }
                }
                if (message.browsers != null && message.hasOwnProperty("browsers")) {
                    if (!Array.isArray(message.browsers))
                        return "browsers: array expected";
                    for (var i = 0; i < message.browsers.length; ++i) {
                        var error = $root.cbt.proto.CbtBrowser.verify(message.browsers[i]);
                        if (error)
                            return "browsers." + error;
                    }
                }
                if (message.resolutions != null && message.hasOwnProperty("resolutions")) {
                    if (!Array.isArray(message.resolutions))
                        return "resolutions: array expected";
                    for (var i = 0; i < message.resolutions.length; ++i) {
                        var error = $root.cbt.proto.CbtResolution.verify(message.resolutions[i]);
                        if (error)
                            return "resolutions." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a CbtDevice message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cbt.proto.CbtDevice} CbtDevice
             */
            CbtDevice.fromObject = function fromObject(object) {
                if (object instanceof $root.cbt.proto.CbtDevice)
                    return object;
                var message = new $root.cbt.proto.CbtDevice();
                if (object.api_name != null)
                    message.api_name = String(object.api_name);
                if (object.device != null)
                    message.device = String(object.device);
                if (object.device_type != null)
                    message.device_type = String(object.device_type);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.version != null)
                    message.version = String(object.version);
                if (object.type != null)
                    message.type = String(object.type);
                if (object.icon_class != null)
                    message.icon_class = String(object.icon_class);
                if (object.upload_file_enabled != null)
                    message.upload_file_enabled = Boolean(object.upload_file_enabled);
                if (object.sort_order != null)
                    message.sort_order = Number(object.sort_order);
                if (object.is_webrtc_enabled != null)
                    message.is_webrtc_enabled = Boolean(object.is_webrtc_enabled);
                if (object.caps) {
                    if (!Array.isArray(object.caps))
                        throw TypeError(".cbt.proto.CbtDevice.caps: array expected");
                    message.caps = [];
                    for (var i = 0; i < object.caps.length; ++i) {
                        if (typeof object.caps[i] !== "object")
                            throw TypeError(".cbt.proto.CbtDevice.caps: object expected");
                        message.caps[i] = $root.selenium.proto.RawCapabilities.fromObject(object.caps[i]);
                    }
                }
                if (object.browsers) {
                    if (!Array.isArray(object.browsers))
                        throw TypeError(".cbt.proto.CbtDevice.browsers: array expected");
                    message.browsers = [];
                    for (var i = 0; i < object.browsers.length; ++i) {
                        if (typeof object.browsers[i] !== "object")
                            throw TypeError(".cbt.proto.CbtDevice.browsers: object expected");
                        message.browsers[i] = $root.cbt.proto.CbtBrowser.fromObject(object.browsers[i]);
                    }
                }
                if (object.resolutions) {
                    if (!Array.isArray(object.resolutions))
                        throw TypeError(".cbt.proto.CbtDevice.resolutions: array expected");
                    message.resolutions = [];
                    for (var i = 0; i < object.resolutions.length; ++i) {
                        if (typeof object.resolutions[i] !== "object")
                            throw TypeError(".cbt.proto.CbtDevice.resolutions: object expected");
                        message.resolutions[i] = $root.cbt.proto.CbtResolution.fromObject(object.resolutions[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a CbtDevice message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cbt.proto.CbtDevice
             * @static
             * @param {cbt.proto.CbtDevice} message CbtDevice
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CbtDevice.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.caps = [];
                    object.browsers = [];
                    object.resolutions = [];
                }
                if (options.defaults) {
                    object.api_name = "";
                    object.device = "";
                    object.device_type = "";
                    object.name = "";
                    object.version = "";
                    object.type = "";
                    object.icon_class = "";
                    object.upload_file_enabled = false;
                    object.sort_order = 0;
                    object.is_webrtc_enabled = false;
                }
                if (message.api_name != null && message.hasOwnProperty("api_name"))
                    object.api_name = message.api_name;
                if (message.device != null && message.hasOwnProperty("device"))
                    object.device = message.device;
                if (message.device_type != null && message.hasOwnProperty("device_type"))
                    object.device_type = message.device_type;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.icon_class != null && message.hasOwnProperty("icon_class"))
                    object.icon_class = message.icon_class;
                if (message.upload_file_enabled != null && message.hasOwnProperty("upload_file_enabled"))
                    object.upload_file_enabled = message.upload_file_enabled;
                if (message.sort_order != null && message.hasOwnProperty("sort_order"))
                    object.sort_order = options.json && !isFinite(message.sort_order) ? String(message.sort_order) : message.sort_order;
                if (message.is_webrtc_enabled != null && message.hasOwnProperty("is_webrtc_enabled"))
                    object.is_webrtc_enabled = message.is_webrtc_enabled;
                if (message.caps && message.caps.length) {
                    object.caps = [];
                    for (var j = 0; j < message.caps.length; ++j)
                        object.caps[j] = $root.selenium.proto.RawCapabilities.toObject(message.caps[j], options);
                }
                if (message.browsers && message.browsers.length) {
                    object.browsers = [];
                    for (var j = 0; j < message.browsers.length; ++j)
                        object.browsers[j] = $root.cbt.proto.CbtBrowser.toObject(message.browsers[j], options);
                }
                if (message.resolutions && message.resolutions.length) {
                    object.resolutions = [];
                    for (var j = 0; j < message.resolutions.length; ++j)
                        object.resolutions[j] = $root.cbt.proto.CbtResolution.toObject(message.resolutions[j], options);
                }
                return object;
            };

            /**
             * Converts this CbtDevice to JSON.
             * @function toJSON
             * @memberof cbt.proto.CbtDevice
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CbtDevice.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return CbtDevice;
        })();

        proto.CbtBrowser = (function() {

            /**
             * Properties of a CbtBrowser.
             * @memberof cbt.proto
             * @interface ICbtBrowser
             * @property {string|null} [name] CbtBrowser name
             * @property {string|null} [type] CbtBrowser type
             * @property {string|null} [version] CbtBrowser version
             * @property {string|null} [api_name] CbtBrowser api_name
             * @property {boolean|null} [default_live_test_browser] CbtBrowser default_live_test_browser
             * @property {string|null} [icon_class] CbtBrowser icon_class
             * @property {boolean|null} [major_browser] CbtBrowser major_browser
             * @property {string|null} [device] CbtBrowser device
             * @property {string|null} [selenium_version] CbtBrowser selenium_version
             * @property {string|null} [webdriver_type] CbtBrowser webdriver_type
             * @property {string|null} [webdriver_version] CbtBrowser webdriver_version
             * @property {boolean|null} [can_mobile_debug] CbtBrowser can_mobile_debug
             * @property {Array.<selenium.proto.IRawCapabilities>|null} [caps] CbtBrowser caps
             * @property {string|null} [default_config] CbtBrowser default_config
             */

            /**
             * Constructs a new CbtBrowser.
             * @memberof cbt.proto
             * @classdesc Represents a CbtBrowser.
             * @implements ICbtBrowser
             * @constructor
             * @param {cbt.proto.ICbtBrowser=} [properties] Properties to set
             */
            function CbtBrowser(properties) {
                this.caps = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CbtBrowser name.
             * @member {string} name
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.name = "";

            /**
             * CbtBrowser type.
             * @member {string} type
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.type = "";

            /**
             * CbtBrowser version.
             * @member {string} version
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.version = "";

            /**
             * CbtBrowser api_name.
             * @member {string} api_name
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.api_name = "";

            /**
             * CbtBrowser default_live_test_browser.
             * @member {boolean} default_live_test_browser
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.default_live_test_browser = false;

            /**
             * CbtBrowser icon_class.
             * @member {string} icon_class
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.icon_class = "";

            /**
             * CbtBrowser major_browser.
             * @member {boolean} major_browser
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.major_browser = false;

            /**
             * CbtBrowser device.
             * @member {string} device
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.device = "";

            /**
             * CbtBrowser selenium_version.
             * @member {string} selenium_version
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.selenium_version = "";

            /**
             * CbtBrowser webdriver_type.
             * @member {string} webdriver_type
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.webdriver_type = "";

            /**
             * CbtBrowser webdriver_version.
             * @member {string} webdriver_version
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.webdriver_version = "";

            /**
             * CbtBrowser can_mobile_debug.
             * @member {boolean} can_mobile_debug
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.can_mobile_debug = false;

            /**
             * CbtBrowser caps.
             * @member {Array.<selenium.proto.IRawCapabilities>} caps
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.caps = $util.emptyArray;

            /**
             * CbtBrowser default_config.
             * @member {string} default_config
             * @memberof cbt.proto.CbtBrowser
             * @instance
             */
            CbtBrowser.prototype.default_config = "";

            /**
             * Creates a new CbtBrowser instance using the specified properties.
             * @function create
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {cbt.proto.ICbtBrowser=} [properties] Properties to set
             * @returns {cbt.proto.CbtBrowser} CbtBrowser instance
             */
            CbtBrowser.create = function create(properties) {
                return new CbtBrowser(properties);
            };

            /**
             * Encodes the specified CbtBrowser message. Does not implicitly {@link cbt.proto.CbtBrowser.verify|verify} messages.
             * @function encode
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {cbt.proto.ICbtBrowser} message CbtBrowser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtBrowser.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
                if (message.version != null && message.hasOwnProperty("version"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
                if (message.api_name != null && message.hasOwnProperty("api_name"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.api_name);
                if (message.default_live_test_browser != null && message.hasOwnProperty("default_live_test_browser"))
                    writer.uint32(/* id 5, wireType 0 =*/40).bool(message.default_live_test_browser);
                if (message.icon_class != null && message.hasOwnProperty("icon_class"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.icon_class);
                if (message.major_browser != null && message.hasOwnProperty("major_browser"))
                    writer.uint32(/* id 7, wireType 0 =*/56).bool(message.major_browser);
                if (message.device != null && message.hasOwnProperty("device"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.device);
                if (message.selenium_version != null && message.hasOwnProperty("selenium_version"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.selenium_version);
                if (message.webdriver_type != null && message.hasOwnProperty("webdriver_type"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.webdriver_type);
                if (message.webdriver_version != null && message.hasOwnProperty("webdriver_version"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.webdriver_version);
                if (message.can_mobile_debug != null && message.hasOwnProperty("can_mobile_debug"))
                    writer.uint32(/* id 12, wireType 0 =*/96).bool(message.can_mobile_debug);
                if (message.caps != null && message.caps.length)
                    for (var i = 0; i < message.caps.length; ++i)
                        $root.selenium.proto.RawCapabilities.encode(message.caps[i], writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.default_config != null && message.hasOwnProperty("default_config"))
                    writer.uint32(/* id 14, wireType 2 =*/114).string(message.default_config);
                return writer;
            };

            /**
             * Encodes the specified CbtBrowser message, length delimited. Does not implicitly {@link cbt.proto.CbtBrowser.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {cbt.proto.ICbtBrowser} message CbtBrowser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtBrowser.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CbtBrowser message from the specified reader or buffer.
             * @function decode
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cbt.proto.CbtBrowser} CbtBrowser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtBrowser.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtBrowser();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.type = reader.string();
                        break;
                    case 3:
                        message.version = reader.string();
                        break;
                    case 4:
                        message.api_name = reader.string();
                        break;
                    case 5:
                        message.default_live_test_browser = reader.bool();
                        break;
                    case 6:
                        message.icon_class = reader.string();
                        break;
                    case 7:
                        message.major_browser = reader.bool();
                        break;
                    case 8:
                        message.device = reader.string();
                        break;
                    case 9:
                        message.selenium_version = reader.string();
                        break;
                    case 10:
                        message.webdriver_type = reader.string();
                        break;
                    case 11:
                        message.webdriver_version = reader.string();
                        break;
                    case 12:
                        message.can_mobile_debug = reader.bool();
                        break;
                    case 13:
                        if (!(message.caps && message.caps.length))
                            message.caps = [];
                        message.caps.push($root.selenium.proto.RawCapabilities.decode(reader, reader.uint32()));
                        break;
                    case 14:
                        message.default_config = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CbtBrowser message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cbt.proto.CbtBrowser} CbtBrowser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtBrowser.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CbtBrowser message.
             * @function verify
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CbtBrowser.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isString(message.type))
                        return "type: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                if (message.api_name != null && message.hasOwnProperty("api_name"))
                    if (!$util.isString(message.api_name))
                        return "api_name: string expected";
                if (message.default_live_test_browser != null && message.hasOwnProperty("default_live_test_browser"))
                    if (typeof message.default_live_test_browser !== "boolean")
                        return "default_live_test_browser: boolean expected";
                if (message.icon_class != null && message.hasOwnProperty("icon_class"))
                    if (!$util.isString(message.icon_class))
                        return "icon_class: string expected";
                if (message.major_browser != null && message.hasOwnProperty("major_browser"))
                    if (typeof message.major_browser !== "boolean")
                        return "major_browser: boolean expected";
                if (message.device != null && message.hasOwnProperty("device"))
                    if (!$util.isString(message.device))
                        return "device: string expected";
                if (message.selenium_version != null && message.hasOwnProperty("selenium_version"))
                    if (!$util.isString(message.selenium_version))
                        return "selenium_version: string expected";
                if (message.webdriver_type != null && message.hasOwnProperty("webdriver_type"))
                    if (!$util.isString(message.webdriver_type))
                        return "webdriver_type: string expected";
                if (message.webdriver_version != null && message.hasOwnProperty("webdriver_version"))
                    if (!$util.isString(message.webdriver_version))
                        return "webdriver_version: string expected";
                if (message.can_mobile_debug != null && message.hasOwnProperty("can_mobile_debug"))
                    if (typeof message.can_mobile_debug !== "boolean")
                        return "can_mobile_debug: boolean expected";
                if (message.caps != null && message.hasOwnProperty("caps")) {
                    if (!Array.isArray(message.caps))
                        return "caps: array expected";
                    for (var i = 0; i < message.caps.length; ++i) {
                        var error = $root.selenium.proto.RawCapabilities.verify(message.caps[i]);
                        if (error)
                            return "caps." + error;
                    }
                }
                if (message.default_config != null && message.hasOwnProperty("default_config"))
                    if (!$util.isString(message.default_config))
                        return "default_config: string expected";
                return null;
            };

            /**
             * Creates a CbtBrowser message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cbt.proto.CbtBrowser} CbtBrowser
             */
            CbtBrowser.fromObject = function fromObject(object) {
                if (object instanceof $root.cbt.proto.CbtBrowser)
                    return object;
                var message = new $root.cbt.proto.CbtBrowser();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.type != null)
                    message.type = String(object.type);
                if (object.version != null)
                    message.version = String(object.version);
                if (object.api_name != null)
                    message.api_name = String(object.api_name);
                if (object.default_live_test_browser != null)
                    message.default_live_test_browser = Boolean(object.default_live_test_browser);
                if (object.icon_class != null)
                    message.icon_class = String(object.icon_class);
                if (object.major_browser != null)
                    message.major_browser = Boolean(object.major_browser);
                if (object.device != null)
                    message.device = String(object.device);
                if (object.selenium_version != null)
                    message.selenium_version = String(object.selenium_version);
                if (object.webdriver_type != null)
                    message.webdriver_type = String(object.webdriver_type);
                if (object.webdriver_version != null)
                    message.webdriver_version = String(object.webdriver_version);
                if (object.can_mobile_debug != null)
                    message.can_mobile_debug = Boolean(object.can_mobile_debug);
                if (object.caps) {
                    if (!Array.isArray(object.caps))
                        throw TypeError(".cbt.proto.CbtBrowser.caps: array expected");
                    message.caps = [];
                    for (var i = 0; i < object.caps.length; ++i) {
                        if (typeof object.caps[i] !== "object")
                            throw TypeError(".cbt.proto.CbtBrowser.caps: object expected");
                        message.caps[i] = $root.selenium.proto.RawCapabilities.fromObject(object.caps[i]);
                    }
                }
                if (object.default_config != null)
                    message.default_config = String(object.default_config);
                return message;
            };

            /**
             * Creates a plain object from a CbtBrowser message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cbt.proto.CbtBrowser
             * @static
             * @param {cbt.proto.CbtBrowser} message CbtBrowser
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CbtBrowser.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.caps = [];
                if (options.defaults) {
                    object.name = "";
                    object.type = "";
                    object.version = "";
                    object.api_name = "";
                    object.default_live_test_browser = false;
                    object.icon_class = "";
                    object.major_browser = false;
                    object.device = "";
                    object.selenium_version = "";
                    object.webdriver_type = "";
                    object.webdriver_version = "";
                    object.can_mobile_debug = false;
                    object.default_config = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                if (message.api_name != null && message.hasOwnProperty("api_name"))
                    object.api_name = message.api_name;
                if (message.default_live_test_browser != null && message.hasOwnProperty("default_live_test_browser"))
                    object.default_live_test_browser = message.default_live_test_browser;
                if (message.icon_class != null && message.hasOwnProperty("icon_class"))
                    object.icon_class = message.icon_class;
                if (message.major_browser != null && message.hasOwnProperty("major_browser"))
                    object.major_browser = message.major_browser;
                if (message.device != null && message.hasOwnProperty("device"))
                    object.device = message.device;
                if (message.selenium_version != null && message.hasOwnProperty("selenium_version"))
                    object.selenium_version = message.selenium_version;
                if (message.webdriver_type != null && message.hasOwnProperty("webdriver_type"))
                    object.webdriver_type = message.webdriver_type;
                if (message.webdriver_version != null && message.hasOwnProperty("webdriver_version"))
                    object.webdriver_version = message.webdriver_version;
                if (message.can_mobile_debug != null && message.hasOwnProperty("can_mobile_debug"))
                    object.can_mobile_debug = message.can_mobile_debug;
                if (message.caps && message.caps.length) {
                    object.caps = [];
                    for (var j = 0; j < message.caps.length; ++j)
                        object.caps[j] = $root.selenium.proto.RawCapabilities.toObject(message.caps[j], options);
                }
                if (message.default_config != null && message.hasOwnProperty("default_config"))
                    object.default_config = message.default_config;
                return object;
            };

            /**
             * Converts this CbtBrowser to JSON.
             * @function toJSON
             * @memberof cbt.proto.CbtBrowser
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CbtBrowser.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return CbtBrowser;
        })();

        proto.CbtResolution = (function() {

            /**
             * Properties of a CbtResolution.
             * @memberof cbt.proto
             * @interface ICbtResolution
             * @property {number|null} [width] CbtResolution width
             * @property {number|null} [height] CbtResolution height
             * @property {string|null} [name] CbtResolution name
             * @property {number|null} [desktop_width] CbtResolution desktop_width
             * @property {number|null} [desktop_height] CbtResolution desktop_height
             * @property {string|null} ["default"] CbtResolution default
             * @property {string|null} [orientation] CbtResolution orientation
             */

            /**
             * Constructs a new CbtResolution.
             * @memberof cbt.proto
             * @classdesc Represents a CbtResolution.
             * @implements ICbtResolution
             * @constructor
             * @param {cbt.proto.ICbtResolution=} [properties] Properties to set
             */
            function CbtResolution(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CbtResolution width.
             * @member {number} width
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype.width = 0;

            /**
             * CbtResolution height.
             * @member {number} height
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype.height = 0;

            /**
             * CbtResolution name.
             * @member {string} name
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype.name = "";

            /**
             * CbtResolution desktop_width.
             * @member {number} desktop_width
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype.desktop_width = 0;

            /**
             * CbtResolution desktop_height.
             * @member {number} desktop_height
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype.desktop_height = 0;

            /**
             * CbtResolution default.
             * @member {string} default
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype["default"] = "";

            /**
             * CbtResolution orientation.
             * @member {string} orientation
             * @memberof cbt.proto.CbtResolution
             * @instance
             */
            CbtResolution.prototype.orientation = "";

            /**
             * Creates a new CbtResolution instance using the specified properties.
             * @function create
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {cbt.proto.ICbtResolution=} [properties] Properties to set
             * @returns {cbt.proto.CbtResolution} CbtResolution instance
             */
            CbtResolution.create = function create(properties) {
                return new CbtResolution(properties);
            };

            /**
             * Encodes the specified CbtResolution message. Does not implicitly {@link cbt.proto.CbtResolution.verify|verify} messages.
             * @function encode
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {cbt.proto.ICbtResolution} message CbtResolution message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtResolution.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.width != null && message.hasOwnProperty("width"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.width);
                if (message.height != null && message.hasOwnProperty("height"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.height);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                if (message.desktop_width != null && message.hasOwnProperty("desktop_width"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.desktop_width);
                if (message.desktop_height != null && message.hasOwnProperty("desktop_height"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.desktop_height);
                if (message["default"] != null && message.hasOwnProperty("default"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message["default"]);
                if (message.orientation != null && message.hasOwnProperty("orientation"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.orientation);
                return writer;
            };

            /**
             * Encodes the specified CbtResolution message, length delimited. Does not implicitly {@link cbt.proto.CbtResolution.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {cbt.proto.ICbtResolution} message CbtResolution message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtResolution.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CbtResolution message from the specified reader or buffer.
             * @function decode
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cbt.proto.CbtResolution} CbtResolution
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtResolution.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtResolution();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.width = reader.uint32();
                        break;
                    case 2:
                        message.height = reader.uint32();
                        break;
                    case 3:
                        message.name = reader.string();
                        break;
                    case 4:
                        message.desktop_width = reader.uint32();
                        break;
                    case 5:
                        message.desktop_height = reader.uint32();
                        break;
                    case 6:
                        message["default"] = reader.string();
                        break;
                    case 7:
                        message.orientation = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CbtResolution message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cbt.proto.CbtResolution} CbtResolution
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtResolution.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CbtResolution message.
             * @function verify
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CbtResolution.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.width != null && message.hasOwnProperty("width"))
                    if (!$util.isInteger(message.width))
                        return "width: integer expected";
                if (message.height != null && message.hasOwnProperty("height"))
                    if (!$util.isInteger(message.height))
                        return "height: integer expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.desktop_width != null && message.hasOwnProperty("desktop_width"))
                    if (!$util.isInteger(message.desktop_width))
                        return "desktop_width: integer expected";
                if (message.desktop_height != null && message.hasOwnProperty("desktop_height"))
                    if (!$util.isInteger(message.desktop_height))
                        return "desktop_height: integer expected";
                if (message["default"] != null && message.hasOwnProperty("default"))
                    if (!$util.isString(message["default"]))
                        return "default: string expected";
                if (message.orientation != null && message.hasOwnProperty("orientation"))
                    if (!$util.isString(message.orientation))
                        return "orientation: string expected";
                return null;
            };

            /**
             * Creates a CbtResolution message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cbt.proto.CbtResolution} CbtResolution
             */
            CbtResolution.fromObject = function fromObject(object) {
                if (object instanceof $root.cbt.proto.CbtResolution)
                    return object;
                var message = new $root.cbt.proto.CbtResolution();
                if (object.width != null)
                    message.width = object.width >>> 0;
                if (object.height != null)
                    message.height = object.height >>> 0;
                if (object.name != null)
                    message.name = String(object.name);
                if (object.desktop_width != null)
                    message.desktop_width = object.desktop_width >>> 0;
                if (object.desktop_height != null)
                    message.desktop_height = object.desktop_height >>> 0;
                if (object["default"] != null)
                    message["default"] = String(object["default"]);
                if (object.orientation != null)
                    message.orientation = String(object.orientation);
                return message;
            };

            /**
             * Creates a plain object from a CbtResolution message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cbt.proto.CbtResolution
             * @static
             * @param {cbt.proto.CbtResolution} message CbtResolution
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CbtResolution.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.width = 0;
                    object.height = 0;
                    object.name = "";
                    object.desktop_width = 0;
                    object.desktop_height = 0;
                    object["default"] = "";
                    object.orientation = "";
                }
                if (message.width != null && message.hasOwnProperty("width"))
                    object.width = message.width;
                if (message.height != null && message.hasOwnProperty("height"))
                    object.height = message.height;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.desktop_width != null && message.hasOwnProperty("desktop_width"))
                    object.desktop_width = message.desktop_width;
                if (message.desktop_height != null && message.hasOwnProperty("desktop_height"))
                    object.desktop_height = message.desktop_height;
                if (message["default"] != null && message.hasOwnProperty("default"))
                    object["default"] = message["default"];
                if (message.orientation != null && message.hasOwnProperty("orientation"))
                    object.orientation = message.orientation;
                return object;
            };

            /**
             * Converts this CbtResolution to JSON.
             * @function toJSON
             * @memberof cbt.proto.CbtResolution
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CbtResolution.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return CbtResolution;
        })();

        proto.CbtAccount = (function() {

            /**
             * Properties of a CbtAccount.
             * @memberof cbt.proto
             * @interface ICbtAccount
             * @property {cbt.proto.CbtAccount.ISubscription|null} [subscription] CbtAccount subscription
             */

            /**
             * Constructs a new CbtAccount.
             * @memberof cbt.proto
             * @classdesc Represents a CbtAccount.
             * @implements ICbtAccount
             * @constructor
             * @param {cbt.proto.ICbtAccount=} [properties] Properties to set
             */
            function CbtAccount(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CbtAccount subscription.
             * @member {cbt.proto.CbtAccount.ISubscription|null|undefined} subscription
             * @memberof cbt.proto.CbtAccount
             * @instance
             */
            CbtAccount.prototype.subscription = null;

            /**
             * Creates a new CbtAccount instance using the specified properties.
             * @function create
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {cbt.proto.ICbtAccount=} [properties] Properties to set
             * @returns {cbt.proto.CbtAccount} CbtAccount instance
             */
            CbtAccount.create = function create(properties) {
                return new CbtAccount(properties);
            };

            /**
             * Encodes the specified CbtAccount message. Does not implicitly {@link cbt.proto.CbtAccount.verify|verify} messages.
             * @function encode
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {cbt.proto.ICbtAccount} message CbtAccount message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtAccount.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.subscription != null && message.hasOwnProperty("subscription"))
                    $root.cbt.proto.CbtAccount.Subscription.encode(message.subscription, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CbtAccount message, length delimited. Does not implicitly {@link cbt.proto.CbtAccount.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {cbt.proto.ICbtAccount} message CbtAccount message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtAccount.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CbtAccount message from the specified reader or buffer.
             * @function decode
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cbt.proto.CbtAccount} CbtAccount
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtAccount.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtAccount();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.subscription = $root.cbt.proto.CbtAccount.Subscription.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CbtAccount message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cbt.proto.CbtAccount} CbtAccount
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtAccount.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CbtAccount message.
             * @function verify
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CbtAccount.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.subscription != null && message.hasOwnProperty("subscription")) {
                    var error = $root.cbt.proto.CbtAccount.Subscription.verify(message.subscription);
                    if (error)
                        return "subscription." + error;
                }
                return null;
            };

            /**
             * Creates a CbtAccount message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cbt.proto.CbtAccount} CbtAccount
             */
            CbtAccount.fromObject = function fromObject(object) {
                if (object instanceof $root.cbt.proto.CbtAccount)
                    return object;
                var message = new $root.cbt.proto.CbtAccount();
                if (object.subscription != null) {
                    if (typeof object.subscription !== "object")
                        throw TypeError(".cbt.proto.CbtAccount.subscription: object expected");
                    message.subscription = $root.cbt.proto.CbtAccount.Subscription.fromObject(object.subscription);
                }
                return message;
            };

            /**
             * Creates a plain object from a CbtAccount message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cbt.proto.CbtAccount
             * @static
             * @param {cbt.proto.CbtAccount} message CbtAccount
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CbtAccount.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.subscription = null;
                if (message.subscription != null && message.hasOwnProperty("subscription"))
                    object.subscription = $root.cbt.proto.CbtAccount.Subscription.toObject(message.subscription, options);
                return object;
            };

            /**
             * Converts this CbtAccount to JSON.
             * @function toJSON
             * @memberof cbt.proto.CbtAccount
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CbtAccount.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            CbtAccount.Subscription = (function() {

                /**
                 * Properties of a Subscription.
                 * @memberof cbt.proto.CbtAccount
                 * @interface ISubscription
                 * @property {cbt.proto.CbtAccount.Subscription.IPackage|null} ["package"] Subscription package
                 * @property {cbt.proto.CbtAccount.Subscription.IUsage|null} [usage] Subscription usage
                 */

                /**
                 * Constructs a new Subscription.
                 * @memberof cbt.proto.CbtAccount
                 * @classdesc Represents a Subscription.
                 * @implements ISubscription
                 * @constructor
                 * @param {cbt.proto.CbtAccount.ISubscription=} [properties] Properties to set
                 */
                function Subscription(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Subscription package.
                 * @member {cbt.proto.CbtAccount.Subscription.IPackage|null|undefined} package
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @instance
                 */
                Subscription.prototype["package"] = null;

                /**
                 * Subscription usage.
                 * @member {cbt.proto.CbtAccount.Subscription.IUsage|null|undefined} usage
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @instance
                 */
                Subscription.prototype.usage = null;

                /**
                 * Creates a new Subscription instance using the specified properties.
                 * @function create
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {cbt.proto.CbtAccount.ISubscription=} [properties] Properties to set
                 * @returns {cbt.proto.CbtAccount.Subscription} Subscription instance
                 */
                Subscription.create = function create(properties) {
                    return new Subscription(properties);
                };

                /**
                 * Encodes the specified Subscription message. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.verify|verify} messages.
                 * @function encode
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {cbt.proto.CbtAccount.ISubscription} message Subscription message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Subscription.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message["package"] != null && message.hasOwnProperty("package"))
                        $root.cbt.proto.CbtAccount.Subscription.Package.encode(message["package"], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.usage != null && message.hasOwnProperty("usage"))
                        $root.cbt.proto.CbtAccount.Subscription.Usage.encode(message.usage, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Subscription message, length delimited. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {cbt.proto.CbtAccount.ISubscription} message Subscription message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Subscription.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Subscription message from the specified reader or buffer.
                 * @function decode
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {cbt.proto.CbtAccount.Subscription} Subscription
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Subscription.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtAccount.Subscription();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message["package"] = $root.cbt.proto.CbtAccount.Subscription.Package.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.usage = $root.cbt.proto.CbtAccount.Subscription.Usage.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Subscription message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {cbt.proto.CbtAccount.Subscription} Subscription
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Subscription.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Subscription message.
                 * @function verify
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Subscription.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message["package"] != null && message.hasOwnProperty("package")) {
                        var error = $root.cbt.proto.CbtAccount.Subscription.Package.verify(message["package"]);
                        if (error)
                            return "package." + error;
                    }
                    if (message.usage != null && message.hasOwnProperty("usage")) {
                        var error = $root.cbt.proto.CbtAccount.Subscription.Usage.verify(message.usage);
                        if (error)
                            return "usage." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Subscription message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {cbt.proto.CbtAccount.Subscription} Subscription
                 */
                Subscription.fromObject = function fromObject(object) {
                    if (object instanceof $root.cbt.proto.CbtAccount.Subscription)
                        return object;
                    var message = new $root.cbt.proto.CbtAccount.Subscription();
                    if (object["package"] != null) {
                        if (typeof object["package"] !== "object")
                            throw TypeError(".cbt.proto.CbtAccount.Subscription.package: object expected");
                        message["package"] = $root.cbt.proto.CbtAccount.Subscription.Package.fromObject(object["package"]);
                    }
                    if (object.usage != null) {
                        if (typeof object.usage !== "object")
                            throw TypeError(".cbt.proto.CbtAccount.Subscription.usage: object expected");
                        message.usage = $root.cbt.proto.CbtAccount.Subscription.Usage.fromObject(object.usage);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Subscription message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @static
                 * @param {cbt.proto.CbtAccount.Subscription} message Subscription
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Subscription.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object["package"] = null;
                        object.usage = null;
                    }
                    if (message["package"] != null && message.hasOwnProperty("package"))
                        object["package"] = $root.cbt.proto.CbtAccount.Subscription.Package.toObject(message["package"], options);
                    if (message.usage != null && message.hasOwnProperty("usage"))
                        object.usage = $root.cbt.proto.CbtAccount.Subscription.Usage.toObject(message.usage, options);
                    return object;
                };

                /**
                 * Converts this Subscription to JSON.
                 * @function toJSON
                 * @memberof cbt.proto.CbtAccount.Subscription
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Subscription.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                Subscription.Package = (function() {

                    /**
                     * Properties of a Package.
                     * @memberof cbt.proto.CbtAccount.Subscription
                     * @interface IPackage
                     * @property {number|null} [package_minutes] Package package_minutes
                     * @property {number|null} [max_concurrent_selenium] Package max_concurrent_selenium
                     * @property {number|null} [max_screenshot_count_per_test] Package max_screenshot_count_per_test
                     */

                    /**
                     * Constructs a new Package.
                     * @memberof cbt.proto.CbtAccount.Subscription
                     * @classdesc Represents a Package.
                     * @implements IPackage
                     * @constructor
                     * @param {cbt.proto.CbtAccount.Subscription.IPackage=} [properties] Properties to set
                     */
                    function Package(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Package package_minutes.
                     * @member {number} package_minutes
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @instance
                     */
                    Package.prototype.package_minutes = 0;

                    /**
                     * Package max_concurrent_selenium.
                     * @member {number} max_concurrent_selenium
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @instance
                     */
                    Package.prototype.max_concurrent_selenium = 0;

                    /**
                     * Package max_screenshot_count_per_test.
                     * @member {number} max_screenshot_count_per_test
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @instance
                     */
                    Package.prototype.max_screenshot_count_per_test = 0;

                    /**
                     * Creates a new Package instance using the specified properties.
                     * @function create
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.IPackage=} [properties] Properties to set
                     * @returns {cbt.proto.CbtAccount.Subscription.Package} Package instance
                     */
                    Package.create = function create(properties) {
                        return new Package(properties);
                    };

                    /**
                     * Encodes the specified Package message. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Package.verify|verify} messages.
                     * @function encode
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.IPackage} message Package message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Package.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.package_minutes != null && message.hasOwnProperty("package_minutes"))
                            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.package_minutes);
                        if (message.max_concurrent_selenium != null && message.hasOwnProperty("max_concurrent_selenium"))
                            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.max_concurrent_selenium);
                        if (message.max_screenshot_count_per_test != null && message.hasOwnProperty("max_screenshot_count_per_test"))
                            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.max_screenshot_count_per_test);
                        return writer;
                    };

                    /**
                     * Encodes the specified Package message, length delimited. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Package.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.IPackage} message Package message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Package.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Package message from the specified reader or buffer.
                     * @function decode
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {cbt.proto.CbtAccount.Subscription.Package} Package
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Package.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtAccount.Subscription.Package();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.package_minutes = reader.uint32();
                                break;
                            case 2:
                                message.max_concurrent_selenium = reader.uint32();
                                break;
                            case 3:
                                message.max_screenshot_count_per_test = reader.uint32();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Package message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {cbt.proto.CbtAccount.Subscription.Package} Package
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Package.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Package message.
                     * @function verify
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Package.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.package_minutes != null && message.hasOwnProperty("package_minutes"))
                            if (!$util.isInteger(message.package_minutes))
                                return "package_minutes: integer expected";
                        if (message.max_concurrent_selenium != null && message.hasOwnProperty("max_concurrent_selenium"))
                            if (!$util.isInteger(message.max_concurrent_selenium))
                                return "max_concurrent_selenium: integer expected";
                        if (message.max_screenshot_count_per_test != null && message.hasOwnProperty("max_screenshot_count_per_test"))
                            if (!$util.isInteger(message.max_screenshot_count_per_test))
                                return "max_screenshot_count_per_test: integer expected";
                        return null;
                    };

                    /**
                     * Creates a Package message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {cbt.proto.CbtAccount.Subscription.Package} Package
                     */
                    Package.fromObject = function fromObject(object) {
                        if (object instanceof $root.cbt.proto.CbtAccount.Subscription.Package)
                            return object;
                        var message = new $root.cbt.proto.CbtAccount.Subscription.Package();
                        if (object.package_minutes != null)
                            message.package_minutes = object.package_minutes >>> 0;
                        if (object.max_concurrent_selenium != null)
                            message.max_concurrent_selenium = object.max_concurrent_selenium >>> 0;
                        if (object.max_screenshot_count_per_test != null)
                            message.max_screenshot_count_per_test = object.max_screenshot_count_per_test >>> 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a Package message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.Package} message Package
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Package.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.package_minutes = 0;
                            object.max_concurrent_selenium = 0;
                            object.max_screenshot_count_per_test = 0;
                        }
                        if (message.package_minutes != null && message.hasOwnProperty("package_minutes"))
                            object.package_minutes = message.package_minutes;
                        if (message.max_concurrent_selenium != null && message.hasOwnProperty("max_concurrent_selenium"))
                            object.max_concurrent_selenium = message.max_concurrent_selenium;
                        if (message.max_screenshot_count_per_test != null && message.hasOwnProperty("max_screenshot_count_per_test"))
                            object.max_screenshot_count_per_test = message.max_screenshot_count_per_test;
                        return object;
                    };

                    /**
                     * Converts this Package to JSON.
                     * @function toJSON
                     * @memberof cbt.proto.CbtAccount.Subscription.Package
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Package.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Package;
                })();

                Subscription.Usage = (function() {

                    /**
                     * Properties of a Usage.
                     * @memberof cbt.proto.CbtAccount.Subscription
                     * @interface IUsage
                     * @property {cbt.proto.CbtAccount.Subscription.Usage.IEntity|null} [team] Usage team
                     * @property {cbt.proto.CbtAccount.Subscription.Usage.IEntity|null} [member] Usage member
                     */

                    /**
                     * Constructs a new Usage.
                     * @memberof cbt.proto.CbtAccount.Subscription
                     * @classdesc Represents a Usage.
                     * @implements IUsage
                     * @constructor
                     * @param {cbt.proto.CbtAccount.Subscription.IUsage=} [properties] Properties to set
                     */
                    function Usage(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Usage team.
                     * @member {cbt.proto.CbtAccount.Subscription.Usage.IEntity|null|undefined} team
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @instance
                     */
                    Usage.prototype.team = null;

                    /**
                     * Usage member.
                     * @member {cbt.proto.CbtAccount.Subscription.Usage.IEntity|null|undefined} member
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @instance
                     */
                    Usage.prototype.member = null;

                    /**
                     * Creates a new Usage instance using the specified properties.
                     * @function create
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.IUsage=} [properties] Properties to set
                     * @returns {cbt.proto.CbtAccount.Subscription.Usage} Usage instance
                     */
                    Usage.create = function create(properties) {
                        return new Usage(properties);
                    };

                    /**
                     * Encodes the specified Usage message. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Usage.verify|verify} messages.
                     * @function encode
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.IUsage} message Usage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Usage.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.team != null && message.hasOwnProperty("team"))
                            $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.encode(message.team, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.member != null && message.hasOwnProperty("member"))
                            $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.encode(message.member, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };

                    /**
                     * Encodes the specified Usage message, length delimited. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Usage.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.IUsage} message Usage message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Usage.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Usage message from the specified reader or buffer.
                     * @function decode
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {cbt.proto.CbtAccount.Subscription.Usage} Usage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Usage.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtAccount.Subscription.Usage();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.team = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.decode(reader, reader.uint32());
                                break;
                            case 2:
                                message.member = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Usage message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {cbt.proto.CbtAccount.Subscription.Usage} Usage
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Usage.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Usage message.
                     * @function verify
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Usage.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.team != null && message.hasOwnProperty("team")) {
                            var error = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.verify(message.team);
                            if (error)
                                return "team." + error;
                        }
                        if (message.member != null && message.hasOwnProperty("member")) {
                            var error = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.verify(message.member);
                            if (error)
                                return "member." + error;
                        }
                        return null;
                    };

                    /**
                     * Creates a Usage message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {cbt.proto.CbtAccount.Subscription.Usage} Usage
                     */
                    Usage.fromObject = function fromObject(object) {
                        if (object instanceof $root.cbt.proto.CbtAccount.Subscription.Usage)
                            return object;
                        var message = new $root.cbt.proto.CbtAccount.Subscription.Usage();
                        if (object.team != null) {
                            if (typeof object.team !== "object")
                                throw TypeError(".cbt.proto.CbtAccount.Subscription.Usage.team: object expected");
                            message.team = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.fromObject(object.team);
                        }
                        if (object.member != null) {
                            if (typeof object.member !== "object")
                                throw TypeError(".cbt.proto.CbtAccount.Subscription.Usage.member: object expected");
                            message.member = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.fromObject(object.member);
                        }
                        return message;
                    };

                    /**
                     * Creates a plain object from a Usage message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @static
                     * @param {cbt.proto.CbtAccount.Subscription.Usage} message Usage
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Usage.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.team = null;
                            object.member = null;
                        }
                        if (message.team != null && message.hasOwnProperty("team"))
                            object.team = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.toObject(message.team, options);
                        if (message.member != null && message.hasOwnProperty("member"))
                            object.member = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.toObject(message.member, options);
                        return object;
                    };

                    /**
                     * Converts this Usage to JSON.
                     * @function toJSON
                     * @memberof cbt.proto.CbtAccount.Subscription.Usage
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Usage.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    Usage.Entity = (function() {

                        /**
                         * Properties of an Entity.
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage
                         * @interface IEntity
                         * @property {string|null} [measure] Entity measure
                         * @property {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts|null} [manual] Entity manual
                         * @property {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts|null} [automated] Entity automated
                         */

                        /**
                         * Constructs a new Entity.
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage
                         * @classdesc Represents an Entity.
                         * @implements IEntity
                         * @constructor
                         * @param {cbt.proto.CbtAccount.Subscription.Usage.IEntity=} [properties] Properties to set
                         */
                        function Entity(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }

                        /**
                         * Entity measure.
                         * @member {string} measure
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @instance
                         */
                        Entity.prototype.measure = "";

                        /**
                         * Entity manual.
                         * @member {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts|null|undefined} manual
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @instance
                         */
                        Entity.prototype.manual = null;

                        /**
                         * Entity automated.
                         * @member {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts|null|undefined} automated
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @instance
                         */
                        Entity.prototype.automated = null;

                        /**
                         * Creates a new Entity instance using the specified properties.
                         * @function create
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {cbt.proto.CbtAccount.Subscription.Usage.IEntity=} [properties] Properties to set
                         * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity} Entity instance
                         */
                        Entity.create = function create(properties) {
                            return new Entity(properties);
                        };

                        /**
                         * Encodes the specified Entity message. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Usage.Entity.verify|verify} messages.
                         * @function encode
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {cbt.proto.CbtAccount.Subscription.Usage.IEntity} message Entity message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Entity.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.measure != null && message.hasOwnProperty("measure"))
                                writer.uint32(/* id 1, wireType 2 =*/10).string(message.measure);
                            if (message.manual != null && message.hasOwnProperty("manual"))
                                $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.encode(message.manual, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.automated != null && message.hasOwnProperty("automated"))
                                $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.encode(message.automated, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            return writer;
                        };

                        /**
                         * Encodes the specified Entity message, length delimited. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Usage.Entity.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {cbt.proto.CbtAccount.Subscription.Usage.IEntity} message Entity message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Entity.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };

                        /**
                         * Decodes an Entity message from the specified reader or buffer.
                         * @function decode
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity} Entity
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Entity.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtAccount.Subscription.Usage.Entity();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.measure = reader.string();
                                    break;
                                case 2:
                                    message.manual = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.decode(reader, reader.uint32());
                                    break;
                                case 3:
                                    message.automated = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };

                        /**
                         * Decodes an Entity message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity} Entity
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Entity.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };

                        /**
                         * Verifies an Entity message.
                         * @function verify
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Entity.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.measure != null && message.hasOwnProperty("measure"))
                                if (!$util.isString(message.measure))
                                    return "measure: string expected";
                            if (message.manual != null && message.hasOwnProperty("manual")) {
                                var error = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.verify(message.manual);
                                if (error)
                                    return "manual." + error;
                            }
                            if (message.automated != null && message.hasOwnProperty("automated")) {
                                var error = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.verify(message.automated);
                                if (error)
                                    return "automated." + error;
                            }
                            return null;
                        };

                        /**
                         * Creates an Entity message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity} Entity
                         */
                        Entity.fromObject = function fromObject(object) {
                            if (object instanceof $root.cbt.proto.CbtAccount.Subscription.Usage.Entity)
                                return object;
                            var message = new $root.cbt.proto.CbtAccount.Subscription.Usage.Entity();
                            if (object.measure != null)
                                message.measure = String(object.measure);
                            if (object.manual != null) {
                                if (typeof object.manual !== "object")
                                    throw TypeError(".cbt.proto.CbtAccount.Subscription.Usage.Entity.manual: object expected");
                                message.manual = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.fromObject(object.manual);
                            }
                            if (object.automated != null) {
                                if (typeof object.automated !== "object")
                                    throw TypeError(".cbt.proto.CbtAccount.Subscription.Usage.Entity.automated: object expected");
                                message.automated = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.fromObject(object.automated);
                            }
                            return message;
                        };

                        /**
                         * Creates a plain object from an Entity message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @static
                         * @param {cbt.proto.CbtAccount.Subscription.Usage.Entity} message Entity
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Entity.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.measure = "";
                                object.manual = null;
                                object.automated = null;
                            }
                            if (message.measure != null && message.hasOwnProperty("measure"))
                                object.measure = message.measure;
                            if (message.manual != null && message.hasOwnProperty("manual"))
                                object.manual = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.toObject(message.manual, options);
                            if (message.automated != null && message.hasOwnProperty("automated"))
                                object.automated = $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.toObject(message.automated, options);
                            return object;
                        };

                        /**
                         * Converts this Entity to JSON.
                         * @function toJSON
                         * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Entity.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        Entity.Counts = (function() {

                            /**
                             * Properties of a Counts.
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                             * @interface ICounts
                             * @property {number|null} [livetests] Counts livetests
                             * @property {number|null} [screenshots] Counts screenshots
                             * @property {number|null} [selenium] Counts selenium
                             * @property {number|null} [testexecute] Counts testexecute
                             * @property {number|null} [total] Counts total
                             */

                            /**
                             * Constructs a new Counts.
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity
                             * @classdesc Represents a Counts.
                             * @implements ICounts
                             * @constructor
                             * @param {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts=} [properties] Properties to set
                             */
                            function Counts(properties) {
                                if (properties)
                                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                        if (properties[keys[i]] != null)
                                            this[keys[i]] = properties[keys[i]];
                            }

                            /**
                             * Counts livetests.
                             * @member {number} livetests
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @instance
                             */
                            Counts.prototype.livetests = 0;

                            /**
                             * Counts screenshots.
                             * @member {number} screenshots
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @instance
                             */
                            Counts.prototype.screenshots = 0;

                            /**
                             * Counts selenium.
                             * @member {number} selenium
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @instance
                             */
                            Counts.prototype.selenium = 0;

                            /**
                             * Counts testexecute.
                             * @member {number} testexecute
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @instance
                             */
                            Counts.prototype.testexecute = 0;

                            /**
                             * Counts total.
                             * @member {number} total
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @instance
                             */
                            Counts.prototype.total = 0;

                            /**
                             * Creates a new Counts instance using the specified properties.
                             * @function create
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts=} [properties] Properties to set
                             * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts} Counts instance
                             */
                            Counts.create = function create(properties) {
                                return new Counts(properties);
                            };

                            /**
                             * Encodes the specified Counts message. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.verify|verify} messages.
                             * @function encode
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts} message Counts message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            Counts.encode = function encode(message, writer) {
                                if (!writer)
                                    writer = $Writer.create();
                                if (message.livetests != null && message.hasOwnProperty("livetests"))
                                    writer.uint32(/* id 1, wireType 1 =*/9).double(message.livetests);
                                if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                                    writer.uint32(/* id 2, wireType 1 =*/17).double(message.screenshots);
                                if (message.selenium != null && message.hasOwnProperty("selenium"))
                                    writer.uint32(/* id 3, wireType 1 =*/25).double(message.selenium);
                                if (message.testexecute != null && message.hasOwnProperty("testexecute"))
                                    writer.uint32(/* id 4, wireType 1 =*/33).double(message.testexecute);
                                if (message.total != null && message.hasOwnProperty("total"))
                                    writer.uint32(/* id 5, wireType 1 =*/41).double(message.total);
                                return writer;
                            };

                            /**
                             * Encodes the specified Counts message, length delimited. Does not implicitly {@link cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts.verify|verify} messages.
                             * @function encodeDelimited
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {cbt.proto.CbtAccount.Subscription.Usage.Entity.ICounts} message Counts message or plain object to encode
                             * @param {$protobuf.Writer} [writer] Writer to encode to
                             * @returns {$protobuf.Writer} Writer
                             */
                            Counts.encodeDelimited = function encodeDelimited(message, writer) {
                                return this.encode(message, writer).ldelim();
                            };

                            /**
                             * Decodes a Counts message from the specified reader or buffer.
                             * @function decode
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @param {number} [length] Message length if known beforehand
                             * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts} Counts
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            Counts.decode = function decode(reader, length) {
                                if (!(reader instanceof $Reader))
                                    reader = $Reader.create(reader);
                                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts();
                                while (reader.pos < end) {
                                    var tag = reader.uint32();
                                    switch (tag >>> 3) {
                                    case 1:
                                        message.livetests = reader.double();
                                        break;
                                    case 2:
                                        message.screenshots = reader.double();
                                        break;
                                    case 3:
                                        message.selenium = reader.double();
                                        break;
                                    case 4:
                                        message.testexecute = reader.double();
                                        break;
                                    case 5:
                                        message.total = reader.double();
                                        break;
                                    default:
                                        reader.skipType(tag & 7);
                                        break;
                                    }
                                }
                                return message;
                            };

                            /**
                             * Decodes a Counts message from the specified reader or buffer, length delimited.
                             * @function decodeDelimited
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                             * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts} Counts
                             * @throws {Error} If the payload is not a reader or valid buffer
                             * @throws {$protobuf.util.ProtocolError} If required fields are missing
                             */
                            Counts.decodeDelimited = function decodeDelimited(reader) {
                                if (!(reader instanceof $Reader))
                                    reader = new $Reader(reader);
                                return this.decode(reader, reader.uint32());
                            };

                            /**
                             * Verifies a Counts message.
                             * @function verify
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {Object.<string,*>} message Plain object to verify
                             * @returns {string|null} `null` if valid, otherwise the reason why it is not
                             */
                            Counts.verify = function verify(message) {
                                if (typeof message !== "object" || message === null)
                                    return "object expected";
                                if (message.livetests != null && message.hasOwnProperty("livetests"))
                                    if (typeof message.livetests !== "number")
                                        return "livetests: number expected";
                                if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                                    if (typeof message.screenshots !== "number")
                                        return "screenshots: number expected";
                                if (message.selenium != null && message.hasOwnProperty("selenium"))
                                    if (typeof message.selenium !== "number")
                                        return "selenium: number expected";
                                if (message.testexecute != null && message.hasOwnProperty("testexecute"))
                                    if (typeof message.testexecute !== "number")
                                        return "testexecute: number expected";
                                if (message.total != null && message.hasOwnProperty("total"))
                                    if (typeof message.total !== "number")
                                        return "total: number expected";
                                return null;
                            };

                            /**
                             * Creates a Counts message from a plain object. Also converts values to their respective internal types.
                             * @function fromObject
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {Object.<string,*>} object Plain object
                             * @returns {cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts} Counts
                             */
                            Counts.fromObject = function fromObject(object) {
                                if (object instanceof $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts)
                                    return object;
                                var message = new $root.cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts();
                                if (object.livetests != null)
                                    message.livetests = Number(object.livetests);
                                if (object.screenshots != null)
                                    message.screenshots = Number(object.screenshots);
                                if (object.selenium != null)
                                    message.selenium = Number(object.selenium);
                                if (object.testexecute != null)
                                    message.testexecute = Number(object.testexecute);
                                if (object.total != null)
                                    message.total = Number(object.total);
                                return message;
                            };

                            /**
                             * Creates a plain object from a Counts message. Also converts values to other types if specified.
                             * @function toObject
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @static
                             * @param {cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts} message Counts
                             * @param {$protobuf.IConversionOptions} [options] Conversion options
                             * @returns {Object.<string,*>} Plain object
                             */
                            Counts.toObject = function toObject(message, options) {
                                if (!options)
                                    options = {};
                                var object = {};
                                if (options.defaults) {
                                    object.livetests = 0;
                                    object.screenshots = 0;
                                    object.selenium = 0;
                                    object.testexecute = 0;
                                    object.total = 0;
                                }
                                if (message.livetests != null && message.hasOwnProperty("livetests"))
                                    object.livetests = options.json && !isFinite(message.livetests) ? String(message.livetests) : message.livetests;
                                if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                                    object.screenshots = options.json && !isFinite(message.screenshots) ? String(message.screenshots) : message.screenshots;
                                if (message.selenium != null && message.hasOwnProperty("selenium"))
                                    object.selenium = options.json && !isFinite(message.selenium) ? String(message.selenium) : message.selenium;
                                if (message.testexecute != null && message.hasOwnProperty("testexecute"))
                                    object.testexecute = options.json && !isFinite(message.testexecute) ? String(message.testexecute) : message.testexecute;
                                if (message.total != null && message.hasOwnProperty("total"))
                                    object.total = options.json && !isFinite(message.total) ? String(message.total) : message.total;
                                return object;
                            };

                            /**
                             * Converts this Counts to JSON.
                             * @function toJSON
                             * @memberof cbt.proto.CbtAccount.Subscription.Usage.Entity.Counts
                             * @instance
                             * @returns {Object.<string,*>} JSON object
                             */
                            Counts.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };

                            return Counts;
                        })();

                        return Entity;
                    })();

                    return Usage;
                })();

                return Subscription;
            })();

            return CbtAccount;
        })();

        proto.CbtActiveTestCounts = (function() {

            /**
             * Properties of a CbtActiveTestCounts.
             * @memberof cbt.proto
             * @interface ICbtActiveTestCounts
             * @property {cbt.proto.CbtActiveTestCounts.ICounts|null} [team] CbtActiveTestCounts team
             * @property {cbt.proto.CbtActiveTestCounts.ICounts|null} [member] CbtActiveTestCounts member
             */

            /**
             * Constructs a new CbtActiveTestCounts.
             * @memberof cbt.proto
             * @classdesc Represents a CbtActiveTestCounts.
             * @implements ICbtActiveTestCounts
             * @constructor
             * @param {cbt.proto.ICbtActiveTestCounts=} [properties] Properties to set
             */
            function CbtActiveTestCounts(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CbtActiveTestCounts team.
             * @member {cbt.proto.CbtActiveTestCounts.ICounts|null|undefined} team
             * @memberof cbt.proto.CbtActiveTestCounts
             * @instance
             */
            CbtActiveTestCounts.prototype.team = null;

            /**
             * CbtActiveTestCounts member.
             * @member {cbt.proto.CbtActiveTestCounts.ICounts|null|undefined} member
             * @memberof cbt.proto.CbtActiveTestCounts
             * @instance
             */
            CbtActiveTestCounts.prototype.member = null;

            /**
             * Creates a new CbtActiveTestCounts instance using the specified properties.
             * @function create
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {cbt.proto.ICbtActiveTestCounts=} [properties] Properties to set
             * @returns {cbt.proto.CbtActiveTestCounts} CbtActiveTestCounts instance
             */
            CbtActiveTestCounts.create = function create(properties) {
                return new CbtActiveTestCounts(properties);
            };

            /**
             * Encodes the specified CbtActiveTestCounts message. Does not implicitly {@link cbt.proto.CbtActiveTestCounts.verify|verify} messages.
             * @function encode
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {cbt.proto.ICbtActiveTestCounts} message CbtActiveTestCounts message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtActiveTestCounts.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.team != null && message.hasOwnProperty("team"))
                    $root.cbt.proto.CbtActiveTestCounts.Counts.encode(message.team, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.member != null && message.hasOwnProperty("member"))
                    $root.cbt.proto.CbtActiveTestCounts.Counts.encode(message.member, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified CbtActiveTestCounts message, length delimited. Does not implicitly {@link cbt.proto.CbtActiveTestCounts.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {cbt.proto.ICbtActiveTestCounts} message CbtActiveTestCounts message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtActiveTestCounts.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CbtActiveTestCounts message from the specified reader or buffer.
             * @function decode
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cbt.proto.CbtActiveTestCounts} CbtActiveTestCounts
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtActiveTestCounts.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtActiveTestCounts();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.team = $root.cbt.proto.CbtActiveTestCounts.Counts.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.member = $root.cbt.proto.CbtActiveTestCounts.Counts.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CbtActiveTestCounts message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cbt.proto.CbtActiveTestCounts} CbtActiveTestCounts
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtActiveTestCounts.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CbtActiveTestCounts message.
             * @function verify
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CbtActiveTestCounts.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.team != null && message.hasOwnProperty("team")) {
                    var error = $root.cbt.proto.CbtActiveTestCounts.Counts.verify(message.team);
                    if (error)
                        return "team." + error;
                }
                if (message.member != null && message.hasOwnProperty("member")) {
                    var error = $root.cbt.proto.CbtActiveTestCounts.Counts.verify(message.member);
                    if (error)
                        return "member." + error;
                }
                return null;
            };

            /**
             * Creates a CbtActiveTestCounts message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cbt.proto.CbtActiveTestCounts} CbtActiveTestCounts
             */
            CbtActiveTestCounts.fromObject = function fromObject(object) {
                if (object instanceof $root.cbt.proto.CbtActiveTestCounts)
                    return object;
                var message = new $root.cbt.proto.CbtActiveTestCounts();
                if (object.team != null) {
                    if (typeof object.team !== "object")
                        throw TypeError(".cbt.proto.CbtActiveTestCounts.team: object expected");
                    message.team = $root.cbt.proto.CbtActiveTestCounts.Counts.fromObject(object.team);
                }
                if (object.member != null) {
                    if (typeof object.member !== "object")
                        throw TypeError(".cbt.proto.CbtActiveTestCounts.member: object expected");
                    message.member = $root.cbt.proto.CbtActiveTestCounts.Counts.fromObject(object.member);
                }
                return message;
            };

            /**
             * Creates a plain object from a CbtActiveTestCounts message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cbt.proto.CbtActiveTestCounts
             * @static
             * @param {cbt.proto.CbtActiveTestCounts} message CbtActiveTestCounts
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CbtActiveTestCounts.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.team = null;
                    object.member = null;
                }
                if (message.team != null && message.hasOwnProperty("team"))
                    object.team = $root.cbt.proto.CbtActiveTestCounts.Counts.toObject(message.team, options);
                if (message.member != null && message.hasOwnProperty("member"))
                    object.member = $root.cbt.proto.CbtActiveTestCounts.Counts.toObject(message.member, options);
                return object;
            };

            /**
             * Converts this CbtActiveTestCounts to JSON.
             * @function toJSON
             * @memberof cbt.proto.CbtActiveTestCounts
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CbtActiveTestCounts.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            CbtActiveTestCounts.Counts = (function() {

                /**
                 * Properties of a Counts.
                 * @memberof cbt.proto.CbtActiveTestCounts
                 * @interface ICounts
                 * @property {number|null} [automated] Counts automated
                 * @property {number|null} [manual] Counts manual
                 */

                /**
                 * Constructs a new Counts.
                 * @memberof cbt.proto.CbtActiveTestCounts
                 * @classdesc Represents a Counts.
                 * @implements ICounts
                 * @constructor
                 * @param {cbt.proto.CbtActiveTestCounts.ICounts=} [properties] Properties to set
                 */
                function Counts(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Counts automated.
                 * @member {number} automated
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @instance
                 */
                Counts.prototype.automated = 0;

                /**
                 * Counts manual.
                 * @member {number} manual
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @instance
                 */
                Counts.prototype.manual = 0;

                /**
                 * Creates a new Counts instance using the specified properties.
                 * @function create
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {cbt.proto.CbtActiveTestCounts.ICounts=} [properties] Properties to set
                 * @returns {cbt.proto.CbtActiveTestCounts.Counts} Counts instance
                 */
                Counts.create = function create(properties) {
                    return new Counts(properties);
                };

                /**
                 * Encodes the specified Counts message. Does not implicitly {@link cbt.proto.CbtActiveTestCounts.Counts.verify|verify} messages.
                 * @function encode
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {cbt.proto.CbtActiveTestCounts.ICounts} message Counts message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Counts.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.automated != null && message.hasOwnProperty("automated"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.automated);
                    if (message.manual != null && message.hasOwnProperty("manual"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.manual);
                    return writer;
                };

                /**
                 * Encodes the specified Counts message, length delimited. Does not implicitly {@link cbt.proto.CbtActiveTestCounts.Counts.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {cbt.proto.CbtActiveTestCounts.ICounts} message Counts message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Counts.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Counts message from the specified reader or buffer.
                 * @function decode
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {cbt.proto.CbtActiveTestCounts.Counts} Counts
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Counts.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtActiveTestCounts.Counts();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.automated = reader.uint32();
                            break;
                        case 2:
                            message.manual = reader.uint32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Counts message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {cbt.proto.CbtActiveTestCounts.Counts} Counts
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Counts.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Counts message.
                 * @function verify
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Counts.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.automated != null && message.hasOwnProperty("automated"))
                        if (!$util.isInteger(message.automated))
                            return "automated: integer expected";
                    if (message.manual != null && message.hasOwnProperty("manual"))
                        if (!$util.isInteger(message.manual))
                            return "manual: integer expected";
                    return null;
                };

                /**
                 * Creates a Counts message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {cbt.proto.CbtActiveTestCounts.Counts} Counts
                 */
                Counts.fromObject = function fromObject(object) {
                    if (object instanceof $root.cbt.proto.CbtActiveTestCounts.Counts)
                        return object;
                    var message = new $root.cbt.proto.CbtActiveTestCounts.Counts();
                    if (object.automated != null)
                        message.automated = object.automated >>> 0;
                    if (object.manual != null)
                        message.manual = object.manual >>> 0;
                    return message;
                };

                /**
                 * Creates a plain object from a Counts message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @static
                 * @param {cbt.proto.CbtActiveTestCounts.Counts} message Counts
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Counts.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.automated = 0;
                        object.manual = 0;
                    }
                    if (message.automated != null && message.hasOwnProperty("automated"))
                        object.automated = message.automated;
                    if (message.manual != null && message.hasOwnProperty("manual"))
                        object.manual = message.manual;
                    return object;
                };

                /**
                 * Converts this Counts to JSON.
                 * @function toJSON
                 * @memberof cbt.proto.CbtActiveTestCounts.Counts
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Counts.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Counts;
            })();

            return CbtActiveTestCounts;
        })();

        proto.CbtConcurrencyStats = (function() {

            /**
             * Properties of a CbtConcurrencyStats.
             * @memberof cbt.proto
             * @interface ICbtConcurrencyStats
             * @property {number|null} [max_minutes] CbtConcurrencyStats max_minutes
             * @property {number|null} [used_minutes] CbtConcurrencyStats used_minutes
             * @property {number|null} [max_concurrent_selenium_tests] CbtConcurrencyStats max_concurrent_selenium_tests
             * @property {number|null} [active_concurrent_selenium_tests] CbtConcurrencyStats active_concurrent_selenium_tests
             * @property {number|null} [max_screenshot_count_per_test] CbtConcurrencyStats max_screenshot_count_per_test
             */

            /**
             * Constructs a new CbtConcurrencyStats.
             * @memberof cbt.proto
             * @classdesc Represents a CbtConcurrencyStats.
             * @implements ICbtConcurrencyStats
             * @constructor
             * @param {cbt.proto.ICbtConcurrencyStats=} [properties] Properties to set
             */
            function CbtConcurrencyStats(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CbtConcurrencyStats max_minutes.
             * @member {number} max_minutes
             * @memberof cbt.proto.CbtConcurrencyStats
             * @instance
             */
            CbtConcurrencyStats.prototype.max_minutes = 0;

            /**
             * CbtConcurrencyStats used_minutes.
             * @member {number} used_minutes
             * @memberof cbt.proto.CbtConcurrencyStats
             * @instance
             */
            CbtConcurrencyStats.prototype.used_minutes = 0;

            /**
             * CbtConcurrencyStats max_concurrent_selenium_tests.
             * @member {number} max_concurrent_selenium_tests
             * @memberof cbt.proto.CbtConcurrencyStats
             * @instance
             */
            CbtConcurrencyStats.prototype.max_concurrent_selenium_tests = 0;

            /**
             * CbtConcurrencyStats active_concurrent_selenium_tests.
             * @member {number} active_concurrent_selenium_tests
             * @memberof cbt.proto.CbtConcurrencyStats
             * @instance
             */
            CbtConcurrencyStats.prototype.active_concurrent_selenium_tests = 0;

            /**
             * CbtConcurrencyStats max_screenshot_count_per_test.
             * @member {number} max_screenshot_count_per_test
             * @memberof cbt.proto.CbtConcurrencyStats
             * @instance
             */
            CbtConcurrencyStats.prototype.max_screenshot_count_per_test = 0;

            /**
             * Creates a new CbtConcurrencyStats instance using the specified properties.
             * @function create
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {cbt.proto.ICbtConcurrencyStats=} [properties] Properties to set
             * @returns {cbt.proto.CbtConcurrencyStats} CbtConcurrencyStats instance
             */
            CbtConcurrencyStats.create = function create(properties) {
                return new CbtConcurrencyStats(properties);
            };

            /**
             * Encodes the specified CbtConcurrencyStats message. Does not implicitly {@link cbt.proto.CbtConcurrencyStats.verify|verify} messages.
             * @function encode
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {cbt.proto.ICbtConcurrencyStats} message CbtConcurrencyStats message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtConcurrencyStats.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.max_minutes != null && message.hasOwnProperty("max_minutes"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.max_minutes);
                if (message.used_minutes != null && message.hasOwnProperty("used_minutes"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.used_minutes);
                if (message.max_concurrent_selenium_tests != null && message.hasOwnProperty("max_concurrent_selenium_tests"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.max_concurrent_selenium_tests);
                if (message.active_concurrent_selenium_tests != null && message.hasOwnProperty("active_concurrent_selenium_tests"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.active_concurrent_selenium_tests);
                if (message.max_screenshot_count_per_test != null && message.hasOwnProperty("max_screenshot_count_per_test"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.max_screenshot_count_per_test);
                return writer;
            };

            /**
             * Encodes the specified CbtConcurrencyStats message, length delimited. Does not implicitly {@link cbt.proto.CbtConcurrencyStats.verify|verify} messages.
             * @function encodeDelimited
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {cbt.proto.ICbtConcurrencyStats} message CbtConcurrencyStats message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CbtConcurrencyStats.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CbtConcurrencyStats message from the specified reader or buffer.
             * @function decode
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {cbt.proto.CbtConcurrencyStats} CbtConcurrencyStats
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtConcurrencyStats.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.cbt.proto.CbtConcurrencyStats();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.max_minutes = reader.uint32();
                        break;
                    case 2:
                        message.used_minutes = reader.uint32();
                        break;
                    case 3:
                        message.max_concurrent_selenium_tests = reader.uint32();
                        break;
                    case 4:
                        message.active_concurrent_selenium_tests = reader.uint32();
                        break;
                    case 5:
                        message.max_screenshot_count_per_test = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CbtConcurrencyStats message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {cbt.proto.CbtConcurrencyStats} CbtConcurrencyStats
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CbtConcurrencyStats.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CbtConcurrencyStats message.
             * @function verify
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CbtConcurrencyStats.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.max_minutes != null && message.hasOwnProperty("max_minutes"))
                    if (!$util.isInteger(message.max_minutes))
                        return "max_minutes: integer expected";
                if (message.used_minutes != null && message.hasOwnProperty("used_minutes"))
                    if (!$util.isInteger(message.used_minutes))
                        return "used_minutes: integer expected";
                if (message.max_concurrent_selenium_tests != null && message.hasOwnProperty("max_concurrent_selenium_tests"))
                    if (!$util.isInteger(message.max_concurrent_selenium_tests))
                        return "max_concurrent_selenium_tests: integer expected";
                if (message.active_concurrent_selenium_tests != null && message.hasOwnProperty("active_concurrent_selenium_tests"))
                    if (!$util.isInteger(message.active_concurrent_selenium_tests))
                        return "active_concurrent_selenium_tests: integer expected";
                if (message.max_screenshot_count_per_test != null && message.hasOwnProperty("max_screenshot_count_per_test"))
                    if (!$util.isInteger(message.max_screenshot_count_per_test))
                        return "max_screenshot_count_per_test: integer expected";
                return null;
            };

            /**
             * Creates a CbtConcurrencyStats message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {cbt.proto.CbtConcurrencyStats} CbtConcurrencyStats
             */
            CbtConcurrencyStats.fromObject = function fromObject(object) {
                if (object instanceof $root.cbt.proto.CbtConcurrencyStats)
                    return object;
                var message = new $root.cbt.proto.CbtConcurrencyStats();
                if (object.max_minutes != null)
                    message.max_minutes = object.max_minutes >>> 0;
                if (object.used_minutes != null)
                    message.used_minutes = object.used_minutes >>> 0;
                if (object.max_concurrent_selenium_tests != null)
                    message.max_concurrent_selenium_tests = object.max_concurrent_selenium_tests >>> 0;
                if (object.active_concurrent_selenium_tests != null)
                    message.active_concurrent_selenium_tests = object.active_concurrent_selenium_tests >>> 0;
                if (object.max_screenshot_count_per_test != null)
                    message.max_screenshot_count_per_test = object.max_screenshot_count_per_test >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a CbtConcurrencyStats message. Also converts values to other types if specified.
             * @function toObject
             * @memberof cbt.proto.CbtConcurrencyStats
             * @static
             * @param {cbt.proto.CbtConcurrencyStats} message CbtConcurrencyStats
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CbtConcurrencyStats.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.max_minutes = 0;
                    object.used_minutes = 0;
                    object.max_concurrent_selenium_tests = 0;
                    object.active_concurrent_selenium_tests = 0;
                    object.max_screenshot_count_per_test = 0;
                }
                if (message.max_minutes != null && message.hasOwnProperty("max_minutes"))
                    object.max_minutes = message.max_minutes;
                if (message.used_minutes != null && message.hasOwnProperty("used_minutes"))
                    object.used_minutes = message.used_minutes;
                if (message.max_concurrent_selenium_tests != null && message.hasOwnProperty("max_concurrent_selenium_tests"))
                    object.max_concurrent_selenium_tests = message.max_concurrent_selenium_tests;
                if (message.active_concurrent_selenium_tests != null && message.hasOwnProperty("active_concurrent_selenium_tests"))
                    object.active_concurrent_selenium_tests = message.active_concurrent_selenium_tests;
                if (message.max_screenshot_count_per_test != null && message.hasOwnProperty("max_screenshot_count_per_test"))
                    object.max_screenshot_count_per_test = message.max_screenshot_count_per_test;
                return object;
            };

            /**
             * Converts this CbtConcurrencyStats to JSON.
             * @function toJSON
             * @memberof cbt.proto.CbtConcurrencyStats
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CbtConcurrencyStats.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return CbtConcurrencyStats;
        })();

        return proto;
    })();

    return cbt;
})();

$root.selenium = (function() {

    /**
     * Namespace selenium.
     * @exports selenium
     * @namespace
     */
    var selenium = {};

    selenium.proto = (function() {

        /**
         * Namespace proto.
         * @memberof selenium
         * @namespace
         */
        var proto = {};

        proto.RawCapabilities = (function() {

            /**
             * Properties of a RawCapabilities.
             * @memberof selenium.proto
             * @interface IRawCapabilities
             * @property {string|null} [browserName] RawCapabilities browserName
             * @property {string|null} [browserVersion] RawCapabilities browserVersion
             * @property {string|null} [version] RawCapabilities version
             * @property {string|null} [platform] RawCapabilities platform
             * @property {string|null} [platformName] RawCapabilities platformName
             * @property {string|null} [platformVersion] RawCapabilities platformVersion
             * @property {string|null} [name] RawCapabilities name
             * @property {string|null} [build] RawCapabilities build
             * @property {boolean|null} [record_video] RawCapabilities record_video
             * @property {boolean|null} [record_network] RawCapabilities record_network
             * @property {string|null} [deviceName] RawCapabilities deviceName
             * @property {string|null} [deviceOrientation] RawCapabilities deviceOrientation
             * @property {string|null} [screenResolution] RawCapabilities screenResolution
             */

            /**
             * Constructs a new RawCapabilities.
             * @memberof selenium.proto
             * @classdesc Represents a RawCapabilities.
             * @implements IRawCapabilities
             * @constructor
             * @param {selenium.proto.IRawCapabilities=} [properties] Properties to set
             */
            function RawCapabilities(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RawCapabilities browserName.
             * @member {string} browserName
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.browserName = "";

            /**
             * RawCapabilities browserVersion.
             * @member {string} browserVersion
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.browserVersion = "";

            /**
             * RawCapabilities version.
             * @member {string} version
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.version = "";

            /**
             * RawCapabilities platform.
             * @member {string} platform
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.platform = "";

            /**
             * RawCapabilities platformName.
             * @member {string} platformName
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.platformName = "";

            /**
             * RawCapabilities platformVersion.
             * @member {string} platformVersion
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.platformVersion = "";

            /**
             * RawCapabilities name.
             * @member {string} name
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.name = "";

            /**
             * RawCapabilities build.
             * @member {string} build
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.build = "";

            /**
             * RawCapabilities record_video.
             * @member {boolean} record_video
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.record_video = false;

            /**
             * RawCapabilities record_network.
             * @member {boolean} record_network
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.record_network = false;

            /**
             * RawCapabilities deviceName.
             * @member {string} deviceName
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.deviceName = "";

            /**
             * RawCapabilities deviceOrientation.
             * @member {string} deviceOrientation
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.deviceOrientation = "";

            /**
             * RawCapabilities screenResolution.
             * @member {string} screenResolution
             * @memberof selenium.proto.RawCapabilities
             * @instance
             */
            RawCapabilities.prototype.screenResolution = "";

            /**
             * Creates a new RawCapabilities instance using the specified properties.
             * @function create
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {selenium.proto.IRawCapabilities=} [properties] Properties to set
             * @returns {selenium.proto.RawCapabilities} RawCapabilities instance
             */
            RawCapabilities.create = function create(properties) {
                return new RawCapabilities(properties);
            };

            /**
             * Encodes the specified RawCapabilities message. Does not implicitly {@link selenium.proto.RawCapabilities.verify|verify} messages.
             * @function encode
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {selenium.proto.IRawCapabilities} message RawCapabilities message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RawCapabilities.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.browserName != null && message.hasOwnProperty("browserName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.browserName);
                if (message.browserVersion != null && message.hasOwnProperty("browserVersion"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.browserVersion);
                if (message.version != null && message.hasOwnProperty("version"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.version);
                if (message.platform != null && message.hasOwnProperty("platform"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.platform);
                if (message.platformName != null && message.hasOwnProperty("platformName"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.platformName);
                if (message.platformVersion != null && message.hasOwnProperty("platformVersion"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.platformVersion);
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.name);
                if (message.build != null && message.hasOwnProperty("build"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.build);
                if (message.record_video != null && message.hasOwnProperty("record_video"))
                    writer.uint32(/* id 9, wireType 0 =*/72).bool(message.record_video);
                if (message.record_network != null && message.hasOwnProperty("record_network"))
                    writer.uint32(/* id 10, wireType 0 =*/80).bool(message.record_network);
                if (message.deviceName != null && message.hasOwnProperty("deviceName"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.deviceName);
                if (message.deviceOrientation != null && message.hasOwnProperty("deviceOrientation"))
                    writer.uint32(/* id 12, wireType 2 =*/98).string(message.deviceOrientation);
                if (message.screenResolution != null && message.hasOwnProperty("screenResolution"))
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.screenResolution);
                return writer;
            };

            /**
             * Encodes the specified RawCapabilities message, length delimited. Does not implicitly {@link selenium.proto.RawCapabilities.verify|verify} messages.
             * @function encodeDelimited
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {selenium.proto.IRawCapabilities} message RawCapabilities message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RawCapabilities.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RawCapabilities message from the specified reader or buffer.
             * @function decode
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {selenium.proto.RawCapabilities} RawCapabilities
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RawCapabilities.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.selenium.proto.RawCapabilities();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.browserName = reader.string();
                        break;
                    case 2:
                        message.browserVersion = reader.string();
                        break;
                    case 3:
                        message.version = reader.string();
                        break;
                    case 4:
                        message.platform = reader.string();
                        break;
                    case 5:
                        message.platformName = reader.string();
                        break;
                    case 6:
                        message.platformVersion = reader.string();
                        break;
                    case 7:
                        message.name = reader.string();
                        break;
                    case 8:
                        message.build = reader.string();
                        break;
                    case 9:
                        message.record_video = reader.bool();
                        break;
                    case 10:
                        message.record_network = reader.bool();
                        break;
                    case 11:
                        message.deviceName = reader.string();
                        break;
                    case 12:
                        message.deviceOrientation = reader.string();
                        break;
                    case 13:
                        message.screenResolution = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RawCapabilities message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {selenium.proto.RawCapabilities} RawCapabilities
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RawCapabilities.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RawCapabilities message.
             * @function verify
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RawCapabilities.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.browserName != null && message.hasOwnProperty("browserName"))
                    if (!$util.isString(message.browserName))
                        return "browserName: string expected";
                if (message.browserVersion != null && message.hasOwnProperty("browserVersion"))
                    if (!$util.isString(message.browserVersion))
                        return "browserVersion: string expected";
                if (message.version != null && message.hasOwnProperty("version"))
                    if (!$util.isString(message.version))
                        return "version: string expected";
                if (message.platform != null && message.hasOwnProperty("platform"))
                    if (!$util.isString(message.platform))
                        return "platform: string expected";
                if (message.platformName != null && message.hasOwnProperty("platformName"))
                    if (!$util.isString(message.platformName))
                        return "platformName: string expected";
                if (message.platformVersion != null && message.hasOwnProperty("platformVersion"))
                    if (!$util.isString(message.platformVersion))
                        return "platformVersion: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.build != null && message.hasOwnProperty("build"))
                    if (!$util.isString(message.build))
                        return "build: string expected";
                if (message.record_video != null && message.hasOwnProperty("record_video"))
                    if (typeof message.record_video !== "boolean")
                        return "record_video: boolean expected";
                if (message.record_network != null && message.hasOwnProperty("record_network"))
                    if (typeof message.record_network !== "boolean")
                        return "record_network: boolean expected";
                if (message.deviceName != null && message.hasOwnProperty("deviceName"))
                    if (!$util.isString(message.deviceName))
                        return "deviceName: string expected";
                if (message.deviceOrientation != null && message.hasOwnProperty("deviceOrientation"))
                    if (!$util.isString(message.deviceOrientation))
                        return "deviceOrientation: string expected";
                if (message.screenResolution != null && message.hasOwnProperty("screenResolution"))
                    if (!$util.isString(message.screenResolution))
                        return "screenResolution: string expected";
                return null;
            };

            /**
             * Creates a RawCapabilities message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {selenium.proto.RawCapabilities} RawCapabilities
             */
            RawCapabilities.fromObject = function fromObject(object) {
                if (object instanceof $root.selenium.proto.RawCapabilities)
                    return object;
                var message = new $root.selenium.proto.RawCapabilities();
                if (object.browserName != null)
                    message.browserName = String(object.browserName);
                if (object.browserVersion != null)
                    message.browserVersion = String(object.browserVersion);
                if (object.version != null)
                    message.version = String(object.version);
                if (object.platform != null)
                    message.platform = String(object.platform);
                if (object.platformName != null)
                    message.platformName = String(object.platformName);
                if (object.platformVersion != null)
                    message.platformVersion = String(object.platformVersion);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.build != null)
                    message.build = String(object.build);
                if (object.record_video != null)
                    message.record_video = Boolean(object.record_video);
                if (object.record_network != null)
                    message.record_network = Boolean(object.record_network);
                if (object.deviceName != null)
                    message.deviceName = String(object.deviceName);
                if (object.deviceOrientation != null)
                    message.deviceOrientation = String(object.deviceOrientation);
                if (object.screenResolution != null)
                    message.screenResolution = String(object.screenResolution);
                return message;
            };

            /**
             * Creates a plain object from a RawCapabilities message. Also converts values to other types if specified.
             * @function toObject
             * @memberof selenium.proto.RawCapabilities
             * @static
             * @param {selenium.proto.RawCapabilities} message RawCapabilities
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RawCapabilities.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.browserName = "";
                    object.browserVersion = "";
                    object.version = "";
                    object.platform = "";
                    object.platformName = "";
                    object.platformVersion = "";
                    object.name = "";
                    object.build = "";
                    object.record_video = false;
                    object.record_network = false;
                    object.deviceName = "";
                    object.deviceOrientation = "";
                    object.screenResolution = "";
                }
                if (message.browserName != null && message.hasOwnProperty("browserName"))
                    object.browserName = message.browserName;
                if (message.browserVersion != null && message.hasOwnProperty("browserVersion"))
                    object.browserVersion = message.browserVersion;
                if (message.version != null && message.hasOwnProperty("version"))
                    object.version = message.version;
                if (message.platform != null && message.hasOwnProperty("platform"))
                    object.platform = message.platform;
                if (message.platformName != null && message.hasOwnProperty("platformName"))
                    object.platformName = message.platformName;
                if (message.platformVersion != null && message.hasOwnProperty("platformVersion"))
                    object.platformVersion = message.platformVersion;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.build != null && message.hasOwnProperty("build"))
                    object.build = message.build;
                if (message.record_video != null && message.hasOwnProperty("record_video"))
                    object.record_video = message.record_video;
                if (message.record_network != null && message.hasOwnProperty("record_network"))
                    object.record_network = message.record_network;
                if (message.deviceName != null && message.hasOwnProperty("deviceName"))
                    object.deviceName = message.deviceName;
                if (message.deviceOrientation != null && message.hasOwnProperty("deviceOrientation"))
                    object.deviceOrientation = message.deviceOrientation;
                if (message.screenResolution != null && message.hasOwnProperty("screenResolution"))
                    object.screenResolution = message.screenResolution;
                return object;
            };

            /**
             * Converts this RawCapabilities to JSON.
             * @function toJSON
             * @memberof selenium.proto.RawCapabilities
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RawCapabilities.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return RawCapabilities;
        })();

        return proto;
    })();

    return selenium;
})();

module.exports = $root;
