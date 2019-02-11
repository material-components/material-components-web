/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.github = (function() {

    /**
     * Namespace github.
     * @exports github
     * @namespace
     */
    var github = {};

    github.proto = (function() {

        /**
         * Namespace proto.
         * @memberof github
         * @namespace
         */
        var proto = {};

        proto.PullRequestFileResponse = (function() {

            /**
             * Properties of a PullRequestFileResponse.
             * @memberof github.proto
             * @interface IPullRequestFileResponse
             * @property {Array.<github.proto.IPullRequestFile>|null} [data] PullRequestFileResponse data
             */

            /**
             * Constructs a new PullRequestFileResponse.
             * @memberof github.proto
             * @classdesc Represents a PullRequestFileResponse.
             * @implements IPullRequestFileResponse
             * @constructor
             * @param {github.proto.IPullRequestFileResponse=} [properties] Properties to set
             */
            function PullRequestFileResponse(properties) {
                this.data = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PullRequestFileResponse data.
             * @member {Array.<github.proto.IPullRequestFile>} data
             * @memberof github.proto.PullRequestFileResponse
             * @instance
             */
            PullRequestFileResponse.prototype.data = $util.emptyArray;

            /**
             * Creates a new PullRequestFileResponse instance using the specified properties.
             * @function create
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {github.proto.IPullRequestFileResponse=} [properties] Properties to set
             * @returns {github.proto.PullRequestFileResponse} PullRequestFileResponse instance
             */
            PullRequestFileResponse.create = function create(properties) {
                return new PullRequestFileResponse(properties);
            };

            /**
             * Encodes the specified PullRequestFileResponse message. Does not implicitly {@link github.proto.PullRequestFileResponse.verify|verify} messages.
             * @function encode
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {github.proto.IPullRequestFileResponse} message PullRequestFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PullRequestFileResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.data != null && message.data.length)
                    for (var i = 0; i < message.data.length; ++i)
                        $root.github.proto.PullRequestFile.encode(message.data[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified PullRequestFileResponse message, length delimited. Does not implicitly {@link github.proto.PullRequestFileResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {github.proto.IPullRequestFileResponse} message PullRequestFileResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PullRequestFileResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PullRequestFileResponse message from the specified reader or buffer.
             * @function decode
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {github.proto.PullRequestFileResponse} PullRequestFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PullRequestFileResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.github.proto.PullRequestFileResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.data && message.data.length))
                            message.data = [];
                        message.data.push($root.github.proto.PullRequestFile.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PullRequestFileResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {github.proto.PullRequestFileResponse} PullRequestFileResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PullRequestFileResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PullRequestFileResponse message.
             * @function verify
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PullRequestFileResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.data != null && message.hasOwnProperty("data")) {
                    if (!Array.isArray(message.data))
                        return "data: array expected";
                    for (var i = 0; i < message.data.length; ++i) {
                        var error = $root.github.proto.PullRequestFile.verify(message.data[i]);
                        if (error)
                            return "data." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a PullRequestFileResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {github.proto.PullRequestFileResponse} PullRequestFileResponse
             */
            PullRequestFileResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.github.proto.PullRequestFileResponse)
                    return object;
                var message = new $root.github.proto.PullRequestFileResponse();
                if (object.data) {
                    if (!Array.isArray(object.data))
                        throw TypeError(".github.proto.PullRequestFileResponse.data: array expected");
                    message.data = [];
                    for (var i = 0; i < object.data.length; ++i) {
                        if (typeof object.data[i] !== "object")
                            throw TypeError(".github.proto.PullRequestFileResponse.data: object expected");
                        message.data[i] = $root.github.proto.PullRequestFile.fromObject(object.data[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a PullRequestFileResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof github.proto.PullRequestFileResponse
             * @static
             * @param {github.proto.PullRequestFileResponse} message PullRequestFileResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PullRequestFileResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.data = [];
                if (message.data && message.data.length) {
                    object.data = [];
                    for (var j = 0; j < message.data.length; ++j)
                        object.data[j] = $root.github.proto.PullRequestFile.toObject(message.data[j], options);
                }
                return object;
            };

            /**
             * Converts this PullRequestFileResponse to JSON.
             * @function toJSON
             * @memberof github.proto.PullRequestFileResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PullRequestFileResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return PullRequestFileResponse;
        })();

        proto.PullRequestFile = (function() {

            /**
             * Properties of a PullRequestFile.
             * @memberof github.proto
             * @interface IPullRequestFile
             * @property {string|null} [sha] PullRequestFile sha
             * @property {string|null} [filename] PullRequestFile filename
             * @property {string|null} [status] PullRequestFile status
             * @property {number|null} [additions] PullRequestFile additions
             * @property {number|null} [deletions] PullRequestFile deletions
             * @property {number|null} [changes] PullRequestFile changes
             * @property {string|null} [blob_url] PullRequestFile blob_url
             * @property {string|null} [raw_url] PullRequestFile raw_url
             * @property {string|null} [contents_url] PullRequestFile contents_url
             * @property {string|null} [patch] PullRequestFile patch
             */

            /**
             * Constructs a new PullRequestFile.
             * @memberof github.proto
             * @classdesc Represents a PullRequestFile.
             * @implements IPullRequestFile
             * @constructor
             * @param {github.proto.IPullRequestFile=} [properties] Properties to set
             */
            function PullRequestFile(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * PullRequestFile sha.
             * @member {string} sha
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.sha = "";

            /**
             * PullRequestFile filename.
             * @member {string} filename
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.filename = "";

            /**
             * PullRequestFile status.
             * @member {string} status
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.status = "";

            /**
             * PullRequestFile additions.
             * @member {number} additions
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.additions = 0;

            /**
             * PullRequestFile deletions.
             * @member {number} deletions
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.deletions = 0;

            /**
             * PullRequestFile changes.
             * @member {number} changes
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.changes = 0;

            /**
             * PullRequestFile blob_url.
             * @member {string} blob_url
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.blob_url = "";

            /**
             * PullRequestFile raw_url.
             * @member {string} raw_url
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.raw_url = "";

            /**
             * PullRequestFile contents_url.
             * @member {string} contents_url
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.contents_url = "";

            /**
             * PullRequestFile patch.
             * @member {string} patch
             * @memberof github.proto.PullRequestFile
             * @instance
             */
            PullRequestFile.prototype.patch = "";

            /**
             * Creates a new PullRequestFile instance using the specified properties.
             * @function create
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {github.proto.IPullRequestFile=} [properties] Properties to set
             * @returns {github.proto.PullRequestFile} PullRequestFile instance
             */
            PullRequestFile.create = function create(properties) {
                return new PullRequestFile(properties);
            };

            /**
             * Encodes the specified PullRequestFile message. Does not implicitly {@link github.proto.PullRequestFile.verify|verify} messages.
             * @function encode
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {github.proto.IPullRequestFile} message PullRequestFile message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PullRequestFile.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.sha != null && message.hasOwnProperty("sha"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.sha);
                if (message.filename != null && message.hasOwnProperty("filename"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.filename);
                if (message.status != null && message.hasOwnProperty("status"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.status);
                if (message.additions != null && message.hasOwnProperty("additions"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.additions);
                if (message.deletions != null && message.hasOwnProperty("deletions"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.deletions);
                if (message.changes != null && message.hasOwnProperty("changes"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.changes);
                if (message.blob_url != null && message.hasOwnProperty("blob_url"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.blob_url);
                if (message.raw_url != null && message.hasOwnProperty("raw_url"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.raw_url);
                if (message.contents_url != null && message.hasOwnProperty("contents_url"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.contents_url);
                if (message.patch != null && message.hasOwnProperty("patch"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.patch);
                return writer;
            };

            /**
             * Encodes the specified PullRequestFile message, length delimited. Does not implicitly {@link github.proto.PullRequestFile.verify|verify} messages.
             * @function encodeDelimited
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {github.proto.IPullRequestFile} message PullRequestFile message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            PullRequestFile.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a PullRequestFile message from the specified reader or buffer.
             * @function decode
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {github.proto.PullRequestFile} PullRequestFile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PullRequestFile.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.github.proto.PullRequestFile();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.sha = reader.string();
                        break;
                    case 2:
                        message.filename = reader.string();
                        break;
                    case 3:
                        message.status = reader.string();
                        break;
                    case 4:
                        message.additions = reader.uint32();
                        break;
                    case 5:
                        message.deletions = reader.uint32();
                        break;
                    case 6:
                        message.changes = reader.uint32();
                        break;
                    case 7:
                        message.blob_url = reader.string();
                        break;
                    case 8:
                        message.raw_url = reader.string();
                        break;
                    case 9:
                        message.contents_url = reader.string();
                        break;
                    case 10:
                        message.patch = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a PullRequestFile message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {github.proto.PullRequestFile} PullRequestFile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            PullRequestFile.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a PullRequestFile message.
             * @function verify
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            PullRequestFile.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.sha != null && message.hasOwnProperty("sha"))
                    if (!$util.isString(message.sha))
                        return "sha: string expected";
                if (message.filename != null && message.hasOwnProperty("filename"))
                    if (!$util.isString(message.filename))
                        return "filename: string expected";
                if (message.status != null && message.hasOwnProperty("status"))
                    if (!$util.isString(message.status))
                        return "status: string expected";
                if (message.additions != null && message.hasOwnProperty("additions"))
                    if (!$util.isInteger(message.additions))
                        return "additions: integer expected";
                if (message.deletions != null && message.hasOwnProperty("deletions"))
                    if (!$util.isInteger(message.deletions))
                        return "deletions: integer expected";
                if (message.changes != null && message.hasOwnProperty("changes"))
                    if (!$util.isInteger(message.changes))
                        return "changes: integer expected";
                if (message.blob_url != null && message.hasOwnProperty("blob_url"))
                    if (!$util.isString(message.blob_url))
                        return "blob_url: string expected";
                if (message.raw_url != null && message.hasOwnProperty("raw_url"))
                    if (!$util.isString(message.raw_url))
                        return "raw_url: string expected";
                if (message.contents_url != null && message.hasOwnProperty("contents_url"))
                    if (!$util.isString(message.contents_url))
                        return "contents_url: string expected";
                if (message.patch != null && message.hasOwnProperty("patch"))
                    if (!$util.isString(message.patch))
                        return "patch: string expected";
                return null;
            };

            /**
             * Creates a PullRequestFile message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {github.proto.PullRequestFile} PullRequestFile
             */
            PullRequestFile.fromObject = function fromObject(object) {
                if (object instanceof $root.github.proto.PullRequestFile)
                    return object;
                var message = new $root.github.proto.PullRequestFile();
                if (object.sha != null)
                    message.sha = String(object.sha);
                if (object.filename != null)
                    message.filename = String(object.filename);
                if (object.status != null)
                    message.status = String(object.status);
                if (object.additions != null)
                    message.additions = object.additions >>> 0;
                if (object.deletions != null)
                    message.deletions = object.deletions >>> 0;
                if (object.changes != null)
                    message.changes = object.changes >>> 0;
                if (object.blob_url != null)
                    message.blob_url = String(object.blob_url);
                if (object.raw_url != null)
                    message.raw_url = String(object.raw_url);
                if (object.contents_url != null)
                    message.contents_url = String(object.contents_url);
                if (object.patch != null)
                    message.patch = String(object.patch);
                return message;
            };

            /**
             * Creates a plain object from a PullRequestFile message. Also converts values to other types if specified.
             * @function toObject
             * @memberof github.proto.PullRequestFile
             * @static
             * @param {github.proto.PullRequestFile} message PullRequestFile
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            PullRequestFile.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.sha = "";
                    object.filename = "";
                    object.status = "";
                    object.additions = 0;
                    object.deletions = 0;
                    object.changes = 0;
                    object.blob_url = "";
                    object.raw_url = "";
                    object.contents_url = "";
                    object.patch = "";
                }
                if (message.sha != null && message.hasOwnProperty("sha"))
                    object.sha = message.sha;
                if (message.filename != null && message.hasOwnProperty("filename"))
                    object.filename = message.filename;
                if (message.status != null && message.hasOwnProperty("status"))
                    object.status = message.status;
                if (message.additions != null && message.hasOwnProperty("additions"))
                    object.additions = message.additions;
                if (message.deletions != null && message.hasOwnProperty("deletions"))
                    object.deletions = message.deletions;
                if (message.changes != null && message.hasOwnProperty("changes"))
                    object.changes = message.changes;
                if (message.blob_url != null && message.hasOwnProperty("blob_url"))
                    object.blob_url = message.blob_url;
                if (message.raw_url != null && message.hasOwnProperty("raw_url"))
                    object.raw_url = message.raw_url;
                if (message.contents_url != null && message.hasOwnProperty("contents_url"))
                    object.contents_url = message.contents_url;
                if (message.patch != null && message.hasOwnProperty("patch"))
                    object.patch = message.patch;
                return object;
            };

            /**
             * Converts this PullRequestFile to JSON.
             * @function toJSON
             * @memberof github.proto.PullRequestFile
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            PullRequestFile.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return PullRequestFile;
        })();

        return proto;
    })();

    return github;
})();

module.exports = $root;
