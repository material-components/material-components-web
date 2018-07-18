/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

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
