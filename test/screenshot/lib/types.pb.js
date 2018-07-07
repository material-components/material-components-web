/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.mdc = (function() {

    /**
     * Namespace mdc.
     * @exports mdc
     * @namespace
     */
    var mdc = {};

    mdc.test = (function() {

        /**
         * Namespace test.
         * @memberof mdc
         * @namespace
         */
        var test = {};

        test.screenshot = (function() {

            /**
             * Namespace screenshot.
             * @memberof mdc.test
             * @namespace
             */
            var screenshot = {};

            screenshot.ReportData = (function() {

                /**
                 * Properties of a ReportData.
                 * @memberof mdc.test.screenshot
                 * @interface IReportData
                 * @property {mdc.test.screenshot.IReportMeta|null} [meta] ReportData meta
                 * @property {mdc.test.screenshot.IUserAgents|null} [user_agents] ReportData user_agents
                 * @property {mdc.test.screenshot.IScreenshots|null} [screenshots] ReportData screenshots
                 * @property {mdc.test.screenshot.IApprovals|null} [approvals] ReportData approvals
                 */

                /**
                 * Constructs a new ReportData.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a ReportData.
                 * @implements IReportData
                 * @constructor
                 * @param {mdc.test.screenshot.IReportData=} [properties] Properties to set
                 */
                function ReportData(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ReportData meta.
                 * @member {mdc.test.screenshot.IReportMeta|null|undefined} meta
                 * @memberof mdc.test.screenshot.ReportData
                 * @instance
                 */
                ReportData.prototype.meta = null;

                /**
                 * ReportData user_agents.
                 * @member {mdc.test.screenshot.IUserAgents|null|undefined} user_agents
                 * @memberof mdc.test.screenshot.ReportData
                 * @instance
                 */
                ReportData.prototype.user_agents = null;

                /**
                 * ReportData screenshots.
                 * @member {mdc.test.screenshot.IScreenshots|null|undefined} screenshots
                 * @memberof mdc.test.screenshot.ReportData
                 * @instance
                 */
                ReportData.prototype.screenshots = null;

                /**
                 * ReportData approvals.
                 * @member {mdc.test.screenshot.IApprovals|null|undefined} approvals
                 * @memberof mdc.test.screenshot.ReportData
                 * @instance
                 */
                ReportData.prototype.approvals = null;

                /**
                 * Creates a new ReportData instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {mdc.test.screenshot.IReportData=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.ReportData} ReportData instance
                 */
                ReportData.create = function create(properties) {
                    return new ReportData(properties);
                };

                /**
                 * Encodes the specified ReportData message. Does not implicitly {@link mdc.test.screenshot.ReportData.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {mdc.test.screenshot.IReportData} message ReportData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReportData.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.meta != null && message.hasOwnProperty("meta"))
                        $root.mdc.test.screenshot.ReportMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.user_agents != null && message.hasOwnProperty("user_agents"))
                        $root.mdc.test.screenshot.UserAgents.encode(message.user_agents, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                        $root.mdc.test.screenshot.Screenshots.encode(message.screenshots, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.approvals != null && message.hasOwnProperty("approvals"))
                        $root.mdc.test.screenshot.Approvals.encode(message.approvals, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ReportData message, length delimited. Does not implicitly {@link mdc.test.screenshot.ReportData.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {mdc.test.screenshot.IReportData} message ReportData message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReportData.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ReportData message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.ReportData} ReportData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ReportData.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.ReportData();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.meta = $root.mdc.test.screenshot.ReportMeta.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.user_agents = $root.mdc.test.screenshot.UserAgents.decode(reader, reader.uint32());
                            break;
                        case 3:
                            message.screenshots = $root.mdc.test.screenshot.Screenshots.decode(reader, reader.uint32());
                            break;
                        case 4:
                            message.approvals = $root.mdc.test.screenshot.Approvals.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ReportData message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.ReportData} ReportData
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ReportData.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ReportData message.
                 * @function verify
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ReportData.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.meta != null && message.hasOwnProperty("meta")) {
                        var error = $root.mdc.test.screenshot.ReportMeta.verify(message.meta);
                        if (error)
                            return "meta." + error;
                    }
                    if (message.user_agents != null && message.hasOwnProperty("user_agents")) {
                        var error = $root.mdc.test.screenshot.UserAgents.verify(message.user_agents);
                        if (error)
                            return "user_agents." + error;
                    }
                    if (message.screenshots != null && message.hasOwnProperty("screenshots")) {
                        var error = $root.mdc.test.screenshot.Screenshots.verify(message.screenshots);
                        if (error)
                            return "screenshots." + error;
                    }
                    if (message.approvals != null && message.hasOwnProperty("approvals")) {
                        var error = $root.mdc.test.screenshot.Approvals.verify(message.approvals);
                        if (error)
                            return "approvals." + error;
                    }
                    return null;
                };

                /**
                 * Creates a ReportData message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.ReportData} ReportData
                 */
                ReportData.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.ReportData)
                        return object;
                    var message = new $root.mdc.test.screenshot.ReportData();
                    if (object.meta != null) {
                        if (typeof object.meta !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportData.meta: object expected");
                        message.meta = $root.mdc.test.screenshot.ReportMeta.fromObject(object.meta);
                    }
                    if (object.user_agents != null) {
                        if (typeof object.user_agents !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportData.user_agents: object expected");
                        message.user_agents = $root.mdc.test.screenshot.UserAgents.fromObject(object.user_agents);
                    }
                    if (object.screenshots != null) {
                        if (typeof object.screenshots !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportData.screenshots: object expected");
                        message.screenshots = $root.mdc.test.screenshot.Screenshots.fromObject(object.screenshots);
                    }
                    if (object.approvals != null) {
                        if (typeof object.approvals !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportData.approvals: object expected");
                        message.approvals = $root.mdc.test.screenshot.Approvals.fromObject(object.approvals);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ReportData message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.ReportData
                 * @static
                 * @param {mdc.test.screenshot.ReportData} message ReportData
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReportData.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.meta = null;
                        object.user_agents = null;
                        object.screenshots = null;
                        object.approvals = null;
                    }
                    if (message.meta != null && message.hasOwnProperty("meta"))
                        object.meta = $root.mdc.test.screenshot.ReportMeta.toObject(message.meta, options);
                    if (message.user_agents != null && message.hasOwnProperty("user_agents"))
                        object.user_agents = $root.mdc.test.screenshot.UserAgents.toObject(message.user_agents, options);
                    if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                        object.screenshots = $root.mdc.test.screenshot.Screenshots.toObject(message.screenshots, options);
                    if (message.approvals != null && message.hasOwnProperty("approvals"))
                        object.approvals = $root.mdc.test.screenshot.Approvals.toObject(message.approvals, options);
                    return object;
                };

                /**
                 * Converts this ReportData to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.ReportData
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ReportData.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ReportData;
            })();

            screenshot.ReportMeta = (function() {

                /**
                 * Properties of a ReportMeta.
                 * @memberof mdc.test.screenshot
                 * @interface IReportMeta
                 * @property {boolean|null} [is_online] ReportMeta is_online
                 * @property {number|Long|null} [start_time] ReportMeta start_time
                 * @property {number|Long|null} [end_time] ReportMeta end_time
                 * @property {number|Long|null} [duration] ReportMeta duration
                 * @property {string|null} [remote_upload_base_dir] ReportMeta remote_upload_base_dir
                 * @property {string|null} [remote_upload_base_url] ReportMeta remote_upload_base_url
                 * @property {string|null} [local_asset_base_dir] ReportMeta local_asset_base_dir
                 * @property {string|null} [local_screenshot_image_base_dir] ReportMeta local_screenshot_image_base_dir
                 * @property {string|null} [local_diff_image_base_dir] ReportMeta local_diff_image_base_dir
                 * @property {string|null} [local_report_base_dir] ReportMeta local_report_base_dir
                 * @property {string|null} [cli_invocation] ReportMeta cli_invocation
                 * @property {mdc.test.screenshot.IDiffBase|null} [diff_base] ReportMeta diff_base
                 * @property {mdc.test.screenshot.IUser|null} [user] ReportMeta user
                 * @property {mdc.test.screenshot.ILibraryVersion|null} [node_version] ReportMeta node_version
                 * @property {mdc.test.screenshot.ILibraryVersion|null} [npm_version] ReportMeta npm_version
                 * @property {mdc.test.screenshot.ILibraryVersion|null} [mdc_version] ReportMeta mdc_version
                 */

                /**
                 * Constructs a new ReportMeta.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a ReportMeta.
                 * @implements IReportMeta
                 * @constructor
                 * @param {mdc.test.screenshot.IReportMeta=} [properties] Properties to set
                 */
                function ReportMeta(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ReportMeta is_online.
                 * @member {boolean} is_online
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.is_online = false;

                /**
                 * ReportMeta start_time.
                 * @member {number|Long} start_time
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.start_time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * ReportMeta end_time.
                 * @member {number|Long} end_time
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.end_time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * ReportMeta duration.
                 * @member {number|Long} duration
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.duration = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * ReportMeta remote_upload_base_dir.
                 * @member {string} remote_upload_base_dir
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.remote_upload_base_dir = "";

                /**
                 * ReportMeta remote_upload_base_url.
                 * @member {string} remote_upload_base_url
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.remote_upload_base_url = "";

                /**
                 * ReportMeta local_asset_base_dir.
                 * @member {string} local_asset_base_dir
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.local_asset_base_dir = "";

                /**
                 * ReportMeta local_screenshot_image_base_dir.
                 * @member {string} local_screenshot_image_base_dir
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.local_screenshot_image_base_dir = "";

                /**
                 * ReportMeta local_diff_image_base_dir.
                 * @member {string} local_diff_image_base_dir
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.local_diff_image_base_dir = "";

                /**
                 * ReportMeta local_report_base_dir.
                 * @member {string} local_report_base_dir
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.local_report_base_dir = "";

                /**
                 * ReportMeta cli_invocation.
                 * @member {string} cli_invocation
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.cli_invocation = "";

                /**
                 * ReportMeta diff_base.
                 * @member {mdc.test.screenshot.IDiffBase|null|undefined} diff_base
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.diff_base = null;

                /**
                 * ReportMeta user.
                 * @member {mdc.test.screenshot.IUser|null|undefined} user
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.user = null;

                /**
                 * ReportMeta node_version.
                 * @member {mdc.test.screenshot.ILibraryVersion|null|undefined} node_version
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.node_version = null;

                /**
                 * ReportMeta npm_version.
                 * @member {mdc.test.screenshot.ILibraryVersion|null|undefined} npm_version
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.npm_version = null;

                /**
                 * ReportMeta mdc_version.
                 * @member {mdc.test.screenshot.ILibraryVersion|null|undefined} mdc_version
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 */
                ReportMeta.prototype.mdc_version = null;

                /**
                 * Creates a new ReportMeta instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {mdc.test.screenshot.IReportMeta=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.ReportMeta} ReportMeta instance
                 */
                ReportMeta.create = function create(properties) {
                    return new ReportMeta(properties);
                };

                /**
                 * Encodes the specified ReportMeta message. Does not implicitly {@link mdc.test.screenshot.ReportMeta.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {mdc.test.screenshot.IReportMeta} message ReportMeta message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReportMeta.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.is_online != null && message.hasOwnProperty("is_online"))
                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.is_online);
                    if (message.start_time != null && message.hasOwnProperty("start_time"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.start_time);
                    if (message.end_time != null && message.hasOwnProperty("end_time"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.end_time);
                    if (message.duration != null && message.hasOwnProperty("duration"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.duration);
                    if (message.remote_upload_base_dir != null && message.hasOwnProperty("remote_upload_base_dir"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.remote_upload_base_dir);
                    if (message.remote_upload_base_url != null && message.hasOwnProperty("remote_upload_base_url"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.remote_upload_base_url);
                    if (message.local_asset_base_dir != null && message.hasOwnProperty("local_asset_base_dir"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.local_asset_base_dir);
                    if (message.local_screenshot_image_base_dir != null && message.hasOwnProperty("local_screenshot_image_base_dir"))
                        writer.uint32(/* id 8, wireType 2 =*/66).string(message.local_screenshot_image_base_dir);
                    if (message.local_diff_image_base_dir != null && message.hasOwnProperty("local_diff_image_base_dir"))
                        writer.uint32(/* id 9, wireType 2 =*/74).string(message.local_diff_image_base_dir);
                    if (message.local_report_base_dir != null && message.hasOwnProperty("local_report_base_dir"))
                        writer.uint32(/* id 10, wireType 2 =*/82).string(message.local_report_base_dir);
                    if (message.cli_invocation != null && message.hasOwnProperty("cli_invocation"))
                        writer.uint32(/* id 11, wireType 2 =*/90).string(message.cli_invocation);
                    if (message.diff_base != null && message.hasOwnProperty("diff_base"))
                        $root.mdc.test.screenshot.DiffBase.encode(message.diff_base, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                    if (message.user != null && message.hasOwnProperty("user"))
                        $root.mdc.test.screenshot.User.encode(message.user, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                    if (message.node_version != null && message.hasOwnProperty("node_version"))
                        $root.mdc.test.screenshot.LibraryVersion.encode(message.node_version, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
                    if (message.npm_version != null && message.hasOwnProperty("npm_version"))
                        $root.mdc.test.screenshot.LibraryVersion.encode(message.npm_version, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                    if (message.mdc_version != null && message.hasOwnProperty("mdc_version"))
                        $root.mdc.test.screenshot.LibraryVersion.encode(message.mdc_version, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ReportMeta message, length delimited. Does not implicitly {@link mdc.test.screenshot.ReportMeta.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {mdc.test.screenshot.IReportMeta} message ReportMeta message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ReportMeta.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ReportMeta message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.ReportMeta} ReportMeta
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ReportMeta.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.ReportMeta();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.is_online = reader.bool();
                            break;
                        case 2:
                            message.start_time = reader.uint64();
                            break;
                        case 3:
                            message.end_time = reader.uint64();
                            break;
                        case 4:
                            message.duration = reader.uint64();
                            break;
                        case 5:
                            message.remote_upload_base_dir = reader.string();
                            break;
                        case 6:
                            message.remote_upload_base_url = reader.string();
                            break;
                        case 7:
                            message.local_asset_base_dir = reader.string();
                            break;
                        case 8:
                            message.local_screenshot_image_base_dir = reader.string();
                            break;
                        case 9:
                            message.local_diff_image_base_dir = reader.string();
                            break;
                        case 10:
                            message.local_report_base_dir = reader.string();
                            break;
                        case 11:
                            message.cli_invocation = reader.string();
                            break;
                        case 12:
                            message.diff_base = $root.mdc.test.screenshot.DiffBase.decode(reader, reader.uint32());
                            break;
                        case 13:
                            message.user = $root.mdc.test.screenshot.User.decode(reader, reader.uint32());
                            break;
                        case 14:
                            message.node_version = $root.mdc.test.screenshot.LibraryVersion.decode(reader, reader.uint32());
                            break;
                        case 15:
                            message.npm_version = $root.mdc.test.screenshot.LibraryVersion.decode(reader, reader.uint32());
                            break;
                        case 16:
                            message.mdc_version = $root.mdc.test.screenshot.LibraryVersion.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ReportMeta message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.ReportMeta} ReportMeta
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ReportMeta.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ReportMeta message.
                 * @function verify
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ReportMeta.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.is_online != null && message.hasOwnProperty("is_online"))
                        if (typeof message.is_online !== "boolean")
                            return "is_online: boolean expected";
                    if (message.start_time != null && message.hasOwnProperty("start_time"))
                        if (!$util.isInteger(message.start_time) && !(message.start_time && $util.isInteger(message.start_time.low) && $util.isInteger(message.start_time.high)))
                            return "start_time: integer|Long expected";
                    if (message.end_time != null && message.hasOwnProperty("end_time"))
                        if (!$util.isInteger(message.end_time) && !(message.end_time && $util.isInteger(message.end_time.low) && $util.isInteger(message.end_time.high)))
                            return "end_time: integer|Long expected";
                    if (message.duration != null && message.hasOwnProperty("duration"))
                        if (!$util.isInteger(message.duration) && !(message.duration && $util.isInteger(message.duration.low) && $util.isInteger(message.duration.high)))
                            return "duration: integer|Long expected";
                    if (message.remote_upload_base_dir != null && message.hasOwnProperty("remote_upload_base_dir"))
                        if (!$util.isString(message.remote_upload_base_dir))
                            return "remote_upload_base_dir: string expected";
                    if (message.remote_upload_base_url != null && message.hasOwnProperty("remote_upload_base_url"))
                        if (!$util.isString(message.remote_upload_base_url))
                            return "remote_upload_base_url: string expected";
                    if (message.local_asset_base_dir != null && message.hasOwnProperty("local_asset_base_dir"))
                        if (!$util.isString(message.local_asset_base_dir))
                            return "local_asset_base_dir: string expected";
                    if (message.local_screenshot_image_base_dir != null && message.hasOwnProperty("local_screenshot_image_base_dir"))
                        if (!$util.isString(message.local_screenshot_image_base_dir))
                            return "local_screenshot_image_base_dir: string expected";
                    if (message.local_diff_image_base_dir != null && message.hasOwnProperty("local_diff_image_base_dir"))
                        if (!$util.isString(message.local_diff_image_base_dir))
                            return "local_diff_image_base_dir: string expected";
                    if (message.local_report_base_dir != null && message.hasOwnProperty("local_report_base_dir"))
                        if (!$util.isString(message.local_report_base_dir))
                            return "local_report_base_dir: string expected";
                    if (message.cli_invocation != null && message.hasOwnProperty("cli_invocation"))
                        if (!$util.isString(message.cli_invocation))
                            return "cli_invocation: string expected";
                    if (message.diff_base != null && message.hasOwnProperty("diff_base")) {
                        var error = $root.mdc.test.screenshot.DiffBase.verify(message.diff_base);
                        if (error)
                            return "diff_base." + error;
                    }
                    if (message.user != null && message.hasOwnProperty("user")) {
                        var error = $root.mdc.test.screenshot.User.verify(message.user);
                        if (error)
                            return "user." + error;
                    }
                    if (message.node_version != null && message.hasOwnProperty("node_version")) {
                        var error = $root.mdc.test.screenshot.LibraryVersion.verify(message.node_version);
                        if (error)
                            return "node_version." + error;
                    }
                    if (message.npm_version != null && message.hasOwnProperty("npm_version")) {
                        var error = $root.mdc.test.screenshot.LibraryVersion.verify(message.npm_version);
                        if (error)
                            return "npm_version." + error;
                    }
                    if (message.mdc_version != null && message.hasOwnProperty("mdc_version")) {
                        var error = $root.mdc.test.screenshot.LibraryVersion.verify(message.mdc_version);
                        if (error)
                            return "mdc_version." + error;
                    }
                    return null;
                };

                /**
                 * Creates a ReportMeta message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.ReportMeta} ReportMeta
                 */
                ReportMeta.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.ReportMeta)
                        return object;
                    var message = new $root.mdc.test.screenshot.ReportMeta();
                    if (object.is_online != null)
                        message.is_online = Boolean(object.is_online);
                    if (object.start_time != null)
                        if ($util.Long)
                            (message.start_time = $util.Long.fromValue(object.start_time)).unsigned = true;
                        else if (typeof object.start_time === "string")
                            message.start_time = parseInt(object.start_time, 10);
                        else if (typeof object.start_time === "number")
                            message.start_time = object.start_time;
                        else if (typeof object.start_time === "object")
                            message.start_time = new $util.LongBits(object.start_time.low >>> 0, object.start_time.high >>> 0).toNumber(true);
                    if (object.end_time != null)
                        if ($util.Long)
                            (message.end_time = $util.Long.fromValue(object.end_time)).unsigned = true;
                        else if (typeof object.end_time === "string")
                            message.end_time = parseInt(object.end_time, 10);
                        else if (typeof object.end_time === "number")
                            message.end_time = object.end_time;
                        else if (typeof object.end_time === "object")
                            message.end_time = new $util.LongBits(object.end_time.low >>> 0, object.end_time.high >>> 0).toNumber(true);
                    if (object.duration != null)
                        if ($util.Long)
                            (message.duration = $util.Long.fromValue(object.duration)).unsigned = true;
                        else if (typeof object.duration === "string")
                            message.duration = parseInt(object.duration, 10);
                        else if (typeof object.duration === "number")
                            message.duration = object.duration;
                        else if (typeof object.duration === "object")
                            message.duration = new $util.LongBits(object.duration.low >>> 0, object.duration.high >>> 0).toNumber(true);
                    if (object.remote_upload_base_dir != null)
                        message.remote_upload_base_dir = String(object.remote_upload_base_dir);
                    if (object.remote_upload_base_url != null)
                        message.remote_upload_base_url = String(object.remote_upload_base_url);
                    if (object.local_asset_base_dir != null)
                        message.local_asset_base_dir = String(object.local_asset_base_dir);
                    if (object.local_screenshot_image_base_dir != null)
                        message.local_screenshot_image_base_dir = String(object.local_screenshot_image_base_dir);
                    if (object.local_diff_image_base_dir != null)
                        message.local_diff_image_base_dir = String(object.local_diff_image_base_dir);
                    if (object.local_report_base_dir != null)
                        message.local_report_base_dir = String(object.local_report_base_dir);
                    if (object.cli_invocation != null)
                        message.cli_invocation = String(object.cli_invocation);
                    if (object.diff_base != null) {
                        if (typeof object.diff_base !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportMeta.diff_base: object expected");
                        message.diff_base = $root.mdc.test.screenshot.DiffBase.fromObject(object.diff_base);
                    }
                    if (object.user != null) {
                        if (typeof object.user !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportMeta.user: object expected");
                        message.user = $root.mdc.test.screenshot.User.fromObject(object.user);
                    }
                    if (object.node_version != null) {
                        if (typeof object.node_version !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportMeta.node_version: object expected");
                        message.node_version = $root.mdc.test.screenshot.LibraryVersion.fromObject(object.node_version);
                    }
                    if (object.npm_version != null) {
                        if (typeof object.npm_version !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportMeta.npm_version: object expected");
                        message.npm_version = $root.mdc.test.screenshot.LibraryVersion.fromObject(object.npm_version);
                    }
                    if (object.mdc_version != null) {
                        if (typeof object.mdc_version !== "object")
                            throw TypeError(".mdc.test.screenshot.ReportMeta.mdc_version: object expected");
                        message.mdc_version = $root.mdc.test.screenshot.LibraryVersion.fromObject(object.mdc_version);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ReportMeta message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @static
                 * @param {mdc.test.screenshot.ReportMeta} message ReportMeta
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ReportMeta.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.is_online = false;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.start_time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.start_time = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.end_time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.end_time = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.duration = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.duration = options.longs === String ? "0" : 0;
                        object.remote_upload_base_dir = "";
                        object.remote_upload_base_url = "";
                        object.local_asset_base_dir = "";
                        object.local_screenshot_image_base_dir = "";
                        object.local_diff_image_base_dir = "";
                        object.local_report_base_dir = "";
                        object.cli_invocation = "";
                        object.diff_base = null;
                        object.user = null;
                        object.node_version = null;
                        object.npm_version = null;
                        object.mdc_version = null;
                    }
                    if (message.is_online != null && message.hasOwnProperty("is_online"))
                        object.is_online = message.is_online;
                    if (message.start_time != null && message.hasOwnProperty("start_time"))
                        if (typeof message.start_time === "number")
                            object.start_time = options.longs === String ? String(message.start_time) : message.start_time;
                        else
                            object.start_time = options.longs === String ? $util.Long.prototype.toString.call(message.start_time) : options.longs === Number ? new $util.LongBits(message.start_time.low >>> 0, message.start_time.high >>> 0).toNumber(true) : message.start_time;
                    if (message.end_time != null && message.hasOwnProperty("end_time"))
                        if (typeof message.end_time === "number")
                            object.end_time = options.longs === String ? String(message.end_time) : message.end_time;
                        else
                            object.end_time = options.longs === String ? $util.Long.prototype.toString.call(message.end_time) : options.longs === Number ? new $util.LongBits(message.end_time.low >>> 0, message.end_time.high >>> 0).toNumber(true) : message.end_time;
                    if (message.duration != null && message.hasOwnProperty("duration"))
                        if (typeof message.duration === "number")
                            object.duration = options.longs === String ? String(message.duration) : message.duration;
                        else
                            object.duration = options.longs === String ? $util.Long.prototype.toString.call(message.duration) : options.longs === Number ? new $util.LongBits(message.duration.low >>> 0, message.duration.high >>> 0).toNumber(true) : message.duration;
                    if (message.remote_upload_base_dir != null && message.hasOwnProperty("remote_upload_base_dir"))
                        object.remote_upload_base_dir = message.remote_upload_base_dir;
                    if (message.remote_upload_base_url != null && message.hasOwnProperty("remote_upload_base_url"))
                        object.remote_upload_base_url = message.remote_upload_base_url;
                    if (message.local_asset_base_dir != null && message.hasOwnProperty("local_asset_base_dir"))
                        object.local_asset_base_dir = message.local_asset_base_dir;
                    if (message.local_screenshot_image_base_dir != null && message.hasOwnProperty("local_screenshot_image_base_dir"))
                        object.local_screenshot_image_base_dir = message.local_screenshot_image_base_dir;
                    if (message.local_diff_image_base_dir != null && message.hasOwnProperty("local_diff_image_base_dir"))
                        object.local_diff_image_base_dir = message.local_diff_image_base_dir;
                    if (message.local_report_base_dir != null && message.hasOwnProperty("local_report_base_dir"))
                        object.local_report_base_dir = message.local_report_base_dir;
                    if (message.cli_invocation != null && message.hasOwnProperty("cli_invocation"))
                        object.cli_invocation = message.cli_invocation;
                    if (message.diff_base != null && message.hasOwnProperty("diff_base"))
                        object.diff_base = $root.mdc.test.screenshot.DiffBase.toObject(message.diff_base, options);
                    if (message.user != null && message.hasOwnProperty("user"))
                        object.user = $root.mdc.test.screenshot.User.toObject(message.user, options);
                    if (message.node_version != null && message.hasOwnProperty("node_version"))
                        object.node_version = $root.mdc.test.screenshot.LibraryVersion.toObject(message.node_version, options);
                    if (message.npm_version != null && message.hasOwnProperty("npm_version"))
                        object.npm_version = $root.mdc.test.screenshot.LibraryVersion.toObject(message.npm_version, options);
                    if (message.mdc_version != null && message.hasOwnProperty("mdc_version"))
                        object.mdc_version = $root.mdc.test.screenshot.LibraryVersion.toObject(message.mdc_version, options);
                    return object;
                };

                /**
                 * Converts this ReportMeta to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.ReportMeta
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ReportMeta.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ReportMeta;
            })();

            screenshot.DiffBase = (function() {

                /**
                 * Properties of a DiffBase.
                 * @memberof mdc.test.screenshot
                 * @interface IDiffBase
                 * @property {mdc.test.screenshot.DiffBase.Type|null} [type] DiffBase type
                 * @property {string|null} [file_path] DiffBase file_path
                 * @property {string|null} [public_url] DiffBase public_url
                 * @property {mdc.test.screenshot.IGitRevision|null} [git_revision] DiffBase git_revision
                 */

                /**
                 * Constructs a new DiffBase.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a DiffBase.
                 * @implements IDiffBase
                 * @constructor
                 * @param {mdc.test.screenshot.IDiffBase=} [properties] Properties to set
                 */
                function DiffBase(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * DiffBase type.
                 * @member {mdc.test.screenshot.DiffBase.Type} type
                 * @memberof mdc.test.screenshot.DiffBase
                 * @instance
                 */
                DiffBase.prototype.type = 0;

                /**
                 * DiffBase file_path.
                 * @member {string} file_path
                 * @memberof mdc.test.screenshot.DiffBase
                 * @instance
                 */
                DiffBase.prototype.file_path = "";

                /**
                 * DiffBase public_url.
                 * @member {string} public_url
                 * @memberof mdc.test.screenshot.DiffBase
                 * @instance
                 */
                DiffBase.prototype.public_url = "";

                /**
                 * DiffBase git_revision.
                 * @member {mdc.test.screenshot.IGitRevision|null|undefined} git_revision
                 * @memberof mdc.test.screenshot.DiffBase
                 * @instance
                 */
                DiffBase.prototype.git_revision = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * DiffBase value_oneof.
                 * @member {"file_path"|"public_url"|"git_revision"|undefined} value_oneof
                 * @memberof mdc.test.screenshot.DiffBase
                 * @instance
                 */
                Object.defineProperty(DiffBase.prototype, "value_oneof", {
                    get: $util.oneOfGetter($oneOfFields = ["file_path", "public_url", "git_revision"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new DiffBase instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {mdc.test.screenshot.IDiffBase=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.DiffBase} DiffBase instance
                 */
                DiffBase.create = function create(properties) {
                    return new DiffBase(properties);
                };

                /**
                 * Encodes the specified DiffBase message. Does not implicitly {@link mdc.test.screenshot.DiffBase.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {mdc.test.screenshot.IDiffBase} message DiffBase message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DiffBase.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.type != null && message.hasOwnProperty("type"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                    if (message.file_path != null && message.hasOwnProperty("file_path"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.file_path);
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.public_url);
                    if (message.git_revision != null && message.hasOwnProperty("git_revision"))
                        $root.mdc.test.screenshot.GitRevision.encode(message.git_revision, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified DiffBase message, length delimited. Does not implicitly {@link mdc.test.screenshot.DiffBase.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {mdc.test.screenshot.IDiffBase} message DiffBase message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                DiffBase.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a DiffBase message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.DiffBase} DiffBase
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DiffBase.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.DiffBase();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.type = reader.int32();
                            break;
                        case 2:
                            message.file_path = reader.string();
                            break;
                        case 3:
                            message.public_url = reader.string();
                            break;
                        case 4:
                            message.git_revision = $root.mdc.test.screenshot.GitRevision.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a DiffBase message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.DiffBase} DiffBase
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                DiffBase.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a DiffBase message.
                 * @function verify
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                DiffBase.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.file_path != null && message.hasOwnProperty("file_path")) {
                        properties.value_oneof = 1;
                        if (!$util.isString(message.file_path))
                            return "file_path: string expected";
                    }
                    if (message.public_url != null && message.hasOwnProperty("public_url")) {
                        if (properties.value_oneof === 1)
                            return "value_oneof: multiple values";
                        properties.value_oneof = 1;
                        if (!$util.isString(message.public_url))
                            return "public_url: string expected";
                    }
                    if (message.git_revision != null && message.hasOwnProperty("git_revision")) {
                        if (properties.value_oneof === 1)
                            return "value_oneof: multiple values";
                        properties.value_oneof = 1;
                        {
                            var error = $root.mdc.test.screenshot.GitRevision.verify(message.git_revision);
                            if (error)
                                return "git_revision." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a DiffBase message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.DiffBase} DiffBase
                 */
                DiffBase.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.DiffBase)
                        return object;
                    var message = new $root.mdc.test.screenshot.DiffBase();
                    switch (object.type) {
                    case "UNKNOWN":
                    case 0:
                        message.type = 0;
                        break;
                    case "FILE_PATH":
                    case 1:
                        message.type = 1;
                        break;
                    case "PUBLIC_URL":
                    case 2:
                        message.type = 2;
                        break;
                    case "GIT_REVISION":
                    case 3:
                        message.type = 3;
                        break;
                    }
                    if (object.file_path != null)
                        message.file_path = String(object.file_path);
                    if (object.public_url != null)
                        message.public_url = String(object.public_url);
                    if (object.git_revision != null) {
                        if (typeof object.git_revision !== "object")
                            throw TypeError(".mdc.test.screenshot.DiffBase.git_revision: object expected");
                        message.git_revision = $root.mdc.test.screenshot.GitRevision.fromObject(object.git_revision);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a DiffBase message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.DiffBase
                 * @static
                 * @param {mdc.test.screenshot.DiffBase} message DiffBase
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                DiffBase.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.type = options.enums === String ? "UNKNOWN" : 0;
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.mdc.test.screenshot.DiffBase.Type[message.type] : message.type;
                    if (message.file_path != null && message.hasOwnProperty("file_path")) {
                        object.file_path = message.file_path;
                        if (options.oneofs)
                            object.value_oneof = "file_path";
                    }
                    if (message.public_url != null && message.hasOwnProperty("public_url")) {
                        object.public_url = message.public_url;
                        if (options.oneofs)
                            object.value_oneof = "public_url";
                    }
                    if (message.git_revision != null && message.hasOwnProperty("git_revision")) {
                        object.git_revision = $root.mdc.test.screenshot.GitRevision.toObject(message.git_revision, options);
                        if (options.oneofs)
                            object.value_oneof = "git_revision";
                    }
                    return object;
                };

                /**
                 * Converts this DiffBase to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.DiffBase
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                DiffBase.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Type enum.
                 * @name mdc.test.screenshot.DiffBase.Type
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} FILE_PATH=1 FILE_PATH value
                 * @property {number} PUBLIC_URL=2 PUBLIC_URL value
                 * @property {number} GIT_REVISION=3 GIT_REVISION value
                 */
                DiffBase.Type = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "FILE_PATH"] = 1;
                    values[valuesById[2] = "PUBLIC_URL"] = 2;
                    values[valuesById[3] = "GIT_REVISION"] = 3;
                    return values;
                })();

                return DiffBase;
            })();

            screenshot.GitRevision = (function() {

                /**
                 * Properties of a GitRevision.
                 * @memberof mdc.test.screenshot
                 * @interface IGitRevision
                 * @property {mdc.test.screenshot.GitRevision.Type|null} [type] GitRevision type
                 * @property {string|null} [snapshot_file_path] GitRevision snapshot_file_path
                 * @property {string|null} [commit] GitRevision commit
                 * @property {string|null} [remote] GitRevision remote
                 * @property {string|null} [branch] GitRevision branch
                 * @property {string|null} [tag] GitRevision tag
                 */

                /**
                 * Constructs a new GitRevision.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a GitRevision.
                 * @implements IGitRevision
                 * @constructor
                 * @param {mdc.test.screenshot.IGitRevision=} [properties] Properties to set
                 */
                function GitRevision(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GitRevision type.
                 * @member {mdc.test.screenshot.GitRevision.Type} type
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 */
                GitRevision.prototype.type = 0;

                /**
                 * GitRevision snapshot_file_path.
                 * @member {string} snapshot_file_path
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 */
                GitRevision.prototype.snapshot_file_path = "";

                /**
                 * GitRevision commit.
                 * @member {string} commit
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 */
                GitRevision.prototype.commit = "";

                /**
                 * GitRevision remote.
                 * @member {string} remote
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 */
                GitRevision.prototype.remote = "";

                /**
                 * GitRevision branch.
                 * @member {string} branch
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 */
                GitRevision.prototype.branch = "";

                /**
                 * GitRevision tag.
                 * @member {string} tag
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 */
                GitRevision.prototype.tag = "";

                /**
                 * Creates a new GitRevision instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {mdc.test.screenshot.IGitRevision=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.GitRevision} GitRevision instance
                 */
                GitRevision.create = function create(properties) {
                    return new GitRevision(properties);
                };

                /**
                 * Encodes the specified GitRevision message. Does not implicitly {@link mdc.test.screenshot.GitRevision.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {mdc.test.screenshot.IGitRevision} message GitRevision message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GitRevision.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.type != null && message.hasOwnProperty("type"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                    if (message.snapshot_file_path != null && message.hasOwnProperty("snapshot_file_path"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.snapshot_file_path);
                    if (message.commit != null && message.hasOwnProperty("commit"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.commit);
                    if (message.remote != null && message.hasOwnProperty("remote"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.remote);
                    if (message.branch != null && message.hasOwnProperty("branch"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.branch);
                    if (message.tag != null && message.hasOwnProperty("tag"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.tag);
                    return writer;
                };

                /**
                 * Encodes the specified GitRevision message, length delimited. Does not implicitly {@link mdc.test.screenshot.GitRevision.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {mdc.test.screenshot.IGitRevision} message GitRevision message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GitRevision.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GitRevision message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.GitRevision} GitRevision
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GitRevision.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.GitRevision();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.type = reader.int32();
                            break;
                        case 2:
                            message.snapshot_file_path = reader.string();
                            break;
                        case 3:
                            message.commit = reader.string();
                            break;
                        case 4:
                            message.remote = reader.string();
                            break;
                        case 5:
                            message.branch = reader.string();
                            break;
                        case 6:
                            message.tag = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GitRevision message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.GitRevision} GitRevision
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GitRevision.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GitRevision message.
                 * @function verify
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GitRevision.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.type != null && message.hasOwnProperty("type"))
                        switch (message.type) {
                        default:
                            return "type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                    if (message.snapshot_file_path != null && message.hasOwnProperty("snapshot_file_path"))
                        if (!$util.isString(message.snapshot_file_path))
                            return "snapshot_file_path: string expected";
                    if (message.commit != null && message.hasOwnProperty("commit"))
                        if (!$util.isString(message.commit))
                            return "commit: string expected";
                    if (message.remote != null && message.hasOwnProperty("remote"))
                        if (!$util.isString(message.remote))
                            return "remote: string expected";
                    if (message.branch != null && message.hasOwnProperty("branch"))
                        if (!$util.isString(message.branch))
                            return "branch: string expected";
                    if (message.tag != null && message.hasOwnProperty("tag"))
                        if (!$util.isString(message.tag))
                            return "tag: string expected";
                    return null;
                };

                /**
                 * Creates a GitRevision message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.GitRevision} GitRevision
                 */
                GitRevision.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.GitRevision)
                        return object;
                    var message = new $root.mdc.test.screenshot.GitRevision();
                    switch (object.type) {
                    case "UNKNOWN":
                    case 0:
                        message.type = 0;
                        break;
                    case "COMMIT":
                    case 1:
                        message.type = 1;
                        break;
                    case "LOCAL_BRANCH":
                    case 2:
                        message.type = 2;
                        break;
                    case "REMOTE_BRANCH":
                    case 3:
                        message.type = 3;
                        break;
                    case "REMOTE_TAG":
                    case 4:
                        message.type = 4;
                        break;
                    }
                    if (object.snapshot_file_path != null)
                        message.snapshot_file_path = String(object.snapshot_file_path);
                    if (object.commit != null)
                        message.commit = String(object.commit);
                    if (object.remote != null)
                        message.remote = String(object.remote);
                    if (object.branch != null)
                        message.branch = String(object.branch);
                    if (object.tag != null)
                        message.tag = String(object.tag);
                    return message;
                };

                /**
                 * Creates a plain object from a GitRevision message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.GitRevision
                 * @static
                 * @param {mdc.test.screenshot.GitRevision} message GitRevision
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GitRevision.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.type = options.enums === String ? "UNKNOWN" : 0;
                        object.snapshot_file_path = "";
                        object.commit = "";
                        object.remote = "";
                        object.branch = "";
                        object.tag = "";
                    }
                    if (message.type != null && message.hasOwnProperty("type"))
                        object.type = options.enums === String ? $root.mdc.test.screenshot.GitRevision.Type[message.type] : message.type;
                    if (message.snapshot_file_path != null && message.hasOwnProperty("snapshot_file_path"))
                        object.snapshot_file_path = message.snapshot_file_path;
                    if (message.commit != null && message.hasOwnProperty("commit"))
                        object.commit = message.commit;
                    if (message.remote != null && message.hasOwnProperty("remote"))
                        object.remote = message.remote;
                    if (message.branch != null && message.hasOwnProperty("branch"))
                        object.branch = message.branch;
                    if (message.tag != null && message.hasOwnProperty("tag"))
                        object.tag = message.tag;
                    return object;
                };

                /**
                 * Converts this GitRevision to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.GitRevision
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GitRevision.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Type enum.
                 * @name mdc.test.screenshot.GitRevision.Type
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} COMMIT=1 COMMIT value
                 * @property {number} LOCAL_BRANCH=2 LOCAL_BRANCH value
                 * @property {number} REMOTE_BRANCH=3 REMOTE_BRANCH value
                 * @property {number} REMOTE_TAG=4 REMOTE_TAG value
                 */
                GitRevision.Type = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "COMMIT"] = 1;
                    values[valuesById[2] = "LOCAL_BRANCH"] = 2;
                    values[valuesById[3] = "REMOTE_BRANCH"] = 3;
                    values[valuesById[4] = "REMOTE_TAG"] = 4;
                    return values;
                })();

                return GitRevision;
            })();

            screenshot.User = (function() {

                /**
                 * Properties of a User.
                 * @memberof mdc.test.screenshot
                 * @interface IUser
                 * @property {string|null} [name] User name
                 * @property {string|null} [email] User email
                 * @property {string|null} [username] User username
                 */

                /**
                 * Constructs a new User.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a User.
                 * @implements IUser
                 * @constructor
                 * @param {mdc.test.screenshot.IUser=} [properties] Properties to set
                 */
                function User(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * User name.
                 * @member {string} name
                 * @memberof mdc.test.screenshot.User
                 * @instance
                 */
                User.prototype.name = "";

                /**
                 * User email.
                 * @member {string} email
                 * @memberof mdc.test.screenshot.User
                 * @instance
                 */
                User.prototype.email = "";

                /**
                 * User username.
                 * @member {string} username
                 * @memberof mdc.test.screenshot.User
                 * @instance
                 */
                User.prototype.username = "";

                /**
                 * Creates a new User instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {mdc.test.screenshot.IUser=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.User} User instance
                 */
                User.create = function create(properties) {
                    return new User(properties);
                };

                /**
                 * Encodes the specified User message. Does not implicitly {@link mdc.test.screenshot.User.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {mdc.test.screenshot.IUser} message User message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                User.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    if (message.email != null && message.hasOwnProperty("email"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.email);
                    if (message.username != null && message.hasOwnProperty("username"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.username);
                    return writer;
                };

                /**
                 * Encodes the specified User message, length delimited. Does not implicitly {@link mdc.test.screenshot.User.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {mdc.test.screenshot.IUser} message User message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                User.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a User message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.User} User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                User.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.User();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        case 2:
                            message.email = reader.string();
                            break;
                        case 3:
                            message.username = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a User message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.User} User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                User.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a User message.
                 * @function verify
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                User.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.email != null && message.hasOwnProperty("email"))
                        if (!$util.isString(message.email))
                            return "email: string expected";
                    if (message.username != null && message.hasOwnProperty("username"))
                        if (!$util.isString(message.username))
                            return "username: string expected";
                    return null;
                };

                /**
                 * Creates a User message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.User} User
                 */
                User.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.User)
                        return object;
                    var message = new $root.mdc.test.screenshot.User();
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.email != null)
                        message.email = String(object.email);
                    if (object.username != null)
                        message.username = String(object.username);
                    return message;
                };

                /**
                 * Creates a plain object from a User message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.User
                 * @static
                 * @param {mdc.test.screenshot.User} message User
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                User.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.name = "";
                        object.email = "";
                        object.username = "";
                    }
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.email != null && message.hasOwnProperty("email"))
                        object.email = message.email;
                    if (message.username != null && message.hasOwnProperty("username"))
                        object.username = message.username;
                    return object;
                };

                /**
                 * Converts this User to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.User
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                User.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return User;
            })();

            screenshot.LibraryVersion = (function() {

                /**
                 * Properties of a LibraryVersion.
                 * @memberof mdc.test.screenshot
                 * @interface ILibraryVersion
                 * @property {string|null} [version_string] LibraryVersion version_string
                 * @property {number|null} [commit_offset] LibraryVersion commit_offset
                 */

                /**
                 * Constructs a new LibraryVersion.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a LibraryVersion.
                 * @implements ILibraryVersion
                 * @constructor
                 * @param {mdc.test.screenshot.ILibraryVersion=} [properties] Properties to set
                 */
                function LibraryVersion(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * LibraryVersion version_string.
                 * @member {string} version_string
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @instance
                 */
                LibraryVersion.prototype.version_string = "";

                /**
                 * LibraryVersion commit_offset.
                 * @member {number} commit_offset
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @instance
                 */
                LibraryVersion.prototype.commit_offset = 0;

                /**
                 * Creates a new LibraryVersion instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {mdc.test.screenshot.ILibraryVersion=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.LibraryVersion} LibraryVersion instance
                 */
                LibraryVersion.create = function create(properties) {
                    return new LibraryVersion(properties);
                };

                /**
                 * Encodes the specified LibraryVersion message. Does not implicitly {@link mdc.test.screenshot.LibraryVersion.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {mdc.test.screenshot.ILibraryVersion} message LibraryVersion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LibraryVersion.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.version_string != null && message.hasOwnProperty("version_string"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.version_string);
                    if (message.commit_offset != null && message.hasOwnProperty("commit_offset"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.commit_offset);
                    return writer;
                };

                /**
                 * Encodes the specified LibraryVersion message, length delimited. Does not implicitly {@link mdc.test.screenshot.LibraryVersion.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {mdc.test.screenshot.ILibraryVersion} message LibraryVersion message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                LibraryVersion.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a LibraryVersion message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.LibraryVersion} LibraryVersion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LibraryVersion.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.LibraryVersion();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.version_string = reader.string();
                            break;
                        case 2:
                            message.commit_offset = reader.int32();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a LibraryVersion message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.LibraryVersion} LibraryVersion
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                LibraryVersion.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a LibraryVersion message.
                 * @function verify
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                LibraryVersion.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.version_string != null && message.hasOwnProperty("version_string"))
                        if (!$util.isString(message.version_string))
                            return "version_string: string expected";
                    if (message.commit_offset != null && message.hasOwnProperty("commit_offset"))
                        if (!$util.isInteger(message.commit_offset))
                            return "commit_offset: integer expected";
                    return null;
                };

                /**
                 * Creates a LibraryVersion message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.LibraryVersion} LibraryVersion
                 */
                LibraryVersion.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.LibraryVersion)
                        return object;
                    var message = new $root.mdc.test.screenshot.LibraryVersion();
                    if (object.version_string != null)
                        message.version_string = String(object.version_string);
                    if (object.commit_offset != null)
                        message.commit_offset = object.commit_offset | 0;
                    return message;
                };

                /**
                 * Creates a plain object from a LibraryVersion message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @static
                 * @param {mdc.test.screenshot.LibraryVersion} message LibraryVersion
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                LibraryVersion.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.version_string = "";
                        object.commit_offset = 0;
                    }
                    if (message.version_string != null && message.hasOwnProperty("version_string"))
                        object.version_string = message.version_string;
                    if (message.commit_offset != null && message.hasOwnProperty("commit_offset"))
                        object.commit_offset = message.commit_offset;
                    return object;
                };

                /**
                 * Converts this LibraryVersion to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.LibraryVersion
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                LibraryVersion.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return LibraryVersion;
            })();

            screenshot.UserAgents = (function() {

                /**
                 * Properties of a UserAgents.
                 * @memberof mdc.test.screenshot
                 * @interface IUserAgents
                 * @property {Array.<mdc.test.screenshot.IUserAgent>|null} [all_user_agents] UserAgents all_user_agents
                 * @property {Array.<mdc.test.screenshot.IUserAgent>|null} [runnable_user_agents] UserAgents runnable_user_agents
                 * @property {Array.<mdc.test.screenshot.IUserAgent>|null} [skipped_user_agents] UserAgents skipped_user_agents
                 */

                /**
                 * Constructs a new UserAgents.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a UserAgents.
                 * @implements IUserAgents
                 * @constructor
                 * @param {mdc.test.screenshot.IUserAgents=} [properties] Properties to set
                 */
                function UserAgents(properties) {
                    this.all_user_agents = [];
                    this.runnable_user_agents = [];
                    this.skipped_user_agents = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * UserAgents all_user_agents.
                 * @member {Array.<mdc.test.screenshot.IUserAgent>} all_user_agents
                 * @memberof mdc.test.screenshot.UserAgents
                 * @instance
                 */
                UserAgents.prototype.all_user_agents = $util.emptyArray;

                /**
                 * UserAgents runnable_user_agents.
                 * @member {Array.<mdc.test.screenshot.IUserAgent>} runnable_user_agents
                 * @memberof mdc.test.screenshot.UserAgents
                 * @instance
                 */
                UserAgents.prototype.runnable_user_agents = $util.emptyArray;

                /**
                 * UserAgents skipped_user_agents.
                 * @member {Array.<mdc.test.screenshot.IUserAgent>} skipped_user_agents
                 * @memberof mdc.test.screenshot.UserAgents
                 * @instance
                 */
                UserAgents.prototype.skipped_user_agents = $util.emptyArray;

                /**
                 * Creates a new UserAgents instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {mdc.test.screenshot.IUserAgents=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.UserAgents} UserAgents instance
                 */
                UserAgents.create = function create(properties) {
                    return new UserAgents(properties);
                };

                /**
                 * Encodes the specified UserAgents message. Does not implicitly {@link mdc.test.screenshot.UserAgents.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {mdc.test.screenshot.IUserAgents} message UserAgents message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UserAgents.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.all_user_agents != null && message.all_user_agents.length)
                        for (var i = 0; i < message.all_user_agents.length; ++i)
                            $root.mdc.test.screenshot.UserAgent.encode(message.all_user_agents[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.runnable_user_agents != null && message.runnable_user_agents.length)
                        for (var i = 0; i < message.runnable_user_agents.length; ++i)
                            $root.mdc.test.screenshot.UserAgent.encode(message.runnable_user_agents[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.skipped_user_agents != null && message.skipped_user_agents.length)
                        for (var i = 0; i < message.skipped_user_agents.length; ++i)
                            $root.mdc.test.screenshot.UserAgent.encode(message.skipped_user_agents[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified UserAgents message, length delimited. Does not implicitly {@link mdc.test.screenshot.UserAgents.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {mdc.test.screenshot.IUserAgents} message UserAgents message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UserAgents.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a UserAgents message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.UserAgents} UserAgents
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UserAgents.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.UserAgents();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.all_user_agents && message.all_user_agents.length))
                                message.all_user_agents = [];
                            message.all_user_agents.push($root.mdc.test.screenshot.UserAgent.decode(reader, reader.uint32()));
                            break;
                        case 2:
                            if (!(message.runnable_user_agents && message.runnable_user_agents.length))
                                message.runnable_user_agents = [];
                            message.runnable_user_agents.push($root.mdc.test.screenshot.UserAgent.decode(reader, reader.uint32()));
                            break;
                        case 3:
                            if (!(message.skipped_user_agents && message.skipped_user_agents.length))
                                message.skipped_user_agents = [];
                            message.skipped_user_agents.push($root.mdc.test.screenshot.UserAgent.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a UserAgents message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.UserAgents} UserAgents
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UserAgents.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a UserAgents message.
                 * @function verify
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                UserAgents.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.all_user_agents != null && message.hasOwnProperty("all_user_agents")) {
                        if (!Array.isArray(message.all_user_agents))
                            return "all_user_agents: array expected";
                        for (var i = 0; i < message.all_user_agents.length; ++i) {
                            var error = $root.mdc.test.screenshot.UserAgent.verify(message.all_user_agents[i]);
                            if (error)
                                return "all_user_agents." + error;
                        }
                    }
                    if (message.runnable_user_agents != null && message.hasOwnProperty("runnable_user_agents")) {
                        if (!Array.isArray(message.runnable_user_agents))
                            return "runnable_user_agents: array expected";
                        for (var i = 0; i < message.runnable_user_agents.length; ++i) {
                            var error = $root.mdc.test.screenshot.UserAgent.verify(message.runnable_user_agents[i]);
                            if (error)
                                return "runnable_user_agents." + error;
                        }
                    }
                    if (message.skipped_user_agents != null && message.hasOwnProperty("skipped_user_agents")) {
                        if (!Array.isArray(message.skipped_user_agents))
                            return "skipped_user_agents: array expected";
                        for (var i = 0; i < message.skipped_user_agents.length; ++i) {
                            var error = $root.mdc.test.screenshot.UserAgent.verify(message.skipped_user_agents[i]);
                            if (error)
                                return "skipped_user_agents." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a UserAgents message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.UserAgents} UserAgents
                 */
                UserAgents.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.UserAgents)
                        return object;
                    var message = new $root.mdc.test.screenshot.UserAgents();
                    if (object.all_user_agents) {
                        if (!Array.isArray(object.all_user_agents))
                            throw TypeError(".mdc.test.screenshot.UserAgents.all_user_agents: array expected");
                        message.all_user_agents = [];
                        for (var i = 0; i < object.all_user_agents.length; ++i) {
                            if (typeof object.all_user_agents[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.UserAgents.all_user_agents: object expected");
                            message.all_user_agents[i] = $root.mdc.test.screenshot.UserAgent.fromObject(object.all_user_agents[i]);
                        }
                    }
                    if (object.runnable_user_agents) {
                        if (!Array.isArray(object.runnable_user_agents))
                            throw TypeError(".mdc.test.screenshot.UserAgents.runnable_user_agents: array expected");
                        message.runnable_user_agents = [];
                        for (var i = 0; i < object.runnable_user_agents.length; ++i) {
                            if (typeof object.runnable_user_agents[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.UserAgents.runnable_user_agents: object expected");
                            message.runnable_user_agents[i] = $root.mdc.test.screenshot.UserAgent.fromObject(object.runnable_user_agents[i]);
                        }
                    }
                    if (object.skipped_user_agents) {
                        if (!Array.isArray(object.skipped_user_agents))
                            throw TypeError(".mdc.test.screenshot.UserAgents.skipped_user_agents: array expected");
                        message.skipped_user_agents = [];
                        for (var i = 0; i < object.skipped_user_agents.length; ++i) {
                            if (typeof object.skipped_user_agents[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.UserAgents.skipped_user_agents: object expected");
                            message.skipped_user_agents[i] = $root.mdc.test.screenshot.UserAgent.fromObject(object.skipped_user_agents[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a UserAgents message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.UserAgents
                 * @static
                 * @param {mdc.test.screenshot.UserAgents} message UserAgents
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UserAgents.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.all_user_agents = [];
                        object.runnable_user_agents = [];
                        object.skipped_user_agents = [];
                    }
                    if (message.all_user_agents && message.all_user_agents.length) {
                        object.all_user_agents = [];
                        for (var j = 0; j < message.all_user_agents.length; ++j)
                            object.all_user_agents[j] = $root.mdc.test.screenshot.UserAgent.toObject(message.all_user_agents[j], options);
                    }
                    if (message.runnable_user_agents && message.runnable_user_agents.length) {
                        object.runnable_user_agents = [];
                        for (var j = 0; j < message.runnable_user_agents.length; ++j)
                            object.runnable_user_agents[j] = $root.mdc.test.screenshot.UserAgent.toObject(message.runnable_user_agents[j], options);
                    }
                    if (message.skipped_user_agents && message.skipped_user_agents.length) {
                        object.skipped_user_agents = [];
                        for (var j = 0; j < message.skipped_user_agents.length; ++j)
                            object.skipped_user_agents[j] = $root.mdc.test.screenshot.UserAgent.toObject(message.skipped_user_agents[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this UserAgents to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.UserAgents
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                UserAgents.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return UserAgents;
            })();

            screenshot.UserAgent = (function() {

                /**
                 * Properties of a UserAgent.
                 * @memberof mdc.test.screenshot
                 * @interface IUserAgent
                 * @property {string|null} [alias] UserAgent alias
                 * @property {mdc.test.screenshot.UserAgent.FormFactorType|null} [form_factor_type] UserAgent form_factor_type
                 * @property {mdc.test.screenshot.UserAgent.OsVendorType|null} [os_vendor_type] UserAgent os_vendor_type
                 * @property {mdc.test.screenshot.UserAgent.BrowserVendorType|null} [browser_vendor_type] UserAgent browser_vendor_type
                 * @property {mdc.test.screenshot.UserAgent.BrowserVersionType|null} [browser_version_type] UserAgent browser_version_type
                 * @property {string|null} [browser_version_value] UserAgent browser_version_value
                 * @property {string|null} [selenium_id] UserAgent selenium_id
                 * @property {mdc.test.screenshot.IWebDriverCapabilities|null} [webdriver_capabilities] UserAgent webdriver_capabilities
                 * @property {boolean|null} [is_enabled_by_cli] UserAgent is_enabled_by_cli
                 * @property {boolean|null} [is_available_locally] UserAgent is_available_locally
                 * @property {boolean|null} [is_runnable] UserAgent is_runnable
                 */

                /**
                 * Constructs a new UserAgent.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a UserAgent.
                 * @implements IUserAgent
                 * @constructor
                 * @param {mdc.test.screenshot.IUserAgent=} [properties] Properties to set
                 */
                function UserAgent(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * UserAgent alias.
                 * @member {string} alias
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.alias = "";

                /**
                 * UserAgent form_factor_type.
                 * @member {mdc.test.screenshot.UserAgent.FormFactorType} form_factor_type
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.form_factor_type = 0;

                /**
                 * UserAgent os_vendor_type.
                 * @member {mdc.test.screenshot.UserAgent.OsVendorType} os_vendor_type
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.os_vendor_type = 0;

                /**
                 * UserAgent browser_vendor_type.
                 * @member {mdc.test.screenshot.UserAgent.BrowserVendorType} browser_vendor_type
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.browser_vendor_type = 0;

                /**
                 * UserAgent browser_version_type.
                 * @member {mdc.test.screenshot.UserAgent.BrowserVersionType} browser_version_type
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.browser_version_type = 0;

                /**
                 * UserAgent browser_version_value.
                 * @member {string} browser_version_value
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.browser_version_value = "";

                /**
                 * UserAgent selenium_id.
                 * @member {string} selenium_id
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.selenium_id = "";

                /**
                 * UserAgent webdriver_capabilities.
                 * @member {mdc.test.screenshot.IWebDriverCapabilities|null|undefined} webdriver_capabilities
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.webdriver_capabilities = null;

                /**
                 * UserAgent is_enabled_by_cli.
                 * @member {boolean} is_enabled_by_cli
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.is_enabled_by_cli = false;

                /**
                 * UserAgent is_available_locally.
                 * @member {boolean} is_available_locally
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.is_available_locally = false;

                /**
                 * UserAgent is_runnable.
                 * @member {boolean} is_runnable
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 */
                UserAgent.prototype.is_runnable = false;

                /**
                 * Creates a new UserAgent instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {mdc.test.screenshot.IUserAgent=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.UserAgent} UserAgent instance
                 */
                UserAgent.create = function create(properties) {
                    return new UserAgent(properties);
                };

                /**
                 * Encodes the specified UserAgent message. Does not implicitly {@link mdc.test.screenshot.UserAgent.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {mdc.test.screenshot.IUserAgent} message UserAgent message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UserAgent.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.alias != null && message.hasOwnProperty("alias"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.alias);
                    if (message.form_factor_type != null && message.hasOwnProperty("form_factor_type"))
                        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.form_factor_type);
                    if (message.os_vendor_type != null && message.hasOwnProperty("os_vendor_type"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.os_vendor_type);
                    if (message.browser_vendor_type != null && message.hasOwnProperty("browser_vendor_type"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.browser_vendor_type);
                    if (message.browser_version_type != null && message.hasOwnProperty("browser_version_type"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.browser_version_type);
                    if (message.browser_version_value != null && message.hasOwnProperty("browser_version_value"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.browser_version_value);
                    if (message.selenium_id != null && message.hasOwnProperty("selenium_id"))
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.selenium_id);
                    if (message.webdriver_capabilities != null && message.hasOwnProperty("webdriver_capabilities"))
                        $root.mdc.test.screenshot.WebDriverCapabilities.encode(message.webdriver_capabilities, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                    if (message.is_enabled_by_cli != null && message.hasOwnProperty("is_enabled_by_cli"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.is_enabled_by_cli);
                    if (message.is_available_locally != null && message.hasOwnProperty("is_available_locally"))
                        writer.uint32(/* id 10, wireType 0 =*/80).bool(message.is_available_locally);
                    if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                        writer.uint32(/* id 11, wireType 0 =*/88).bool(message.is_runnable);
                    return writer;
                };

                /**
                 * Encodes the specified UserAgent message, length delimited. Does not implicitly {@link mdc.test.screenshot.UserAgent.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {mdc.test.screenshot.IUserAgent} message UserAgent message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                UserAgent.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a UserAgent message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.UserAgent} UserAgent
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UserAgent.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.UserAgent();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.alias = reader.string();
                            break;
                        case 2:
                            message.form_factor_type = reader.int32();
                            break;
                        case 3:
                            message.os_vendor_type = reader.int32();
                            break;
                        case 4:
                            message.browser_vendor_type = reader.int32();
                            break;
                        case 5:
                            message.browser_version_type = reader.int32();
                            break;
                        case 6:
                            message.browser_version_value = reader.string();
                            break;
                        case 7:
                            message.selenium_id = reader.string();
                            break;
                        case 8:
                            message.webdriver_capabilities = $root.mdc.test.screenshot.WebDriverCapabilities.decode(reader, reader.uint32());
                            break;
                        case 9:
                            message.is_enabled_by_cli = reader.bool();
                            break;
                        case 10:
                            message.is_available_locally = reader.bool();
                            break;
                        case 11:
                            message.is_runnable = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a UserAgent message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.UserAgent} UserAgent
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                UserAgent.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a UserAgent message.
                 * @function verify
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                UserAgent.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.alias != null && message.hasOwnProperty("alias"))
                        if (!$util.isString(message.alias))
                            return "alias: string expected";
                    if (message.form_factor_type != null && message.hasOwnProperty("form_factor_type"))
                        switch (message.form_factor_type) {
                        default:
                            return "form_factor_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.os_vendor_type != null && message.hasOwnProperty("os_vendor_type"))
                        switch (message.os_vendor_type) {
                        default:
                            return "os_vendor_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                    if (message.browser_vendor_type != null && message.hasOwnProperty("browser_vendor_type"))
                        switch (message.browser_vendor_type) {
                        default:
                            return "browser_vendor_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            break;
                        }
                    if (message.browser_version_type != null && message.hasOwnProperty("browser_version_type"))
                        switch (message.browser_version_type) {
                        default:
                            return "browser_version_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.browser_version_value != null && message.hasOwnProperty("browser_version_value"))
                        if (!$util.isString(message.browser_version_value))
                            return "browser_version_value: string expected";
                    if (message.selenium_id != null && message.hasOwnProperty("selenium_id"))
                        if (!$util.isString(message.selenium_id))
                            return "selenium_id: string expected";
                    if (message.webdriver_capabilities != null && message.hasOwnProperty("webdriver_capabilities")) {
                        var error = $root.mdc.test.screenshot.WebDriverCapabilities.verify(message.webdriver_capabilities);
                        if (error)
                            return "webdriver_capabilities." + error;
                    }
                    if (message.is_enabled_by_cli != null && message.hasOwnProperty("is_enabled_by_cli"))
                        if (typeof message.is_enabled_by_cli !== "boolean")
                            return "is_enabled_by_cli: boolean expected";
                    if (message.is_available_locally != null && message.hasOwnProperty("is_available_locally"))
                        if (typeof message.is_available_locally !== "boolean")
                            return "is_available_locally: boolean expected";
                    if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                        if (typeof message.is_runnable !== "boolean")
                            return "is_runnable: boolean expected";
                    return null;
                };

                /**
                 * Creates a UserAgent message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.UserAgent} UserAgent
                 */
                UserAgent.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.UserAgent)
                        return object;
                    var message = new $root.mdc.test.screenshot.UserAgent();
                    if (object.alias != null)
                        message.alias = String(object.alias);
                    switch (object.form_factor_type) {
                    case "UNKNOWN":
                    case 0:
                        message.form_factor_type = 0;
                        break;
                    case "DESKTOP":
                    case 1:
                        message.form_factor_type = 1;
                        break;
                    case "MOBILE":
                    case 2:
                        message.form_factor_type = 2;
                        break;
                    }
                    switch (object.os_vendor_type) {
                    case "UNKNOWN":
                    case 0:
                        message.os_vendor_type = 0;
                        break;
                    case "WINDOWS":
                    case 1:
                        message.os_vendor_type = 1;
                        break;
                    case "MAC":
                    case 2:
                        message.os_vendor_type = 2;
                        break;
                    case "IOS":
                    case 3:
                        message.os_vendor_type = 3;
                        break;
                    case "ANDROID":
                    case 4:
                        message.os_vendor_type = 4;
                        break;
                    }
                    switch (object.browser_vendor_type) {
                    case "UNKNOWN":
                    case 0:
                        message.browser_vendor_type = 0;
                        break;
                    case "CHROME":
                    case 1:
                        message.browser_vendor_type = 1;
                        break;
                    case "FIREFOX":
                    case 2:
                        message.browser_vendor_type = 2;
                        break;
                    case "SAFARI":
                    case 3:
                        message.browser_vendor_type = 3;
                        break;
                    case "EDGE":
                    case 4:
                        message.browser_vendor_type = 4;
                        break;
                    case "IE":
                    case 5:
                        message.browser_vendor_type = 5;
                        break;
                    }
                    switch (object.browser_version_type) {
                    case "UNKNOWN":
                    case 0:
                        message.browser_version_type = 0;
                        break;
                    case "EXACT":
                    case 1:
                        message.browser_version_type = 1;
                        break;
                    case "LATEST":
                    case 2:
                        message.browser_version_type = 2;
                        break;
                    case "PREVIOUS":
                    case 3:
                        message.browser_version_type = 3;
                        break;
                    }
                    if (object.browser_version_value != null)
                        message.browser_version_value = String(object.browser_version_value);
                    if (object.selenium_id != null)
                        message.selenium_id = String(object.selenium_id);
                    if (object.webdriver_capabilities != null) {
                        if (typeof object.webdriver_capabilities !== "object")
                            throw TypeError(".mdc.test.screenshot.UserAgent.webdriver_capabilities: object expected");
                        message.webdriver_capabilities = $root.mdc.test.screenshot.WebDriverCapabilities.fromObject(object.webdriver_capabilities);
                    }
                    if (object.is_enabled_by_cli != null)
                        message.is_enabled_by_cli = Boolean(object.is_enabled_by_cli);
                    if (object.is_available_locally != null)
                        message.is_available_locally = Boolean(object.is_available_locally);
                    if (object.is_runnable != null)
                        message.is_runnable = Boolean(object.is_runnable);
                    return message;
                };

                /**
                 * Creates a plain object from a UserAgent message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.UserAgent
                 * @static
                 * @param {mdc.test.screenshot.UserAgent} message UserAgent
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                UserAgent.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.alias = "";
                        object.form_factor_type = options.enums === String ? "UNKNOWN" : 0;
                        object.os_vendor_type = options.enums === String ? "UNKNOWN" : 0;
                        object.browser_vendor_type = options.enums === String ? "UNKNOWN" : 0;
                        object.browser_version_type = options.enums === String ? "UNKNOWN" : 0;
                        object.browser_version_value = "";
                        object.selenium_id = "";
                        object.webdriver_capabilities = null;
                        object.is_enabled_by_cli = false;
                        object.is_available_locally = false;
                        object.is_runnable = false;
                    }
                    if (message.alias != null && message.hasOwnProperty("alias"))
                        object.alias = message.alias;
                    if (message.form_factor_type != null && message.hasOwnProperty("form_factor_type"))
                        object.form_factor_type = options.enums === String ? $root.mdc.test.screenshot.UserAgent.FormFactorType[message.form_factor_type] : message.form_factor_type;
                    if (message.os_vendor_type != null && message.hasOwnProperty("os_vendor_type"))
                        object.os_vendor_type = options.enums === String ? $root.mdc.test.screenshot.UserAgent.OsVendorType[message.os_vendor_type] : message.os_vendor_type;
                    if (message.browser_vendor_type != null && message.hasOwnProperty("browser_vendor_type"))
                        object.browser_vendor_type = options.enums === String ? $root.mdc.test.screenshot.UserAgent.BrowserVendorType[message.browser_vendor_type] : message.browser_vendor_type;
                    if (message.browser_version_type != null && message.hasOwnProperty("browser_version_type"))
                        object.browser_version_type = options.enums === String ? $root.mdc.test.screenshot.UserAgent.BrowserVersionType[message.browser_version_type] : message.browser_version_type;
                    if (message.browser_version_value != null && message.hasOwnProperty("browser_version_value"))
                        object.browser_version_value = message.browser_version_value;
                    if (message.selenium_id != null && message.hasOwnProperty("selenium_id"))
                        object.selenium_id = message.selenium_id;
                    if (message.webdriver_capabilities != null && message.hasOwnProperty("webdriver_capabilities"))
                        object.webdriver_capabilities = $root.mdc.test.screenshot.WebDriverCapabilities.toObject(message.webdriver_capabilities, options);
                    if (message.is_enabled_by_cli != null && message.hasOwnProperty("is_enabled_by_cli"))
                        object.is_enabled_by_cli = message.is_enabled_by_cli;
                    if (message.is_available_locally != null && message.hasOwnProperty("is_available_locally"))
                        object.is_available_locally = message.is_available_locally;
                    if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                        object.is_runnable = message.is_runnable;
                    return object;
                };

                /**
                 * Converts this UserAgent to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.UserAgent
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                UserAgent.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * FormFactorType enum.
                 * @name mdc.test.screenshot.UserAgent.FormFactorType
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} DESKTOP=1 DESKTOP value
                 * @property {number} MOBILE=2 MOBILE value
                 */
                UserAgent.FormFactorType = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "DESKTOP"] = 1;
                    values[valuesById[2] = "MOBILE"] = 2;
                    return values;
                })();

                /**
                 * OsVendorType enum.
                 * @name mdc.test.screenshot.UserAgent.OsVendorType
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} WINDOWS=1 WINDOWS value
                 * @property {number} MAC=2 MAC value
                 * @property {number} IOS=3 IOS value
                 * @property {number} ANDROID=4 ANDROID value
                 */
                UserAgent.OsVendorType = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "WINDOWS"] = 1;
                    values[valuesById[2] = "MAC"] = 2;
                    values[valuesById[3] = "IOS"] = 3;
                    values[valuesById[4] = "ANDROID"] = 4;
                    return values;
                })();

                /**
                 * BrowserVendorType enum.
                 * @name mdc.test.screenshot.UserAgent.BrowserVendorType
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} CHROME=1 CHROME value
                 * @property {number} FIREFOX=2 FIREFOX value
                 * @property {number} SAFARI=3 SAFARI value
                 * @property {number} EDGE=4 EDGE value
                 * @property {number} IE=5 IE value
                 */
                UserAgent.BrowserVendorType = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "CHROME"] = 1;
                    values[valuesById[2] = "FIREFOX"] = 2;
                    values[valuesById[3] = "SAFARI"] = 3;
                    values[valuesById[4] = "EDGE"] = 4;
                    values[valuesById[5] = "IE"] = 5;
                    return values;
                })();

                /**
                 * BrowserVersionType enum.
                 * @name mdc.test.screenshot.UserAgent.BrowserVersionType
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} EXACT=1 EXACT value
                 * @property {number} LATEST=2 LATEST value
                 * @property {number} PREVIOUS=3 PREVIOUS value
                 */
                UserAgent.BrowserVersionType = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "EXACT"] = 1;
                    values[valuesById[2] = "LATEST"] = 2;
                    values[valuesById[3] = "PREVIOUS"] = 3;
                    return values;
                })();

                return UserAgent;
            })();

            screenshot.WebDriverCapabilities = (function() {

                /**
                 * Properties of a WebDriverCapabilities.
                 * @memberof mdc.test.screenshot
                 * @interface IWebDriverCapabilities
                 * @property {string|null} [browserName] WebDriverCapabilities browserName
                 * @property {string|null} [browserVersion] WebDriverCapabilities browserVersion
                 * @property {string|null} [platformName] WebDriverCapabilities platformName
                 * @property {string|null} [platformVersion] WebDriverCapabilities platformVersion
                 * @property {boolean|null} [is_headless] WebDriverCapabilities is_headless
                 * @property {boolean|null} [is_rotatable] WebDriverCapabilities is_rotatable
                 * @property {boolean|null} [has_touch_screen] WebDriverCapabilities has_touch_screen
                 * @property {boolean|null} [supports_native_events] WebDriverCapabilities supports_native_events
                 * @property {string|null} [image_filename_suffix] WebDriverCapabilities image_filename_suffix
                 */

                /**
                 * Constructs a new WebDriverCapabilities.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a WebDriverCapabilities.
                 * @implements IWebDriverCapabilities
                 * @constructor
                 * @param {mdc.test.screenshot.IWebDriverCapabilities=} [properties] Properties to set
                 */
                function WebDriverCapabilities(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * WebDriverCapabilities browserName.
                 * @member {string} browserName
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.browserName = "";

                /**
                 * WebDriverCapabilities browserVersion.
                 * @member {string} browserVersion
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.browserVersion = "";

                /**
                 * WebDriverCapabilities platformName.
                 * @member {string} platformName
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.platformName = "";

                /**
                 * WebDriverCapabilities platformVersion.
                 * @member {string} platformVersion
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.platformVersion = "";

                /**
                 * WebDriverCapabilities is_headless.
                 * @member {boolean} is_headless
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.is_headless = false;

                /**
                 * WebDriverCapabilities is_rotatable.
                 * @member {boolean} is_rotatable
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.is_rotatable = false;

                /**
                 * WebDriverCapabilities has_touch_screen.
                 * @member {boolean} has_touch_screen
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.has_touch_screen = false;

                /**
                 * WebDriverCapabilities supports_native_events.
                 * @member {boolean} supports_native_events
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.supports_native_events = false;

                /**
                 * WebDriverCapabilities image_filename_suffix.
                 * @member {string} image_filename_suffix
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 */
                WebDriverCapabilities.prototype.image_filename_suffix = "";

                /**
                 * Creates a new WebDriverCapabilities instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {mdc.test.screenshot.IWebDriverCapabilities=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.WebDriverCapabilities} WebDriverCapabilities instance
                 */
                WebDriverCapabilities.create = function create(properties) {
                    return new WebDriverCapabilities(properties);
                };

                /**
                 * Encodes the specified WebDriverCapabilities message. Does not implicitly {@link mdc.test.screenshot.WebDriverCapabilities.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {mdc.test.screenshot.IWebDriverCapabilities} message WebDriverCapabilities message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WebDriverCapabilities.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.browserName != null && message.hasOwnProperty("browserName"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.browserName);
                    if (message.browserVersion != null && message.hasOwnProperty("browserVersion"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.browserVersion);
                    if (message.platformName != null && message.hasOwnProperty("platformName"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.platformName);
                    if (message.platformVersion != null && message.hasOwnProperty("platformVersion"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.platformVersion);
                    if (message.is_headless != null && message.hasOwnProperty("is_headless"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.is_headless);
                    if (message.is_rotatable != null && message.hasOwnProperty("is_rotatable"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.is_rotatable);
                    if (message.has_touch_screen != null && message.hasOwnProperty("has_touch_screen"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.has_touch_screen);
                    if (message.supports_native_events != null && message.hasOwnProperty("supports_native_events"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.supports_native_events);
                    if (message.image_filename_suffix != null && message.hasOwnProperty("image_filename_suffix"))
                        writer.uint32(/* id 9, wireType 2 =*/74).string(message.image_filename_suffix);
                    return writer;
                };

                /**
                 * Encodes the specified WebDriverCapabilities message, length delimited. Does not implicitly {@link mdc.test.screenshot.WebDriverCapabilities.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {mdc.test.screenshot.IWebDriverCapabilities} message WebDriverCapabilities message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                WebDriverCapabilities.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a WebDriverCapabilities message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.WebDriverCapabilities} WebDriverCapabilities
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WebDriverCapabilities.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.WebDriverCapabilities();
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
                            message.platformName = reader.string();
                            break;
                        case 4:
                            message.platformVersion = reader.string();
                            break;
                        case 5:
                            message.is_headless = reader.bool();
                            break;
                        case 6:
                            message.is_rotatable = reader.bool();
                            break;
                        case 7:
                            message.has_touch_screen = reader.bool();
                            break;
                        case 8:
                            message.supports_native_events = reader.bool();
                            break;
                        case 9:
                            message.image_filename_suffix = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a WebDriverCapabilities message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.WebDriverCapabilities} WebDriverCapabilities
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                WebDriverCapabilities.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a WebDriverCapabilities message.
                 * @function verify
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                WebDriverCapabilities.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.browserName != null && message.hasOwnProperty("browserName"))
                        if (!$util.isString(message.browserName))
                            return "browserName: string expected";
                    if (message.browserVersion != null && message.hasOwnProperty("browserVersion"))
                        if (!$util.isString(message.browserVersion))
                            return "browserVersion: string expected";
                    if (message.platformName != null && message.hasOwnProperty("platformName"))
                        if (!$util.isString(message.platformName))
                            return "platformName: string expected";
                    if (message.platformVersion != null && message.hasOwnProperty("platformVersion"))
                        if (!$util.isString(message.platformVersion))
                            return "platformVersion: string expected";
                    if (message.is_headless != null && message.hasOwnProperty("is_headless"))
                        if (typeof message.is_headless !== "boolean")
                            return "is_headless: boolean expected";
                    if (message.is_rotatable != null && message.hasOwnProperty("is_rotatable"))
                        if (typeof message.is_rotatable !== "boolean")
                            return "is_rotatable: boolean expected";
                    if (message.has_touch_screen != null && message.hasOwnProperty("has_touch_screen"))
                        if (typeof message.has_touch_screen !== "boolean")
                            return "has_touch_screen: boolean expected";
                    if (message.supports_native_events != null && message.hasOwnProperty("supports_native_events"))
                        if (typeof message.supports_native_events !== "boolean")
                            return "supports_native_events: boolean expected";
                    if (message.image_filename_suffix != null && message.hasOwnProperty("image_filename_suffix"))
                        if (!$util.isString(message.image_filename_suffix))
                            return "image_filename_suffix: string expected";
                    return null;
                };

                /**
                 * Creates a WebDriverCapabilities message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.WebDriverCapabilities} WebDriverCapabilities
                 */
                WebDriverCapabilities.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.WebDriverCapabilities)
                        return object;
                    var message = new $root.mdc.test.screenshot.WebDriverCapabilities();
                    if (object.browserName != null)
                        message.browserName = String(object.browserName);
                    if (object.browserVersion != null)
                        message.browserVersion = String(object.browserVersion);
                    if (object.platformName != null)
                        message.platformName = String(object.platformName);
                    if (object.platformVersion != null)
                        message.platformVersion = String(object.platformVersion);
                    if (object.is_headless != null)
                        message.is_headless = Boolean(object.is_headless);
                    if (object.is_rotatable != null)
                        message.is_rotatable = Boolean(object.is_rotatable);
                    if (object.has_touch_screen != null)
                        message.has_touch_screen = Boolean(object.has_touch_screen);
                    if (object.supports_native_events != null)
                        message.supports_native_events = Boolean(object.supports_native_events);
                    if (object.image_filename_suffix != null)
                        message.image_filename_suffix = String(object.image_filename_suffix);
                    return message;
                };

                /**
                 * Creates a plain object from a WebDriverCapabilities message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @static
                 * @param {mdc.test.screenshot.WebDriverCapabilities} message WebDriverCapabilities
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                WebDriverCapabilities.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.browserName = "";
                        object.browserVersion = "";
                        object.platformName = "";
                        object.platformVersion = "";
                        object.is_headless = false;
                        object.is_rotatable = false;
                        object.has_touch_screen = false;
                        object.supports_native_events = false;
                        object.image_filename_suffix = "";
                    }
                    if (message.browserName != null && message.hasOwnProperty("browserName"))
                        object.browserName = message.browserName;
                    if (message.browserVersion != null && message.hasOwnProperty("browserVersion"))
                        object.browserVersion = message.browserVersion;
                    if (message.platformName != null && message.hasOwnProperty("platformName"))
                        object.platformName = message.platformName;
                    if (message.platformVersion != null && message.hasOwnProperty("platformVersion"))
                        object.platformVersion = message.platformVersion;
                    if (message.is_headless != null && message.hasOwnProperty("is_headless"))
                        object.is_headless = message.is_headless;
                    if (message.is_rotatable != null && message.hasOwnProperty("is_rotatable"))
                        object.is_rotatable = message.is_rotatable;
                    if (message.has_touch_screen != null && message.hasOwnProperty("has_touch_screen"))
                        object.has_touch_screen = message.has_touch_screen;
                    if (message.supports_native_events != null && message.hasOwnProperty("supports_native_events"))
                        object.supports_native_events = message.supports_native_events;
                    if (message.image_filename_suffix != null && message.hasOwnProperty("image_filename_suffix"))
                        object.image_filename_suffix = message.image_filename_suffix;
                    return object;
                };

                /**
                 * Converts this WebDriverCapabilities to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.WebDriverCapabilities
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                WebDriverCapabilities.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return WebDriverCapabilities;
            })();

            screenshot.Screenshots = (function() {

                /**
                 * Properties of a Screenshots.
                 * @memberof mdc.test.screenshot
                 * @interface IScreenshots
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [expected_screenshot_list] Screenshots expected_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [actual_screenshot_list] Screenshots actual_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [runnable_screenshot_list] Screenshots runnable_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [skipped_screenshot_list] Screenshots skipped_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [added_screenshot_list] Screenshots added_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [removed_screenshot_list] Screenshots removed_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [comparable_screenshot_list] Screenshots comparable_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [changed_screenshot_list] Screenshots changed_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [unchanged_screenshot_list] Screenshots unchanged_screenshot_list
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [expected_screenshot_browser_map] Screenshots expected_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [actual_screenshot_browser_map] Screenshots actual_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [runnable_screenshot_browser_map] Screenshots runnable_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [skipped_screenshot_browser_map] Screenshots skipped_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [added_screenshot_browser_map] Screenshots added_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [removed_screenshot_browser_map] Screenshots removed_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [comparable_screenshot_browser_map] Screenshots comparable_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [changed_screenshot_browser_map] Screenshots changed_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [unchanged_screenshot_browser_map] Screenshots unchanged_screenshot_browser_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [expected_screenshot_page_map] Screenshots expected_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [actual_screenshot_page_map] Screenshots actual_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [runnable_screenshot_page_map] Screenshots runnable_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [skipped_screenshot_page_map] Screenshots skipped_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [added_screenshot_page_map] Screenshots added_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [removed_screenshot_page_map] Screenshots removed_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [comparable_screenshot_page_map] Screenshots comparable_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [changed_screenshot_page_map] Screenshots changed_screenshot_page_map
                 * @property {Object.<string,mdc.test.screenshot.IScreenshotList>|null} [unchanged_screenshot_page_map] Screenshots unchanged_screenshot_page_map
                 */

                /**
                 * Constructs a new Screenshots.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a Screenshots.
                 * @implements IScreenshots
                 * @constructor
                 * @param {mdc.test.screenshot.IScreenshots=} [properties] Properties to set
                 */
                function Screenshots(properties) {
                    this.expected_screenshot_list = [];
                    this.actual_screenshot_list = [];
                    this.runnable_screenshot_list = [];
                    this.skipped_screenshot_list = [];
                    this.added_screenshot_list = [];
                    this.removed_screenshot_list = [];
                    this.comparable_screenshot_list = [];
                    this.changed_screenshot_list = [];
                    this.unchanged_screenshot_list = [];
                    this.expected_screenshot_browser_map = {};
                    this.actual_screenshot_browser_map = {};
                    this.runnable_screenshot_browser_map = {};
                    this.skipped_screenshot_browser_map = {};
                    this.added_screenshot_browser_map = {};
                    this.removed_screenshot_browser_map = {};
                    this.comparable_screenshot_browser_map = {};
                    this.changed_screenshot_browser_map = {};
                    this.unchanged_screenshot_browser_map = {};
                    this.expected_screenshot_page_map = {};
                    this.actual_screenshot_page_map = {};
                    this.runnable_screenshot_page_map = {};
                    this.skipped_screenshot_page_map = {};
                    this.added_screenshot_page_map = {};
                    this.removed_screenshot_page_map = {};
                    this.comparable_screenshot_page_map = {};
                    this.changed_screenshot_page_map = {};
                    this.unchanged_screenshot_page_map = {};
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Screenshots expected_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} expected_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.expected_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots actual_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} actual_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.actual_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots runnable_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} runnable_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.runnable_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots skipped_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} skipped_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.skipped_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots added_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} added_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.added_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots removed_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} removed_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.removed_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots comparable_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} comparable_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.comparable_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots changed_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} changed_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.changed_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots unchanged_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} unchanged_screenshot_list
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.unchanged_screenshot_list = $util.emptyArray;

                /**
                 * Screenshots expected_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} expected_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.expected_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots actual_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} actual_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.actual_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots runnable_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} runnable_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.runnable_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots skipped_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} skipped_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.skipped_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots added_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} added_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.added_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots removed_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} removed_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.removed_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots comparable_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} comparable_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.comparable_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots changed_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} changed_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.changed_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots unchanged_screenshot_browser_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} unchanged_screenshot_browser_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.unchanged_screenshot_browser_map = $util.emptyObject;

                /**
                 * Screenshots expected_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} expected_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.expected_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots actual_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} actual_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.actual_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots runnable_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} runnable_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.runnable_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots skipped_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} skipped_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.skipped_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots added_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} added_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.added_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots removed_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} removed_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.removed_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots comparable_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} comparable_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.comparable_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots changed_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} changed_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.changed_screenshot_page_map = $util.emptyObject;

                /**
                 * Screenshots unchanged_screenshot_page_map.
                 * @member {Object.<string,mdc.test.screenshot.IScreenshotList>} unchanged_screenshot_page_map
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 */
                Screenshots.prototype.unchanged_screenshot_page_map = $util.emptyObject;

                /**
                 * Creates a new Screenshots instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {mdc.test.screenshot.IScreenshots=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.Screenshots} Screenshots instance
                 */
                Screenshots.create = function create(properties) {
                    return new Screenshots(properties);
                };

                /**
                 * Encodes the specified Screenshots message. Does not implicitly {@link mdc.test.screenshot.Screenshots.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {mdc.test.screenshot.IScreenshots} message Screenshots message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Screenshots.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.expected_screenshot_list != null && message.expected_screenshot_list.length)
                        for (var i = 0; i < message.expected_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.expected_screenshot_list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.actual_screenshot_list != null && message.actual_screenshot_list.length)
                        for (var i = 0; i < message.actual_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.actual_screenshot_list[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.runnable_screenshot_list != null && message.runnable_screenshot_list.length)
                        for (var i = 0; i < message.runnable_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.runnable_screenshot_list[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.skipped_screenshot_list != null && message.skipped_screenshot_list.length)
                        for (var i = 0; i < message.skipped_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.skipped_screenshot_list[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.added_screenshot_list != null && message.added_screenshot_list.length)
                        for (var i = 0; i < message.added_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.added_screenshot_list[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.removed_screenshot_list != null && message.removed_screenshot_list.length)
                        for (var i = 0; i < message.removed_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.removed_screenshot_list[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.comparable_screenshot_list != null && message.comparable_screenshot_list.length)
                        for (var i = 0; i < message.comparable_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.comparable_screenshot_list[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    if (message.changed_screenshot_list != null && message.changed_screenshot_list.length)
                        for (var i = 0; i < message.changed_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.changed_screenshot_list[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                    if (message.unchanged_screenshot_list != null && message.unchanged_screenshot_list.length)
                        for (var i = 0; i < message.unchanged_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.unchanged_screenshot_list[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                    if (message.expected_screenshot_browser_map != null && message.hasOwnProperty("expected_screenshot_browser_map"))
                        for (var keys = Object.keys(message.expected_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 10, wireType 2 =*/82).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.expected_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.actual_screenshot_browser_map != null && message.hasOwnProperty("actual_screenshot_browser_map"))
                        for (var keys = Object.keys(message.actual_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 11, wireType 2 =*/90).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.actual_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.runnable_screenshot_browser_map != null && message.hasOwnProperty("runnable_screenshot_browser_map"))
                        for (var keys = Object.keys(message.runnable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 12, wireType 2 =*/98).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.runnable_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.skipped_screenshot_browser_map != null && message.hasOwnProperty("skipped_screenshot_browser_map"))
                        for (var keys = Object.keys(message.skipped_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 13, wireType 2 =*/106).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.skipped_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.added_screenshot_browser_map != null && message.hasOwnProperty("added_screenshot_browser_map"))
                        for (var keys = Object.keys(message.added_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 14, wireType 2 =*/114).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.added_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.removed_screenshot_browser_map != null && message.hasOwnProperty("removed_screenshot_browser_map"))
                        for (var keys = Object.keys(message.removed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 15, wireType 2 =*/122).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.removed_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.comparable_screenshot_browser_map != null && message.hasOwnProperty("comparable_screenshot_browser_map"))
                        for (var keys = Object.keys(message.comparable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 16, wireType 2 =*/130).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.comparable_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.changed_screenshot_browser_map != null && message.hasOwnProperty("changed_screenshot_browser_map"))
                        for (var keys = Object.keys(message.changed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 17, wireType 2 =*/138).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.changed_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.unchanged_screenshot_browser_map != null && message.hasOwnProperty("unchanged_screenshot_browser_map"))
                        for (var keys = Object.keys(message.unchanged_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 18, wireType 2 =*/146).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.unchanged_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.expected_screenshot_page_map != null && message.hasOwnProperty("expected_screenshot_page_map"))
                        for (var keys = Object.keys(message.expected_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 19, wireType 2 =*/154).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.expected_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.actual_screenshot_page_map != null && message.hasOwnProperty("actual_screenshot_page_map"))
                        for (var keys = Object.keys(message.actual_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 20, wireType 2 =*/162).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.actual_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.runnable_screenshot_page_map != null && message.hasOwnProperty("runnable_screenshot_page_map"))
                        for (var keys = Object.keys(message.runnable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 21, wireType 2 =*/170).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.runnable_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.skipped_screenshot_page_map != null && message.hasOwnProperty("skipped_screenshot_page_map"))
                        for (var keys = Object.keys(message.skipped_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 22, wireType 2 =*/178).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.skipped_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.added_screenshot_page_map != null && message.hasOwnProperty("added_screenshot_page_map"))
                        for (var keys = Object.keys(message.added_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 23, wireType 2 =*/186).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.added_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.removed_screenshot_page_map != null && message.hasOwnProperty("removed_screenshot_page_map"))
                        for (var keys = Object.keys(message.removed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 24, wireType 2 =*/194).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.removed_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.comparable_screenshot_page_map != null && message.hasOwnProperty("comparable_screenshot_page_map"))
                        for (var keys = Object.keys(message.comparable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 25, wireType 2 =*/202).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.comparable_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.changed_screenshot_page_map != null && message.hasOwnProperty("changed_screenshot_page_map"))
                        for (var keys = Object.keys(message.changed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 26, wireType 2 =*/210).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.changed_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    if (message.unchanged_screenshot_page_map != null && message.hasOwnProperty("unchanged_screenshot_page_map"))
                        for (var keys = Object.keys(message.unchanged_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 27, wireType 2 =*/218).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.ScreenshotList.encode(message.unchanged_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    return writer;
                };

                /**
                 * Encodes the specified Screenshots message, length delimited. Does not implicitly {@link mdc.test.screenshot.Screenshots.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {mdc.test.screenshot.IScreenshots} message Screenshots message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Screenshots.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Screenshots message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.Screenshots} Screenshots
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Screenshots.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.Screenshots(), key;
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.expected_screenshot_list && message.expected_screenshot_list.length))
                                message.expected_screenshot_list = [];
                            message.expected_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 2:
                            if (!(message.actual_screenshot_list && message.actual_screenshot_list.length))
                                message.actual_screenshot_list = [];
                            message.actual_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 3:
                            if (!(message.runnable_screenshot_list && message.runnable_screenshot_list.length))
                                message.runnable_screenshot_list = [];
                            message.runnable_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 4:
                            if (!(message.skipped_screenshot_list && message.skipped_screenshot_list.length))
                                message.skipped_screenshot_list = [];
                            message.skipped_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 5:
                            if (!(message.added_screenshot_list && message.added_screenshot_list.length))
                                message.added_screenshot_list = [];
                            message.added_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 6:
                            if (!(message.removed_screenshot_list && message.removed_screenshot_list.length))
                                message.removed_screenshot_list = [];
                            message.removed_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 7:
                            if (!(message.comparable_screenshot_list && message.comparable_screenshot_list.length))
                                message.comparable_screenshot_list = [];
                            message.comparable_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 8:
                            if (!(message.changed_screenshot_list && message.changed_screenshot_list.length))
                                message.changed_screenshot_list = [];
                            message.changed_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 9:
                            if (!(message.unchanged_screenshot_list && message.unchanged_screenshot_list.length))
                                message.unchanged_screenshot_list = [];
                            message.unchanged_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 10:
                            reader.skip().pos++;
                            if (message.expected_screenshot_browser_map === $util.emptyObject)
                                message.expected_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.expected_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 11:
                            reader.skip().pos++;
                            if (message.actual_screenshot_browser_map === $util.emptyObject)
                                message.actual_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.actual_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 12:
                            reader.skip().pos++;
                            if (message.runnable_screenshot_browser_map === $util.emptyObject)
                                message.runnable_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.runnable_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 13:
                            reader.skip().pos++;
                            if (message.skipped_screenshot_browser_map === $util.emptyObject)
                                message.skipped_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.skipped_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 14:
                            reader.skip().pos++;
                            if (message.added_screenshot_browser_map === $util.emptyObject)
                                message.added_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.added_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 15:
                            reader.skip().pos++;
                            if (message.removed_screenshot_browser_map === $util.emptyObject)
                                message.removed_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.removed_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 16:
                            reader.skip().pos++;
                            if (message.comparable_screenshot_browser_map === $util.emptyObject)
                                message.comparable_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.comparable_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 17:
                            reader.skip().pos++;
                            if (message.changed_screenshot_browser_map === $util.emptyObject)
                                message.changed_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.changed_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 18:
                            reader.skip().pos++;
                            if (message.unchanged_screenshot_browser_map === $util.emptyObject)
                                message.unchanged_screenshot_browser_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.unchanged_screenshot_browser_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 19:
                            reader.skip().pos++;
                            if (message.expected_screenshot_page_map === $util.emptyObject)
                                message.expected_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.expected_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 20:
                            reader.skip().pos++;
                            if (message.actual_screenshot_page_map === $util.emptyObject)
                                message.actual_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.actual_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 21:
                            reader.skip().pos++;
                            if (message.runnable_screenshot_page_map === $util.emptyObject)
                                message.runnable_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.runnable_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 22:
                            reader.skip().pos++;
                            if (message.skipped_screenshot_page_map === $util.emptyObject)
                                message.skipped_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.skipped_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 23:
                            reader.skip().pos++;
                            if (message.added_screenshot_page_map === $util.emptyObject)
                                message.added_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.added_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 24:
                            reader.skip().pos++;
                            if (message.removed_screenshot_page_map === $util.emptyObject)
                                message.removed_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.removed_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 25:
                            reader.skip().pos++;
                            if (message.comparable_screenshot_page_map === $util.emptyObject)
                                message.comparable_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.comparable_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 26:
                            reader.skip().pos++;
                            if (message.changed_screenshot_page_map === $util.emptyObject)
                                message.changed_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.changed_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        case 27:
                            reader.skip().pos++;
                            if (message.unchanged_screenshot_page_map === $util.emptyObject)
                                message.unchanged_screenshot_page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.unchanged_screenshot_page_map[key] = $root.mdc.test.screenshot.ScreenshotList.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Screenshots message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.Screenshots} Screenshots
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Screenshots.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Screenshots message.
                 * @function verify
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Screenshots.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.expected_screenshot_list != null && message.hasOwnProperty("expected_screenshot_list")) {
                        if (!Array.isArray(message.expected_screenshot_list))
                            return "expected_screenshot_list: array expected";
                        for (var i = 0; i < message.expected_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.expected_screenshot_list[i]);
                            if (error)
                                return "expected_screenshot_list." + error;
                        }
                    }
                    if (message.actual_screenshot_list != null && message.hasOwnProperty("actual_screenshot_list")) {
                        if (!Array.isArray(message.actual_screenshot_list))
                            return "actual_screenshot_list: array expected";
                        for (var i = 0; i < message.actual_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.actual_screenshot_list[i]);
                            if (error)
                                return "actual_screenshot_list." + error;
                        }
                    }
                    if (message.runnable_screenshot_list != null && message.hasOwnProperty("runnable_screenshot_list")) {
                        if (!Array.isArray(message.runnable_screenshot_list))
                            return "runnable_screenshot_list: array expected";
                        for (var i = 0; i < message.runnable_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.runnable_screenshot_list[i]);
                            if (error)
                                return "runnable_screenshot_list." + error;
                        }
                    }
                    if (message.skipped_screenshot_list != null && message.hasOwnProperty("skipped_screenshot_list")) {
                        if (!Array.isArray(message.skipped_screenshot_list))
                            return "skipped_screenshot_list: array expected";
                        for (var i = 0; i < message.skipped_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.skipped_screenshot_list[i]);
                            if (error)
                                return "skipped_screenshot_list." + error;
                        }
                    }
                    if (message.added_screenshot_list != null && message.hasOwnProperty("added_screenshot_list")) {
                        if (!Array.isArray(message.added_screenshot_list))
                            return "added_screenshot_list: array expected";
                        for (var i = 0; i < message.added_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.added_screenshot_list[i]);
                            if (error)
                                return "added_screenshot_list." + error;
                        }
                    }
                    if (message.removed_screenshot_list != null && message.hasOwnProperty("removed_screenshot_list")) {
                        if (!Array.isArray(message.removed_screenshot_list))
                            return "removed_screenshot_list: array expected";
                        for (var i = 0; i < message.removed_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.removed_screenshot_list[i]);
                            if (error)
                                return "removed_screenshot_list." + error;
                        }
                    }
                    if (message.comparable_screenshot_list != null && message.hasOwnProperty("comparable_screenshot_list")) {
                        if (!Array.isArray(message.comparable_screenshot_list))
                            return "comparable_screenshot_list: array expected";
                        for (var i = 0; i < message.comparable_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.comparable_screenshot_list[i]);
                            if (error)
                                return "comparable_screenshot_list." + error;
                        }
                    }
                    if (message.changed_screenshot_list != null && message.hasOwnProperty("changed_screenshot_list")) {
                        if (!Array.isArray(message.changed_screenshot_list))
                            return "changed_screenshot_list: array expected";
                        for (var i = 0; i < message.changed_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.changed_screenshot_list[i]);
                            if (error)
                                return "changed_screenshot_list." + error;
                        }
                    }
                    if (message.unchanged_screenshot_list != null && message.hasOwnProperty("unchanged_screenshot_list")) {
                        if (!Array.isArray(message.unchanged_screenshot_list))
                            return "unchanged_screenshot_list: array expected";
                        for (var i = 0; i < message.unchanged_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.unchanged_screenshot_list[i]);
                            if (error)
                                return "unchanged_screenshot_list." + error;
                        }
                    }
                    if (message.expected_screenshot_browser_map != null && message.hasOwnProperty("expected_screenshot_browser_map")) {
                        if (!$util.isObject(message.expected_screenshot_browser_map))
                            return "expected_screenshot_browser_map: object expected";
                        var key = Object.keys(message.expected_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.expected_screenshot_browser_map[key[i]]);
                            if (error)
                                return "expected_screenshot_browser_map." + error;
                        }
                    }
                    if (message.actual_screenshot_browser_map != null && message.hasOwnProperty("actual_screenshot_browser_map")) {
                        if (!$util.isObject(message.actual_screenshot_browser_map))
                            return "actual_screenshot_browser_map: object expected";
                        var key = Object.keys(message.actual_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.actual_screenshot_browser_map[key[i]]);
                            if (error)
                                return "actual_screenshot_browser_map." + error;
                        }
                    }
                    if (message.runnable_screenshot_browser_map != null && message.hasOwnProperty("runnable_screenshot_browser_map")) {
                        if (!$util.isObject(message.runnable_screenshot_browser_map))
                            return "runnable_screenshot_browser_map: object expected";
                        var key = Object.keys(message.runnable_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.runnable_screenshot_browser_map[key[i]]);
                            if (error)
                                return "runnable_screenshot_browser_map." + error;
                        }
                    }
                    if (message.skipped_screenshot_browser_map != null && message.hasOwnProperty("skipped_screenshot_browser_map")) {
                        if (!$util.isObject(message.skipped_screenshot_browser_map))
                            return "skipped_screenshot_browser_map: object expected";
                        var key = Object.keys(message.skipped_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.skipped_screenshot_browser_map[key[i]]);
                            if (error)
                                return "skipped_screenshot_browser_map." + error;
                        }
                    }
                    if (message.added_screenshot_browser_map != null && message.hasOwnProperty("added_screenshot_browser_map")) {
                        if (!$util.isObject(message.added_screenshot_browser_map))
                            return "added_screenshot_browser_map: object expected";
                        var key = Object.keys(message.added_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.added_screenshot_browser_map[key[i]]);
                            if (error)
                                return "added_screenshot_browser_map." + error;
                        }
                    }
                    if (message.removed_screenshot_browser_map != null && message.hasOwnProperty("removed_screenshot_browser_map")) {
                        if (!$util.isObject(message.removed_screenshot_browser_map))
                            return "removed_screenshot_browser_map: object expected";
                        var key = Object.keys(message.removed_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.removed_screenshot_browser_map[key[i]]);
                            if (error)
                                return "removed_screenshot_browser_map." + error;
                        }
                    }
                    if (message.comparable_screenshot_browser_map != null && message.hasOwnProperty("comparable_screenshot_browser_map")) {
                        if (!$util.isObject(message.comparable_screenshot_browser_map))
                            return "comparable_screenshot_browser_map: object expected";
                        var key = Object.keys(message.comparable_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.comparable_screenshot_browser_map[key[i]]);
                            if (error)
                                return "comparable_screenshot_browser_map." + error;
                        }
                    }
                    if (message.changed_screenshot_browser_map != null && message.hasOwnProperty("changed_screenshot_browser_map")) {
                        if (!$util.isObject(message.changed_screenshot_browser_map))
                            return "changed_screenshot_browser_map: object expected";
                        var key = Object.keys(message.changed_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.changed_screenshot_browser_map[key[i]]);
                            if (error)
                                return "changed_screenshot_browser_map." + error;
                        }
                    }
                    if (message.unchanged_screenshot_browser_map != null && message.hasOwnProperty("unchanged_screenshot_browser_map")) {
                        if (!$util.isObject(message.unchanged_screenshot_browser_map))
                            return "unchanged_screenshot_browser_map: object expected";
                        var key = Object.keys(message.unchanged_screenshot_browser_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.unchanged_screenshot_browser_map[key[i]]);
                            if (error)
                                return "unchanged_screenshot_browser_map." + error;
                        }
                    }
                    if (message.expected_screenshot_page_map != null && message.hasOwnProperty("expected_screenshot_page_map")) {
                        if (!$util.isObject(message.expected_screenshot_page_map))
                            return "expected_screenshot_page_map: object expected";
                        var key = Object.keys(message.expected_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.expected_screenshot_page_map[key[i]]);
                            if (error)
                                return "expected_screenshot_page_map." + error;
                        }
                    }
                    if (message.actual_screenshot_page_map != null && message.hasOwnProperty("actual_screenshot_page_map")) {
                        if (!$util.isObject(message.actual_screenshot_page_map))
                            return "actual_screenshot_page_map: object expected";
                        var key = Object.keys(message.actual_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.actual_screenshot_page_map[key[i]]);
                            if (error)
                                return "actual_screenshot_page_map." + error;
                        }
                    }
                    if (message.runnable_screenshot_page_map != null && message.hasOwnProperty("runnable_screenshot_page_map")) {
                        if (!$util.isObject(message.runnable_screenshot_page_map))
                            return "runnable_screenshot_page_map: object expected";
                        var key = Object.keys(message.runnable_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.runnable_screenshot_page_map[key[i]]);
                            if (error)
                                return "runnable_screenshot_page_map." + error;
                        }
                    }
                    if (message.skipped_screenshot_page_map != null && message.hasOwnProperty("skipped_screenshot_page_map")) {
                        if (!$util.isObject(message.skipped_screenshot_page_map))
                            return "skipped_screenshot_page_map: object expected";
                        var key = Object.keys(message.skipped_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.skipped_screenshot_page_map[key[i]]);
                            if (error)
                                return "skipped_screenshot_page_map." + error;
                        }
                    }
                    if (message.added_screenshot_page_map != null && message.hasOwnProperty("added_screenshot_page_map")) {
                        if (!$util.isObject(message.added_screenshot_page_map))
                            return "added_screenshot_page_map: object expected";
                        var key = Object.keys(message.added_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.added_screenshot_page_map[key[i]]);
                            if (error)
                                return "added_screenshot_page_map." + error;
                        }
                    }
                    if (message.removed_screenshot_page_map != null && message.hasOwnProperty("removed_screenshot_page_map")) {
                        if (!$util.isObject(message.removed_screenshot_page_map))
                            return "removed_screenshot_page_map: object expected";
                        var key = Object.keys(message.removed_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.removed_screenshot_page_map[key[i]]);
                            if (error)
                                return "removed_screenshot_page_map." + error;
                        }
                    }
                    if (message.comparable_screenshot_page_map != null && message.hasOwnProperty("comparable_screenshot_page_map")) {
                        if (!$util.isObject(message.comparable_screenshot_page_map))
                            return "comparable_screenshot_page_map: object expected";
                        var key = Object.keys(message.comparable_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.comparable_screenshot_page_map[key[i]]);
                            if (error)
                                return "comparable_screenshot_page_map." + error;
                        }
                    }
                    if (message.changed_screenshot_page_map != null && message.hasOwnProperty("changed_screenshot_page_map")) {
                        if (!$util.isObject(message.changed_screenshot_page_map))
                            return "changed_screenshot_page_map: object expected";
                        var key = Object.keys(message.changed_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.changed_screenshot_page_map[key[i]]);
                            if (error)
                                return "changed_screenshot_page_map." + error;
                        }
                    }
                    if (message.unchanged_screenshot_page_map != null && message.hasOwnProperty("unchanged_screenshot_page_map")) {
                        if (!$util.isObject(message.unchanged_screenshot_page_map))
                            return "unchanged_screenshot_page_map: object expected";
                        var key = Object.keys(message.unchanged_screenshot_page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.ScreenshotList.verify(message.unchanged_screenshot_page_map[key[i]]);
                            if (error)
                                return "unchanged_screenshot_page_map." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a Screenshots message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.Screenshots} Screenshots
                 */
                Screenshots.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.Screenshots)
                        return object;
                    var message = new $root.mdc.test.screenshot.Screenshots();
                    if (object.expected_screenshot_list) {
                        if (!Array.isArray(object.expected_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.expected_screenshot_list: array expected");
                        message.expected_screenshot_list = [];
                        for (var i = 0; i < object.expected_screenshot_list.length; ++i) {
                            if (typeof object.expected_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.expected_screenshot_list: object expected");
                            message.expected_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.expected_screenshot_list[i]);
                        }
                    }
                    if (object.actual_screenshot_list) {
                        if (!Array.isArray(object.actual_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.actual_screenshot_list: array expected");
                        message.actual_screenshot_list = [];
                        for (var i = 0; i < object.actual_screenshot_list.length; ++i) {
                            if (typeof object.actual_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.actual_screenshot_list: object expected");
                            message.actual_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.actual_screenshot_list[i]);
                        }
                    }
                    if (object.runnable_screenshot_list) {
                        if (!Array.isArray(object.runnable_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.runnable_screenshot_list: array expected");
                        message.runnable_screenshot_list = [];
                        for (var i = 0; i < object.runnable_screenshot_list.length; ++i) {
                            if (typeof object.runnable_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.runnable_screenshot_list: object expected");
                            message.runnable_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.runnable_screenshot_list[i]);
                        }
                    }
                    if (object.skipped_screenshot_list) {
                        if (!Array.isArray(object.skipped_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.skipped_screenshot_list: array expected");
                        message.skipped_screenshot_list = [];
                        for (var i = 0; i < object.skipped_screenshot_list.length; ++i) {
                            if (typeof object.skipped_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.skipped_screenshot_list: object expected");
                            message.skipped_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.skipped_screenshot_list[i]);
                        }
                    }
                    if (object.added_screenshot_list) {
                        if (!Array.isArray(object.added_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.added_screenshot_list: array expected");
                        message.added_screenshot_list = [];
                        for (var i = 0; i < object.added_screenshot_list.length; ++i) {
                            if (typeof object.added_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.added_screenshot_list: object expected");
                            message.added_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.added_screenshot_list[i]);
                        }
                    }
                    if (object.removed_screenshot_list) {
                        if (!Array.isArray(object.removed_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.removed_screenshot_list: array expected");
                        message.removed_screenshot_list = [];
                        for (var i = 0; i < object.removed_screenshot_list.length; ++i) {
                            if (typeof object.removed_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.removed_screenshot_list: object expected");
                            message.removed_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.removed_screenshot_list[i]);
                        }
                    }
                    if (object.comparable_screenshot_list) {
                        if (!Array.isArray(object.comparable_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.comparable_screenshot_list: array expected");
                        message.comparable_screenshot_list = [];
                        for (var i = 0; i < object.comparable_screenshot_list.length; ++i) {
                            if (typeof object.comparable_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.comparable_screenshot_list: object expected");
                            message.comparable_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.comparable_screenshot_list[i]);
                        }
                    }
                    if (object.changed_screenshot_list) {
                        if (!Array.isArray(object.changed_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.changed_screenshot_list: array expected");
                        message.changed_screenshot_list = [];
                        for (var i = 0; i < object.changed_screenshot_list.length; ++i) {
                            if (typeof object.changed_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.changed_screenshot_list: object expected");
                            message.changed_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.changed_screenshot_list[i]);
                        }
                    }
                    if (object.unchanged_screenshot_list) {
                        if (!Array.isArray(object.unchanged_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Screenshots.unchanged_screenshot_list: array expected");
                        message.unchanged_screenshot_list = [];
                        for (var i = 0; i < object.unchanged_screenshot_list.length; ++i) {
                            if (typeof object.unchanged_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.unchanged_screenshot_list: object expected");
                            message.unchanged_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.unchanged_screenshot_list[i]);
                        }
                    }
                    if (object.expected_screenshot_browser_map) {
                        if (typeof object.expected_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.expected_screenshot_browser_map: object expected");
                        message.expected_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.expected_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.expected_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.expected_screenshot_browser_map: object expected");
                            message.expected_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.expected_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.actual_screenshot_browser_map) {
                        if (typeof object.actual_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.actual_screenshot_browser_map: object expected");
                        message.actual_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.actual_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.actual_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.actual_screenshot_browser_map: object expected");
                            message.actual_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.actual_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.runnable_screenshot_browser_map) {
                        if (typeof object.runnable_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.runnable_screenshot_browser_map: object expected");
                        message.runnable_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.runnable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.runnable_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.runnable_screenshot_browser_map: object expected");
                            message.runnable_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.runnable_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.skipped_screenshot_browser_map) {
                        if (typeof object.skipped_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.skipped_screenshot_browser_map: object expected");
                        message.skipped_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.skipped_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.skipped_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.skipped_screenshot_browser_map: object expected");
                            message.skipped_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.skipped_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.added_screenshot_browser_map) {
                        if (typeof object.added_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.added_screenshot_browser_map: object expected");
                        message.added_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.added_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.added_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.added_screenshot_browser_map: object expected");
                            message.added_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.added_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.removed_screenshot_browser_map) {
                        if (typeof object.removed_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.removed_screenshot_browser_map: object expected");
                        message.removed_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.removed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.removed_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.removed_screenshot_browser_map: object expected");
                            message.removed_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.removed_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.comparable_screenshot_browser_map) {
                        if (typeof object.comparable_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.comparable_screenshot_browser_map: object expected");
                        message.comparable_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.comparable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.comparable_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.comparable_screenshot_browser_map: object expected");
                            message.comparable_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.comparable_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.changed_screenshot_browser_map) {
                        if (typeof object.changed_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.changed_screenshot_browser_map: object expected");
                        message.changed_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.changed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.changed_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.changed_screenshot_browser_map: object expected");
                            message.changed_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.changed_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.unchanged_screenshot_browser_map) {
                        if (typeof object.unchanged_screenshot_browser_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.unchanged_screenshot_browser_map: object expected");
                        message.unchanged_screenshot_browser_map = {};
                        for (var keys = Object.keys(object.unchanged_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.unchanged_screenshot_browser_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.unchanged_screenshot_browser_map: object expected");
                            message.unchanged_screenshot_browser_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.unchanged_screenshot_browser_map[keys[i]]);
                        }
                    }
                    if (object.expected_screenshot_page_map) {
                        if (typeof object.expected_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.expected_screenshot_page_map: object expected");
                        message.expected_screenshot_page_map = {};
                        for (var keys = Object.keys(object.expected_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.expected_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.expected_screenshot_page_map: object expected");
                            message.expected_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.expected_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.actual_screenshot_page_map) {
                        if (typeof object.actual_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.actual_screenshot_page_map: object expected");
                        message.actual_screenshot_page_map = {};
                        for (var keys = Object.keys(object.actual_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.actual_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.actual_screenshot_page_map: object expected");
                            message.actual_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.actual_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.runnable_screenshot_page_map) {
                        if (typeof object.runnable_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.runnable_screenshot_page_map: object expected");
                        message.runnable_screenshot_page_map = {};
                        for (var keys = Object.keys(object.runnable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.runnable_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.runnable_screenshot_page_map: object expected");
                            message.runnable_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.runnable_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.skipped_screenshot_page_map) {
                        if (typeof object.skipped_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.skipped_screenshot_page_map: object expected");
                        message.skipped_screenshot_page_map = {};
                        for (var keys = Object.keys(object.skipped_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.skipped_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.skipped_screenshot_page_map: object expected");
                            message.skipped_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.skipped_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.added_screenshot_page_map) {
                        if (typeof object.added_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.added_screenshot_page_map: object expected");
                        message.added_screenshot_page_map = {};
                        for (var keys = Object.keys(object.added_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.added_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.added_screenshot_page_map: object expected");
                            message.added_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.added_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.removed_screenshot_page_map) {
                        if (typeof object.removed_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.removed_screenshot_page_map: object expected");
                        message.removed_screenshot_page_map = {};
                        for (var keys = Object.keys(object.removed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.removed_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.removed_screenshot_page_map: object expected");
                            message.removed_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.removed_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.comparable_screenshot_page_map) {
                        if (typeof object.comparable_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.comparable_screenshot_page_map: object expected");
                        message.comparable_screenshot_page_map = {};
                        for (var keys = Object.keys(object.comparable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.comparable_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.comparable_screenshot_page_map: object expected");
                            message.comparable_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.comparable_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.changed_screenshot_page_map) {
                        if (typeof object.changed_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.changed_screenshot_page_map: object expected");
                        message.changed_screenshot_page_map = {};
                        for (var keys = Object.keys(object.changed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.changed_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.changed_screenshot_page_map: object expected");
                            message.changed_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.changed_screenshot_page_map[keys[i]]);
                        }
                    }
                    if (object.unchanged_screenshot_page_map) {
                        if (typeof object.unchanged_screenshot_page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshots.unchanged_screenshot_page_map: object expected");
                        message.unchanged_screenshot_page_map = {};
                        for (var keys = Object.keys(object.unchanged_screenshot_page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.unchanged_screenshot_page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.Screenshots.unchanged_screenshot_page_map: object expected");
                            message.unchanged_screenshot_page_map[keys[i]] = $root.mdc.test.screenshot.ScreenshotList.fromObject(object.unchanged_screenshot_page_map[keys[i]]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Screenshots message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.Screenshots
                 * @static
                 * @param {mdc.test.screenshot.Screenshots} message Screenshots
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Screenshots.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.expected_screenshot_list = [];
                        object.actual_screenshot_list = [];
                        object.runnable_screenshot_list = [];
                        object.skipped_screenshot_list = [];
                        object.added_screenshot_list = [];
                        object.removed_screenshot_list = [];
                        object.comparable_screenshot_list = [];
                        object.changed_screenshot_list = [];
                        object.unchanged_screenshot_list = [];
                    }
                    if (options.objects || options.defaults) {
                        object.expected_screenshot_browser_map = {};
                        object.actual_screenshot_browser_map = {};
                        object.runnable_screenshot_browser_map = {};
                        object.skipped_screenshot_browser_map = {};
                        object.added_screenshot_browser_map = {};
                        object.removed_screenshot_browser_map = {};
                        object.comparable_screenshot_browser_map = {};
                        object.changed_screenshot_browser_map = {};
                        object.unchanged_screenshot_browser_map = {};
                        object.expected_screenshot_page_map = {};
                        object.actual_screenshot_page_map = {};
                        object.runnable_screenshot_page_map = {};
                        object.skipped_screenshot_page_map = {};
                        object.added_screenshot_page_map = {};
                        object.removed_screenshot_page_map = {};
                        object.comparable_screenshot_page_map = {};
                        object.changed_screenshot_page_map = {};
                        object.unchanged_screenshot_page_map = {};
                    }
                    if (message.expected_screenshot_list && message.expected_screenshot_list.length) {
                        object.expected_screenshot_list = [];
                        for (var j = 0; j < message.expected_screenshot_list.length; ++j)
                            object.expected_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.expected_screenshot_list[j], options);
                    }
                    if (message.actual_screenshot_list && message.actual_screenshot_list.length) {
                        object.actual_screenshot_list = [];
                        for (var j = 0; j < message.actual_screenshot_list.length; ++j)
                            object.actual_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.actual_screenshot_list[j], options);
                    }
                    if (message.runnable_screenshot_list && message.runnable_screenshot_list.length) {
                        object.runnable_screenshot_list = [];
                        for (var j = 0; j < message.runnable_screenshot_list.length; ++j)
                            object.runnable_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.runnable_screenshot_list[j], options);
                    }
                    if (message.skipped_screenshot_list && message.skipped_screenshot_list.length) {
                        object.skipped_screenshot_list = [];
                        for (var j = 0; j < message.skipped_screenshot_list.length; ++j)
                            object.skipped_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.skipped_screenshot_list[j], options);
                    }
                    if (message.added_screenshot_list && message.added_screenshot_list.length) {
                        object.added_screenshot_list = [];
                        for (var j = 0; j < message.added_screenshot_list.length; ++j)
                            object.added_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.added_screenshot_list[j], options);
                    }
                    if (message.removed_screenshot_list && message.removed_screenshot_list.length) {
                        object.removed_screenshot_list = [];
                        for (var j = 0; j < message.removed_screenshot_list.length; ++j)
                            object.removed_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.removed_screenshot_list[j], options);
                    }
                    if (message.comparable_screenshot_list && message.comparable_screenshot_list.length) {
                        object.comparable_screenshot_list = [];
                        for (var j = 0; j < message.comparable_screenshot_list.length; ++j)
                            object.comparable_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.comparable_screenshot_list[j], options);
                    }
                    if (message.changed_screenshot_list && message.changed_screenshot_list.length) {
                        object.changed_screenshot_list = [];
                        for (var j = 0; j < message.changed_screenshot_list.length; ++j)
                            object.changed_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.changed_screenshot_list[j], options);
                    }
                    if (message.unchanged_screenshot_list && message.unchanged_screenshot_list.length) {
                        object.unchanged_screenshot_list = [];
                        for (var j = 0; j < message.unchanged_screenshot_list.length; ++j)
                            object.unchanged_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.unchanged_screenshot_list[j], options);
                    }
                    var keys2;
                    if (message.expected_screenshot_browser_map && (keys2 = Object.keys(message.expected_screenshot_browser_map)).length) {
                        object.expected_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.expected_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.expected_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.actual_screenshot_browser_map && (keys2 = Object.keys(message.actual_screenshot_browser_map)).length) {
                        object.actual_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.actual_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.actual_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.runnable_screenshot_browser_map && (keys2 = Object.keys(message.runnable_screenshot_browser_map)).length) {
                        object.runnable_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.runnable_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.runnable_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.skipped_screenshot_browser_map && (keys2 = Object.keys(message.skipped_screenshot_browser_map)).length) {
                        object.skipped_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.skipped_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.skipped_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.added_screenshot_browser_map && (keys2 = Object.keys(message.added_screenshot_browser_map)).length) {
                        object.added_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.added_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.added_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.removed_screenshot_browser_map && (keys2 = Object.keys(message.removed_screenshot_browser_map)).length) {
                        object.removed_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.removed_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.removed_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.comparable_screenshot_browser_map && (keys2 = Object.keys(message.comparable_screenshot_browser_map)).length) {
                        object.comparable_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.comparable_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.comparable_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.changed_screenshot_browser_map && (keys2 = Object.keys(message.changed_screenshot_browser_map)).length) {
                        object.changed_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.changed_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.changed_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.unchanged_screenshot_browser_map && (keys2 = Object.keys(message.unchanged_screenshot_browser_map)).length) {
                        object.unchanged_screenshot_browser_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.unchanged_screenshot_browser_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.unchanged_screenshot_browser_map[keys2[j]], options);
                    }
                    if (message.expected_screenshot_page_map && (keys2 = Object.keys(message.expected_screenshot_page_map)).length) {
                        object.expected_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.expected_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.expected_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.actual_screenshot_page_map && (keys2 = Object.keys(message.actual_screenshot_page_map)).length) {
                        object.actual_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.actual_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.actual_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.runnable_screenshot_page_map && (keys2 = Object.keys(message.runnable_screenshot_page_map)).length) {
                        object.runnable_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.runnable_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.runnable_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.skipped_screenshot_page_map && (keys2 = Object.keys(message.skipped_screenshot_page_map)).length) {
                        object.skipped_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.skipped_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.skipped_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.added_screenshot_page_map && (keys2 = Object.keys(message.added_screenshot_page_map)).length) {
                        object.added_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.added_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.added_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.removed_screenshot_page_map && (keys2 = Object.keys(message.removed_screenshot_page_map)).length) {
                        object.removed_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.removed_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.removed_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.comparable_screenshot_page_map && (keys2 = Object.keys(message.comparable_screenshot_page_map)).length) {
                        object.comparable_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.comparable_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.comparable_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.changed_screenshot_page_map && (keys2 = Object.keys(message.changed_screenshot_page_map)).length) {
                        object.changed_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.changed_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.changed_screenshot_page_map[keys2[j]], options);
                    }
                    if (message.unchanged_screenshot_page_map && (keys2 = Object.keys(message.unchanged_screenshot_page_map)).length) {
                        object.unchanged_screenshot_page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.unchanged_screenshot_page_map[keys2[j]] = $root.mdc.test.screenshot.ScreenshotList.toObject(message.unchanged_screenshot_page_map[keys2[j]], options);
                    }
                    return object;
                };

                /**
                 * Converts this Screenshots to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.Screenshots
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Screenshots.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Screenshots;
            })();

            screenshot.ScreenshotList = (function() {

                /**
                 * Properties of a ScreenshotList.
                 * @memberof mdc.test.screenshot
                 * @interface IScreenshotList
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [screenshots] ScreenshotList screenshots
                 */

                /**
                 * Constructs a new ScreenshotList.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a ScreenshotList.
                 * @implements IScreenshotList
                 * @constructor
                 * @param {mdc.test.screenshot.IScreenshotList=} [properties] Properties to set
                 */
                function ScreenshotList(properties) {
                    this.screenshots = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ScreenshotList screenshots.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} screenshots
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @instance
                 */
                ScreenshotList.prototype.screenshots = $util.emptyArray;

                /**
                 * Creates a new ScreenshotList instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {mdc.test.screenshot.IScreenshotList=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.ScreenshotList} ScreenshotList instance
                 */
                ScreenshotList.create = function create(properties) {
                    return new ScreenshotList(properties);
                };

                /**
                 * Encodes the specified ScreenshotList message. Does not implicitly {@link mdc.test.screenshot.ScreenshotList.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {mdc.test.screenshot.IScreenshotList} message ScreenshotList message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ScreenshotList.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.screenshots != null && message.screenshots.length)
                        for (var i = 0; i < message.screenshots.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.screenshots[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified ScreenshotList message, length delimited. Does not implicitly {@link mdc.test.screenshot.ScreenshotList.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {mdc.test.screenshot.IScreenshotList} message ScreenshotList message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ScreenshotList.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a ScreenshotList message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.ScreenshotList} ScreenshotList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ScreenshotList.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.ScreenshotList();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.screenshots && message.screenshots.length))
                                message.screenshots = [];
                            message.screenshots.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a ScreenshotList message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.ScreenshotList} ScreenshotList
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ScreenshotList.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a ScreenshotList message.
                 * @function verify
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ScreenshotList.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.screenshots != null && message.hasOwnProperty("screenshots")) {
                        if (!Array.isArray(message.screenshots))
                            return "screenshots: array expected";
                        for (var i = 0; i < message.screenshots.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.screenshots[i]);
                            if (error)
                                return "screenshots." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a ScreenshotList message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.ScreenshotList} ScreenshotList
                 */
                ScreenshotList.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.ScreenshotList)
                        return object;
                    var message = new $root.mdc.test.screenshot.ScreenshotList();
                    if (object.screenshots) {
                        if (!Array.isArray(object.screenshots))
                            throw TypeError(".mdc.test.screenshot.ScreenshotList.screenshots: array expected");
                        message.screenshots = [];
                        for (var i = 0; i < object.screenshots.length; ++i) {
                            if (typeof object.screenshots[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.ScreenshotList.screenshots: object expected");
                            message.screenshots[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.screenshots[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a ScreenshotList message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @static
                 * @param {mdc.test.screenshot.ScreenshotList} message ScreenshotList
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ScreenshotList.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.screenshots = [];
                    if (message.screenshots && message.screenshots.length) {
                        object.screenshots = [];
                        for (var j = 0; j < message.screenshots.length; ++j)
                            object.screenshots[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.screenshots[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this ScreenshotList to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.ScreenshotList
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ScreenshotList.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ScreenshotList;
            })();

            screenshot.Screenshot = (function() {

                /**
                 * Properties of a Screenshot.
                 * @memberof mdc.test.screenshot
                 * @interface IScreenshot
                 * @property {mdc.test.screenshot.Screenshot.InclusionType|null} [inclusion_type] Screenshot inclusion_type
                 * @property {boolean|null} [is_runnable] Screenshot is_runnable
                 * @property {mdc.test.screenshot.Screenshot.CaptureState|null} [capture_state] Screenshot capture_state
                 * @property {mdc.test.screenshot.IImageDiffResult|null} [image_diff_result] Screenshot image_diff_result
                 * @property {mdc.test.screenshot.IUserAgent|null} [user_agent] Screenshot user_agent
                 * @property {mdc.test.screenshot.ITestFile|null} [test_page_file] Screenshot test_page_file
                 * @property {mdc.test.screenshot.ITestFile|null} [expected_image_file] Screenshot expected_image_file
                 * @property {mdc.test.screenshot.ITestFile|null} [actual_image_file] Screenshot actual_image_file
                 */

                /**
                 * Constructs a new Screenshot.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a Screenshot.
                 * @implements IScreenshot
                 * @constructor
                 * @param {mdc.test.screenshot.IScreenshot=} [properties] Properties to set
                 */
                function Screenshot(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Screenshot inclusion_type.
                 * @member {mdc.test.screenshot.Screenshot.InclusionType} inclusion_type
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.inclusion_type = 0;

                /**
                 * Screenshot is_runnable.
                 * @member {boolean} is_runnable
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.is_runnable = false;

                /**
                 * Screenshot capture_state.
                 * @member {mdc.test.screenshot.Screenshot.CaptureState} capture_state
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.capture_state = 0;

                /**
                 * Screenshot image_diff_result.
                 * @member {mdc.test.screenshot.IImageDiffResult|null|undefined} image_diff_result
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.image_diff_result = null;

                /**
                 * Screenshot user_agent.
                 * @member {mdc.test.screenshot.IUserAgent|null|undefined} user_agent
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.user_agent = null;

                /**
                 * Screenshot test_page_file.
                 * @member {mdc.test.screenshot.ITestFile|null|undefined} test_page_file
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.test_page_file = null;

                /**
                 * Screenshot expected_image_file.
                 * @member {mdc.test.screenshot.ITestFile|null|undefined} expected_image_file
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.expected_image_file = null;

                /**
                 * Screenshot actual_image_file.
                 * @member {mdc.test.screenshot.ITestFile|null|undefined} actual_image_file
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 */
                Screenshot.prototype.actual_image_file = null;

                /**
                 * Creates a new Screenshot instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {mdc.test.screenshot.IScreenshot=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.Screenshot} Screenshot instance
                 */
                Screenshot.create = function create(properties) {
                    return new Screenshot(properties);
                };

                /**
                 * Encodes the specified Screenshot message. Does not implicitly {@link mdc.test.screenshot.Screenshot.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {mdc.test.screenshot.IScreenshot} message Screenshot message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Screenshot.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.inclusion_type != null && message.hasOwnProperty("inclusion_type"))
                        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.inclusion_type);
                    if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.is_runnable);
                    if (message.capture_state != null && message.hasOwnProperty("capture_state"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.capture_state);
                    if (message.image_diff_result != null && message.hasOwnProperty("image_diff_result"))
                        $root.mdc.test.screenshot.ImageDiffResult.encode(message.image_diff_result, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.user_agent != null && message.hasOwnProperty("user_agent"))
                        $root.mdc.test.screenshot.UserAgent.encode(message.user_agent, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.test_page_file != null && message.hasOwnProperty("test_page_file"))
                        $root.mdc.test.screenshot.TestFile.encode(message.test_page_file, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    if (message.expected_image_file != null && message.hasOwnProperty("expected_image_file"))
                        $root.mdc.test.screenshot.TestFile.encode(message.expected_image_file, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    if (message.actual_image_file != null && message.hasOwnProperty("actual_image_file"))
                        $root.mdc.test.screenshot.TestFile.encode(message.actual_image_file, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Screenshot message, length delimited. Does not implicitly {@link mdc.test.screenshot.Screenshot.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {mdc.test.screenshot.IScreenshot} message Screenshot message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Screenshot.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Screenshot message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.Screenshot} Screenshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Screenshot.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.Screenshot();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.inclusion_type = reader.int32();
                            break;
                        case 2:
                            message.is_runnable = reader.bool();
                            break;
                        case 3:
                            message.capture_state = reader.int32();
                            break;
                        case 4:
                            message.image_diff_result = $root.mdc.test.screenshot.ImageDiffResult.decode(reader, reader.uint32());
                            break;
                        case 5:
                            message.user_agent = $root.mdc.test.screenshot.UserAgent.decode(reader, reader.uint32());
                            break;
                        case 6:
                            message.test_page_file = $root.mdc.test.screenshot.TestFile.decode(reader, reader.uint32());
                            break;
                        case 7:
                            message.expected_image_file = $root.mdc.test.screenshot.TestFile.decode(reader, reader.uint32());
                            break;
                        case 8:
                            message.actual_image_file = $root.mdc.test.screenshot.TestFile.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Screenshot message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.Screenshot} Screenshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Screenshot.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Screenshot message.
                 * @function verify
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Screenshot.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.inclusion_type != null && message.hasOwnProperty("inclusion_type"))
                        switch (message.inclusion_type) {
                        default:
                            return "inclusion_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            break;
                        }
                    if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                        if (typeof message.is_runnable !== "boolean")
                            return "is_runnable: boolean expected";
                    if (message.capture_state != null && message.hasOwnProperty("capture_state"))
                        switch (message.capture_state) {
                        default:
                            return "capture_state: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            break;
                        }
                    if (message.image_diff_result != null && message.hasOwnProperty("image_diff_result")) {
                        var error = $root.mdc.test.screenshot.ImageDiffResult.verify(message.image_diff_result);
                        if (error)
                            return "image_diff_result." + error;
                    }
                    if (message.user_agent != null && message.hasOwnProperty("user_agent")) {
                        var error = $root.mdc.test.screenshot.UserAgent.verify(message.user_agent);
                        if (error)
                            return "user_agent." + error;
                    }
                    if (message.test_page_file != null && message.hasOwnProperty("test_page_file")) {
                        var error = $root.mdc.test.screenshot.TestFile.verify(message.test_page_file);
                        if (error)
                            return "test_page_file." + error;
                    }
                    if (message.expected_image_file != null && message.hasOwnProperty("expected_image_file")) {
                        var error = $root.mdc.test.screenshot.TestFile.verify(message.expected_image_file);
                        if (error)
                            return "expected_image_file." + error;
                    }
                    if (message.actual_image_file != null && message.hasOwnProperty("actual_image_file")) {
                        var error = $root.mdc.test.screenshot.TestFile.verify(message.actual_image_file);
                        if (error)
                            return "actual_image_file." + error;
                    }
                    return null;
                };

                /**
                 * Creates a Screenshot message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.Screenshot} Screenshot
                 */
                Screenshot.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.Screenshot)
                        return object;
                    var message = new $root.mdc.test.screenshot.Screenshot();
                    switch (object.inclusion_type) {
                    case "UNKNOWN":
                    case 0:
                        message.inclusion_type = 0;
                        break;
                    case "ADD":
                    case 1:
                        message.inclusion_type = 1;
                        break;
                    case "SKIP":
                    case 2:
                        message.inclusion_type = 2;
                        break;
                    case "REMOVE":
                    case 3:
                        message.inclusion_type = 3;
                        break;
                    case "COMPARE":
                    case 4:
                        message.inclusion_type = 4;
                        break;
                    }
                    if (object.is_runnable != null)
                        message.is_runnable = Boolean(object.is_runnable);
                    switch (object.capture_state) {
                    case "UNKNOWN":
                    case 0:
                        message.capture_state = 0;
                        break;
                    case "QUEUED":
                    case 1:
                        message.capture_state = 1;
                        break;
                    case "SKIPPED":
                    case 2:
                        message.capture_state = 2;
                        break;
                    case "RUNNING":
                    case 3:
                        message.capture_state = 3;
                        break;
                    case "CAPTURED":
                    case 4:
                        message.capture_state = 4;
                        break;
                    case "DIFFED":
                    case 5:
                        message.capture_state = 5;
                        break;
                    }
                    if (object.image_diff_result != null) {
                        if (typeof object.image_diff_result !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshot.image_diff_result: object expected");
                        message.image_diff_result = $root.mdc.test.screenshot.ImageDiffResult.fromObject(object.image_diff_result);
                    }
                    if (object.user_agent != null) {
                        if (typeof object.user_agent !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshot.user_agent: object expected");
                        message.user_agent = $root.mdc.test.screenshot.UserAgent.fromObject(object.user_agent);
                    }
                    if (object.test_page_file != null) {
                        if (typeof object.test_page_file !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshot.test_page_file: object expected");
                        message.test_page_file = $root.mdc.test.screenshot.TestFile.fromObject(object.test_page_file);
                    }
                    if (object.expected_image_file != null) {
                        if (typeof object.expected_image_file !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshot.expected_image_file: object expected");
                        message.expected_image_file = $root.mdc.test.screenshot.TestFile.fromObject(object.expected_image_file);
                    }
                    if (object.actual_image_file != null) {
                        if (typeof object.actual_image_file !== "object")
                            throw TypeError(".mdc.test.screenshot.Screenshot.actual_image_file: object expected");
                        message.actual_image_file = $root.mdc.test.screenshot.TestFile.fromObject(object.actual_image_file);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a Screenshot message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.Screenshot
                 * @static
                 * @param {mdc.test.screenshot.Screenshot} message Screenshot
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Screenshot.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.inclusion_type = options.enums === String ? "UNKNOWN" : 0;
                        object.is_runnable = false;
                        object.capture_state = options.enums === String ? "UNKNOWN" : 0;
                        object.image_diff_result = null;
                        object.user_agent = null;
                        object.test_page_file = null;
                        object.expected_image_file = null;
                        object.actual_image_file = null;
                    }
                    if (message.inclusion_type != null && message.hasOwnProperty("inclusion_type"))
                        object.inclusion_type = options.enums === String ? $root.mdc.test.screenshot.Screenshot.InclusionType[message.inclusion_type] : message.inclusion_type;
                    if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                        object.is_runnable = message.is_runnable;
                    if (message.capture_state != null && message.hasOwnProperty("capture_state"))
                        object.capture_state = options.enums === String ? $root.mdc.test.screenshot.Screenshot.CaptureState[message.capture_state] : message.capture_state;
                    if (message.image_diff_result != null && message.hasOwnProperty("image_diff_result"))
                        object.image_diff_result = $root.mdc.test.screenshot.ImageDiffResult.toObject(message.image_diff_result, options);
                    if (message.user_agent != null && message.hasOwnProperty("user_agent"))
                        object.user_agent = $root.mdc.test.screenshot.UserAgent.toObject(message.user_agent, options);
                    if (message.test_page_file != null && message.hasOwnProperty("test_page_file"))
                        object.test_page_file = $root.mdc.test.screenshot.TestFile.toObject(message.test_page_file, options);
                    if (message.expected_image_file != null && message.hasOwnProperty("expected_image_file"))
                        object.expected_image_file = $root.mdc.test.screenshot.TestFile.toObject(message.expected_image_file, options);
                    if (message.actual_image_file != null && message.hasOwnProperty("actual_image_file"))
                        object.actual_image_file = $root.mdc.test.screenshot.TestFile.toObject(message.actual_image_file, options);
                    return object;
                };

                /**
                 * Converts this Screenshot to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.Screenshot
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Screenshot.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * InclusionType enum.
                 * @name mdc.test.screenshot.Screenshot.InclusionType
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} ADD=1 ADD value
                 * @property {number} SKIP=2 SKIP value
                 * @property {number} REMOVE=3 REMOVE value
                 * @property {number} COMPARE=4 COMPARE value
                 */
                Screenshot.InclusionType = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "ADD"] = 1;
                    values[valuesById[2] = "SKIP"] = 2;
                    values[valuesById[3] = "REMOVE"] = 3;
                    values[valuesById[4] = "COMPARE"] = 4;
                    return values;
                })();

                /**
                 * CaptureState enum.
                 * @name mdc.test.screenshot.Screenshot.CaptureState
                 * @enum {string}
                 * @property {number} UNKNOWN=0 UNKNOWN value
                 * @property {number} QUEUED=1 QUEUED value
                 * @property {number} SKIPPED=2 SKIPPED value
                 * @property {number} RUNNING=3 RUNNING value
                 * @property {number} CAPTURED=4 CAPTURED value
                 * @property {number} DIFFED=5 DIFFED value
                 */
                Screenshot.CaptureState = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "UNKNOWN"] = 0;
                    values[valuesById[1] = "QUEUED"] = 1;
                    values[valuesById[2] = "SKIPPED"] = 2;
                    values[valuesById[3] = "RUNNING"] = 3;
                    values[valuesById[4] = "CAPTURED"] = 4;
                    values[valuesById[5] = "DIFFED"] = 5;
                    return values;
                })();

                return Screenshot;
            })();

            screenshot.ImageDiffResult = (function() {

                /**
                 * Properties of an ImageDiffResult.
                 * @memberof mdc.test.screenshot
                 * @interface IImageDiffResult
                 * @property {mdc.test.screenshot.ITestFile|null} [diff_image_file] ImageDiffResult diff_image_file
                 * @property {number|Long|null} [diff_pixel_count] ImageDiffResult diff_pixel_count
                 * @property {number|null} [diff_pixel_fraction] ImageDiffResult diff_pixel_fraction
                 * @property {boolean|null} [has_changed] ImageDiffResult has_changed
                 */

                /**
                 * Constructs a new ImageDiffResult.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents an ImageDiffResult.
                 * @implements IImageDiffResult
                 * @constructor
                 * @param {mdc.test.screenshot.IImageDiffResult=} [properties] Properties to set
                 */
                function ImageDiffResult(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ImageDiffResult diff_image_file.
                 * @member {mdc.test.screenshot.ITestFile|null|undefined} diff_image_file
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @instance
                 */
                ImageDiffResult.prototype.diff_image_file = null;

                /**
                 * ImageDiffResult diff_pixel_count.
                 * @member {number|Long} diff_pixel_count
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @instance
                 */
                ImageDiffResult.prototype.diff_pixel_count = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * ImageDiffResult diff_pixel_fraction.
                 * @member {number} diff_pixel_fraction
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @instance
                 */
                ImageDiffResult.prototype.diff_pixel_fraction = 0;

                /**
                 * ImageDiffResult has_changed.
                 * @member {boolean} has_changed
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @instance
                 */
                ImageDiffResult.prototype.has_changed = false;

                /**
                 * Creates a new ImageDiffResult instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {mdc.test.screenshot.IImageDiffResult=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.ImageDiffResult} ImageDiffResult instance
                 */
                ImageDiffResult.create = function create(properties) {
                    return new ImageDiffResult(properties);
                };

                /**
                 * Encodes the specified ImageDiffResult message. Does not implicitly {@link mdc.test.screenshot.ImageDiffResult.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {mdc.test.screenshot.IImageDiffResult} message ImageDiffResult message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ImageDiffResult.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file"))
                        $root.mdc.test.screenshot.TestFile.encode(message.diff_image_file, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.diff_pixel_count != null && message.hasOwnProperty("diff_pixel_count"))
                        writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.diff_pixel_count);
                    if (message.diff_pixel_fraction != null && message.hasOwnProperty("diff_pixel_fraction"))
                        writer.uint32(/* id 3, wireType 1 =*/25).double(message.diff_pixel_fraction);
                    if (message.has_changed != null && message.hasOwnProperty("has_changed"))
                        writer.uint32(/* id 4, wireType 0 =*/32).bool(message.has_changed);
                    return writer;
                };

                /**
                 * Encodes the specified ImageDiffResult message, length delimited. Does not implicitly {@link mdc.test.screenshot.ImageDiffResult.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {mdc.test.screenshot.IImageDiffResult} message ImageDiffResult message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ImageDiffResult.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ImageDiffResult message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.ImageDiffResult} ImageDiffResult
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ImageDiffResult.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.ImageDiffResult();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.diff_image_file = $root.mdc.test.screenshot.TestFile.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.diff_pixel_count = reader.uint64();
                            break;
                        case 3:
                            message.diff_pixel_fraction = reader.double();
                            break;
                        case 4:
                            message.has_changed = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ImageDiffResult message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.ImageDiffResult} ImageDiffResult
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ImageDiffResult.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ImageDiffResult message.
                 * @function verify
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ImageDiffResult.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file")) {
                        var error = $root.mdc.test.screenshot.TestFile.verify(message.diff_image_file);
                        if (error)
                            return "diff_image_file." + error;
                    }
                    if (message.diff_pixel_count != null && message.hasOwnProperty("diff_pixel_count"))
                        if (!$util.isInteger(message.diff_pixel_count) && !(message.diff_pixel_count && $util.isInteger(message.diff_pixel_count.low) && $util.isInteger(message.diff_pixel_count.high)))
                            return "diff_pixel_count: integer|Long expected";
                    if (message.diff_pixel_fraction != null && message.hasOwnProperty("diff_pixel_fraction"))
                        if (typeof message.diff_pixel_fraction !== "number")
                            return "diff_pixel_fraction: number expected";
                    if (message.has_changed != null && message.hasOwnProperty("has_changed"))
                        if (typeof message.has_changed !== "boolean")
                            return "has_changed: boolean expected";
                    return null;
                };

                /**
                 * Creates an ImageDiffResult message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.ImageDiffResult} ImageDiffResult
                 */
                ImageDiffResult.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.ImageDiffResult)
                        return object;
                    var message = new $root.mdc.test.screenshot.ImageDiffResult();
                    if (object.diff_image_file != null) {
                        if (typeof object.diff_image_file !== "object")
                            throw TypeError(".mdc.test.screenshot.ImageDiffResult.diff_image_file: object expected");
                        message.diff_image_file = $root.mdc.test.screenshot.TestFile.fromObject(object.diff_image_file);
                    }
                    if (object.diff_pixel_count != null)
                        if ($util.Long)
                            (message.diff_pixel_count = $util.Long.fromValue(object.diff_pixel_count)).unsigned = true;
                        else if (typeof object.diff_pixel_count === "string")
                            message.diff_pixel_count = parseInt(object.diff_pixel_count, 10);
                        else if (typeof object.diff_pixel_count === "number")
                            message.diff_pixel_count = object.diff_pixel_count;
                        else if (typeof object.diff_pixel_count === "object")
                            message.diff_pixel_count = new $util.LongBits(object.diff_pixel_count.low >>> 0, object.diff_pixel_count.high >>> 0).toNumber(true);
                    if (object.diff_pixel_fraction != null)
                        message.diff_pixel_fraction = Number(object.diff_pixel_fraction);
                    if (object.has_changed != null)
                        message.has_changed = Boolean(object.has_changed);
                    return message;
                };

                /**
                 * Creates a plain object from an ImageDiffResult message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @static
                 * @param {mdc.test.screenshot.ImageDiffResult} message ImageDiffResult
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ImageDiffResult.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.diff_image_file = null;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.diff_pixel_count = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.diff_pixel_count = options.longs === String ? "0" : 0;
                        object.diff_pixel_fraction = 0;
                        object.has_changed = false;
                    }
                    if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file"))
                        object.diff_image_file = $root.mdc.test.screenshot.TestFile.toObject(message.diff_image_file, options);
                    if (message.diff_pixel_count != null && message.hasOwnProperty("diff_pixel_count"))
                        if (typeof message.diff_pixel_count === "number")
                            object.diff_pixel_count = options.longs === String ? String(message.diff_pixel_count) : message.diff_pixel_count;
                        else
                            object.diff_pixel_count = options.longs === String ? $util.Long.prototype.toString.call(message.diff_pixel_count) : options.longs === Number ? new $util.LongBits(message.diff_pixel_count.low >>> 0, message.diff_pixel_count.high >>> 0).toNumber(true) : message.diff_pixel_count;
                    if (message.diff_pixel_fraction != null && message.hasOwnProperty("diff_pixel_fraction"))
                        object.diff_pixel_fraction = options.json && !isFinite(message.diff_pixel_fraction) ? String(message.diff_pixel_fraction) : message.diff_pixel_fraction;
                    if (message.has_changed != null && message.hasOwnProperty("has_changed"))
                        object.has_changed = message.has_changed;
                    return object;
                };

                /**
                 * Converts this ImageDiffResult to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.ImageDiffResult
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ImageDiffResult.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ImageDiffResult;
            })();

            screenshot.TestFile = (function() {

                /**
                 * Properties of a TestFile.
                 * @memberof mdc.test.screenshot
                 * @interface ITestFile
                 * @property {string|null} [relative_path] TestFile relative_path
                 * @property {string|null} [absolute_path] TestFile absolute_path
                 * @property {string|null} [public_url] TestFile public_url
                 */

                /**
                 * Constructs a new TestFile.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a TestFile.
                 * @implements ITestFile
                 * @constructor
                 * @param {mdc.test.screenshot.ITestFile=} [properties] Properties to set
                 */
                function TestFile(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * TestFile relative_path.
                 * @member {string} relative_path
                 * @memberof mdc.test.screenshot.TestFile
                 * @instance
                 */
                TestFile.prototype.relative_path = "";

                /**
                 * TestFile absolute_path.
                 * @member {string} absolute_path
                 * @memberof mdc.test.screenshot.TestFile
                 * @instance
                 */
                TestFile.prototype.absolute_path = "";

                /**
                 * TestFile public_url.
                 * @member {string} public_url
                 * @memberof mdc.test.screenshot.TestFile
                 * @instance
                 */
                TestFile.prototype.public_url = "";

                /**
                 * Creates a new TestFile instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {mdc.test.screenshot.ITestFile=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.TestFile} TestFile instance
                 */
                TestFile.create = function create(properties) {
                    return new TestFile(properties);
                };

                /**
                 * Encodes the specified TestFile message. Does not implicitly {@link mdc.test.screenshot.TestFile.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {mdc.test.screenshot.ITestFile} message TestFile message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TestFile.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.relative_path != null && message.hasOwnProperty("relative_path"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.relative_path);
                    if (message.absolute_path != null && message.hasOwnProperty("absolute_path"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.absolute_path);
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.public_url);
                    return writer;
                };

                /**
                 * Encodes the specified TestFile message, length delimited. Does not implicitly {@link mdc.test.screenshot.TestFile.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {mdc.test.screenshot.ITestFile} message TestFile message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                TestFile.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a TestFile message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.TestFile} TestFile
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TestFile.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.TestFile();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.relative_path = reader.string();
                            break;
                        case 2:
                            message.absolute_path = reader.string();
                            break;
                        case 3:
                            message.public_url = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a TestFile message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.TestFile} TestFile
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                TestFile.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a TestFile message.
                 * @function verify
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                TestFile.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.relative_path != null && message.hasOwnProperty("relative_path"))
                        if (!$util.isString(message.relative_path))
                            return "relative_path: string expected";
                    if (message.absolute_path != null && message.hasOwnProperty("absolute_path"))
                        if (!$util.isString(message.absolute_path))
                            return "absolute_path: string expected";
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        if (!$util.isString(message.public_url))
                            return "public_url: string expected";
                    return null;
                };

                /**
                 * Creates a TestFile message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.TestFile} TestFile
                 */
                TestFile.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.TestFile)
                        return object;
                    var message = new $root.mdc.test.screenshot.TestFile();
                    if (object.relative_path != null)
                        message.relative_path = String(object.relative_path);
                    if (object.absolute_path != null)
                        message.absolute_path = String(object.absolute_path);
                    if (object.public_url != null)
                        message.public_url = String(object.public_url);
                    return message;
                };

                /**
                 * Creates a plain object from a TestFile message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.TestFile
                 * @static
                 * @param {mdc.test.screenshot.TestFile} message TestFile
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                TestFile.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.relative_path = "";
                        object.absolute_path = "";
                        object.public_url = "";
                    }
                    if (message.relative_path != null && message.hasOwnProperty("relative_path"))
                        object.relative_path = message.relative_path;
                    if (message.absolute_path != null && message.hasOwnProperty("absolute_path"))
                        object.absolute_path = message.absolute_path;
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        object.public_url = message.public_url;
                    return object;
                };

                /**
                 * Converts this TestFile to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.TestFile
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                TestFile.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return TestFile;
            })();

            screenshot.Approvals = (function() {

                /**
                 * Properties of an Approvals.
                 * @memberof mdc.test.screenshot
                 * @interface IApprovals
                 * @property {Array.<mdc.test.screenshot.IApprovalId>|null} [added_ids] Approvals added_ids
                 * @property {Array.<mdc.test.screenshot.IApprovalId>|null} [changed_ids] Approvals changed_ids
                 * @property {Array.<mdc.test.screenshot.IApprovalId>|null} [removed_ids] Approvals removed_ids
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [added_screenshot_list] Approvals added_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [changed_screenshot_list] Approvals changed_screenshot_list
                 * @property {Array.<mdc.test.screenshot.IScreenshot>|null} [removed_screenshot_list] Approvals removed_screenshot_list
                 */

                /**
                 * Constructs a new Approvals.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents an Approvals.
                 * @implements IApprovals
                 * @constructor
                 * @param {mdc.test.screenshot.IApprovals=} [properties] Properties to set
                 */
                function Approvals(properties) {
                    this.added_ids = [];
                    this.changed_ids = [];
                    this.removed_ids = [];
                    this.added_screenshot_list = [];
                    this.changed_screenshot_list = [];
                    this.removed_screenshot_list = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Approvals added_ids.
                 * @member {Array.<mdc.test.screenshot.IApprovalId>} added_ids
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 */
                Approvals.prototype.added_ids = $util.emptyArray;

                /**
                 * Approvals changed_ids.
                 * @member {Array.<mdc.test.screenshot.IApprovalId>} changed_ids
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 */
                Approvals.prototype.changed_ids = $util.emptyArray;

                /**
                 * Approvals removed_ids.
                 * @member {Array.<mdc.test.screenshot.IApprovalId>} removed_ids
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 */
                Approvals.prototype.removed_ids = $util.emptyArray;

                /**
                 * Approvals added_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} added_screenshot_list
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 */
                Approvals.prototype.added_screenshot_list = $util.emptyArray;

                /**
                 * Approvals changed_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} changed_screenshot_list
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 */
                Approvals.prototype.changed_screenshot_list = $util.emptyArray;

                /**
                 * Approvals removed_screenshot_list.
                 * @member {Array.<mdc.test.screenshot.IScreenshot>} removed_screenshot_list
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 */
                Approvals.prototype.removed_screenshot_list = $util.emptyArray;

                /**
                 * Creates a new Approvals instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {mdc.test.screenshot.IApprovals=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.Approvals} Approvals instance
                 */
                Approvals.create = function create(properties) {
                    return new Approvals(properties);
                };

                /**
                 * Encodes the specified Approvals message. Does not implicitly {@link mdc.test.screenshot.Approvals.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {mdc.test.screenshot.IApprovals} message Approvals message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Approvals.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.added_ids != null && message.added_ids.length)
                        for (var i = 0; i < message.added_ids.length; ++i)
                            $root.mdc.test.screenshot.ApprovalId.encode(message.added_ids[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.changed_ids != null && message.changed_ids.length)
                        for (var i = 0; i < message.changed_ids.length; ++i)
                            $root.mdc.test.screenshot.ApprovalId.encode(message.changed_ids[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.removed_ids != null && message.removed_ids.length)
                        for (var i = 0; i < message.removed_ids.length; ++i)
                            $root.mdc.test.screenshot.ApprovalId.encode(message.removed_ids[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    if (message.added_screenshot_list != null && message.added_screenshot_list.length)
                        for (var i = 0; i < message.added_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.added_screenshot_list[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    if (message.changed_screenshot_list != null && message.changed_screenshot_list.length)
                        for (var i = 0; i < message.changed_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.changed_screenshot_list[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    if (message.removed_screenshot_list != null && message.removed_screenshot_list.length)
                        for (var i = 0; i < message.removed_screenshot_list.length; ++i)
                            $root.mdc.test.screenshot.Screenshot.encode(message.removed_screenshot_list[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified Approvals message, length delimited. Does not implicitly {@link mdc.test.screenshot.Approvals.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {mdc.test.screenshot.IApprovals} message Approvals message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Approvals.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an Approvals message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.Approvals} Approvals
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Approvals.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.Approvals();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.added_ids && message.added_ids.length))
                                message.added_ids = [];
                            message.added_ids.push($root.mdc.test.screenshot.ApprovalId.decode(reader, reader.uint32()));
                            break;
                        case 2:
                            if (!(message.changed_ids && message.changed_ids.length))
                                message.changed_ids = [];
                            message.changed_ids.push($root.mdc.test.screenshot.ApprovalId.decode(reader, reader.uint32()));
                            break;
                        case 3:
                            if (!(message.removed_ids && message.removed_ids.length))
                                message.removed_ids = [];
                            message.removed_ids.push($root.mdc.test.screenshot.ApprovalId.decode(reader, reader.uint32()));
                            break;
                        case 4:
                            if (!(message.added_screenshot_list && message.added_screenshot_list.length))
                                message.added_screenshot_list = [];
                            message.added_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 5:
                            if (!(message.changed_screenshot_list && message.changed_screenshot_list.length))
                                message.changed_screenshot_list = [];
                            message.changed_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        case 6:
                            if (!(message.removed_screenshot_list && message.removed_screenshot_list.length))
                                message.removed_screenshot_list = [];
                            message.removed_screenshot_list.push($root.mdc.test.screenshot.Screenshot.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an Approvals message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.Approvals} Approvals
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Approvals.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an Approvals message.
                 * @function verify
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Approvals.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.added_ids != null && message.hasOwnProperty("added_ids")) {
                        if (!Array.isArray(message.added_ids))
                            return "added_ids: array expected";
                        for (var i = 0; i < message.added_ids.length; ++i) {
                            var error = $root.mdc.test.screenshot.ApprovalId.verify(message.added_ids[i]);
                            if (error)
                                return "added_ids." + error;
                        }
                    }
                    if (message.changed_ids != null && message.hasOwnProperty("changed_ids")) {
                        if (!Array.isArray(message.changed_ids))
                            return "changed_ids: array expected";
                        for (var i = 0; i < message.changed_ids.length; ++i) {
                            var error = $root.mdc.test.screenshot.ApprovalId.verify(message.changed_ids[i]);
                            if (error)
                                return "changed_ids." + error;
                        }
                    }
                    if (message.removed_ids != null && message.hasOwnProperty("removed_ids")) {
                        if (!Array.isArray(message.removed_ids))
                            return "removed_ids: array expected";
                        for (var i = 0; i < message.removed_ids.length; ++i) {
                            var error = $root.mdc.test.screenshot.ApprovalId.verify(message.removed_ids[i]);
                            if (error)
                                return "removed_ids." + error;
                        }
                    }
                    if (message.added_screenshot_list != null && message.hasOwnProperty("added_screenshot_list")) {
                        if (!Array.isArray(message.added_screenshot_list))
                            return "added_screenshot_list: array expected";
                        for (var i = 0; i < message.added_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.added_screenshot_list[i]);
                            if (error)
                                return "added_screenshot_list." + error;
                        }
                    }
                    if (message.changed_screenshot_list != null && message.hasOwnProperty("changed_screenshot_list")) {
                        if (!Array.isArray(message.changed_screenshot_list))
                            return "changed_screenshot_list: array expected";
                        for (var i = 0; i < message.changed_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.changed_screenshot_list[i]);
                            if (error)
                                return "changed_screenshot_list." + error;
                        }
                    }
                    if (message.removed_screenshot_list != null && message.hasOwnProperty("removed_screenshot_list")) {
                        if (!Array.isArray(message.removed_screenshot_list))
                            return "removed_screenshot_list: array expected";
                        for (var i = 0; i < message.removed_screenshot_list.length; ++i) {
                            var error = $root.mdc.test.screenshot.Screenshot.verify(message.removed_screenshot_list[i]);
                            if (error)
                                return "removed_screenshot_list." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an Approvals message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.Approvals} Approvals
                 */
                Approvals.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.Approvals)
                        return object;
                    var message = new $root.mdc.test.screenshot.Approvals();
                    if (object.added_ids) {
                        if (!Array.isArray(object.added_ids))
                            throw TypeError(".mdc.test.screenshot.Approvals.added_ids: array expected");
                        message.added_ids = [];
                        for (var i = 0; i < object.added_ids.length; ++i) {
                            if (typeof object.added_ids[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Approvals.added_ids: object expected");
                            message.added_ids[i] = $root.mdc.test.screenshot.ApprovalId.fromObject(object.added_ids[i]);
                        }
                    }
                    if (object.changed_ids) {
                        if (!Array.isArray(object.changed_ids))
                            throw TypeError(".mdc.test.screenshot.Approvals.changed_ids: array expected");
                        message.changed_ids = [];
                        for (var i = 0; i < object.changed_ids.length; ++i) {
                            if (typeof object.changed_ids[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Approvals.changed_ids: object expected");
                            message.changed_ids[i] = $root.mdc.test.screenshot.ApprovalId.fromObject(object.changed_ids[i]);
                        }
                    }
                    if (object.removed_ids) {
                        if (!Array.isArray(object.removed_ids))
                            throw TypeError(".mdc.test.screenshot.Approvals.removed_ids: array expected");
                        message.removed_ids = [];
                        for (var i = 0; i < object.removed_ids.length; ++i) {
                            if (typeof object.removed_ids[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Approvals.removed_ids: object expected");
                            message.removed_ids[i] = $root.mdc.test.screenshot.ApprovalId.fromObject(object.removed_ids[i]);
                        }
                    }
                    if (object.added_screenshot_list) {
                        if (!Array.isArray(object.added_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Approvals.added_screenshot_list: array expected");
                        message.added_screenshot_list = [];
                        for (var i = 0; i < object.added_screenshot_list.length; ++i) {
                            if (typeof object.added_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Approvals.added_screenshot_list: object expected");
                            message.added_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.added_screenshot_list[i]);
                        }
                    }
                    if (object.changed_screenshot_list) {
                        if (!Array.isArray(object.changed_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Approvals.changed_screenshot_list: array expected");
                        message.changed_screenshot_list = [];
                        for (var i = 0; i < object.changed_screenshot_list.length; ++i) {
                            if (typeof object.changed_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Approvals.changed_screenshot_list: object expected");
                            message.changed_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.changed_screenshot_list[i]);
                        }
                    }
                    if (object.removed_screenshot_list) {
                        if (!Array.isArray(object.removed_screenshot_list))
                            throw TypeError(".mdc.test.screenshot.Approvals.removed_screenshot_list: array expected");
                        message.removed_screenshot_list = [];
                        for (var i = 0; i < object.removed_screenshot_list.length; ++i) {
                            if (typeof object.removed_screenshot_list[i] !== "object")
                                throw TypeError(".mdc.test.screenshot.Approvals.removed_screenshot_list: object expected");
                            message.removed_screenshot_list[i] = $root.mdc.test.screenshot.Screenshot.fromObject(object.removed_screenshot_list[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an Approvals message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.Approvals
                 * @static
                 * @param {mdc.test.screenshot.Approvals} message Approvals
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Approvals.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults) {
                        object.added_ids = [];
                        object.changed_ids = [];
                        object.removed_ids = [];
                        object.added_screenshot_list = [];
                        object.changed_screenshot_list = [];
                        object.removed_screenshot_list = [];
                    }
                    if (message.added_ids && message.added_ids.length) {
                        object.added_ids = [];
                        for (var j = 0; j < message.added_ids.length; ++j)
                            object.added_ids[j] = $root.mdc.test.screenshot.ApprovalId.toObject(message.added_ids[j], options);
                    }
                    if (message.changed_ids && message.changed_ids.length) {
                        object.changed_ids = [];
                        for (var j = 0; j < message.changed_ids.length; ++j)
                            object.changed_ids[j] = $root.mdc.test.screenshot.ApprovalId.toObject(message.changed_ids[j], options);
                    }
                    if (message.removed_ids && message.removed_ids.length) {
                        object.removed_ids = [];
                        for (var j = 0; j < message.removed_ids.length; ++j)
                            object.removed_ids[j] = $root.mdc.test.screenshot.ApprovalId.toObject(message.removed_ids[j], options);
                    }
                    if (message.added_screenshot_list && message.added_screenshot_list.length) {
                        object.added_screenshot_list = [];
                        for (var j = 0; j < message.added_screenshot_list.length; ++j)
                            object.added_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.added_screenshot_list[j], options);
                    }
                    if (message.changed_screenshot_list && message.changed_screenshot_list.length) {
                        object.changed_screenshot_list = [];
                        for (var j = 0; j < message.changed_screenshot_list.length; ++j)
                            object.changed_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.changed_screenshot_list[j], options);
                    }
                    if (message.removed_screenshot_list && message.removed_screenshot_list.length) {
                        object.removed_screenshot_list = [];
                        for (var j = 0; j < message.removed_screenshot_list.length; ++j)
                            object.removed_screenshot_list[j] = $root.mdc.test.screenshot.Screenshot.toObject(message.removed_screenshot_list[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this Approvals to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.Approvals
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Approvals.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Approvals;
            })();

            screenshot.ApprovalId = (function() {

                /**
                 * Properties of an ApprovalId.
                 * @memberof mdc.test.screenshot
                 * @interface IApprovalId
                 * @property {string|null} [html_file_path] ApprovalId html_file_path
                 * @property {string|null} [user_agent_alias] ApprovalId user_agent_alias
                 */

                /**
                 * Constructs a new ApprovalId.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents an ApprovalId.
                 * @implements IApprovalId
                 * @constructor
                 * @param {mdc.test.screenshot.IApprovalId=} [properties] Properties to set
                 */
                function ApprovalId(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ApprovalId html_file_path.
                 * @member {string} html_file_path
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @instance
                 */
                ApprovalId.prototype.html_file_path = "";

                /**
                 * ApprovalId user_agent_alias.
                 * @member {string} user_agent_alias
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @instance
                 */
                ApprovalId.prototype.user_agent_alias = "";

                /**
                 * Creates a new ApprovalId instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {mdc.test.screenshot.IApprovalId=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.ApprovalId} ApprovalId instance
                 */
                ApprovalId.create = function create(properties) {
                    return new ApprovalId(properties);
                };

                /**
                 * Encodes the specified ApprovalId message. Does not implicitly {@link mdc.test.screenshot.ApprovalId.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {mdc.test.screenshot.IApprovalId} message ApprovalId message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ApprovalId.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.html_file_path);
                    if (message.user_agent_alias != null && message.hasOwnProperty("user_agent_alias"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.user_agent_alias);
                    return writer;
                };

                /**
                 * Encodes the specified ApprovalId message, length delimited. Does not implicitly {@link mdc.test.screenshot.ApprovalId.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {mdc.test.screenshot.IApprovalId} message ApprovalId message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ApprovalId.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ApprovalId message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.ApprovalId} ApprovalId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ApprovalId.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.ApprovalId();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.html_file_path = reader.string();
                            break;
                        case 2:
                            message.user_agent_alias = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ApprovalId message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.ApprovalId} ApprovalId
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ApprovalId.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ApprovalId message.
                 * @function verify
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ApprovalId.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                        if (!$util.isString(message.html_file_path))
                            return "html_file_path: string expected";
                    if (message.user_agent_alias != null && message.hasOwnProperty("user_agent_alias"))
                        if (!$util.isString(message.user_agent_alias))
                            return "user_agent_alias: string expected";
                    return null;
                };

                /**
                 * Creates an ApprovalId message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.ApprovalId} ApprovalId
                 */
                ApprovalId.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.ApprovalId)
                        return object;
                    var message = new $root.mdc.test.screenshot.ApprovalId();
                    if (object.html_file_path != null)
                        message.html_file_path = String(object.html_file_path);
                    if (object.user_agent_alias != null)
                        message.user_agent_alias = String(object.user_agent_alias);
                    return message;
                };

                /**
                 * Creates a plain object from an ApprovalId message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @static
                 * @param {mdc.test.screenshot.ApprovalId} message ApprovalId
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ApprovalId.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.html_file_path = "";
                        object.user_agent_alias = "";
                    }
                    if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                        object.html_file_path = message.html_file_path;
                    if (message.user_agent_alias != null && message.hasOwnProperty("user_agent_alias"))
                        object.user_agent_alias = message.user_agent_alias;
                    return object;
                };

                /**
                 * Converts this ApprovalId to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.ApprovalId
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ApprovalId.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ApprovalId;
            })();

            screenshot.GoldenSuite = (function() {

                /**
                 * Properties of a GoldenSuite.
                 * @memberof mdc.test.screenshot
                 * @interface IGoldenSuite
                 * @property {Object.<string,mdc.test.screenshot.IGoldenPage>|null} [page_map] GoldenSuite page_map
                 */

                /**
                 * Constructs a new GoldenSuite.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a GoldenSuite.
                 * @implements IGoldenSuite
                 * @constructor
                 * @param {mdc.test.screenshot.IGoldenSuite=} [properties] Properties to set
                 */
                function GoldenSuite(properties) {
                    this.page_map = {};
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GoldenSuite page_map.
                 * @member {Object.<string,mdc.test.screenshot.IGoldenPage>} page_map
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @instance
                 */
                GoldenSuite.prototype.page_map = $util.emptyObject;

                /**
                 * Creates a new GoldenSuite instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {mdc.test.screenshot.IGoldenSuite=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.GoldenSuite} GoldenSuite instance
                 */
                GoldenSuite.create = function create(properties) {
                    return new GoldenSuite(properties);
                };

                /**
                 * Encodes the specified GoldenSuite message. Does not implicitly {@link mdc.test.screenshot.GoldenSuite.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {mdc.test.screenshot.IGoldenSuite} message GoldenSuite message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GoldenSuite.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.page_map != null && message.hasOwnProperty("page_map"))
                        for (var keys = Object.keys(message.page_map), i = 0; i < keys.length; ++i) {
                            writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                            $root.mdc.test.screenshot.GoldenPage.encode(message.page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                        }
                    return writer;
                };

                /**
                 * Encodes the specified GoldenSuite message, length delimited. Does not implicitly {@link mdc.test.screenshot.GoldenSuite.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {mdc.test.screenshot.IGoldenSuite} message GoldenSuite message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GoldenSuite.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GoldenSuite message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.GoldenSuite} GoldenSuite
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GoldenSuite.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.GoldenSuite(), key;
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            reader.skip().pos++;
                            if (message.page_map === $util.emptyObject)
                                message.page_map = {};
                            key = reader.string();
                            reader.pos++;
                            message.page_map[key] = $root.mdc.test.screenshot.GoldenPage.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GoldenSuite message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.GoldenSuite} GoldenSuite
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GoldenSuite.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GoldenSuite message.
                 * @function verify
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GoldenSuite.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.page_map != null && message.hasOwnProperty("page_map")) {
                        if (!$util.isObject(message.page_map))
                            return "page_map: object expected";
                        var key = Object.keys(message.page_map);
                        for (var i = 0; i < key.length; ++i) {
                            var error = $root.mdc.test.screenshot.GoldenPage.verify(message.page_map[key[i]]);
                            if (error)
                                return "page_map." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a GoldenSuite message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.GoldenSuite} GoldenSuite
                 */
                GoldenSuite.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.GoldenSuite)
                        return object;
                    var message = new $root.mdc.test.screenshot.GoldenSuite();
                    if (object.page_map) {
                        if (typeof object.page_map !== "object")
                            throw TypeError(".mdc.test.screenshot.GoldenSuite.page_map: object expected");
                        message.page_map = {};
                        for (var keys = Object.keys(object.page_map), i = 0; i < keys.length; ++i) {
                            if (typeof object.page_map[keys[i]] !== "object")
                                throw TypeError(".mdc.test.screenshot.GoldenSuite.page_map: object expected");
                            message.page_map[keys[i]] = $root.mdc.test.screenshot.GoldenPage.fromObject(object.page_map[keys[i]]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a GoldenSuite message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @static
                 * @param {mdc.test.screenshot.GoldenSuite} message GoldenSuite
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GoldenSuite.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.objects || options.defaults)
                        object.page_map = {};
                    var keys2;
                    if (message.page_map && (keys2 = Object.keys(message.page_map)).length) {
                        object.page_map = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.page_map[keys2[j]] = $root.mdc.test.screenshot.GoldenPage.toObject(message.page_map[keys2[j]], options);
                    }
                    return object;
                };

                /**
                 * Converts this GoldenSuite to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.GoldenSuite
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GoldenSuite.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return GoldenSuite;
            })();

            screenshot.GoldenPage = (function() {

                /**
                 * Properties of a GoldenPage.
                 * @memberof mdc.test.screenshot
                 * @interface IGoldenPage
                 * @property {string|null} [public_url] GoldenPage public_url
                 * @property {Object.<string,string>|null} [screenshots] GoldenPage screenshots
                 */

                /**
                 * Constructs a new GoldenPage.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a GoldenPage.
                 * @implements IGoldenPage
                 * @constructor
                 * @param {mdc.test.screenshot.IGoldenPage=} [properties] Properties to set
                 */
                function GoldenPage(properties) {
                    this.screenshots = {};
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GoldenPage public_url.
                 * @member {string} public_url
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @instance
                 */
                GoldenPage.prototype.public_url = "";

                /**
                 * GoldenPage screenshots.
                 * @member {Object.<string,string>} screenshots
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @instance
                 */
                GoldenPage.prototype.screenshots = $util.emptyObject;

                /**
                 * Creates a new GoldenPage instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {mdc.test.screenshot.IGoldenPage=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.GoldenPage} GoldenPage instance
                 */
                GoldenPage.create = function create(properties) {
                    return new GoldenPage(properties);
                };

                /**
                 * Encodes the specified GoldenPage message. Does not implicitly {@link mdc.test.screenshot.GoldenPage.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {mdc.test.screenshot.IGoldenPage} message GoldenPage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GoldenPage.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.public_url);
                    if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                        for (var keys = Object.keys(message.screenshots), i = 0; i < keys.length; ++i)
                            writer.uint32(/* id 2, wireType 2 =*/18).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.screenshots[keys[i]]).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified GoldenPage message, length delimited. Does not implicitly {@link mdc.test.screenshot.GoldenPage.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {mdc.test.screenshot.IGoldenPage} message GoldenPage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GoldenPage.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GoldenPage message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.GoldenPage} GoldenPage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GoldenPage.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.GoldenPage(), key;
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.public_url = reader.string();
                            break;
                        case 2:
                            reader.skip().pos++;
                            if (message.screenshots === $util.emptyObject)
                                message.screenshots = {};
                            key = reader.string();
                            reader.pos++;
                            message.screenshots[key] = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GoldenPage message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.GoldenPage} GoldenPage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GoldenPage.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GoldenPage message.
                 * @function verify
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GoldenPage.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        if (!$util.isString(message.public_url))
                            return "public_url: string expected";
                    if (message.screenshots != null && message.hasOwnProperty("screenshots")) {
                        if (!$util.isObject(message.screenshots))
                            return "screenshots: object expected";
                        var key = Object.keys(message.screenshots);
                        for (var i = 0; i < key.length; ++i)
                            if (!$util.isString(message.screenshots[key[i]]))
                                return "screenshots: string{k:string} expected";
                    }
                    return null;
                };

                /**
                 * Creates a GoldenPage message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.GoldenPage} GoldenPage
                 */
                GoldenPage.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.GoldenPage)
                        return object;
                    var message = new $root.mdc.test.screenshot.GoldenPage();
                    if (object.public_url != null)
                        message.public_url = String(object.public_url);
                    if (object.screenshots) {
                        if (typeof object.screenshots !== "object")
                            throw TypeError(".mdc.test.screenshot.GoldenPage.screenshots: object expected");
                        message.screenshots = {};
                        for (var keys = Object.keys(object.screenshots), i = 0; i < keys.length; ++i)
                            message.screenshots[keys[i]] = String(object.screenshots[keys[i]]);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a GoldenPage message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @static
                 * @param {mdc.test.screenshot.GoldenPage} message GoldenPage
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GoldenPage.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.objects || options.defaults)
                        object.screenshots = {};
                    if (options.defaults)
                        object.public_url = "";
                    if (message.public_url != null && message.hasOwnProperty("public_url"))
                        object.public_url = message.public_url;
                    var keys2;
                    if (message.screenshots && (keys2 = Object.keys(message.screenshots)).length) {
                        object.screenshots = {};
                        for (var j = 0; j < keys2.length; ++j)
                            object.screenshots[keys2[j]] = message.screenshots[keys2[j]];
                    }
                    return object;
                };

                /**
                 * Converts this GoldenPage to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.GoldenPage
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GoldenPage.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return GoldenPage;
            })();

            screenshot.GoldenScreenshot = (function() {

                /**
                 * Properties of a GoldenScreenshot.
                 * @memberof mdc.test.screenshot
                 * @interface IGoldenScreenshot
                 * @property {string|null} [html_file_path] GoldenScreenshot html_file_path
                 * @property {string|null} [html_file_url] GoldenScreenshot html_file_url
                 * @property {string|null} [user_agent_alias] GoldenScreenshot user_agent_alias
                 * @property {string|null} [screenshot_image_path] GoldenScreenshot screenshot_image_path
                 * @property {string|null} [screenshot_image_url] GoldenScreenshot screenshot_image_url
                 */

                /**
                 * Constructs a new GoldenScreenshot.
                 * @memberof mdc.test.screenshot
                 * @classdesc Represents a GoldenScreenshot.
                 * @implements IGoldenScreenshot
                 * @constructor
                 * @param {mdc.test.screenshot.IGoldenScreenshot=} [properties] Properties to set
                 */
                function GoldenScreenshot(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * GoldenScreenshot html_file_path.
                 * @member {string} html_file_path
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @instance
                 */
                GoldenScreenshot.prototype.html_file_path = "";

                /**
                 * GoldenScreenshot html_file_url.
                 * @member {string} html_file_url
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @instance
                 */
                GoldenScreenshot.prototype.html_file_url = "";

                /**
                 * GoldenScreenshot user_agent_alias.
                 * @member {string} user_agent_alias
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @instance
                 */
                GoldenScreenshot.prototype.user_agent_alias = "";

                /**
                 * GoldenScreenshot screenshot_image_path.
                 * @member {string} screenshot_image_path
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @instance
                 */
                GoldenScreenshot.prototype.screenshot_image_path = "";

                /**
                 * GoldenScreenshot screenshot_image_url.
                 * @member {string} screenshot_image_url
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @instance
                 */
                GoldenScreenshot.prototype.screenshot_image_url = "";

                /**
                 * Creates a new GoldenScreenshot instance using the specified properties.
                 * @function create
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {mdc.test.screenshot.IGoldenScreenshot=} [properties] Properties to set
                 * @returns {mdc.test.screenshot.GoldenScreenshot} GoldenScreenshot instance
                 */
                GoldenScreenshot.create = function create(properties) {
                    return new GoldenScreenshot(properties);
                };

                /**
                 * Encodes the specified GoldenScreenshot message. Does not implicitly {@link mdc.test.screenshot.GoldenScreenshot.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {mdc.test.screenshot.IGoldenScreenshot} message GoldenScreenshot message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GoldenScreenshot.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.html_file_path);
                    if (message.html_file_url != null && message.hasOwnProperty("html_file_url"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.html_file_url);
                    if (message.user_agent_alias != null && message.hasOwnProperty("user_agent_alias"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.user_agent_alias);
                    if (message.screenshot_image_path != null && message.hasOwnProperty("screenshot_image_path"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.screenshot_image_path);
                    if (message.screenshot_image_url != null && message.hasOwnProperty("screenshot_image_url"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.screenshot_image_url);
                    return writer;
                };

                /**
                 * Encodes the specified GoldenScreenshot message, length delimited. Does not implicitly {@link mdc.test.screenshot.GoldenScreenshot.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {mdc.test.screenshot.IGoldenScreenshot} message GoldenScreenshot message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                GoldenScreenshot.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a GoldenScreenshot message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.test.screenshot.GoldenScreenshot} GoldenScreenshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GoldenScreenshot.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.test.screenshot.GoldenScreenshot();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.html_file_path = reader.string();
                            break;
                        case 2:
                            message.html_file_url = reader.string();
                            break;
                        case 3:
                            message.user_agent_alias = reader.string();
                            break;
                        case 4:
                            message.screenshot_image_path = reader.string();
                            break;
                        case 5:
                            message.screenshot_image_url = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a GoldenScreenshot message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.test.screenshot.GoldenScreenshot} GoldenScreenshot
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                GoldenScreenshot.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a GoldenScreenshot message.
                 * @function verify
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                GoldenScreenshot.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                        if (!$util.isString(message.html_file_path))
                            return "html_file_path: string expected";
                    if (message.html_file_url != null && message.hasOwnProperty("html_file_url"))
                        if (!$util.isString(message.html_file_url))
                            return "html_file_url: string expected";
                    if (message.user_agent_alias != null && message.hasOwnProperty("user_agent_alias"))
                        if (!$util.isString(message.user_agent_alias))
                            return "user_agent_alias: string expected";
                    if (message.screenshot_image_path != null && message.hasOwnProperty("screenshot_image_path"))
                        if (!$util.isString(message.screenshot_image_path))
                            return "screenshot_image_path: string expected";
                    if (message.screenshot_image_url != null && message.hasOwnProperty("screenshot_image_url"))
                        if (!$util.isString(message.screenshot_image_url))
                            return "screenshot_image_url: string expected";
                    return null;
                };

                /**
                 * Creates a GoldenScreenshot message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.test.screenshot.GoldenScreenshot} GoldenScreenshot
                 */
                GoldenScreenshot.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.test.screenshot.GoldenScreenshot)
                        return object;
                    var message = new $root.mdc.test.screenshot.GoldenScreenshot();
                    if (object.html_file_path != null)
                        message.html_file_path = String(object.html_file_path);
                    if (object.html_file_url != null)
                        message.html_file_url = String(object.html_file_url);
                    if (object.user_agent_alias != null)
                        message.user_agent_alias = String(object.user_agent_alias);
                    if (object.screenshot_image_path != null)
                        message.screenshot_image_path = String(object.screenshot_image_path);
                    if (object.screenshot_image_url != null)
                        message.screenshot_image_url = String(object.screenshot_image_url);
                    return message;
                };

                /**
                 * Creates a plain object from a GoldenScreenshot message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @static
                 * @param {mdc.test.screenshot.GoldenScreenshot} message GoldenScreenshot
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                GoldenScreenshot.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.html_file_path = "";
                        object.html_file_url = "";
                        object.user_agent_alias = "";
                        object.screenshot_image_path = "";
                        object.screenshot_image_url = "";
                    }
                    if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                        object.html_file_path = message.html_file_path;
                    if (message.html_file_url != null && message.hasOwnProperty("html_file_url"))
                        object.html_file_url = message.html_file_url;
                    if (message.user_agent_alias != null && message.hasOwnProperty("user_agent_alias"))
                        object.user_agent_alias = message.user_agent_alias;
                    if (message.screenshot_image_path != null && message.hasOwnProperty("screenshot_image_path"))
                        object.screenshot_image_path = message.screenshot_image_path;
                    if (message.screenshot_image_url != null && message.hasOwnProperty("screenshot_image_url"))
                        object.screenshot_image_url = message.screenshot_image_url;
                    return object;
                };

                /**
                 * Converts this GoldenScreenshot to JSON.
                 * @function toJSON
                 * @memberof mdc.test.screenshot.GoldenScreenshot
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                GoldenScreenshot.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return GoldenScreenshot;
            })();

            return screenshot;
        })();

        return test;
    })();

    return mdc;
})();

module.exports = $root;
