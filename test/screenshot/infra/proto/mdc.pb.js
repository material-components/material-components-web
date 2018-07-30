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

    mdc.proto = (function() {

        /**
         * Namespace proto.
         * @memberof mdc
         * @namespace
         */
        var proto = {};

        proto.ReportData = (function() {

            /**
             * Properties of a ReportData.
             * @memberof mdc.proto
             * @interface IReportData
             * @property {mdc.proto.IReportMeta|null} [meta] ReportData meta
             * @property {mdc.proto.IUserAgents|null} [user_agents] ReportData user_agents
             * @property {mdc.proto.IScreenshots|null} [screenshots] ReportData screenshots
             * @property {mdc.proto.IApprovals|null} [approvals] ReportData approvals
             */

            /**
             * Constructs a new ReportData.
             * @memberof mdc.proto
             * @classdesc Represents a ReportData.
             * @implements IReportData
             * @constructor
             * @param {mdc.proto.IReportData=} [properties] Properties to set
             */
            function ReportData(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ReportData meta.
             * @member {mdc.proto.IReportMeta|null|undefined} meta
             * @memberof mdc.proto.ReportData
             * @instance
             */
            ReportData.prototype.meta = null;

            /**
             * ReportData user_agents.
             * @member {mdc.proto.IUserAgents|null|undefined} user_agents
             * @memberof mdc.proto.ReportData
             * @instance
             */
            ReportData.prototype.user_agents = null;

            /**
             * ReportData screenshots.
             * @member {mdc.proto.IScreenshots|null|undefined} screenshots
             * @memberof mdc.proto.ReportData
             * @instance
             */
            ReportData.prototype.screenshots = null;

            /**
             * ReportData approvals.
             * @member {mdc.proto.IApprovals|null|undefined} approvals
             * @memberof mdc.proto.ReportData
             * @instance
             */
            ReportData.prototype.approvals = null;

            /**
             * Creates a new ReportData instance using the specified properties.
             * @function create
             * @memberof mdc.proto.ReportData
             * @static
             * @param {mdc.proto.IReportData=} [properties] Properties to set
             * @returns {mdc.proto.ReportData} ReportData instance
             */
            ReportData.create = function create(properties) {
                return new ReportData(properties);
            };

            /**
             * Encodes the specified ReportData message. Does not implicitly {@link mdc.proto.ReportData.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.ReportData
             * @static
             * @param {mdc.proto.IReportData} message ReportData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReportData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.meta != null && message.hasOwnProperty("meta"))
                    $root.mdc.proto.ReportMeta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.user_agents != null && message.hasOwnProperty("user_agents"))
                    $root.mdc.proto.UserAgents.encode(message.user_agents, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                    $root.mdc.proto.Screenshots.encode(message.screenshots, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.approvals != null && message.hasOwnProperty("approvals"))
                    $root.mdc.proto.Approvals.encode(message.approvals, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ReportData message, length delimited. Does not implicitly {@link mdc.proto.ReportData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.ReportData
             * @static
             * @param {mdc.proto.IReportData} message ReportData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReportData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ReportData message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.ReportData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.ReportData} ReportData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReportData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.ReportData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.meta = $root.mdc.proto.ReportMeta.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.user_agents = $root.mdc.proto.UserAgents.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.screenshots = $root.mdc.proto.Screenshots.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.approvals = $root.mdc.proto.Approvals.decode(reader, reader.uint32());
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
             * @memberof mdc.proto.ReportData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.ReportData} ReportData
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
             * @memberof mdc.proto.ReportData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ReportData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.meta != null && message.hasOwnProperty("meta")) {
                    var error = $root.mdc.proto.ReportMeta.verify(message.meta);
                    if (error)
                        return "meta." + error;
                }
                if (message.user_agents != null && message.hasOwnProperty("user_agents")) {
                    var error = $root.mdc.proto.UserAgents.verify(message.user_agents);
                    if (error)
                        return "user_agents." + error;
                }
                if (message.screenshots != null && message.hasOwnProperty("screenshots")) {
                    var error = $root.mdc.proto.Screenshots.verify(message.screenshots);
                    if (error)
                        return "screenshots." + error;
                }
                if (message.approvals != null && message.hasOwnProperty("approvals")) {
                    var error = $root.mdc.proto.Approvals.verify(message.approvals);
                    if (error)
                        return "approvals." + error;
                }
                return null;
            };

            /**
             * Creates a ReportData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.ReportData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.ReportData} ReportData
             */
            ReportData.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.ReportData)
                    return object;
                var message = new $root.mdc.proto.ReportData();
                if (object.meta != null) {
                    if (typeof object.meta !== "object")
                        throw TypeError(".mdc.proto.ReportData.meta: object expected");
                    message.meta = $root.mdc.proto.ReportMeta.fromObject(object.meta);
                }
                if (object.user_agents != null) {
                    if (typeof object.user_agents !== "object")
                        throw TypeError(".mdc.proto.ReportData.user_agents: object expected");
                    message.user_agents = $root.mdc.proto.UserAgents.fromObject(object.user_agents);
                }
                if (object.screenshots != null) {
                    if (typeof object.screenshots !== "object")
                        throw TypeError(".mdc.proto.ReportData.screenshots: object expected");
                    message.screenshots = $root.mdc.proto.Screenshots.fromObject(object.screenshots);
                }
                if (object.approvals != null) {
                    if (typeof object.approvals !== "object")
                        throw TypeError(".mdc.proto.ReportData.approvals: object expected");
                    message.approvals = $root.mdc.proto.Approvals.fromObject(object.approvals);
                }
                return message;
            };

            /**
             * Creates a plain object from a ReportData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.ReportData
             * @static
             * @param {mdc.proto.ReportData} message ReportData
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
                    object.meta = $root.mdc.proto.ReportMeta.toObject(message.meta, options);
                if (message.user_agents != null && message.hasOwnProperty("user_agents"))
                    object.user_agents = $root.mdc.proto.UserAgents.toObject(message.user_agents, options);
                if (message.screenshots != null && message.hasOwnProperty("screenshots"))
                    object.screenshots = $root.mdc.proto.Screenshots.toObject(message.screenshots, options);
                if (message.approvals != null && message.hasOwnProperty("approvals"))
                    object.approvals = $root.mdc.proto.Approvals.toObject(message.approvals, options);
                return object;
            };

            /**
             * Converts this ReportData to JSON.
             * @function toJSON
             * @memberof mdc.proto.ReportData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ReportData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ReportData;
        })();

        proto.ReportMeta = (function() {

            /**
             * Properties of a ReportMeta.
             * @memberof mdc.proto
             * @interface IReportMeta
             * @property {string|null} [start_time_iso_utc] ReportMeta start_time_iso_utc
             * @property {string|null} [end_time_iso_utc] ReportMeta end_time_iso_utc
             * @property {number|Long|null} [duration_ms] ReportMeta duration_ms
             * @property {string|null} [remote_upload_base_dir] ReportMeta remote_upload_base_dir
             * @property {string|null} [remote_upload_base_url] ReportMeta remote_upload_base_url
             * @property {string|null} [local_asset_base_dir] ReportMeta local_asset_base_dir
             * @property {string|null} [local_screenshot_image_base_dir] ReportMeta local_screenshot_image_base_dir
             * @property {string|null} [local_diff_image_base_dir] ReportMeta local_diff_image_base_dir
             * @property {string|null} [local_report_base_dir] ReportMeta local_report_base_dir
             * @property {string|null} [local_temporary_http_dir] ReportMeta local_temporary_http_dir
             * @property {number|null} [local_temporary_http_port] ReportMeta local_temporary_http_port
             * @property {mdc.proto.IUser|null} [user] ReportMeta user
             * @property {string|null} [host_os_name] ReportMeta host_os_name
             * @property {string|null} [cli_invocation] ReportMeta cli_invocation
             * @property {mdc.proto.IDiffBase|null} [golden_diff_base] ReportMeta golden_diff_base
             * @property {mdc.proto.IDiffBase|null} [snapshot_diff_base] ReportMeta snapshot_diff_base
             * @property {mdc.proto.IGitStatus|null} [git_status] ReportMeta git_status
             * @property {mdc.proto.ILibraryVersion|null} [node_version] ReportMeta node_version
             * @property {mdc.proto.ILibraryVersion|null} [npm_version] ReportMeta npm_version
             * @property {mdc.proto.ILibraryVersion|null} [mdc_version] ReportMeta mdc_version
             * @property {mdc.proto.ITestFile|null} [report_html_file] ReportMeta report_html_file
             * @property {mdc.proto.ITestFile|null} [report_json_file] ReportMeta report_json_file
             * @property {mdc.proto.ITestFile|null} [golden_json_file] ReportMeta golden_json_file
             */

            /**
             * Constructs a new ReportMeta.
             * @memberof mdc.proto
             * @classdesc Represents a ReportMeta.
             * @implements IReportMeta
             * @constructor
             * @param {mdc.proto.IReportMeta=} [properties] Properties to set
             */
            function ReportMeta(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ReportMeta start_time_iso_utc.
             * @member {string} start_time_iso_utc
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.start_time_iso_utc = "";

            /**
             * ReportMeta end_time_iso_utc.
             * @member {string} end_time_iso_utc
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.end_time_iso_utc = "";

            /**
             * ReportMeta duration_ms.
             * @member {number|Long} duration_ms
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.duration_ms = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * ReportMeta remote_upload_base_dir.
             * @member {string} remote_upload_base_dir
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.remote_upload_base_dir = "";

            /**
             * ReportMeta remote_upload_base_url.
             * @member {string} remote_upload_base_url
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.remote_upload_base_url = "";

            /**
             * ReportMeta local_asset_base_dir.
             * @member {string} local_asset_base_dir
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.local_asset_base_dir = "";

            /**
             * ReportMeta local_screenshot_image_base_dir.
             * @member {string} local_screenshot_image_base_dir
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.local_screenshot_image_base_dir = "";

            /**
             * ReportMeta local_diff_image_base_dir.
             * @member {string} local_diff_image_base_dir
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.local_diff_image_base_dir = "";

            /**
             * ReportMeta local_report_base_dir.
             * @member {string} local_report_base_dir
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.local_report_base_dir = "";

            /**
             * ReportMeta local_temporary_http_dir.
             * @member {string} local_temporary_http_dir
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.local_temporary_http_dir = "";

            /**
             * ReportMeta local_temporary_http_port.
             * @member {number} local_temporary_http_port
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.local_temporary_http_port = 0;

            /**
             * ReportMeta user.
             * @member {mdc.proto.IUser|null|undefined} user
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.user = null;

            /**
             * ReportMeta host_os_name.
             * @member {string} host_os_name
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.host_os_name = "";

            /**
             * ReportMeta cli_invocation.
             * @member {string} cli_invocation
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.cli_invocation = "";

            /**
             * ReportMeta golden_diff_base.
             * @member {mdc.proto.IDiffBase|null|undefined} golden_diff_base
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.golden_diff_base = null;

            /**
             * ReportMeta snapshot_diff_base.
             * @member {mdc.proto.IDiffBase|null|undefined} snapshot_diff_base
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.snapshot_diff_base = null;

            /**
             * ReportMeta git_status.
             * @member {mdc.proto.IGitStatus|null|undefined} git_status
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.git_status = null;

            /**
             * ReportMeta node_version.
             * @member {mdc.proto.ILibraryVersion|null|undefined} node_version
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.node_version = null;

            /**
             * ReportMeta npm_version.
             * @member {mdc.proto.ILibraryVersion|null|undefined} npm_version
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.npm_version = null;

            /**
             * ReportMeta mdc_version.
             * @member {mdc.proto.ILibraryVersion|null|undefined} mdc_version
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.mdc_version = null;

            /**
             * ReportMeta report_html_file.
             * @member {mdc.proto.ITestFile|null|undefined} report_html_file
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.report_html_file = null;

            /**
             * ReportMeta report_json_file.
             * @member {mdc.proto.ITestFile|null|undefined} report_json_file
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.report_json_file = null;

            /**
             * ReportMeta golden_json_file.
             * @member {mdc.proto.ITestFile|null|undefined} golden_json_file
             * @memberof mdc.proto.ReportMeta
             * @instance
             */
            ReportMeta.prototype.golden_json_file = null;

            /**
             * Creates a new ReportMeta instance using the specified properties.
             * @function create
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {mdc.proto.IReportMeta=} [properties] Properties to set
             * @returns {mdc.proto.ReportMeta} ReportMeta instance
             */
            ReportMeta.create = function create(properties) {
                return new ReportMeta(properties);
            };

            /**
             * Encodes the specified ReportMeta message. Does not implicitly {@link mdc.proto.ReportMeta.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {mdc.proto.IReportMeta} message ReportMeta message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReportMeta.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.start_time_iso_utc != null && message.hasOwnProperty("start_time_iso_utc"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.start_time_iso_utc);
                if (message.end_time_iso_utc != null && message.hasOwnProperty("end_time_iso_utc"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.end_time_iso_utc);
                if (message.duration_ms != null && message.hasOwnProperty("duration_ms"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.duration_ms);
                if (message.remote_upload_base_dir != null && message.hasOwnProperty("remote_upload_base_dir"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.remote_upload_base_dir);
                if (message.remote_upload_base_url != null && message.hasOwnProperty("remote_upload_base_url"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.remote_upload_base_url);
                if (message.local_asset_base_dir != null && message.hasOwnProperty("local_asset_base_dir"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.local_asset_base_dir);
                if (message.local_screenshot_image_base_dir != null && message.hasOwnProperty("local_screenshot_image_base_dir"))
                    writer.uint32(/* id 7, wireType 2 =*/58).string(message.local_screenshot_image_base_dir);
                if (message.local_diff_image_base_dir != null && message.hasOwnProperty("local_diff_image_base_dir"))
                    writer.uint32(/* id 8, wireType 2 =*/66).string(message.local_diff_image_base_dir);
                if (message.local_report_base_dir != null && message.hasOwnProperty("local_report_base_dir"))
                    writer.uint32(/* id 9, wireType 2 =*/74).string(message.local_report_base_dir);
                if (message.local_temporary_http_dir != null && message.hasOwnProperty("local_temporary_http_dir"))
                    writer.uint32(/* id 10, wireType 2 =*/82).string(message.local_temporary_http_dir);
                if (message.local_temporary_http_port != null && message.hasOwnProperty("local_temporary_http_port"))
                    writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.local_temporary_http_port);
                if (message.user != null && message.hasOwnProperty("user"))
                    $root.mdc.proto.User.encode(message.user, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.host_os_name != null && message.hasOwnProperty("host_os_name"))
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.host_os_name);
                if (message.cli_invocation != null && message.hasOwnProperty("cli_invocation"))
                    writer.uint32(/* id 14, wireType 2 =*/114).string(message.cli_invocation);
                if (message.golden_diff_base != null && message.hasOwnProperty("golden_diff_base"))
                    $root.mdc.proto.DiffBase.encode(message.golden_diff_base, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
                if (message.snapshot_diff_base != null && message.hasOwnProperty("snapshot_diff_base"))
                    $root.mdc.proto.DiffBase.encode(message.snapshot_diff_base, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
                if (message.git_status != null && message.hasOwnProperty("git_status"))
                    $root.mdc.proto.GitStatus.encode(message.git_status, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
                if (message.node_version != null && message.hasOwnProperty("node_version"))
                    $root.mdc.proto.LibraryVersion.encode(message.node_version, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
                if (message.npm_version != null && message.hasOwnProperty("npm_version"))
                    $root.mdc.proto.LibraryVersion.encode(message.npm_version, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
                if (message.mdc_version != null && message.hasOwnProperty("mdc_version"))
                    $root.mdc.proto.LibraryVersion.encode(message.mdc_version, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                if (message.report_html_file != null && message.hasOwnProperty("report_html_file"))
                    $root.mdc.proto.TestFile.encode(message.report_html_file, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
                if (message.report_json_file != null && message.hasOwnProperty("report_json_file"))
                    $root.mdc.proto.TestFile.encode(message.report_json_file, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
                if (message.golden_json_file != null && message.hasOwnProperty("golden_json_file"))
                    $root.mdc.proto.TestFile.encode(message.golden_json_file, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ReportMeta message, length delimited. Does not implicitly {@link mdc.proto.ReportMeta.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {mdc.proto.IReportMeta} message ReportMeta message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ReportMeta.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ReportMeta message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.ReportMeta} ReportMeta
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ReportMeta.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.ReportMeta();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.start_time_iso_utc = reader.string();
                        break;
                    case 2:
                        message.end_time_iso_utc = reader.string();
                        break;
                    case 3:
                        message.duration_ms = reader.uint64();
                        break;
                    case 4:
                        message.remote_upload_base_dir = reader.string();
                        break;
                    case 5:
                        message.remote_upload_base_url = reader.string();
                        break;
                    case 6:
                        message.local_asset_base_dir = reader.string();
                        break;
                    case 7:
                        message.local_screenshot_image_base_dir = reader.string();
                        break;
                    case 8:
                        message.local_diff_image_base_dir = reader.string();
                        break;
                    case 9:
                        message.local_report_base_dir = reader.string();
                        break;
                    case 10:
                        message.local_temporary_http_dir = reader.string();
                        break;
                    case 11:
                        message.local_temporary_http_port = reader.uint32();
                        break;
                    case 12:
                        message.user = $root.mdc.proto.User.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.host_os_name = reader.string();
                        break;
                    case 14:
                        message.cli_invocation = reader.string();
                        break;
                    case 15:
                        message.golden_diff_base = $root.mdc.proto.DiffBase.decode(reader, reader.uint32());
                        break;
                    case 16:
                        message.snapshot_diff_base = $root.mdc.proto.DiffBase.decode(reader, reader.uint32());
                        break;
                    case 17:
                        message.git_status = $root.mdc.proto.GitStatus.decode(reader, reader.uint32());
                        break;
                    case 18:
                        message.node_version = $root.mdc.proto.LibraryVersion.decode(reader, reader.uint32());
                        break;
                    case 19:
                        message.npm_version = $root.mdc.proto.LibraryVersion.decode(reader, reader.uint32());
                        break;
                    case 20:
                        message.mdc_version = $root.mdc.proto.LibraryVersion.decode(reader, reader.uint32());
                        break;
                    case 21:
                        message.report_html_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 22:
                        message.report_json_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 23:
                        message.golden_json_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
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
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.ReportMeta} ReportMeta
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
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ReportMeta.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.start_time_iso_utc != null && message.hasOwnProperty("start_time_iso_utc"))
                    if (!$util.isString(message.start_time_iso_utc))
                        return "start_time_iso_utc: string expected";
                if (message.end_time_iso_utc != null && message.hasOwnProperty("end_time_iso_utc"))
                    if (!$util.isString(message.end_time_iso_utc))
                        return "end_time_iso_utc: string expected";
                if (message.duration_ms != null && message.hasOwnProperty("duration_ms"))
                    if (!$util.isInteger(message.duration_ms) && !(message.duration_ms && $util.isInteger(message.duration_ms.low) && $util.isInteger(message.duration_ms.high)))
                        return "duration_ms: integer|Long expected";
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
                if (message.local_temporary_http_dir != null && message.hasOwnProperty("local_temporary_http_dir"))
                    if (!$util.isString(message.local_temporary_http_dir))
                        return "local_temporary_http_dir: string expected";
                if (message.local_temporary_http_port != null && message.hasOwnProperty("local_temporary_http_port"))
                    if (!$util.isInteger(message.local_temporary_http_port))
                        return "local_temporary_http_port: integer expected";
                if (message.user != null && message.hasOwnProperty("user")) {
                    var error = $root.mdc.proto.User.verify(message.user);
                    if (error)
                        return "user." + error;
                }
                if (message.host_os_name != null && message.hasOwnProperty("host_os_name"))
                    if (!$util.isString(message.host_os_name))
                        return "host_os_name: string expected";
                if (message.cli_invocation != null && message.hasOwnProperty("cli_invocation"))
                    if (!$util.isString(message.cli_invocation))
                        return "cli_invocation: string expected";
                if (message.golden_diff_base != null && message.hasOwnProperty("golden_diff_base")) {
                    var error = $root.mdc.proto.DiffBase.verify(message.golden_diff_base);
                    if (error)
                        return "golden_diff_base." + error;
                }
                if (message.snapshot_diff_base != null && message.hasOwnProperty("snapshot_diff_base")) {
                    var error = $root.mdc.proto.DiffBase.verify(message.snapshot_diff_base);
                    if (error)
                        return "snapshot_diff_base." + error;
                }
                if (message.git_status != null && message.hasOwnProperty("git_status")) {
                    var error = $root.mdc.proto.GitStatus.verify(message.git_status);
                    if (error)
                        return "git_status." + error;
                }
                if (message.node_version != null && message.hasOwnProperty("node_version")) {
                    var error = $root.mdc.proto.LibraryVersion.verify(message.node_version);
                    if (error)
                        return "node_version." + error;
                }
                if (message.npm_version != null && message.hasOwnProperty("npm_version")) {
                    var error = $root.mdc.proto.LibraryVersion.verify(message.npm_version);
                    if (error)
                        return "npm_version." + error;
                }
                if (message.mdc_version != null && message.hasOwnProperty("mdc_version")) {
                    var error = $root.mdc.proto.LibraryVersion.verify(message.mdc_version);
                    if (error)
                        return "mdc_version." + error;
                }
                if (message.report_html_file != null && message.hasOwnProperty("report_html_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.report_html_file);
                    if (error)
                        return "report_html_file." + error;
                }
                if (message.report_json_file != null && message.hasOwnProperty("report_json_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.report_json_file);
                    if (error)
                        return "report_json_file." + error;
                }
                if (message.golden_json_file != null && message.hasOwnProperty("golden_json_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.golden_json_file);
                    if (error)
                        return "golden_json_file." + error;
                }
                return null;
            };

            /**
             * Creates a ReportMeta message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.ReportMeta} ReportMeta
             */
            ReportMeta.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.ReportMeta)
                    return object;
                var message = new $root.mdc.proto.ReportMeta();
                if (object.start_time_iso_utc != null)
                    message.start_time_iso_utc = String(object.start_time_iso_utc);
                if (object.end_time_iso_utc != null)
                    message.end_time_iso_utc = String(object.end_time_iso_utc);
                if (object.duration_ms != null)
                    if ($util.Long)
                        (message.duration_ms = $util.Long.fromValue(object.duration_ms)).unsigned = true;
                    else if (typeof object.duration_ms === "string")
                        message.duration_ms = parseInt(object.duration_ms, 10);
                    else if (typeof object.duration_ms === "number")
                        message.duration_ms = object.duration_ms;
                    else if (typeof object.duration_ms === "object")
                        message.duration_ms = new $util.LongBits(object.duration_ms.low >>> 0, object.duration_ms.high >>> 0).toNumber(true);
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
                if (object.local_temporary_http_dir != null)
                    message.local_temporary_http_dir = String(object.local_temporary_http_dir);
                if (object.local_temporary_http_port != null)
                    message.local_temporary_http_port = object.local_temporary_http_port >>> 0;
                if (object.user != null) {
                    if (typeof object.user !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.user: object expected");
                    message.user = $root.mdc.proto.User.fromObject(object.user);
                }
                if (object.host_os_name != null)
                    message.host_os_name = String(object.host_os_name);
                if (object.cli_invocation != null)
                    message.cli_invocation = String(object.cli_invocation);
                if (object.golden_diff_base != null) {
                    if (typeof object.golden_diff_base !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.golden_diff_base: object expected");
                    message.golden_diff_base = $root.mdc.proto.DiffBase.fromObject(object.golden_diff_base);
                }
                if (object.snapshot_diff_base != null) {
                    if (typeof object.snapshot_diff_base !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.snapshot_diff_base: object expected");
                    message.snapshot_diff_base = $root.mdc.proto.DiffBase.fromObject(object.snapshot_diff_base);
                }
                if (object.git_status != null) {
                    if (typeof object.git_status !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.git_status: object expected");
                    message.git_status = $root.mdc.proto.GitStatus.fromObject(object.git_status);
                }
                if (object.node_version != null) {
                    if (typeof object.node_version !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.node_version: object expected");
                    message.node_version = $root.mdc.proto.LibraryVersion.fromObject(object.node_version);
                }
                if (object.npm_version != null) {
                    if (typeof object.npm_version !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.npm_version: object expected");
                    message.npm_version = $root.mdc.proto.LibraryVersion.fromObject(object.npm_version);
                }
                if (object.mdc_version != null) {
                    if (typeof object.mdc_version !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.mdc_version: object expected");
                    message.mdc_version = $root.mdc.proto.LibraryVersion.fromObject(object.mdc_version);
                }
                if (object.report_html_file != null) {
                    if (typeof object.report_html_file !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.report_html_file: object expected");
                    message.report_html_file = $root.mdc.proto.TestFile.fromObject(object.report_html_file);
                }
                if (object.report_json_file != null) {
                    if (typeof object.report_json_file !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.report_json_file: object expected");
                    message.report_json_file = $root.mdc.proto.TestFile.fromObject(object.report_json_file);
                }
                if (object.golden_json_file != null) {
                    if (typeof object.golden_json_file !== "object")
                        throw TypeError(".mdc.proto.ReportMeta.golden_json_file: object expected");
                    message.golden_json_file = $root.mdc.proto.TestFile.fromObject(object.golden_json_file);
                }
                return message;
            };

            /**
             * Creates a plain object from a ReportMeta message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.ReportMeta
             * @static
             * @param {mdc.proto.ReportMeta} message ReportMeta
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ReportMeta.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.start_time_iso_utc = "";
                    object.end_time_iso_utc = "";
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.duration_ms = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.duration_ms = options.longs === String ? "0" : 0;
                    object.remote_upload_base_dir = "";
                    object.remote_upload_base_url = "";
                    object.local_asset_base_dir = "";
                    object.local_screenshot_image_base_dir = "";
                    object.local_diff_image_base_dir = "";
                    object.local_report_base_dir = "";
                    object.local_temporary_http_dir = "";
                    object.local_temporary_http_port = 0;
                    object.user = null;
                    object.host_os_name = "";
                    object.cli_invocation = "";
                    object.golden_diff_base = null;
                    object.snapshot_diff_base = null;
                    object.git_status = null;
                    object.node_version = null;
                    object.npm_version = null;
                    object.mdc_version = null;
                    object.report_html_file = null;
                    object.report_json_file = null;
                    object.golden_json_file = null;
                }
                if (message.start_time_iso_utc != null && message.hasOwnProperty("start_time_iso_utc"))
                    object.start_time_iso_utc = message.start_time_iso_utc;
                if (message.end_time_iso_utc != null && message.hasOwnProperty("end_time_iso_utc"))
                    object.end_time_iso_utc = message.end_time_iso_utc;
                if (message.duration_ms != null && message.hasOwnProperty("duration_ms"))
                    if (typeof message.duration_ms === "number")
                        object.duration_ms = options.longs === String ? String(message.duration_ms) : message.duration_ms;
                    else
                        object.duration_ms = options.longs === String ? $util.Long.prototype.toString.call(message.duration_ms) : options.longs === Number ? new $util.LongBits(message.duration_ms.low >>> 0, message.duration_ms.high >>> 0).toNumber(true) : message.duration_ms;
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
                if (message.local_temporary_http_dir != null && message.hasOwnProperty("local_temporary_http_dir"))
                    object.local_temporary_http_dir = message.local_temporary_http_dir;
                if (message.local_temporary_http_port != null && message.hasOwnProperty("local_temporary_http_port"))
                    object.local_temporary_http_port = message.local_temporary_http_port;
                if (message.user != null && message.hasOwnProperty("user"))
                    object.user = $root.mdc.proto.User.toObject(message.user, options);
                if (message.host_os_name != null && message.hasOwnProperty("host_os_name"))
                    object.host_os_name = message.host_os_name;
                if (message.cli_invocation != null && message.hasOwnProperty("cli_invocation"))
                    object.cli_invocation = message.cli_invocation;
                if (message.golden_diff_base != null && message.hasOwnProperty("golden_diff_base"))
                    object.golden_diff_base = $root.mdc.proto.DiffBase.toObject(message.golden_diff_base, options);
                if (message.snapshot_diff_base != null && message.hasOwnProperty("snapshot_diff_base"))
                    object.snapshot_diff_base = $root.mdc.proto.DiffBase.toObject(message.snapshot_diff_base, options);
                if (message.git_status != null && message.hasOwnProperty("git_status"))
                    object.git_status = $root.mdc.proto.GitStatus.toObject(message.git_status, options);
                if (message.node_version != null && message.hasOwnProperty("node_version"))
                    object.node_version = $root.mdc.proto.LibraryVersion.toObject(message.node_version, options);
                if (message.npm_version != null && message.hasOwnProperty("npm_version"))
                    object.npm_version = $root.mdc.proto.LibraryVersion.toObject(message.npm_version, options);
                if (message.mdc_version != null && message.hasOwnProperty("mdc_version"))
                    object.mdc_version = $root.mdc.proto.LibraryVersion.toObject(message.mdc_version, options);
                if (message.report_html_file != null && message.hasOwnProperty("report_html_file"))
                    object.report_html_file = $root.mdc.proto.TestFile.toObject(message.report_html_file, options);
                if (message.report_json_file != null && message.hasOwnProperty("report_json_file"))
                    object.report_json_file = $root.mdc.proto.TestFile.toObject(message.report_json_file, options);
                if (message.golden_json_file != null && message.hasOwnProperty("golden_json_file"))
                    object.golden_json_file = $root.mdc.proto.TestFile.toObject(message.golden_json_file, options);
                return object;
            };

            /**
             * Converts this ReportMeta to JSON.
             * @function toJSON
             * @memberof mdc.proto.ReportMeta
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ReportMeta.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ReportMeta;
        })();

        proto.DiffBase = (function() {

            /**
             * Properties of a DiffBase.
             * @memberof mdc.proto
             * @interface IDiffBase
             * @property {mdc.proto.DiffBase.Type|null} [type] DiffBase type
             * @property {string|null} [input_string] DiffBase input_string
             * @property {string|null} [local_file_path] DiffBase local_file_path
             * @property {string|null} [public_url] DiffBase public_url
             * @property {mdc.proto.IGitRevision|null} [git_revision] DiffBase git_revision
             * @property {boolean|null} [is_default_local_file] DiffBase is_default_local_file
             */

            /**
             * Constructs a new DiffBase.
             * @memberof mdc.proto
             * @classdesc Represents a DiffBase.
             * @implements IDiffBase
             * @constructor
             * @param {mdc.proto.IDiffBase=} [properties] Properties to set
             */
            function DiffBase(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DiffBase type.
             * @member {mdc.proto.DiffBase.Type} type
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            DiffBase.prototype.type = 0;

            /**
             * DiffBase input_string.
             * @member {string} input_string
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            DiffBase.prototype.input_string = "";

            /**
             * DiffBase local_file_path.
             * @member {string} local_file_path
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            DiffBase.prototype.local_file_path = "";

            /**
             * DiffBase public_url.
             * @member {string} public_url
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            DiffBase.prototype.public_url = "";

            /**
             * DiffBase git_revision.
             * @member {mdc.proto.IGitRevision|null|undefined} git_revision
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            DiffBase.prototype.git_revision = null;

            /**
             * DiffBase is_default_local_file.
             * @member {boolean} is_default_local_file
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            DiffBase.prototype.is_default_local_file = false;

            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;

            /**
             * DiffBase value_oneof.
             * @member {"local_file_path"|"public_url"|"git_revision"|undefined} value_oneof
             * @memberof mdc.proto.DiffBase
             * @instance
             */
            Object.defineProperty(DiffBase.prototype, "value_oneof", {
                get: $util.oneOfGetter($oneOfFields = ["local_file_path", "public_url", "git_revision"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new DiffBase instance using the specified properties.
             * @function create
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {mdc.proto.IDiffBase=} [properties] Properties to set
             * @returns {mdc.proto.DiffBase} DiffBase instance
             */
            DiffBase.create = function create(properties) {
                return new DiffBase(properties);
            };

            /**
             * Encodes the specified DiffBase message. Does not implicitly {@link mdc.proto.DiffBase.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {mdc.proto.IDiffBase} message DiffBase message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiffBase.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.input_string != null && message.hasOwnProperty("input_string"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.input_string);
                if (message.local_file_path != null && message.hasOwnProperty("local_file_path"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.local_file_path);
                if (message.public_url != null && message.hasOwnProperty("public_url"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.public_url);
                if (message.git_revision != null && message.hasOwnProperty("git_revision"))
                    $root.mdc.proto.GitRevision.encode(message.git_revision, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.is_default_local_file != null && message.hasOwnProperty("is_default_local_file"))
                    writer.uint32(/* id 6, wireType 0 =*/48).bool(message.is_default_local_file);
                return writer;
            };

            /**
             * Encodes the specified DiffBase message, length delimited. Does not implicitly {@link mdc.proto.DiffBase.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {mdc.proto.IDiffBase} message DiffBase message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiffBase.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DiffBase message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.DiffBase} DiffBase
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiffBase.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.DiffBase();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = reader.int32();
                        break;
                    case 2:
                        message.input_string = reader.string();
                        break;
                    case 3:
                        message.local_file_path = reader.string();
                        break;
                    case 4:
                        message.public_url = reader.string();
                        break;
                    case 5:
                        message.git_revision = $root.mdc.proto.GitRevision.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.is_default_local_file = reader.bool();
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
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.DiffBase} DiffBase
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
             * @memberof mdc.proto.DiffBase
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
                if (message.input_string != null && message.hasOwnProperty("input_string"))
                    if (!$util.isString(message.input_string))
                        return "input_string: string expected";
                if (message.local_file_path != null && message.hasOwnProperty("local_file_path")) {
                    properties.value_oneof = 1;
                    if (!$util.isString(message.local_file_path))
                        return "local_file_path: string expected";
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
                        var error = $root.mdc.proto.GitRevision.verify(message.git_revision);
                        if (error)
                            return "git_revision." + error;
                    }
                }
                if (message.is_default_local_file != null && message.hasOwnProperty("is_default_local_file"))
                    if (typeof message.is_default_local_file !== "boolean")
                        return "is_default_local_file: boolean expected";
                return null;
            };

            /**
             * Creates a DiffBase message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.DiffBase} DiffBase
             */
            DiffBase.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.DiffBase)
                    return object;
                var message = new $root.mdc.proto.DiffBase();
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
                if (object.input_string != null)
                    message.input_string = String(object.input_string);
                if (object.local_file_path != null)
                    message.local_file_path = String(object.local_file_path);
                if (object.public_url != null)
                    message.public_url = String(object.public_url);
                if (object.git_revision != null) {
                    if (typeof object.git_revision !== "object")
                        throw TypeError(".mdc.proto.DiffBase.git_revision: object expected");
                    message.git_revision = $root.mdc.proto.GitRevision.fromObject(object.git_revision);
                }
                if (object.is_default_local_file != null)
                    message.is_default_local_file = Boolean(object.is_default_local_file);
                return message;
            };

            /**
             * Creates a plain object from a DiffBase message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.DiffBase
             * @static
             * @param {mdc.proto.DiffBase} message DiffBase
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DiffBase.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "UNKNOWN" : 0;
                    object.input_string = "";
                    object.is_default_local_file = false;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.mdc.proto.DiffBase.Type[message.type] : message.type;
                if (message.input_string != null && message.hasOwnProperty("input_string"))
                    object.input_string = message.input_string;
                if (message.local_file_path != null && message.hasOwnProperty("local_file_path")) {
                    object.local_file_path = message.local_file_path;
                    if (options.oneofs)
                        object.value_oneof = "local_file_path";
                }
                if (message.public_url != null && message.hasOwnProperty("public_url")) {
                    object.public_url = message.public_url;
                    if (options.oneofs)
                        object.value_oneof = "public_url";
                }
                if (message.git_revision != null && message.hasOwnProperty("git_revision")) {
                    object.git_revision = $root.mdc.proto.GitRevision.toObject(message.git_revision, options);
                    if (options.oneofs)
                        object.value_oneof = "git_revision";
                }
                if (message.is_default_local_file != null && message.hasOwnProperty("is_default_local_file"))
                    object.is_default_local_file = message.is_default_local_file;
                return object;
            };

            /**
             * Converts this DiffBase to JSON.
             * @function toJSON
             * @memberof mdc.proto.DiffBase
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DiffBase.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Type enum.
             * @name mdc.proto.DiffBase.Type
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

        proto.GitRevision = (function() {

            /**
             * Properties of a GitRevision.
             * @memberof mdc.proto
             * @interface IGitRevision
             * @property {mdc.proto.GitRevision.Type|null} [type] GitRevision type
             * @property {string|null} [golden_json_file_path] GitRevision golden_json_file_path
             * @property {string|null} [commit] GitRevision commit
             * @property {string|null} [remote] GitRevision remote
             * @property {string|null} [branch] GitRevision branch
             * @property {string|null} [tag] GitRevision tag
             * @property {number|null} [pr_number] GitRevision pr_number
             * @property {Array.<string>|null} [pr_file_paths] GitRevision pr_file_paths
             * @property {mdc.proto.IUser|null} [author] GitRevision author
             * @property {mdc.proto.IUser|null} [committer] GitRevision committer
             */

            /**
             * Constructs a new GitRevision.
             * @memberof mdc.proto
             * @classdesc Represents a GitRevision.
             * @implements IGitRevision
             * @constructor
             * @param {mdc.proto.IGitRevision=} [properties] Properties to set
             */
            function GitRevision(properties) {
                this.pr_file_paths = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GitRevision type.
             * @member {mdc.proto.GitRevision.Type} type
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.type = 0;

            /**
             * GitRevision golden_json_file_path.
             * @member {string} golden_json_file_path
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.golden_json_file_path = "";

            /**
             * GitRevision commit.
             * @member {string} commit
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.commit = "";

            /**
             * GitRevision remote.
             * @member {string} remote
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.remote = "";

            /**
             * GitRevision branch.
             * @member {string} branch
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.branch = "";

            /**
             * GitRevision tag.
             * @member {string} tag
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.tag = "";

            /**
             * GitRevision pr_number.
             * @member {number} pr_number
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.pr_number = 0;

            /**
             * GitRevision pr_file_paths.
             * @member {Array.<string>} pr_file_paths
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.pr_file_paths = $util.emptyArray;

            /**
             * GitRevision author.
             * @member {mdc.proto.IUser|null|undefined} author
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.author = null;

            /**
             * GitRevision committer.
             * @member {mdc.proto.IUser|null|undefined} committer
             * @memberof mdc.proto.GitRevision
             * @instance
             */
            GitRevision.prototype.committer = null;

            /**
             * Creates a new GitRevision instance using the specified properties.
             * @function create
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {mdc.proto.IGitRevision=} [properties] Properties to set
             * @returns {mdc.proto.GitRevision} GitRevision instance
             */
            GitRevision.create = function create(properties) {
                return new GitRevision(properties);
            };

            /**
             * Encodes the specified GitRevision message. Does not implicitly {@link mdc.proto.GitRevision.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {mdc.proto.IGitRevision} message GitRevision message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GitRevision.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && message.hasOwnProperty("type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.golden_json_file_path != null && message.hasOwnProperty("golden_json_file_path"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.golden_json_file_path);
                if (message.commit != null && message.hasOwnProperty("commit"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.commit);
                if (message.remote != null && message.hasOwnProperty("remote"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.remote);
                if (message.branch != null && message.hasOwnProperty("branch"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.branch);
                if (message.tag != null && message.hasOwnProperty("tag"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.tag);
                if (message.pr_number != null && message.hasOwnProperty("pr_number"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.pr_number);
                if (message.pr_file_paths != null && message.pr_file_paths.length)
                    for (var i = 0; i < message.pr_file_paths.length; ++i)
                        writer.uint32(/* id 8, wireType 2 =*/66).string(message.pr_file_paths[i]);
                if (message.author != null && message.hasOwnProperty("author"))
                    $root.mdc.proto.User.encode(message.author, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.committer != null && message.hasOwnProperty("committer"))
                    $root.mdc.proto.User.encode(message.committer, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified GitRevision message, length delimited. Does not implicitly {@link mdc.proto.GitRevision.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {mdc.proto.IGitRevision} message GitRevision message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GitRevision.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GitRevision message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.GitRevision} GitRevision
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GitRevision.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.GitRevision();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type = reader.int32();
                        break;
                    case 2:
                        message.golden_json_file_path = reader.string();
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
                    case 7:
                        message.pr_number = reader.uint32();
                        break;
                    case 8:
                        if (!(message.pr_file_paths && message.pr_file_paths.length))
                            message.pr_file_paths = [];
                        message.pr_file_paths.push(reader.string());
                        break;
                    case 9:
                        message.author = $root.mdc.proto.User.decode(reader, reader.uint32());
                        break;
                    case 10:
                        message.committer = $root.mdc.proto.User.decode(reader, reader.uint32());
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
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.GitRevision} GitRevision
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
             * @memberof mdc.proto.GitRevision
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
                    case 5:
                        break;
                    }
                if (message.golden_json_file_path != null && message.hasOwnProperty("golden_json_file_path"))
                    if (!$util.isString(message.golden_json_file_path))
                        return "golden_json_file_path: string expected";
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
                if (message.pr_number != null && message.hasOwnProperty("pr_number"))
                    if (!$util.isInteger(message.pr_number))
                        return "pr_number: integer expected";
                if (message.pr_file_paths != null && message.hasOwnProperty("pr_file_paths")) {
                    if (!Array.isArray(message.pr_file_paths))
                        return "pr_file_paths: array expected";
                    for (var i = 0; i < message.pr_file_paths.length; ++i)
                        if (!$util.isString(message.pr_file_paths[i]))
                            return "pr_file_paths: string[] expected";
                }
                if (message.author != null && message.hasOwnProperty("author")) {
                    var error = $root.mdc.proto.User.verify(message.author);
                    if (error)
                        return "author." + error;
                }
                if (message.committer != null && message.hasOwnProperty("committer")) {
                    var error = $root.mdc.proto.User.verify(message.committer);
                    if (error)
                        return "committer." + error;
                }
                return null;
            };

            /**
             * Creates a GitRevision message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.GitRevision} GitRevision
             */
            GitRevision.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.GitRevision)
                    return object;
                var message = new $root.mdc.proto.GitRevision();
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
                case "TRAVIS_PR":
                case 5:
                    message.type = 5;
                    break;
                }
                if (object.golden_json_file_path != null)
                    message.golden_json_file_path = String(object.golden_json_file_path);
                if (object.commit != null)
                    message.commit = String(object.commit);
                if (object.remote != null)
                    message.remote = String(object.remote);
                if (object.branch != null)
                    message.branch = String(object.branch);
                if (object.tag != null)
                    message.tag = String(object.tag);
                if (object.pr_number != null)
                    message.pr_number = object.pr_number >>> 0;
                if (object.pr_file_paths) {
                    if (!Array.isArray(object.pr_file_paths))
                        throw TypeError(".mdc.proto.GitRevision.pr_file_paths: array expected");
                    message.pr_file_paths = [];
                    for (var i = 0; i < object.pr_file_paths.length; ++i)
                        message.pr_file_paths[i] = String(object.pr_file_paths[i]);
                }
                if (object.author != null) {
                    if (typeof object.author !== "object")
                        throw TypeError(".mdc.proto.GitRevision.author: object expected");
                    message.author = $root.mdc.proto.User.fromObject(object.author);
                }
                if (object.committer != null) {
                    if (typeof object.committer !== "object")
                        throw TypeError(".mdc.proto.GitRevision.committer: object expected");
                    message.committer = $root.mdc.proto.User.fromObject(object.committer);
                }
                return message;
            };

            /**
             * Creates a plain object from a GitRevision message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.GitRevision
             * @static
             * @param {mdc.proto.GitRevision} message GitRevision
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GitRevision.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.pr_file_paths = [];
                if (options.defaults) {
                    object.type = options.enums === String ? "UNKNOWN" : 0;
                    object.golden_json_file_path = "";
                    object.commit = "";
                    object.remote = "";
                    object.branch = "";
                    object.tag = "";
                    object.pr_number = 0;
                    object.author = null;
                    object.committer = null;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.mdc.proto.GitRevision.Type[message.type] : message.type;
                if (message.golden_json_file_path != null && message.hasOwnProperty("golden_json_file_path"))
                    object.golden_json_file_path = message.golden_json_file_path;
                if (message.commit != null && message.hasOwnProperty("commit"))
                    object.commit = message.commit;
                if (message.remote != null && message.hasOwnProperty("remote"))
                    object.remote = message.remote;
                if (message.branch != null && message.hasOwnProperty("branch"))
                    object.branch = message.branch;
                if (message.tag != null && message.hasOwnProperty("tag"))
                    object.tag = message.tag;
                if (message.pr_number != null && message.hasOwnProperty("pr_number"))
                    object.pr_number = message.pr_number;
                if (message.pr_file_paths && message.pr_file_paths.length) {
                    object.pr_file_paths = [];
                    for (var j = 0; j < message.pr_file_paths.length; ++j)
                        object.pr_file_paths[j] = message.pr_file_paths[j];
                }
                if (message.author != null && message.hasOwnProperty("author"))
                    object.author = $root.mdc.proto.User.toObject(message.author, options);
                if (message.committer != null && message.hasOwnProperty("committer"))
                    object.committer = $root.mdc.proto.User.toObject(message.committer, options);
                return object;
            };

            /**
             * Converts this GitRevision to JSON.
             * @function toJSON
             * @memberof mdc.proto.GitRevision
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GitRevision.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Type enum.
             * @name mdc.proto.GitRevision.Type
             * @enum {string}
             * @property {number} UNKNOWN=0 UNKNOWN value
             * @property {number} COMMIT=1 COMMIT value
             * @property {number} LOCAL_BRANCH=2 LOCAL_BRANCH value
             * @property {number} REMOTE_BRANCH=3 REMOTE_BRANCH value
             * @property {number} REMOTE_TAG=4 REMOTE_TAG value
             * @property {number} TRAVIS_PR=5 TRAVIS_PR value
             */
            GitRevision.Type = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "UNKNOWN"] = 0;
                values[valuesById[1] = "COMMIT"] = 1;
                values[valuesById[2] = "LOCAL_BRANCH"] = 2;
                values[valuesById[3] = "REMOTE_BRANCH"] = 3;
                values[valuesById[4] = "REMOTE_TAG"] = 4;
                values[valuesById[5] = "TRAVIS_PR"] = 5;
                return values;
            })();

            return GitRevision;
        })();

        proto.User = (function() {

            /**
             * Properties of a User.
             * @memberof mdc.proto
             * @interface IUser
             * @property {string|null} [name] User name
             * @property {string|null} [email] User email
             * @property {string|null} [username] User username
             */

            /**
             * Constructs a new User.
             * @memberof mdc.proto
             * @classdesc Represents a User.
             * @implements IUser
             * @constructor
             * @param {mdc.proto.IUser=} [properties] Properties to set
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
             * @memberof mdc.proto.User
             * @instance
             */
            User.prototype.name = "";

            /**
             * User email.
             * @member {string} email
             * @memberof mdc.proto.User
             * @instance
             */
            User.prototype.email = "";

            /**
             * User username.
             * @member {string} username
             * @memberof mdc.proto.User
             * @instance
             */
            User.prototype.username = "";

            /**
             * Creates a new User instance using the specified properties.
             * @function create
             * @memberof mdc.proto.User
             * @static
             * @param {mdc.proto.IUser=} [properties] Properties to set
             * @returns {mdc.proto.User} User instance
             */
            User.create = function create(properties) {
                return new User(properties);
            };

            /**
             * Encodes the specified User message. Does not implicitly {@link mdc.proto.User.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.User
             * @static
             * @param {mdc.proto.IUser} message User message or plain object to encode
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
             * Encodes the specified User message, length delimited. Does not implicitly {@link mdc.proto.User.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.User
             * @static
             * @param {mdc.proto.IUser} message User message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            User.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a User message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.User
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.User} User
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            User.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.User();
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
             * @memberof mdc.proto.User
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.User} User
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
             * @memberof mdc.proto.User
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
             * @memberof mdc.proto.User
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.User} User
             */
            User.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.User)
                    return object;
                var message = new $root.mdc.proto.User();
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
             * @memberof mdc.proto.User
             * @static
             * @param {mdc.proto.User} message User
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
             * @memberof mdc.proto.User
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            User.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return User;
        })();

        proto.LibraryVersion = (function() {

            /**
             * Properties of a LibraryVersion.
             * @memberof mdc.proto
             * @interface ILibraryVersion
             * @property {string|null} [version_string] LibraryVersion version_string
             */

            /**
             * Constructs a new LibraryVersion.
             * @memberof mdc.proto
             * @classdesc Represents a LibraryVersion.
             * @implements ILibraryVersion
             * @constructor
             * @param {mdc.proto.ILibraryVersion=} [properties] Properties to set
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
             * @memberof mdc.proto.LibraryVersion
             * @instance
             */
            LibraryVersion.prototype.version_string = "";

            /**
             * Creates a new LibraryVersion instance using the specified properties.
             * @function create
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {mdc.proto.ILibraryVersion=} [properties] Properties to set
             * @returns {mdc.proto.LibraryVersion} LibraryVersion instance
             */
            LibraryVersion.create = function create(properties) {
                return new LibraryVersion(properties);
            };

            /**
             * Encodes the specified LibraryVersion message. Does not implicitly {@link mdc.proto.LibraryVersion.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {mdc.proto.ILibraryVersion} message LibraryVersion message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LibraryVersion.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.version_string != null && message.hasOwnProperty("version_string"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.version_string);
                return writer;
            };

            /**
             * Encodes the specified LibraryVersion message, length delimited. Does not implicitly {@link mdc.proto.LibraryVersion.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {mdc.proto.ILibraryVersion} message LibraryVersion message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LibraryVersion.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LibraryVersion message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.LibraryVersion} LibraryVersion
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LibraryVersion.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.LibraryVersion();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.version_string = reader.string();
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
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.LibraryVersion} LibraryVersion
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
             * @memberof mdc.proto.LibraryVersion
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
                return null;
            };

            /**
             * Creates a LibraryVersion message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.LibraryVersion} LibraryVersion
             */
            LibraryVersion.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.LibraryVersion)
                    return object;
                var message = new $root.mdc.proto.LibraryVersion();
                if (object.version_string != null)
                    message.version_string = String(object.version_string);
                return message;
            };

            /**
             * Creates a plain object from a LibraryVersion message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.LibraryVersion
             * @static
             * @param {mdc.proto.LibraryVersion} message LibraryVersion
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LibraryVersion.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.version_string = "";
                if (message.version_string != null && message.hasOwnProperty("version_string"))
                    object.version_string = message.version_string;
                return object;
            };

            /**
             * Converts this LibraryVersion to JSON.
             * @function toJSON
             * @memberof mdc.proto.LibraryVersion
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LibraryVersion.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return LibraryVersion;
        })();

        proto.UserAgents = (function() {

            /**
             * Properties of a UserAgents.
             * @memberof mdc.proto
             * @interface IUserAgents
             * @property {Array.<mdc.proto.IUserAgent>|null} [all_user_agents] UserAgents all_user_agents
             * @property {Array.<mdc.proto.IUserAgent>|null} [runnable_user_agents] UserAgents runnable_user_agents
             * @property {Array.<mdc.proto.IUserAgent>|null} [skipped_user_agents] UserAgents skipped_user_agents
             */

            /**
             * Constructs a new UserAgents.
             * @memberof mdc.proto
             * @classdesc Represents a UserAgents.
             * @implements IUserAgents
             * @constructor
             * @param {mdc.proto.IUserAgents=} [properties] Properties to set
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
             * @member {Array.<mdc.proto.IUserAgent>} all_user_agents
             * @memberof mdc.proto.UserAgents
             * @instance
             */
            UserAgents.prototype.all_user_agents = $util.emptyArray;

            /**
             * UserAgents runnable_user_agents.
             * @member {Array.<mdc.proto.IUserAgent>} runnable_user_agents
             * @memberof mdc.proto.UserAgents
             * @instance
             */
            UserAgents.prototype.runnable_user_agents = $util.emptyArray;

            /**
             * UserAgents skipped_user_agents.
             * @member {Array.<mdc.proto.IUserAgent>} skipped_user_agents
             * @memberof mdc.proto.UserAgents
             * @instance
             */
            UserAgents.prototype.skipped_user_agents = $util.emptyArray;

            /**
             * Creates a new UserAgents instance using the specified properties.
             * @function create
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {mdc.proto.IUserAgents=} [properties] Properties to set
             * @returns {mdc.proto.UserAgents} UserAgents instance
             */
            UserAgents.create = function create(properties) {
                return new UserAgents(properties);
            };

            /**
             * Encodes the specified UserAgents message. Does not implicitly {@link mdc.proto.UserAgents.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {mdc.proto.IUserAgents} message UserAgents message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserAgents.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.all_user_agents != null && message.all_user_agents.length)
                    for (var i = 0; i < message.all_user_agents.length; ++i)
                        $root.mdc.proto.UserAgent.encode(message.all_user_agents[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.runnable_user_agents != null && message.runnable_user_agents.length)
                    for (var i = 0; i < message.runnable_user_agents.length; ++i)
                        $root.mdc.proto.UserAgent.encode(message.runnable_user_agents[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.skipped_user_agents != null && message.skipped_user_agents.length)
                    for (var i = 0; i < message.skipped_user_agents.length; ++i)
                        $root.mdc.proto.UserAgent.encode(message.skipped_user_agents[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified UserAgents message, length delimited. Does not implicitly {@link mdc.proto.UserAgents.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {mdc.proto.IUserAgents} message UserAgents message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserAgents.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserAgents message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.UserAgents} UserAgents
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserAgents.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.UserAgents();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.all_user_agents && message.all_user_agents.length))
                            message.all_user_agents = [];
                        message.all_user_agents.push($root.mdc.proto.UserAgent.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.runnable_user_agents && message.runnable_user_agents.length))
                            message.runnable_user_agents = [];
                        message.runnable_user_agents.push($root.mdc.proto.UserAgent.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.skipped_user_agents && message.skipped_user_agents.length))
                            message.skipped_user_agents = [];
                        message.skipped_user_agents.push($root.mdc.proto.UserAgent.decode(reader, reader.uint32()));
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
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.UserAgents} UserAgents
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
             * @memberof mdc.proto.UserAgents
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
                        var error = $root.mdc.proto.UserAgent.verify(message.all_user_agents[i]);
                        if (error)
                            return "all_user_agents." + error;
                    }
                }
                if (message.runnable_user_agents != null && message.hasOwnProperty("runnable_user_agents")) {
                    if (!Array.isArray(message.runnable_user_agents))
                        return "runnable_user_agents: array expected";
                    for (var i = 0; i < message.runnable_user_agents.length; ++i) {
                        var error = $root.mdc.proto.UserAgent.verify(message.runnable_user_agents[i]);
                        if (error)
                            return "runnable_user_agents." + error;
                    }
                }
                if (message.skipped_user_agents != null && message.hasOwnProperty("skipped_user_agents")) {
                    if (!Array.isArray(message.skipped_user_agents))
                        return "skipped_user_agents: array expected";
                    for (var i = 0; i < message.skipped_user_agents.length; ++i) {
                        var error = $root.mdc.proto.UserAgent.verify(message.skipped_user_agents[i]);
                        if (error)
                            return "skipped_user_agents." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a UserAgents message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.UserAgents} UserAgents
             */
            UserAgents.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.UserAgents)
                    return object;
                var message = new $root.mdc.proto.UserAgents();
                if (object.all_user_agents) {
                    if (!Array.isArray(object.all_user_agents))
                        throw TypeError(".mdc.proto.UserAgents.all_user_agents: array expected");
                    message.all_user_agents = [];
                    for (var i = 0; i < object.all_user_agents.length; ++i) {
                        if (typeof object.all_user_agents[i] !== "object")
                            throw TypeError(".mdc.proto.UserAgents.all_user_agents: object expected");
                        message.all_user_agents[i] = $root.mdc.proto.UserAgent.fromObject(object.all_user_agents[i]);
                    }
                }
                if (object.runnable_user_agents) {
                    if (!Array.isArray(object.runnable_user_agents))
                        throw TypeError(".mdc.proto.UserAgents.runnable_user_agents: array expected");
                    message.runnable_user_agents = [];
                    for (var i = 0; i < object.runnable_user_agents.length; ++i) {
                        if (typeof object.runnable_user_agents[i] !== "object")
                            throw TypeError(".mdc.proto.UserAgents.runnable_user_agents: object expected");
                        message.runnable_user_agents[i] = $root.mdc.proto.UserAgent.fromObject(object.runnable_user_agents[i]);
                    }
                }
                if (object.skipped_user_agents) {
                    if (!Array.isArray(object.skipped_user_agents))
                        throw TypeError(".mdc.proto.UserAgents.skipped_user_agents: array expected");
                    message.skipped_user_agents = [];
                    for (var i = 0; i < object.skipped_user_agents.length; ++i) {
                        if (typeof object.skipped_user_agents[i] !== "object")
                            throw TypeError(".mdc.proto.UserAgents.skipped_user_agents: object expected");
                        message.skipped_user_agents[i] = $root.mdc.proto.UserAgent.fromObject(object.skipped_user_agents[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a UserAgents message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.UserAgents
             * @static
             * @param {mdc.proto.UserAgents} message UserAgents
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
                        object.all_user_agents[j] = $root.mdc.proto.UserAgent.toObject(message.all_user_agents[j], options);
                }
                if (message.runnable_user_agents && message.runnable_user_agents.length) {
                    object.runnable_user_agents = [];
                    for (var j = 0; j < message.runnable_user_agents.length; ++j)
                        object.runnable_user_agents[j] = $root.mdc.proto.UserAgent.toObject(message.runnable_user_agents[j], options);
                }
                if (message.skipped_user_agents && message.skipped_user_agents.length) {
                    object.skipped_user_agents = [];
                    for (var j = 0; j < message.skipped_user_agents.length; ++j)
                        object.skipped_user_agents[j] = $root.mdc.proto.UserAgent.toObject(message.skipped_user_agents[j], options);
                }
                return object;
            };

            /**
             * Converts this UserAgents to JSON.
             * @function toJSON
             * @memberof mdc.proto.UserAgents
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserAgents.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UserAgents;
        })();

        proto.UserAgent = (function() {

            /**
             * Properties of a UserAgent.
             * @memberof mdc.proto
             * @interface IUserAgent
             * @property {string|null} [alias] UserAgent alias
             * @property {string|null} [form_factor_name] UserAgent form_factor_name
             * @property {string|null} [os_vendor_name] UserAgent os_vendor_name
             * @property {string|null} [browser_vendor_name] UserAgent browser_vendor_name
             * @property {string|null} [browser_version_name] UserAgent browser_version_name
             * @property {string|null} [browser_version_value] UserAgent browser_version_value
             * @property {mdc.proto.UserAgent.FormFactorType|null} [form_factor_type] UserAgent form_factor_type
             * @property {mdc.proto.UserAgent.OsVendorType|null} [os_vendor_type] UserAgent os_vendor_type
             * @property {mdc.proto.UserAgent.BrowserVendorType|null} [browser_vendor_type] UserAgent browser_vendor_type
             * @property {mdc.proto.UserAgent.BrowserVersionType|null} [browser_version_type] UserAgent browser_version_type
             * @property {selenium.proto.IRawCapabilities|null} [desired_capabilities] UserAgent desired_capabilities
             * @property {selenium.proto.IRawCapabilities|null} [actual_capabilities] UserAgent actual_capabilities
             * @property {mdc.proto.UserAgent.INavigator|null} [navigator] UserAgent navigator
             * @property {boolean|null} [is_enabled_by_cli] UserAgent is_enabled_by_cli
             * @property {boolean|null} [is_available_locally] UserAgent is_available_locally
             * @property {boolean|null} [is_runnable] UserAgent is_runnable
             * @property {string|null} [image_filename_suffix] UserAgent image_filename_suffix
             * @property {string|null} [browser_icon_url] UserAgent browser_icon_url
             * @property {string|null} [os_icon_url] UserAgent os_icon_url
             */

            /**
             * Constructs a new UserAgent.
             * @memberof mdc.proto
             * @classdesc Represents a UserAgent.
             * @implements IUserAgent
             * @constructor
             * @param {mdc.proto.IUserAgent=} [properties] Properties to set
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
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.alias = "";

            /**
             * UserAgent form_factor_name.
             * @member {string} form_factor_name
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.form_factor_name = "";

            /**
             * UserAgent os_vendor_name.
             * @member {string} os_vendor_name
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.os_vendor_name = "";

            /**
             * UserAgent browser_vendor_name.
             * @member {string} browser_vendor_name
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.browser_vendor_name = "";

            /**
             * UserAgent browser_version_name.
             * @member {string} browser_version_name
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.browser_version_name = "";

            /**
             * UserAgent browser_version_value.
             * @member {string} browser_version_value
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.browser_version_value = "";

            /**
             * UserAgent form_factor_type.
             * @member {mdc.proto.UserAgent.FormFactorType} form_factor_type
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.form_factor_type = 0;

            /**
             * UserAgent os_vendor_type.
             * @member {mdc.proto.UserAgent.OsVendorType} os_vendor_type
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.os_vendor_type = 0;

            /**
             * UserAgent browser_vendor_type.
             * @member {mdc.proto.UserAgent.BrowserVendorType} browser_vendor_type
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.browser_vendor_type = 0;

            /**
             * UserAgent browser_version_type.
             * @member {mdc.proto.UserAgent.BrowserVersionType} browser_version_type
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.browser_version_type = 0;

            /**
             * UserAgent desired_capabilities.
             * @member {selenium.proto.IRawCapabilities|null|undefined} desired_capabilities
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.desired_capabilities = null;

            /**
             * UserAgent actual_capabilities.
             * @member {selenium.proto.IRawCapabilities|null|undefined} actual_capabilities
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.actual_capabilities = null;

            /**
             * UserAgent navigator.
             * @member {mdc.proto.UserAgent.INavigator|null|undefined} navigator
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.navigator = null;

            /**
             * UserAgent is_enabled_by_cli.
             * @member {boolean} is_enabled_by_cli
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.is_enabled_by_cli = false;

            /**
             * UserAgent is_available_locally.
             * @member {boolean} is_available_locally
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.is_available_locally = false;

            /**
             * UserAgent is_runnable.
             * @member {boolean} is_runnable
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.is_runnable = false;

            /**
             * UserAgent image_filename_suffix.
             * @member {string} image_filename_suffix
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.image_filename_suffix = "";

            /**
             * UserAgent browser_icon_url.
             * @member {string} browser_icon_url
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.browser_icon_url = "";

            /**
             * UserAgent os_icon_url.
             * @member {string} os_icon_url
             * @memberof mdc.proto.UserAgent
             * @instance
             */
            UserAgent.prototype.os_icon_url = "";

            /**
             * Creates a new UserAgent instance using the specified properties.
             * @function create
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {mdc.proto.IUserAgent=} [properties] Properties to set
             * @returns {mdc.proto.UserAgent} UserAgent instance
             */
            UserAgent.create = function create(properties) {
                return new UserAgent(properties);
            };

            /**
             * Encodes the specified UserAgent message. Does not implicitly {@link mdc.proto.UserAgent.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {mdc.proto.IUserAgent} message UserAgent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserAgent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.alias != null && message.hasOwnProperty("alias"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.alias);
                if (message.form_factor_name != null && message.hasOwnProperty("form_factor_name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.form_factor_name);
                if (message.os_vendor_name != null && message.hasOwnProperty("os_vendor_name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.os_vendor_name);
                if (message.browser_vendor_name != null && message.hasOwnProperty("browser_vendor_name"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.browser_vendor_name);
                if (message.browser_version_name != null && message.hasOwnProperty("browser_version_name"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.browser_version_name);
                if (message.browser_version_value != null && message.hasOwnProperty("browser_version_value"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.browser_version_value);
                if (message.form_factor_type != null && message.hasOwnProperty("form_factor_type"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.form_factor_type);
                if (message.os_vendor_type != null && message.hasOwnProperty("os_vendor_type"))
                    writer.uint32(/* id 8, wireType 0 =*/64).int32(message.os_vendor_type);
                if (message.browser_vendor_type != null && message.hasOwnProperty("browser_vendor_type"))
                    writer.uint32(/* id 9, wireType 0 =*/72).int32(message.browser_vendor_type);
                if (message.browser_version_type != null && message.hasOwnProperty("browser_version_type"))
                    writer.uint32(/* id 10, wireType 0 =*/80).int32(message.browser_version_type);
                if (message.desired_capabilities != null && message.hasOwnProperty("desired_capabilities"))
                    $root.selenium.proto.RawCapabilities.encode(message.desired_capabilities, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.actual_capabilities != null && message.hasOwnProperty("actual_capabilities"))
                    $root.selenium.proto.RawCapabilities.encode(message.actual_capabilities, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                if (message.navigator != null && message.hasOwnProperty("navigator"))
                    $root.mdc.proto.UserAgent.Navigator.encode(message.navigator, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
                if (message.is_enabled_by_cli != null && message.hasOwnProperty("is_enabled_by_cli"))
                    writer.uint32(/* id 14, wireType 0 =*/112).bool(message.is_enabled_by_cli);
                if (message.is_available_locally != null && message.hasOwnProperty("is_available_locally"))
                    writer.uint32(/* id 15, wireType 0 =*/120).bool(message.is_available_locally);
                if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                    writer.uint32(/* id 16, wireType 0 =*/128).bool(message.is_runnable);
                if (message.image_filename_suffix != null && message.hasOwnProperty("image_filename_suffix"))
                    writer.uint32(/* id 17, wireType 2 =*/138).string(message.image_filename_suffix);
                if (message.browser_icon_url != null && message.hasOwnProperty("browser_icon_url"))
                    writer.uint32(/* id 18, wireType 2 =*/146).string(message.browser_icon_url);
                if (message.os_icon_url != null && message.hasOwnProperty("os_icon_url"))
                    writer.uint32(/* id 19, wireType 2 =*/154).string(message.os_icon_url);
                return writer;
            };

            /**
             * Encodes the specified UserAgent message, length delimited. Does not implicitly {@link mdc.proto.UserAgent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {mdc.proto.IUserAgent} message UserAgent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserAgent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserAgent message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.UserAgent} UserAgent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserAgent.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.UserAgent();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.alias = reader.string();
                        break;
                    case 2:
                        message.form_factor_name = reader.string();
                        break;
                    case 3:
                        message.os_vendor_name = reader.string();
                        break;
                    case 4:
                        message.browser_vendor_name = reader.string();
                        break;
                    case 5:
                        message.browser_version_name = reader.string();
                        break;
                    case 6:
                        message.browser_version_value = reader.string();
                        break;
                    case 7:
                        message.form_factor_type = reader.int32();
                        break;
                    case 8:
                        message.os_vendor_type = reader.int32();
                        break;
                    case 9:
                        message.browser_vendor_type = reader.int32();
                        break;
                    case 10:
                        message.browser_version_type = reader.int32();
                        break;
                    case 11:
                        message.desired_capabilities = $root.selenium.proto.RawCapabilities.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.actual_capabilities = $root.selenium.proto.RawCapabilities.decode(reader, reader.uint32());
                        break;
                    case 13:
                        message.navigator = $root.mdc.proto.UserAgent.Navigator.decode(reader, reader.uint32());
                        break;
                    case 14:
                        message.is_enabled_by_cli = reader.bool();
                        break;
                    case 15:
                        message.is_available_locally = reader.bool();
                        break;
                    case 16:
                        message.is_runnable = reader.bool();
                        break;
                    case 17:
                        message.image_filename_suffix = reader.string();
                        break;
                    case 18:
                        message.browser_icon_url = reader.string();
                        break;
                    case 19:
                        message.os_icon_url = reader.string();
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
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.UserAgent} UserAgent
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
             * @memberof mdc.proto.UserAgent
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
                if (message.form_factor_name != null && message.hasOwnProperty("form_factor_name"))
                    if (!$util.isString(message.form_factor_name))
                        return "form_factor_name: string expected";
                if (message.os_vendor_name != null && message.hasOwnProperty("os_vendor_name"))
                    if (!$util.isString(message.os_vendor_name))
                        return "os_vendor_name: string expected";
                if (message.browser_vendor_name != null && message.hasOwnProperty("browser_vendor_name"))
                    if (!$util.isString(message.browser_vendor_name))
                        return "browser_vendor_name: string expected";
                if (message.browser_version_name != null && message.hasOwnProperty("browser_version_name"))
                    if (!$util.isString(message.browser_version_name))
                        return "browser_version_name: string expected";
                if (message.browser_version_value != null && message.hasOwnProperty("browser_version_value"))
                    if (!$util.isString(message.browser_version_value))
                        return "browser_version_value: string expected";
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
                if (message.desired_capabilities != null && message.hasOwnProperty("desired_capabilities")) {
                    var error = $root.selenium.proto.RawCapabilities.verify(message.desired_capabilities);
                    if (error)
                        return "desired_capabilities." + error;
                }
                if (message.actual_capabilities != null && message.hasOwnProperty("actual_capabilities")) {
                    var error = $root.selenium.proto.RawCapabilities.verify(message.actual_capabilities);
                    if (error)
                        return "actual_capabilities." + error;
                }
                if (message.navigator != null && message.hasOwnProperty("navigator")) {
                    var error = $root.mdc.proto.UserAgent.Navigator.verify(message.navigator);
                    if (error)
                        return "navigator." + error;
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
                if (message.image_filename_suffix != null && message.hasOwnProperty("image_filename_suffix"))
                    if (!$util.isString(message.image_filename_suffix))
                        return "image_filename_suffix: string expected";
                if (message.browser_icon_url != null && message.hasOwnProperty("browser_icon_url"))
                    if (!$util.isString(message.browser_icon_url))
                        return "browser_icon_url: string expected";
                if (message.os_icon_url != null && message.hasOwnProperty("os_icon_url"))
                    if (!$util.isString(message.os_icon_url))
                        return "os_icon_url: string expected";
                return null;
            };

            /**
             * Creates a UserAgent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.UserAgent} UserAgent
             */
            UserAgent.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.UserAgent)
                    return object;
                var message = new $root.mdc.proto.UserAgent();
                if (object.alias != null)
                    message.alias = String(object.alias);
                if (object.form_factor_name != null)
                    message.form_factor_name = String(object.form_factor_name);
                if (object.os_vendor_name != null)
                    message.os_vendor_name = String(object.os_vendor_name);
                if (object.browser_vendor_name != null)
                    message.browser_vendor_name = String(object.browser_vendor_name);
                if (object.browser_version_name != null)
                    message.browser_version_name = String(object.browser_version_name);
                if (object.browser_version_value != null)
                    message.browser_version_value = String(object.browser_version_value);
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
                if (object.desired_capabilities != null) {
                    if (typeof object.desired_capabilities !== "object")
                        throw TypeError(".mdc.proto.UserAgent.desired_capabilities: object expected");
                    message.desired_capabilities = $root.selenium.proto.RawCapabilities.fromObject(object.desired_capabilities);
                }
                if (object.actual_capabilities != null) {
                    if (typeof object.actual_capabilities !== "object")
                        throw TypeError(".mdc.proto.UserAgent.actual_capabilities: object expected");
                    message.actual_capabilities = $root.selenium.proto.RawCapabilities.fromObject(object.actual_capabilities);
                }
                if (object.navigator != null) {
                    if (typeof object.navigator !== "object")
                        throw TypeError(".mdc.proto.UserAgent.navigator: object expected");
                    message.navigator = $root.mdc.proto.UserAgent.Navigator.fromObject(object.navigator);
                }
                if (object.is_enabled_by_cli != null)
                    message.is_enabled_by_cli = Boolean(object.is_enabled_by_cli);
                if (object.is_available_locally != null)
                    message.is_available_locally = Boolean(object.is_available_locally);
                if (object.is_runnable != null)
                    message.is_runnable = Boolean(object.is_runnable);
                if (object.image_filename_suffix != null)
                    message.image_filename_suffix = String(object.image_filename_suffix);
                if (object.browser_icon_url != null)
                    message.browser_icon_url = String(object.browser_icon_url);
                if (object.os_icon_url != null)
                    message.os_icon_url = String(object.os_icon_url);
                return message;
            };

            /**
             * Creates a plain object from a UserAgent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.UserAgent
             * @static
             * @param {mdc.proto.UserAgent} message UserAgent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserAgent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.alias = "";
                    object.form_factor_name = "";
                    object.os_vendor_name = "";
                    object.browser_vendor_name = "";
                    object.browser_version_name = "";
                    object.browser_version_value = "";
                    object.form_factor_type = options.enums === String ? "UNKNOWN" : 0;
                    object.os_vendor_type = options.enums === String ? "UNKNOWN" : 0;
                    object.browser_vendor_type = options.enums === String ? "UNKNOWN" : 0;
                    object.browser_version_type = options.enums === String ? "UNKNOWN" : 0;
                    object.desired_capabilities = null;
                    object.actual_capabilities = null;
                    object.navigator = null;
                    object.is_enabled_by_cli = false;
                    object.is_available_locally = false;
                    object.is_runnable = false;
                    object.image_filename_suffix = "";
                    object.browser_icon_url = "";
                    object.os_icon_url = "";
                }
                if (message.alias != null && message.hasOwnProperty("alias"))
                    object.alias = message.alias;
                if (message.form_factor_name != null && message.hasOwnProperty("form_factor_name"))
                    object.form_factor_name = message.form_factor_name;
                if (message.os_vendor_name != null && message.hasOwnProperty("os_vendor_name"))
                    object.os_vendor_name = message.os_vendor_name;
                if (message.browser_vendor_name != null && message.hasOwnProperty("browser_vendor_name"))
                    object.browser_vendor_name = message.browser_vendor_name;
                if (message.browser_version_name != null && message.hasOwnProperty("browser_version_name"))
                    object.browser_version_name = message.browser_version_name;
                if (message.browser_version_value != null && message.hasOwnProperty("browser_version_value"))
                    object.browser_version_value = message.browser_version_value;
                if (message.form_factor_type != null && message.hasOwnProperty("form_factor_type"))
                    object.form_factor_type = options.enums === String ? $root.mdc.proto.UserAgent.FormFactorType[message.form_factor_type] : message.form_factor_type;
                if (message.os_vendor_type != null && message.hasOwnProperty("os_vendor_type"))
                    object.os_vendor_type = options.enums === String ? $root.mdc.proto.UserAgent.OsVendorType[message.os_vendor_type] : message.os_vendor_type;
                if (message.browser_vendor_type != null && message.hasOwnProperty("browser_vendor_type"))
                    object.browser_vendor_type = options.enums === String ? $root.mdc.proto.UserAgent.BrowserVendorType[message.browser_vendor_type] : message.browser_vendor_type;
                if (message.browser_version_type != null && message.hasOwnProperty("browser_version_type"))
                    object.browser_version_type = options.enums === String ? $root.mdc.proto.UserAgent.BrowserVersionType[message.browser_version_type] : message.browser_version_type;
                if (message.desired_capabilities != null && message.hasOwnProperty("desired_capabilities"))
                    object.desired_capabilities = $root.selenium.proto.RawCapabilities.toObject(message.desired_capabilities, options);
                if (message.actual_capabilities != null && message.hasOwnProperty("actual_capabilities"))
                    object.actual_capabilities = $root.selenium.proto.RawCapabilities.toObject(message.actual_capabilities, options);
                if (message.navigator != null && message.hasOwnProperty("navigator"))
                    object.navigator = $root.mdc.proto.UserAgent.Navigator.toObject(message.navigator, options);
                if (message.is_enabled_by_cli != null && message.hasOwnProperty("is_enabled_by_cli"))
                    object.is_enabled_by_cli = message.is_enabled_by_cli;
                if (message.is_available_locally != null && message.hasOwnProperty("is_available_locally"))
                    object.is_available_locally = message.is_available_locally;
                if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                    object.is_runnable = message.is_runnable;
                if (message.image_filename_suffix != null && message.hasOwnProperty("image_filename_suffix"))
                    object.image_filename_suffix = message.image_filename_suffix;
                if (message.browser_icon_url != null && message.hasOwnProperty("browser_icon_url"))
                    object.browser_icon_url = message.browser_icon_url;
                if (message.os_icon_url != null && message.hasOwnProperty("os_icon_url"))
                    object.os_icon_url = message.os_icon_url;
                return object;
            };

            /**
             * Converts this UserAgent to JSON.
             * @function toJSON
             * @memberof mdc.proto.UserAgent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserAgent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * FormFactorType enum.
             * @name mdc.proto.UserAgent.FormFactorType
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
             * @name mdc.proto.UserAgent.OsVendorType
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
             * @name mdc.proto.UserAgent.BrowserVendorType
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
             * @name mdc.proto.UserAgent.BrowserVersionType
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

            UserAgent.Navigator = (function() {

                /**
                 * Properties of a Navigator.
                 * @memberof mdc.proto.UserAgent
                 * @interface INavigator
                 * @property {string|null} [os_name] Navigator os_name
                 * @property {string|null} [os_version] Navigator os_version
                 * @property {string|null} [browser_name] Navigator browser_name
                 * @property {string|null} [browser_version] Navigator browser_version
                 * @property {string|null} [full_name] Navigator full_name
                 */

                /**
                 * Constructs a new Navigator.
                 * @memberof mdc.proto.UserAgent
                 * @classdesc Represents a Navigator.
                 * @implements INavigator
                 * @constructor
                 * @param {mdc.proto.UserAgent.INavigator=} [properties] Properties to set
                 */
                function Navigator(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Navigator os_name.
                 * @member {string} os_name
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @instance
                 */
                Navigator.prototype.os_name = "";

                /**
                 * Navigator os_version.
                 * @member {string} os_version
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @instance
                 */
                Navigator.prototype.os_version = "";

                /**
                 * Navigator browser_name.
                 * @member {string} browser_name
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @instance
                 */
                Navigator.prototype.browser_name = "";

                /**
                 * Navigator browser_version.
                 * @member {string} browser_version
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @instance
                 */
                Navigator.prototype.browser_version = "";

                /**
                 * Navigator full_name.
                 * @member {string} full_name
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @instance
                 */
                Navigator.prototype.full_name = "";

                /**
                 * Creates a new Navigator instance using the specified properties.
                 * @function create
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {mdc.proto.UserAgent.INavigator=} [properties] Properties to set
                 * @returns {mdc.proto.UserAgent.Navigator} Navigator instance
                 */
                Navigator.create = function create(properties) {
                    return new Navigator(properties);
                };

                /**
                 * Encodes the specified Navigator message. Does not implicitly {@link mdc.proto.UserAgent.Navigator.verify|verify} messages.
                 * @function encode
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {mdc.proto.UserAgent.INavigator} message Navigator message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Navigator.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.os_name != null && message.hasOwnProperty("os_name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.os_name);
                    if (message.os_version != null && message.hasOwnProperty("os_version"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.os_version);
                    if (message.browser_name != null && message.hasOwnProperty("browser_name"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.browser_name);
                    if (message.browser_version != null && message.hasOwnProperty("browser_version"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.browser_version);
                    if (message.full_name != null && message.hasOwnProperty("full_name"))
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.full_name);
                    return writer;
                };

                /**
                 * Encodes the specified Navigator message, length delimited. Does not implicitly {@link mdc.proto.UserAgent.Navigator.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {mdc.proto.UserAgent.INavigator} message Navigator message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Navigator.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Navigator message from the specified reader or buffer.
                 * @function decode
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {mdc.proto.UserAgent.Navigator} Navigator
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Navigator.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.UserAgent.Navigator();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.os_name = reader.string();
                            break;
                        case 2:
                            message.os_version = reader.string();
                            break;
                        case 3:
                            message.browser_name = reader.string();
                            break;
                        case 4:
                            message.browser_version = reader.string();
                            break;
                        case 5:
                            message.full_name = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Navigator message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {mdc.proto.UserAgent.Navigator} Navigator
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Navigator.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Navigator message.
                 * @function verify
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Navigator.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.os_name != null && message.hasOwnProperty("os_name"))
                        if (!$util.isString(message.os_name))
                            return "os_name: string expected";
                    if (message.os_version != null && message.hasOwnProperty("os_version"))
                        if (!$util.isString(message.os_version))
                            return "os_version: string expected";
                    if (message.browser_name != null && message.hasOwnProperty("browser_name"))
                        if (!$util.isString(message.browser_name))
                            return "browser_name: string expected";
                    if (message.browser_version != null && message.hasOwnProperty("browser_version"))
                        if (!$util.isString(message.browser_version))
                            return "browser_version: string expected";
                    if (message.full_name != null && message.hasOwnProperty("full_name"))
                        if (!$util.isString(message.full_name))
                            return "full_name: string expected";
                    return null;
                };

                /**
                 * Creates a Navigator message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {mdc.proto.UserAgent.Navigator} Navigator
                 */
                Navigator.fromObject = function fromObject(object) {
                    if (object instanceof $root.mdc.proto.UserAgent.Navigator)
                        return object;
                    var message = new $root.mdc.proto.UserAgent.Navigator();
                    if (object.os_name != null)
                        message.os_name = String(object.os_name);
                    if (object.os_version != null)
                        message.os_version = String(object.os_version);
                    if (object.browser_name != null)
                        message.browser_name = String(object.browser_name);
                    if (object.browser_version != null)
                        message.browser_version = String(object.browser_version);
                    if (object.full_name != null)
                        message.full_name = String(object.full_name);
                    return message;
                };

                /**
                 * Creates a plain object from a Navigator message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @static
                 * @param {mdc.proto.UserAgent.Navigator} message Navigator
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Navigator.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.os_name = "";
                        object.os_version = "";
                        object.browser_name = "";
                        object.browser_version = "";
                        object.full_name = "";
                    }
                    if (message.os_name != null && message.hasOwnProperty("os_name"))
                        object.os_name = message.os_name;
                    if (message.os_version != null && message.hasOwnProperty("os_version"))
                        object.os_version = message.os_version;
                    if (message.browser_name != null && message.hasOwnProperty("browser_name"))
                        object.browser_name = message.browser_name;
                    if (message.browser_version != null && message.hasOwnProperty("browser_version"))
                        object.browser_version = message.browser_version;
                    if (message.full_name != null && message.hasOwnProperty("full_name"))
                        object.full_name = message.full_name;
                    return object;
                };

                /**
                 * Converts this Navigator to JSON.
                 * @function toJSON
                 * @memberof mdc.proto.UserAgent.Navigator
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Navigator.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Navigator;
            })();

            return UserAgent;
        })();

        proto.Screenshots = (function() {

            /**
             * Properties of a Screenshots.
             * @memberof mdc.proto
             * @interface IScreenshots
             * @property {Array.<mdc.proto.IScreenshot>|null} [expected_screenshot_list] Screenshots expected_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [actual_screenshot_list] Screenshots actual_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [runnable_screenshot_list] Screenshots runnable_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [skipped_screenshot_list] Screenshots skipped_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [added_screenshot_list] Screenshots added_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [removed_screenshot_list] Screenshots removed_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [comparable_screenshot_list] Screenshots comparable_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [changed_screenshot_list] Screenshots changed_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [unchanged_screenshot_list] Screenshots unchanged_screenshot_list
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [expected_screenshot_browser_map] Screenshots expected_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [actual_screenshot_browser_map] Screenshots actual_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [runnable_screenshot_browser_map] Screenshots runnable_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [skipped_screenshot_browser_map] Screenshots skipped_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [added_screenshot_browser_map] Screenshots added_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [removed_screenshot_browser_map] Screenshots removed_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [comparable_screenshot_browser_map] Screenshots comparable_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [changed_screenshot_browser_map] Screenshots changed_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [unchanged_screenshot_browser_map] Screenshots unchanged_screenshot_browser_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [expected_screenshot_page_map] Screenshots expected_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [actual_screenshot_page_map] Screenshots actual_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [runnable_screenshot_page_map] Screenshots runnable_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [skipped_screenshot_page_map] Screenshots skipped_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [added_screenshot_page_map] Screenshots added_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [removed_screenshot_page_map] Screenshots removed_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [comparable_screenshot_page_map] Screenshots comparable_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [changed_screenshot_page_map] Screenshots changed_screenshot_page_map
             * @property {Object.<string,mdc.proto.IScreenshotList>|null} [unchanged_screenshot_page_map] Screenshots unchanged_screenshot_page_map
             * @property {Array.<string>|null} [runnable_test_page_urls] Screenshots runnable_test_page_urls
             * @property {Array.<string>|null} [skipped_test_page_urls] Screenshots skipped_test_page_urls
             * @property {Array.<string>|null} [runnable_browser_icon_urls] Screenshots runnable_browser_icon_urls
             * @property {Array.<string>|null} [skipped_browser_icon_urls] Screenshots skipped_browser_icon_urls
             * @property {Array.<string>|null} [runnable_screenshot_keys] Screenshots runnable_screenshot_keys
             * @property {Array.<string>|null} [skipped_screenshot_keys] Screenshots skipped_screenshot_keys
             */

            /**
             * Constructs a new Screenshots.
             * @memberof mdc.proto
             * @classdesc Represents a Screenshots.
             * @implements IScreenshots
             * @constructor
             * @param {mdc.proto.IScreenshots=} [properties] Properties to set
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
                this.runnable_test_page_urls = [];
                this.skipped_test_page_urls = [];
                this.runnable_browser_icon_urls = [];
                this.skipped_browser_icon_urls = [];
                this.runnable_screenshot_keys = [];
                this.skipped_screenshot_keys = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Screenshots expected_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} expected_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.expected_screenshot_list = $util.emptyArray;

            /**
             * Screenshots actual_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} actual_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.actual_screenshot_list = $util.emptyArray;

            /**
             * Screenshots runnable_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} runnable_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.runnable_screenshot_list = $util.emptyArray;

            /**
             * Screenshots skipped_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} skipped_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.skipped_screenshot_list = $util.emptyArray;

            /**
             * Screenshots added_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} added_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.added_screenshot_list = $util.emptyArray;

            /**
             * Screenshots removed_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} removed_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.removed_screenshot_list = $util.emptyArray;

            /**
             * Screenshots comparable_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} comparable_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.comparable_screenshot_list = $util.emptyArray;

            /**
             * Screenshots changed_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} changed_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.changed_screenshot_list = $util.emptyArray;

            /**
             * Screenshots unchanged_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} unchanged_screenshot_list
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.unchanged_screenshot_list = $util.emptyArray;

            /**
             * Screenshots expected_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} expected_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.expected_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots actual_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} actual_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.actual_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots runnable_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} runnable_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.runnable_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots skipped_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} skipped_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.skipped_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots added_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} added_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.added_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots removed_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} removed_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.removed_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots comparable_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} comparable_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.comparable_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots changed_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} changed_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.changed_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots unchanged_screenshot_browser_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} unchanged_screenshot_browser_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.unchanged_screenshot_browser_map = $util.emptyObject;

            /**
             * Screenshots expected_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} expected_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.expected_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots actual_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} actual_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.actual_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots runnable_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} runnable_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.runnable_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots skipped_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} skipped_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.skipped_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots added_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} added_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.added_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots removed_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} removed_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.removed_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots comparable_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} comparable_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.comparable_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots changed_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} changed_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.changed_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots unchanged_screenshot_page_map.
             * @member {Object.<string,mdc.proto.IScreenshotList>} unchanged_screenshot_page_map
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.unchanged_screenshot_page_map = $util.emptyObject;

            /**
             * Screenshots runnable_test_page_urls.
             * @member {Array.<string>} runnable_test_page_urls
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.runnable_test_page_urls = $util.emptyArray;

            /**
             * Screenshots skipped_test_page_urls.
             * @member {Array.<string>} skipped_test_page_urls
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.skipped_test_page_urls = $util.emptyArray;

            /**
             * Screenshots runnable_browser_icon_urls.
             * @member {Array.<string>} runnable_browser_icon_urls
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.runnable_browser_icon_urls = $util.emptyArray;

            /**
             * Screenshots skipped_browser_icon_urls.
             * @member {Array.<string>} skipped_browser_icon_urls
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.skipped_browser_icon_urls = $util.emptyArray;

            /**
             * Screenshots runnable_screenshot_keys.
             * @member {Array.<string>} runnable_screenshot_keys
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.runnable_screenshot_keys = $util.emptyArray;

            /**
             * Screenshots skipped_screenshot_keys.
             * @member {Array.<string>} skipped_screenshot_keys
             * @memberof mdc.proto.Screenshots
             * @instance
             */
            Screenshots.prototype.skipped_screenshot_keys = $util.emptyArray;

            /**
             * Creates a new Screenshots instance using the specified properties.
             * @function create
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {mdc.proto.IScreenshots=} [properties] Properties to set
             * @returns {mdc.proto.Screenshots} Screenshots instance
             */
            Screenshots.create = function create(properties) {
                return new Screenshots(properties);
            };

            /**
             * Encodes the specified Screenshots message. Does not implicitly {@link mdc.proto.Screenshots.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {mdc.proto.IScreenshots} message Screenshots message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Screenshots.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.expected_screenshot_list != null && message.expected_screenshot_list.length)
                    for (var i = 0; i < message.expected_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.expected_screenshot_list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.actual_screenshot_list != null && message.actual_screenshot_list.length)
                    for (var i = 0; i < message.actual_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.actual_screenshot_list[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.runnable_screenshot_list != null && message.runnable_screenshot_list.length)
                    for (var i = 0; i < message.runnable_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.runnable_screenshot_list[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.skipped_screenshot_list != null && message.skipped_screenshot_list.length)
                    for (var i = 0; i < message.skipped_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.skipped_screenshot_list[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.added_screenshot_list != null && message.added_screenshot_list.length)
                    for (var i = 0; i < message.added_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.added_screenshot_list[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.removed_screenshot_list != null && message.removed_screenshot_list.length)
                    for (var i = 0; i < message.removed_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.removed_screenshot_list[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.comparable_screenshot_list != null && message.comparable_screenshot_list.length)
                    for (var i = 0; i < message.comparable_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.comparable_screenshot_list[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.changed_screenshot_list != null && message.changed_screenshot_list.length)
                    for (var i = 0; i < message.changed_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.changed_screenshot_list[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.unchanged_screenshot_list != null && message.unchanged_screenshot_list.length)
                    for (var i = 0; i < message.unchanged_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.unchanged_screenshot_list[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.expected_screenshot_browser_map != null && message.hasOwnProperty("expected_screenshot_browser_map"))
                    for (var keys = Object.keys(message.expected_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 10, wireType 2 =*/82).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.expected_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.actual_screenshot_browser_map != null && message.hasOwnProperty("actual_screenshot_browser_map"))
                    for (var keys = Object.keys(message.actual_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 11, wireType 2 =*/90).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.actual_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.runnable_screenshot_browser_map != null && message.hasOwnProperty("runnable_screenshot_browser_map"))
                    for (var keys = Object.keys(message.runnable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 12, wireType 2 =*/98).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.runnable_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.skipped_screenshot_browser_map != null && message.hasOwnProperty("skipped_screenshot_browser_map"))
                    for (var keys = Object.keys(message.skipped_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 13, wireType 2 =*/106).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.skipped_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.added_screenshot_browser_map != null && message.hasOwnProperty("added_screenshot_browser_map"))
                    for (var keys = Object.keys(message.added_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 14, wireType 2 =*/114).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.added_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.removed_screenshot_browser_map != null && message.hasOwnProperty("removed_screenshot_browser_map"))
                    for (var keys = Object.keys(message.removed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 15, wireType 2 =*/122).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.removed_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.comparable_screenshot_browser_map != null && message.hasOwnProperty("comparable_screenshot_browser_map"))
                    for (var keys = Object.keys(message.comparable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 16, wireType 2 =*/130).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.comparable_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.changed_screenshot_browser_map != null && message.hasOwnProperty("changed_screenshot_browser_map"))
                    for (var keys = Object.keys(message.changed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 17, wireType 2 =*/138).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.changed_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.unchanged_screenshot_browser_map != null && message.hasOwnProperty("unchanged_screenshot_browser_map"))
                    for (var keys = Object.keys(message.unchanged_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 18, wireType 2 =*/146).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.unchanged_screenshot_browser_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.expected_screenshot_page_map != null && message.hasOwnProperty("expected_screenshot_page_map"))
                    for (var keys = Object.keys(message.expected_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 19, wireType 2 =*/154).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.expected_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.actual_screenshot_page_map != null && message.hasOwnProperty("actual_screenshot_page_map"))
                    for (var keys = Object.keys(message.actual_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 20, wireType 2 =*/162).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.actual_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.runnable_screenshot_page_map != null && message.hasOwnProperty("runnable_screenshot_page_map"))
                    for (var keys = Object.keys(message.runnable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 21, wireType 2 =*/170).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.runnable_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.skipped_screenshot_page_map != null && message.hasOwnProperty("skipped_screenshot_page_map"))
                    for (var keys = Object.keys(message.skipped_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 22, wireType 2 =*/178).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.skipped_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.added_screenshot_page_map != null && message.hasOwnProperty("added_screenshot_page_map"))
                    for (var keys = Object.keys(message.added_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 23, wireType 2 =*/186).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.added_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.removed_screenshot_page_map != null && message.hasOwnProperty("removed_screenshot_page_map"))
                    for (var keys = Object.keys(message.removed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 24, wireType 2 =*/194).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.removed_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.comparable_screenshot_page_map != null && message.hasOwnProperty("comparable_screenshot_page_map"))
                    for (var keys = Object.keys(message.comparable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 25, wireType 2 =*/202).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.comparable_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.changed_screenshot_page_map != null && message.hasOwnProperty("changed_screenshot_page_map"))
                    for (var keys = Object.keys(message.changed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 26, wireType 2 =*/210).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.changed_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.unchanged_screenshot_page_map != null && message.hasOwnProperty("unchanged_screenshot_page_map"))
                    for (var keys = Object.keys(message.unchanged_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 27, wireType 2 =*/218).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.ScreenshotList.encode(message.unchanged_screenshot_page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                if (message.runnable_test_page_urls != null && message.runnable_test_page_urls.length)
                    for (var i = 0; i < message.runnable_test_page_urls.length; ++i)
                        writer.uint32(/* id 28, wireType 2 =*/226).string(message.runnable_test_page_urls[i]);
                if (message.skipped_test_page_urls != null && message.skipped_test_page_urls.length)
                    for (var i = 0; i < message.skipped_test_page_urls.length; ++i)
                        writer.uint32(/* id 29, wireType 2 =*/234).string(message.skipped_test_page_urls[i]);
                if (message.runnable_browser_icon_urls != null && message.runnable_browser_icon_urls.length)
                    for (var i = 0; i < message.runnable_browser_icon_urls.length; ++i)
                        writer.uint32(/* id 30, wireType 2 =*/242).string(message.runnable_browser_icon_urls[i]);
                if (message.skipped_browser_icon_urls != null && message.skipped_browser_icon_urls.length)
                    for (var i = 0; i < message.skipped_browser_icon_urls.length; ++i)
                        writer.uint32(/* id 31, wireType 2 =*/250).string(message.skipped_browser_icon_urls[i]);
                if (message.runnable_screenshot_keys != null && message.runnable_screenshot_keys.length)
                    for (var i = 0; i < message.runnable_screenshot_keys.length; ++i)
                        writer.uint32(/* id 32, wireType 2 =*/258).string(message.runnable_screenshot_keys[i]);
                if (message.skipped_screenshot_keys != null && message.skipped_screenshot_keys.length)
                    for (var i = 0; i < message.skipped_screenshot_keys.length; ++i)
                        writer.uint32(/* id 33, wireType 2 =*/266).string(message.skipped_screenshot_keys[i]);
                return writer;
            };

            /**
             * Encodes the specified Screenshots message, length delimited. Does not implicitly {@link mdc.proto.Screenshots.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {mdc.proto.IScreenshots} message Screenshots message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Screenshots.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Screenshots message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.Screenshots} Screenshots
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Screenshots.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.Screenshots(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.expected_screenshot_list && message.expected_screenshot_list.length))
                            message.expected_screenshot_list = [];
                        message.expected_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.actual_screenshot_list && message.actual_screenshot_list.length))
                            message.actual_screenshot_list = [];
                        message.actual_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.runnable_screenshot_list && message.runnable_screenshot_list.length))
                            message.runnable_screenshot_list = [];
                        message.runnable_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 4:
                        if (!(message.skipped_screenshot_list && message.skipped_screenshot_list.length))
                            message.skipped_screenshot_list = [];
                        message.skipped_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 5:
                        if (!(message.added_screenshot_list && message.added_screenshot_list.length))
                            message.added_screenshot_list = [];
                        message.added_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 6:
                        if (!(message.removed_screenshot_list && message.removed_screenshot_list.length))
                            message.removed_screenshot_list = [];
                        message.removed_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 7:
                        if (!(message.comparable_screenshot_list && message.comparable_screenshot_list.length))
                            message.comparable_screenshot_list = [];
                        message.comparable_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 8:
                        if (!(message.changed_screenshot_list && message.changed_screenshot_list.length))
                            message.changed_screenshot_list = [];
                        message.changed_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 9:
                        if (!(message.unchanged_screenshot_list && message.unchanged_screenshot_list.length))
                            message.unchanged_screenshot_list = [];
                        message.unchanged_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 10:
                        reader.skip().pos++;
                        if (message.expected_screenshot_browser_map === $util.emptyObject)
                            message.expected_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.expected_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 11:
                        reader.skip().pos++;
                        if (message.actual_screenshot_browser_map === $util.emptyObject)
                            message.actual_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.actual_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 12:
                        reader.skip().pos++;
                        if (message.runnable_screenshot_browser_map === $util.emptyObject)
                            message.runnable_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.runnable_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 13:
                        reader.skip().pos++;
                        if (message.skipped_screenshot_browser_map === $util.emptyObject)
                            message.skipped_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.skipped_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 14:
                        reader.skip().pos++;
                        if (message.added_screenshot_browser_map === $util.emptyObject)
                            message.added_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.added_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 15:
                        reader.skip().pos++;
                        if (message.removed_screenshot_browser_map === $util.emptyObject)
                            message.removed_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.removed_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 16:
                        reader.skip().pos++;
                        if (message.comparable_screenshot_browser_map === $util.emptyObject)
                            message.comparable_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.comparable_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 17:
                        reader.skip().pos++;
                        if (message.changed_screenshot_browser_map === $util.emptyObject)
                            message.changed_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.changed_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 18:
                        reader.skip().pos++;
                        if (message.unchanged_screenshot_browser_map === $util.emptyObject)
                            message.unchanged_screenshot_browser_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.unchanged_screenshot_browser_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 19:
                        reader.skip().pos++;
                        if (message.expected_screenshot_page_map === $util.emptyObject)
                            message.expected_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.expected_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 20:
                        reader.skip().pos++;
                        if (message.actual_screenshot_page_map === $util.emptyObject)
                            message.actual_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.actual_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 21:
                        reader.skip().pos++;
                        if (message.runnable_screenshot_page_map === $util.emptyObject)
                            message.runnable_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.runnable_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 22:
                        reader.skip().pos++;
                        if (message.skipped_screenshot_page_map === $util.emptyObject)
                            message.skipped_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.skipped_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 23:
                        reader.skip().pos++;
                        if (message.added_screenshot_page_map === $util.emptyObject)
                            message.added_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.added_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 24:
                        reader.skip().pos++;
                        if (message.removed_screenshot_page_map === $util.emptyObject)
                            message.removed_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.removed_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 25:
                        reader.skip().pos++;
                        if (message.comparable_screenshot_page_map === $util.emptyObject)
                            message.comparable_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.comparable_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 26:
                        reader.skip().pos++;
                        if (message.changed_screenshot_page_map === $util.emptyObject)
                            message.changed_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.changed_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 27:
                        reader.skip().pos++;
                        if (message.unchanged_screenshot_page_map === $util.emptyObject)
                            message.unchanged_screenshot_page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.unchanged_screenshot_page_map[key] = $root.mdc.proto.ScreenshotList.decode(reader, reader.uint32());
                        break;
                    case 28:
                        if (!(message.runnable_test_page_urls && message.runnable_test_page_urls.length))
                            message.runnable_test_page_urls = [];
                        message.runnable_test_page_urls.push(reader.string());
                        break;
                    case 29:
                        if (!(message.skipped_test_page_urls && message.skipped_test_page_urls.length))
                            message.skipped_test_page_urls = [];
                        message.skipped_test_page_urls.push(reader.string());
                        break;
                    case 30:
                        if (!(message.runnable_browser_icon_urls && message.runnable_browser_icon_urls.length))
                            message.runnable_browser_icon_urls = [];
                        message.runnable_browser_icon_urls.push(reader.string());
                        break;
                    case 31:
                        if (!(message.skipped_browser_icon_urls && message.skipped_browser_icon_urls.length))
                            message.skipped_browser_icon_urls = [];
                        message.skipped_browser_icon_urls.push(reader.string());
                        break;
                    case 32:
                        if (!(message.runnable_screenshot_keys && message.runnable_screenshot_keys.length))
                            message.runnable_screenshot_keys = [];
                        message.runnable_screenshot_keys.push(reader.string());
                        break;
                    case 33:
                        if (!(message.skipped_screenshot_keys && message.skipped_screenshot_keys.length))
                            message.skipped_screenshot_keys = [];
                        message.skipped_screenshot_keys.push(reader.string());
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
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.Screenshots} Screenshots
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
             * @memberof mdc.proto.Screenshots
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
                        var error = $root.mdc.proto.Screenshot.verify(message.expected_screenshot_list[i]);
                        if (error)
                            return "expected_screenshot_list." + error;
                    }
                }
                if (message.actual_screenshot_list != null && message.hasOwnProperty("actual_screenshot_list")) {
                    if (!Array.isArray(message.actual_screenshot_list))
                        return "actual_screenshot_list: array expected";
                    for (var i = 0; i < message.actual_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.actual_screenshot_list[i]);
                        if (error)
                            return "actual_screenshot_list." + error;
                    }
                }
                if (message.runnable_screenshot_list != null && message.hasOwnProperty("runnable_screenshot_list")) {
                    if (!Array.isArray(message.runnable_screenshot_list))
                        return "runnable_screenshot_list: array expected";
                    for (var i = 0; i < message.runnable_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.runnable_screenshot_list[i]);
                        if (error)
                            return "runnable_screenshot_list." + error;
                    }
                }
                if (message.skipped_screenshot_list != null && message.hasOwnProperty("skipped_screenshot_list")) {
                    if (!Array.isArray(message.skipped_screenshot_list))
                        return "skipped_screenshot_list: array expected";
                    for (var i = 0; i < message.skipped_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.skipped_screenshot_list[i]);
                        if (error)
                            return "skipped_screenshot_list." + error;
                    }
                }
                if (message.added_screenshot_list != null && message.hasOwnProperty("added_screenshot_list")) {
                    if (!Array.isArray(message.added_screenshot_list))
                        return "added_screenshot_list: array expected";
                    for (var i = 0; i < message.added_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.added_screenshot_list[i]);
                        if (error)
                            return "added_screenshot_list." + error;
                    }
                }
                if (message.removed_screenshot_list != null && message.hasOwnProperty("removed_screenshot_list")) {
                    if (!Array.isArray(message.removed_screenshot_list))
                        return "removed_screenshot_list: array expected";
                    for (var i = 0; i < message.removed_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.removed_screenshot_list[i]);
                        if (error)
                            return "removed_screenshot_list." + error;
                    }
                }
                if (message.comparable_screenshot_list != null && message.hasOwnProperty("comparable_screenshot_list")) {
                    if (!Array.isArray(message.comparable_screenshot_list))
                        return "comparable_screenshot_list: array expected";
                    for (var i = 0; i < message.comparable_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.comparable_screenshot_list[i]);
                        if (error)
                            return "comparable_screenshot_list." + error;
                    }
                }
                if (message.changed_screenshot_list != null && message.hasOwnProperty("changed_screenshot_list")) {
                    if (!Array.isArray(message.changed_screenshot_list))
                        return "changed_screenshot_list: array expected";
                    for (var i = 0; i < message.changed_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.changed_screenshot_list[i]);
                        if (error)
                            return "changed_screenshot_list." + error;
                    }
                }
                if (message.unchanged_screenshot_list != null && message.hasOwnProperty("unchanged_screenshot_list")) {
                    if (!Array.isArray(message.unchanged_screenshot_list))
                        return "unchanged_screenshot_list: array expected";
                    for (var i = 0; i < message.unchanged_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.unchanged_screenshot_list[i]);
                        if (error)
                            return "unchanged_screenshot_list." + error;
                    }
                }
                if (message.expected_screenshot_browser_map != null && message.hasOwnProperty("expected_screenshot_browser_map")) {
                    if (!$util.isObject(message.expected_screenshot_browser_map))
                        return "expected_screenshot_browser_map: object expected";
                    var key = Object.keys(message.expected_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.expected_screenshot_browser_map[key[i]]);
                        if (error)
                            return "expected_screenshot_browser_map." + error;
                    }
                }
                if (message.actual_screenshot_browser_map != null && message.hasOwnProperty("actual_screenshot_browser_map")) {
                    if (!$util.isObject(message.actual_screenshot_browser_map))
                        return "actual_screenshot_browser_map: object expected";
                    var key = Object.keys(message.actual_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.actual_screenshot_browser_map[key[i]]);
                        if (error)
                            return "actual_screenshot_browser_map." + error;
                    }
                }
                if (message.runnable_screenshot_browser_map != null && message.hasOwnProperty("runnable_screenshot_browser_map")) {
                    if (!$util.isObject(message.runnable_screenshot_browser_map))
                        return "runnable_screenshot_browser_map: object expected";
                    var key = Object.keys(message.runnable_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.runnable_screenshot_browser_map[key[i]]);
                        if (error)
                            return "runnable_screenshot_browser_map." + error;
                    }
                }
                if (message.skipped_screenshot_browser_map != null && message.hasOwnProperty("skipped_screenshot_browser_map")) {
                    if (!$util.isObject(message.skipped_screenshot_browser_map))
                        return "skipped_screenshot_browser_map: object expected";
                    var key = Object.keys(message.skipped_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.skipped_screenshot_browser_map[key[i]]);
                        if (error)
                            return "skipped_screenshot_browser_map." + error;
                    }
                }
                if (message.added_screenshot_browser_map != null && message.hasOwnProperty("added_screenshot_browser_map")) {
                    if (!$util.isObject(message.added_screenshot_browser_map))
                        return "added_screenshot_browser_map: object expected";
                    var key = Object.keys(message.added_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.added_screenshot_browser_map[key[i]]);
                        if (error)
                            return "added_screenshot_browser_map." + error;
                    }
                }
                if (message.removed_screenshot_browser_map != null && message.hasOwnProperty("removed_screenshot_browser_map")) {
                    if (!$util.isObject(message.removed_screenshot_browser_map))
                        return "removed_screenshot_browser_map: object expected";
                    var key = Object.keys(message.removed_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.removed_screenshot_browser_map[key[i]]);
                        if (error)
                            return "removed_screenshot_browser_map." + error;
                    }
                }
                if (message.comparable_screenshot_browser_map != null && message.hasOwnProperty("comparable_screenshot_browser_map")) {
                    if (!$util.isObject(message.comparable_screenshot_browser_map))
                        return "comparable_screenshot_browser_map: object expected";
                    var key = Object.keys(message.comparable_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.comparable_screenshot_browser_map[key[i]]);
                        if (error)
                            return "comparable_screenshot_browser_map." + error;
                    }
                }
                if (message.changed_screenshot_browser_map != null && message.hasOwnProperty("changed_screenshot_browser_map")) {
                    if (!$util.isObject(message.changed_screenshot_browser_map))
                        return "changed_screenshot_browser_map: object expected";
                    var key = Object.keys(message.changed_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.changed_screenshot_browser_map[key[i]]);
                        if (error)
                            return "changed_screenshot_browser_map." + error;
                    }
                }
                if (message.unchanged_screenshot_browser_map != null && message.hasOwnProperty("unchanged_screenshot_browser_map")) {
                    if (!$util.isObject(message.unchanged_screenshot_browser_map))
                        return "unchanged_screenshot_browser_map: object expected";
                    var key = Object.keys(message.unchanged_screenshot_browser_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.unchanged_screenshot_browser_map[key[i]]);
                        if (error)
                            return "unchanged_screenshot_browser_map." + error;
                    }
                }
                if (message.expected_screenshot_page_map != null && message.hasOwnProperty("expected_screenshot_page_map")) {
                    if (!$util.isObject(message.expected_screenshot_page_map))
                        return "expected_screenshot_page_map: object expected";
                    var key = Object.keys(message.expected_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.expected_screenshot_page_map[key[i]]);
                        if (error)
                            return "expected_screenshot_page_map." + error;
                    }
                }
                if (message.actual_screenshot_page_map != null && message.hasOwnProperty("actual_screenshot_page_map")) {
                    if (!$util.isObject(message.actual_screenshot_page_map))
                        return "actual_screenshot_page_map: object expected";
                    var key = Object.keys(message.actual_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.actual_screenshot_page_map[key[i]]);
                        if (error)
                            return "actual_screenshot_page_map." + error;
                    }
                }
                if (message.runnable_screenshot_page_map != null && message.hasOwnProperty("runnable_screenshot_page_map")) {
                    if (!$util.isObject(message.runnable_screenshot_page_map))
                        return "runnable_screenshot_page_map: object expected";
                    var key = Object.keys(message.runnable_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.runnable_screenshot_page_map[key[i]]);
                        if (error)
                            return "runnable_screenshot_page_map." + error;
                    }
                }
                if (message.skipped_screenshot_page_map != null && message.hasOwnProperty("skipped_screenshot_page_map")) {
                    if (!$util.isObject(message.skipped_screenshot_page_map))
                        return "skipped_screenshot_page_map: object expected";
                    var key = Object.keys(message.skipped_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.skipped_screenshot_page_map[key[i]]);
                        if (error)
                            return "skipped_screenshot_page_map." + error;
                    }
                }
                if (message.added_screenshot_page_map != null && message.hasOwnProperty("added_screenshot_page_map")) {
                    if (!$util.isObject(message.added_screenshot_page_map))
                        return "added_screenshot_page_map: object expected";
                    var key = Object.keys(message.added_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.added_screenshot_page_map[key[i]]);
                        if (error)
                            return "added_screenshot_page_map." + error;
                    }
                }
                if (message.removed_screenshot_page_map != null && message.hasOwnProperty("removed_screenshot_page_map")) {
                    if (!$util.isObject(message.removed_screenshot_page_map))
                        return "removed_screenshot_page_map: object expected";
                    var key = Object.keys(message.removed_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.removed_screenshot_page_map[key[i]]);
                        if (error)
                            return "removed_screenshot_page_map." + error;
                    }
                }
                if (message.comparable_screenshot_page_map != null && message.hasOwnProperty("comparable_screenshot_page_map")) {
                    if (!$util.isObject(message.comparable_screenshot_page_map))
                        return "comparable_screenshot_page_map: object expected";
                    var key = Object.keys(message.comparable_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.comparable_screenshot_page_map[key[i]]);
                        if (error)
                            return "comparable_screenshot_page_map." + error;
                    }
                }
                if (message.changed_screenshot_page_map != null && message.hasOwnProperty("changed_screenshot_page_map")) {
                    if (!$util.isObject(message.changed_screenshot_page_map))
                        return "changed_screenshot_page_map: object expected";
                    var key = Object.keys(message.changed_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.changed_screenshot_page_map[key[i]]);
                        if (error)
                            return "changed_screenshot_page_map." + error;
                    }
                }
                if (message.unchanged_screenshot_page_map != null && message.hasOwnProperty("unchanged_screenshot_page_map")) {
                    if (!$util.isObject(message.unchanged_screenshot_page_map))
                        return "unchanged_screenshot_page_map: object expected";
                    var key = Object.keys(message.unchanged_screenshot_page_map);
                    for (var i = 0; i < key.length; ++i) {
                        var error = $root.mdc.proto.ScreenshotList.verify(message.unchanged_screenshot_page_map[key[i]]);
                        if (error)
                            return "unchanged_screenshot_page_map." + error;
                    }
                }
                if (message.runnable_test_page_urls != null && message.hasOwnProperty("runnable_test_page_urls")) {
                    if (!Array.isArray(message.runnable_test_page_urls))
                        return "runnable_test_page_urls: array expected";
                    for (var i = 0; i < message.runnable_test_page_urls.length; ++i)
                        if (!$util.isString(message.runnable_test_page_urls[i]))
                            return "runnable_test_page_urls: string[] expected";
                }
                if (message.skipped_test_page_urls != null && message.hasOwnProperty("skipped_test_page_urls")) {
                    if (!Array.isArray(message.skipped_test_page_urls))
                        return "skipped_test_page_urls: array expected";
                    for (var i = 0; i < message.skipped_test_page_urls.length; ++i)
                        if (!$util.isString(message.skipped_test_page_urls[i]))
                            return "skipped_test_page_urls: string[] expected";
                }
                if (message.runnable_browser_icon_urls != null && message.hasOwnProperty("runnable_browser_icon_urls")) {
                    if (!Array.isArray(message.runnable_browser_icon_urls))
                        return "runnable_browser_icon_urls: array expected";
                    for (var i = 0; i < message.runnable_browser_icon_urls.length; ++i)
                        if (!$util.isString(message.runnable_browser_icon_urls[i]))
                            return "runnable_browser_icon_urls: string[] expected";
                }
                if (message.skipped_browser_icon_urls != null && message.hasOwnProperty("skipped_browser_icon_urls")) {
                    if (!Array.isArray(message.skipped_browser_icon_urls))
                        return "skipped_browser_icon_urls: array expected";
                    for (var i = 0; i < message.skipped_browser_icon_urls.length; ++i)
                        if (!$util.isString(message.skipped_browser_icon_urls[i]))
                            return "skipped_browser_icon_urls: string[] expected";
                }
                if (message.runnable_screenshot_keys != null && message.hasOwnProperty("runnable_screenshot_keys")) {
                    if (!Array.isArray(message.runnable_screenshot_keys))
                        return "runnable_screenshot_keys: array expected";
                    for (var i = 0; i < message.runnable_screenshot_keys.length; ++i)
                        if (!$util.isString(message.runnable_screenshot_keys[i]))
                            return "runnable_screenshot_keys: string[] expected";
                }
                if (message.skipped_screenshot_keys != null && message.hasOwnProperty("skipped_screenshot_keys")) {
                    if (!Array.isArray(message.skipped_screenshot_keys))
                        return "skipped_screenshot_keys: array expected";
                    for (var i = 0; i < message.skipped_screenshot_keys.length; ++i)
                        if (!$util.isString(message.skipped_screenshot_keys[i]))
                            return "skipped_screenshot_keys: string[] expected";
                }
                return null;
            };

            /**
             * Creates a Screenshots message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.Screenshots} Screenshots
             */
            Screenshots.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.Screenshots)
                    return object;
                var message = new $root.mdc.proto.Screenshots();
                if (object.expected_screenshot_list) {
                    if (!Array.isArray(object.expected_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.expected_screenshot_list: array expected");
                    message.expected_screenshot_list = [];
                    for (var i = 0; i < object.expected_screenshot_list.length; ++i) {
                        if (typeof object.expected_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.expected_screenshot_list: object expected");
                        message.expected_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.expected_screenshot_list[i]);
                    }
                }
                if (object.actual_screenshot_list) {
                    if (!Array.isArray(object.actual_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.actual_screenshot_list: array expected");
                    message.actual_screenshot_list = [];
                    for (var i = 0; i < object.actual_screenshot_list.length; ++i) {
                        if (typeof object.actual_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.actual_screenshot_list: object expected");
                        message.actual_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.actual_screenshot_list[i]);
                    }
                }
                if (object.runnable_screenshot_list) {
                    if (!Array.isArray(object.runnable_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_list: array expected");
                    message.runnable_screenshot_list = [];
                    for (var i = 0; i < object.runnable_screenshot_list.length; ++i) {
                        if (typeof object.runnable_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_list: object expected");
                        message.runnable_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.runnable_screenshot_list[i]);
                    }
                }
                if (object.skipped_screenshot_list) {
                    if (!Array.isArray(object.skipped_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_list: array expected");
                    message.skipped_screenshot_list = [];
                    for (var i = 0; i < object.skipped_screenshot_list.length; ++i) {
                        if (typeof object.skipped_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_list: object expected");
                        message.skipped_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.skipped_screenshot_list[i]);
                    }
                }
                if (object.added_screenshot_list) {
                    if (!Array.isArray(object.added_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.added_screenshot_list: array expected");
                    message.added_screenshot_list = [];
                    for (var i = 0; i < object.added_screenshot_list.length; ++i) {
                        if (typeof object.added_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.added_screenshot_list: object expected");
                        message.added_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.added_screenshot_list[i]);
                    }
                }
                if (object.removed_screenshot_list) {
                    if (!Array.isArray(object.removed_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.removed_screenshot_list: array expected");
                    message.removed_screenshot_list = [];
                    for (var i = 0; i < object.removed_screenshot_list.length; ++i) {
                        if (typeof object.removed_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.removed_screenshot_list: object expected");
                        message.removed_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.removed_screenshot_list[i]);
                    }
                }
                if (object.comparable_screenshot_list) {
                    if (!Array.isArray(object.comparable_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.comparable_screenshot_list: array expected");
                    message.comparable_screenshot_list = [];
                    for (var i = 0; i < object.comparable_screenshot_list.length; ++i) {
                        if (typeof object.comparable_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.comparable_screenshot_list: object expected");
                        message.comparable_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.comparable_screenshot_list[i]);
                    }
                }
                if (object.changed_screenshot_list) {
                    if (!Array.isArray(object.changed_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.changed_screenshot_list: array expected");
                    message.changed_screenshot_list = [];
                    for (var i = 0; i < object.changed_screenshot_list.length; ++i) {
                        if (typeof object.changed_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.changed_screenshot_list: object expected");
                        message.changed_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.changed_screenshot_list[i]);
                    }
                }
                if (object.unchanged_screenshot_list) {
                    if (!Array.isArray(object.unchanged_screenshot_list))
                        throw TypeError(".mdc.proto.Screenshots.unchanged_screenshot_list: array expected");
                    message.unchanged_screenshot_list = [];
                    for (var i = 0; i < object.unchanged_screenshot_list.length; ++i) {
                        if (typeof object.unchanged_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.unchanged_screenshot_list: object expected");
                        message.unchanged_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.unchanged_screenshot_list[i]);
                    }
                }
                if (object.expected_screenshot_browser_map) {
                    if (typeof object.expected_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.expected_screenshot_browser_map: object expected");
                    message.expected_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.expected_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.expected_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.expected_screenshot_browser_map: object expected");
                        message.expected_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.expected_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.actual_screenshot_browser_map) {
                    if (typeof object.actual_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.actual_screenshot_browser_map: object expected");
                    message.actual_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.actual_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.actual_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.actual_screenshot_browser_map: object expected");
                        message.actual_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.actual_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.runnable_screenshot_browser_map) {
                    if (typeof object.runnable_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_browser_map: object expected");
                    message.runnable_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.runnable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.runnable_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_browser_map: object expected");
                        message.runnable_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.runnable_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.skipped_screenshot_browser_map) {
                    if (typeof object.skipped_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_browser_map: object expected");
                    message.skipped_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.skipped_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.skipped_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_browser_map: object expected");
                        message.skipped_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.skipped_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.added_screenshot_browser_map) {
                    if (typeof object.added_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.added_screenshot_browser_map: object expected");
                    message.added_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.added_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.added_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.added_screenshot_browser_map: object expected");
                        message.added_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.added_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.removed_screenshot_browser_map) {
                    if (typeof object.removed_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.removed_screenshot_browser_map: object expected");
                    message.removed_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.removed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.removed_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.removed_screenshot_browser_map: object expected");
                        message.removed_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.removed_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.comparable_screenshot_browser_map) {
                    if (typeof object.comparable_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.comparable_screenshot_browser_map: object expected");
                    message.comparable_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.comparable_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.comparable_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.comparable_screenshot_browser_map: object expected");
                        message.comparable_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.comparable_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.changed_screenshot_browser_map) {
                    if (typeof object.changed_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.changed_screenshot_browser_map: object expected");
                    message.changed_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.changed_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.changed_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.changed_screenshot_browser_map: object expected");
                        message.changed_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.changed_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.unchanged_screenshot_browser_map) {
                    if (typeof object.unchanged_screenshot_browser_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.unchanged_screenshot_browser_map: object expected");
                    message.unchanged_screenshot_browser_map = {};
                    for (var keys = Object.keys(object.unchanged_screenshot_browser_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.unchanged_screenshot_browser_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.unchanged_screenshot_browser_map: object expected");
                        message.unchanged_screenshot_browser_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.unchanged_screenshot_browser_map[keys[i]]);
                    }
                }
                if (object.expected_screenshot_page_map) {
                    if (typeof object.expected_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.expected_screenshot_page_map: object expected");
                    message.expected_screenshot_page_map = {};
                    for (var keys = Object.keys(object.expected_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.expected_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.expected_screenshot_page_map: object expected");
                        message.expected_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.expected_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.actual_screenshot_page_map) {
                    if (typeof object.actual_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.actual_screenshot_page_map: object expected");
                    message.actual_screenshot_page_map = {};
                    for (var keys = Object.keys(object.actual_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.actual_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.actual_screenshot_page_map: object expected");
                        message.actual_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.actual_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.runnable_screenshot_page_map) {
                    if (typeof object.runnable_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_page_map: object expected");
                    message.runnable_screenshot_page_map = {};
                    for (var keys = Object.keys(object.runnable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.runnable_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_page_map: object expected");
                        message.runnable_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.runnable_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.skipped_screenshot_page_map) {
                    if (typeof object.skipped_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_page_map: object expected");
                    message.skipped_screenshot_page_map = {};
                    for (var keys = Object.keys(object.skipped_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.skipped_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_page_map: object expected");
                        message.skipped_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.skipped_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.added_screenshot_page_map) {
                    if (typeof object.added_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.added_screenshot_page_map: object expected");
                    message.added_screenshot_page_map = {};
                    for (var keys = Object.keys(object.added_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.added_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.added_screenshot_page_map: object expected");
                        message.added_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.added_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.removed_screenshot_page_map) {
                    if (typeof object.removed_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.removed_screenshot_page_map: object expected");
                    message.removed_screenshot_page_map = {};
                    for (var keys = Object.keys(object.removed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.removed_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.removed_screenshot_page_map: object expected");
                        message.removed_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.removed_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.comparable_screenshot_page_map) {
                    if (typeof object.comparable_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.comparable_screenshot_page_map: object expected");
                    message.comparable_screenshot_page_map = {};
                    for (var keys = Object.keys(object.comparable_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.comparable_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.comparable_screenshot_page_map: object expected");
                        message.comparable_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.comparable_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.changed_screenshot_page_map) {
                    if (typeof object.changed_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.changed_screenshot_page_map: object expected");
                    message.changed_screenshot_page_map = {};
                    for (var keys = Object.keys(object.changed_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.changed_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.changed_screenshot_page_map: object expected");
                        message.changed_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.changed_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.unchanged_screenshot_page_map) {
                    if (typeof object.unchanged_screenshot_page_map !== "object")
                        throw TypeError(".mdc.proto.Screenshots.unchanged_screenshot_page_map: object expected");
                    message.unchanged_screenshot_page_map = {};
                    for (var keys = Object.keys(object.unchanged_screenshot_page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.unchanged_screenshot_page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.Screenshots.unchanged_screenshot_page_map: object expected");
                        message.unchanged_screenshot_page_map[keys[i]] = $root.mdc.proto.ScreenshotList.fromObject(object.unchanged_screenshot_page_map[keys[i]]);
                    }
                }
                if (object.runnable_test_page_urls) {
                    if (!Array.isArray(object.runnable_test_page_urls))
                        throw TypeError(".mdc.proto.Screenshots.runnable_test_page_urls: array expected");
                    message.runnable_test_page_urls = [];
                    for (var i = 0; i < object.runnable_test_page_urls.length; ++i)
                        message.runnable_test_page_urls[i] = String(object.runnable_test_page_urls[i]);
                }
                if (object.skipped_test_page_urls) {
                    if (!Array.isArray(object.skipped_test_page_urls))
                        throw TypeError(".mdc.proto.Screenshots.skipped_test_page_urls: array expected");
                    message.skipped_test_page_urls = [];
                    for (var i = 0; i < object.skipped_test_page_urls.length; ++i)
                        message.skipped_test_page_urls[i] = String(object.skipped_test_page_urls[i]);
                }
                if (object.runnable_browser_icon_urls) {
                    if (!Array.isArray(object.runnable_browser_icon_urls))
                        throw TypeError(".mdc.proto.Screenshots.runnable_browser_icon_urls: array expected");
                    message.runnable_browser_icon_urls = [];
                    for (var i = 0; i < object.runnable_browser_icon_urls.length; ++i)
                        message.runnable_browser_icon_urls[i] = String(object.runnable_browser_icon_urls[i]);
                }
                if (object.skipped_browser_icon_urls) {
                    if (!Array.isArray(object.skipped_browser_icon_urls))
                        throw TypeError(".mdc.proto.Screenshots.skipped_browser_icon_urls: array expected");
                    message.skipped_browser_icon_urls = [];
                    for (var i = 0; i < object.skipped_browser_icon_urls.length; ++i)
                        message.skipped_browser_icon_urls[i] = String(object.skipped_browser_icon_urls[i]);
                }
                if (object.runnable_screenshot_keys) {
                    if (!Array.isArray(object.runnable_screenshot_keys))
                        throw TypeError(".mdc.proto.Screenshots.runnable_screenshot_keys: array expected");
                    message.runnable_screenshot_keys = [];
                    for (var i = 0; i < object.runnable_screenshot_keys.length; ++i)
                        message.runnable_screenshot_keys[i] = String(object.runnable_screenshot_keys[i]);
                }
                if (object.skipped_screenshot_keys) {
                    if (!Array.isArray(object.skipped_screenshot_keys))
                        throw TypeError(".mdc.proto.Screenshots.skipped_screenshot_keys: array expected");
                    message.skipped_screenshot_keys = [];
                    for (var i = 0; i < object.skipped_screenshot_keys.length; ++i)
                        message.skipped_screenshot_keys[i] = String(object.skipped_screenshot_keys[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a Screenshots message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.Screenshots
             * @static
             * @param {mdc.proto.Screenshots} message Screenshots
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
                    object.runnable_test_page_urls = [];
                    object.skipped_test_page_urls = [];
                    object.runnable_browser_icon_urls = [];
                    object.skipped_browser_icon_urls = [];
                    object.runnable_screenshot_keys = [];
                    object.skipped_screenshot_keys = [];
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
                        object.expected_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.expected_screenshot_list[j], options);
                }
                if (message.actual_screenshot_list && message.actual_screenshot_list.length) {
                    object.actual_screenshot_list = [];
                    for (var j = 0; j < message.actual_screenshot_list.length; ++j)
                        object.actual_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.actual_screenshot_list[j], options);
                }
                if (message.runnable_screenshot_list && message.runnable_screenshot_list.length) {
                    object.runnable_screenshot_list = [];
                    for (var j = 0; j < message.runnable_screenshot_list.length; ++j)
                        object.runnable_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.runnable_screenshot_list[j], options);
                }
                if (message.skipped_screenshot_list && message.skipped_screenshot_list.length) {
                    object.skipped_screenshot_list = [];
                    for (var j = 0; j < message.skipped_screenshot_list.length; ++j)
                        object.skipped_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.skipped_screenshot_list[j], options);
                }
                if (message.added_screenshot_list && message.added_screenshot_list.length) {
                    object.added_screenshot_list = [];
                    for (var j = 0; j < message.added_screenshot_list.length; ++j)
                        object.added_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.added_screenshot_list[j], options);
                }
                if (message.removed_screenshot_list && message.removed_screenshot_list.length) {
                    object.removed_screenshot_list = [];
                    for (var j = 0; j < message.removed_screenshot_list.length; ++j)
                        object.removed_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.removed_screenshot_list[j], options);
                }
                if (message.comparable_screenshot_list && message.comparable_screenshot_list.length) {
                    object.comparable_screenshot_list = [];
                    for (var j = 0; j < message.comparable_screenshot_list.length; ++j)
                        object.comparable_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.comparable_screenshot_list[j], options);
                }
                if (message.changed_screenshot_list && message.changed_screenshot_list.length) {
                    object.changed_screenshot_list = [];
                    for (var j = 0; j < message.changed_screenshot_list.length; ++j)
                        object.changed_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.changed_screenshot_list[j], options);
                }
                if (message.unchanged_screenshot_list && message.unchanged_screenshot_list.length) {
                    object.unchanged_screenshot_list = [];
                    for (var j = 0; j < message.unchanged_screenshot_list.length; ++j)
                        object.unchanged_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.unchanged_screenshot_list[j], options);
                }
                var keys2;
                if (message.expected_screenshot_browser_map && (keys2 = Object.keys(message.expected_screenshot_browser_map)).length) {
                    object.expected_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.expected_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.expected_screenshot_browser_map[keys2[j]], options);
                }
                if (message.actual_screenshot_browser_map && (keys2 = Object.keys(message.actual_screenshot_browser_map)).length) {
                    object.actual_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.actual_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.actual_screenshot_browser_map[keys2[j]], options);
                }
                if (message.runnable_screenshot_browser_map && (keys2 = Object.keys(message.runnable_screenshot_browser_map)).length) {
                    object.runnable_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.runnable_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.runnable_screenshot_browser_map[keys2[j]], options);
                }
                if (message.skipped_screenshot_browser_map && (keys2 = Object.keys(message.skipped_screenshot_browser_map)).length) {
                    object.skipped_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.skipped_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.skipped_screenshot_browser_map[keys2[j]], options);
                }
                if (message.added_screenshot_browser_map && (keys2 = Object.keys(message.added_screenshot_browser_map)).length) {
                    object.added_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.added_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.added_screenshot_browser_map[keys2[j]], options);
                }
                if (message.removed_screenshot_browser_map && (keys2 = Object.keys(message.removed_screenshot_browser_map)).length) {
                    object.removed_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.removed_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.removed_screenshot_browser_map[keys2[j]], options);
                }
                if (message.comparable_screenshot_browser_map && (keys2 = Object.keys(message.comparable_screenshot_browser_map)).length) {
                    object.comparable_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.comparable_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.comparable_screenshot_browser_map[keys2[j]], options);
                }
                if (message.changed_screenshot_browser_map && (keys2 = Object.keys(message.changed_screenshot_browser_map)).length) {
                    object.changed_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.changed_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.changed_screenshot_browser_map[keys2[j]], options);
                }
                if (message.unchanged_screenshot_browser_map && (keys2 = Object.keys(message.unchanged_screenshot_browser_map)).length) {
                    object.unchanged_screenshot_browser_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.unchanged_screenshot_browser_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.unchanged_screenshot_browser_map[keys2[j]], options);
                }
                if (message.expected_screenshot_page_map && (keys2 = Object.keys(message.expected_screenshot_page_map)).length) {
                    object.expected_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.expected_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.expected_screenshot_page_map[keys2[j]], options);
                }
                if (message.actual_screenshot_page_map && (keys2 = Object.keys(message.actual_screenshot_page_map)).length) {
                    object.actual_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.actual_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.actual_screenshot_page_map[keys2[j]], options);
                }
                if (message.runnable_screenshot_page_map && (keys2 = Object.keys(message.runnable_screenshot_page_map)).length) {
                    object.runnable_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.runnable_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.runnable_screenshot_page_map[keys2[j]], options);
                }
                if (message.skipped_screenshot_page_map && (keys2 = Object.keys(message.skipped_screenshot_page_map)).length) {
                    object.skipped_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.skipped_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.skipped_screenshot_page_map[keys2[j]], options);
                }
                if (message.added_screenshot_page_map && (keys2 = Object.keys(message.added_screenshot_page_map)).length) {
                    object.added_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.added_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.added_screenshot_page_map[keys2[j]], options);
                }
                if (message.removed_screenshot_page_map && (keys2 = Object.keys(message.removed_screenshot_page_map)).length) {
                    object.removed_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.removed_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.removed_screenshot_page_map[keys2[j]], options);
                }
                if (message.comparable_screenshot_page_map && (keys2 = Object.keys(message.comparable_screenshot_page_map)).length) {
                    object.comparable_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.comparable_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.comparable_screenshot_page_map[keys2[j]], options);
                }
                if (message.changed_screenshot_page_map && (keys2 = Object.keys(message.changed_screenshot_page_map)).length) {
                    object.changed_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.changed_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.changed_screenshot_page_map[keys2[j]], options);
                }
                if (message.unchanged_screenshot_page_map && (keys2 = Object.keys(message.unchanged_screenshot_page_map)).length) {
                    object.unchanged_screenshot_page_map = {};
                    for (var j = 0; j < keys2.length; ++j)
                        object.unchanged_screenshot_page_map[keys2[j]] = $root.mdc.proto.ScreenshotList.toObject(message.unchanged_screenshot_page_map[keys2[j]], options);
                }
                if (message.runnable_test_page_urls && message.runnable_test_page_urls.length) {
                    object.runnable_test_page_urls = [];
                    for (var j = 0; j < message.runnable_test_page_urls.length; ++j)
                        object.runnable_test_page_urls[j] = message.runnable_test_page_urls[j];
                }
                if (message.skipped_test_page_urls && message.skipped_test_page_urls.length) {
                    object.skipped_test_page_urls = [];
                    for (var j = 0; j < message.skipped_test_page_urls.length; ++j)
                        object.skipped_test_page_urls[j] = message.skipped_test_page_urls[j];
                }
                if (message.runnable_browser_icon_urls && message.runnable_browser_icon_urls.length) {
                    object.runnable_browser_icon_urls = [];
                    for (var j = 0; j < message.runnable_browser_icon_urls.length; ++j)
                        object.runnable_browser_icon_urls[j] = message.runnable_browser_icon_urls[j];
                }
                if (message.skipped_browser_icon_urls && message.skipped_browser_icon_urls.length) {
                    object.skipped_browser_icon_urls = [];
                    for (var j = 0; j < message.skipped_browser_icon_urls.length; ++j)
                        object.skipped_browser_icon_urls[j] = message.skipped_browser_icon_urls[j];
                }
                if (message.runnable_screenshot_keys && message.runnable_screenshot_keys.length) {
                    object.runnable_screenshot_keys = [];
                    for (var j = 0; j < message.runnable_screenshot_keys.length; ++j)
                        object.runnable_screenshot_keys[j] = message.runnable_screenshot_keys[j];
                }
                if (message.skipped_screenshot_keys && message.skipped_screenshot_keys.length) {
                    object.skipped_screenshot_keys = [];
                    for (var j = 0; j < message.skipped_screenshot_keys.length; ++j)
                        object.skipped_screenshot_keys[j] = message.skipped_screenshot_keys[j];
                }
                return object;
            };

            /**
             * Converts this Screenshots to JSON.
             * @function toJSON
             * @memberof mdc.proto.Screenshots
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Screenshots.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Screenshots;
        })();

        proto.ScreenshotList = (function() {

            /**
             * Properties of a ScreenshotList.
             * @memberof mdc.proto
             * @interface IScreenshotList
             * @property {Array.<mdc.proto.IScreenshot>|null} [screenshots] ScreenshotList screenshots
             */

            /**
             * Constructs a new ScreenshotList.
             * @memberof mdc.proto
             * @classdesc Represents a ScreenshotList.
             * @implements IScreenshotList
             * @constructor
             * @param {mdc.proto.IScreenshotList=} [properties] Properties to set
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
             * @member {Array.<mdc.proto.IScreenshot>} screenshots
             * @memberof mdc.proto.ScreenshotList
             * @instance
             */
            ScreenshotList.prototype.screenshots = $util.emptyArray;

            /**
             * Creates a new ScreenshotList instance using the specified properties.
             * @function create
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {mdc.proto.IScreenshotList=} [properties] Properties to set
             * @returns {mdc.proto.ScreenshotList} ScreenshotList instance
             */
            ScreenshotList.create = function create(properties) {
                return new ScreenshotList(properties);
            };

            /**
             * Encodes the specified ScreenshotList message. Does not implicitly {@link mdc.proto.ScreenshotList.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {mdc.proto.IScreenshotList} message ScreenshotList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ScreenshotList.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.screenshots != null && message.screenshots.length)
                    for (var i = 0; i < message.screenshots.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.screenshots[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ScreenshotList message, length delimited. Does not implicitly {@link mdc.proto.ScreenshotList.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {mdc.proto.IScreenshotList} message ScreenshotList message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ScreenshotList.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ScreenshotList message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.ScreenshotList} ScreenshotList
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ScreenshotList.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.ScreenshotList();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.screenshots && message.screenshots.length))
                            message.screenshots = [];
                        message.screenshots.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
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
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.ScreenshotList} ScreenshotList
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
             * @memberof mdc.proto.ScreenshotList
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
                        var error = $root.mdc.proto.Screenshot.verify(message.screenshots[i]);
                        if (error)
                            return "screenshots." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a ScreenshotList message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.ScreenshotList} ScreenshotList
             */
            ScreenshotList.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.ScreenshotList)
                    return object;
                var message = new $root.mdc.proto.ScreenshotList();
                if (object.screenshots) {
                    if (!Array.isArray(object.screenshots))
                        throw TypeError(".mdc.proto.ScreenshotList.screenshots: array expected");
                    message.screenshots = [];
                    for (var i = 0; i < object.screenshots.length; ++i) {
                        if (typeof object.screenshots[i] !== "object")
                            throw TypeError(".mdc.proto.ScreenshotList.screenshots: object expected");
                        message.screenshots[i] = $root.mdc.proto.Screenshot.fromObject(object.screenshots[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a ScreenshotList message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.ScreenshotList
             * @static
             * @param {mdc.proto.ScreenshotList} message ScreenshotList
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
                        object.screenshots[j] = $root.mdc.proto.Screenshot.toObject(message.screenshots[j], options);
                }
                return object;
            };

            /**
             * Converts this ScreenshotList to JSON.
             * @function toJSON
             * @memberof mdc.proto.ScreenshotList
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ScreenshotList.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ScreenshotList;
        })();

        proto.Screenshot = (function() {

            /**
             * Properties of a Screenshot.
             * @memberof mdc.proto
             * @interface IScreenshot
             * @property {boolean|null} [is_runnable] Screenshot is_runnable
             * @property {mdc.proto.Screenshot.InclusionType|null} [inclusion_type] Screenshot inclusion_type
             * @property {mdc.proto.Screenshot.CaptureState|null} [capture_state] Screenshot capture_state
             * @property {mdc.proto.IUserAgent|null} [user_agent] Screenshot user_agent
             * @property {string|null} [html_file_path] Screenshot html_file_path
             * @property {mdc.proto.ITestFile|null} [expected_html_file] Screenshot expected_html_file
             * @property {mdc.proto.ITestFile|null} [actual_html_file] Screenshot actual_html_file
             * @property {mdc.proto.ITestFile|null} [expected_image_file] Screenshot expected_image_file
             * @property {mdc.proto.ITestFile|null} [actual_image_file] Screenshot actual_image_file
             * @property {mdc.proto.ITestFile|null} [diff_image_file] Screenshot diff_image_file
             * @property {mdc.proto.IDiffImageResult|null} [diff_image_result] Screenshot diff_image_result
             * @property {number|null} [retry_count] Screenshot retry_count
             * @property {number|null} [max_retries] Screenshot max_retries
             */

            /**
             * Constructs a new Screenshot.
             * @memberof mdc.proto
             * @classdesc Represents a Screenshot.
             * @implements IScreenshot
             * @constructor
             * @param {mdc.proto.IScreenshot=} [properties] Properties to set
             */
            function Screenshot(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Screenshot is_runnable.
             * @member {boolean} is_runnable
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.is_runnable = false;

            /**
             * Screenshot inclusion_type.
             * @member {mdc.proto.Screenshot.InclusionType} inclusion_type
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.inclusion_type = 0;

            /**
             * Screenshot capture_state.
             * @member {mdc.proto.Screenshot.CaptureState} capture_state
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.capture_state = 0;

            /**
             * Screenshot user_agent.
             * @member {mdc.proto.IUserAgent|null|undefined} user_agent
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.user_agent = null;

            /**
             * Screenshot html_file_path.
             * @member {string} html_file_path
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.html_file_path = "";

            /**
             * Screenshot expected_html_file.
             * @member {mdc.proto.ITestFile|null|undefined} expected_html_file
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.expected_html_file = null;

            /**
             * Screenshot actual_html_file.
             * @member {mdc.proto.ITestFile|null|undefined} actual_html_file
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.actual_html_file = null;

            /**
             * Screenshot expected_image_file.
             * @member {mdc.proto.ITestFile|null|undefined} expected_image_file
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.expected_image_file = null;

            /**
             * Screenshot actual_image_file.
             * @member {mdc.proto.ITestFile|null|undefined} actual_image_file
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.actual_image_file = null;

            /**
             * Screenshot diff_image_file.
             * @member {mdc.proto.ITestFile|null|undefined} diff_image_file
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.diff_image_file = null;

            /**
             * Screenshot diff_image_result.
             * @member {mdc.proto.IDiffImageResult|null|undefined} diff_image_result
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.diff_image_result = null;

            /**
             * Screenshot retry_count.
             * @member {number} retry_count
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.retry_count = 0;

            /**
             * Screenshot max_retries.
             * @member {number} max_retries
             * @memberof mdc.proto.Screenshot
             * @instance
             */
            Screenshot.prototype.max_retries = 0;

            /**
             * Creates a new Screenshot instance using the specified properties.
             * @function create
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {mdc.proto.IScreenshot=} [properties] Properties to set
             * @returns {mdc.proto.Screenshot} Screenshot instance
             */
            Screenshot.create = function create(properties) {
                return new Screenshot(properties);
            };

            /**
             * Encodes the specified Screenshot message. Does not implicitly {@link mdc.proto.Screenshot.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {mdc.proto.IScreenshot} message Screenshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Screenshot.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.is_runnable);
                if (message.inclusion_type != null && message.hasOwnProperty("inclusion_type"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.inclusion_type);
                if (message.capture_state != null && message.hasOwnProperty("capture_state"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.capture_state);
                if (message.user_agent != null && message.hasOwnProperty("user_agent"))
                    $root.mdc.proto.UserAgent.encode(message.user_agent, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.html_file_path);
                if (message.expected_html_file != null && message.hasOwnProperty("expected_html_file"))
                    $root.mdc.proto.TestFile.encode(message.expected_html_file, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.actual_html_file != null && message.hasOwnProperty("actual_html_file"))
                    $root.mdc.proto.TestFile.encode(message.actual_html_file, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                if (message.expected_image_file != null && message.hasOwnProperty("expected_image_file"))
                    $root.mdc.proto.TestFile.encode(message.expected_image_file, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
                if (message.actual_image_file != null && message.hasOwnProperty("actual_image_file"))
                    $root.mdc.proto.TestFile.encode(message.actual_image_file, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file"))
                    $root.mdc.proto.TestFile.encode(message.diff_image_file, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                if (message.diff_image_result != null && message.hasOwnProperty("diff_image_result"))
                    $root.mdc.proto.DiffImageResult.encode(message.diff_image_result, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                if (message.retry_count != null && message.hasOwnProperty("retry_count"))
                    writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.retry_count);
                if (message.max_retries != null && message.hasOwnProperty("max_retries"))
                    writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.max_retries);
                return writer;
            };

            /**
             * Encodes the specified Screenshot message, length delimited. Does not implicitly {@link mdc.proto.Screenshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {mdc.proto.IScreenshot} message Screenshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Screenshot.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Screenshot message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.Screenshot} Screenshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Screenshot.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.Screenshot();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.is_runnable = reader.bool();
                        break;
                    case 2:
                        message.inclusion_type = reader.int32();
                        break;
                    case 3:
                        message.capture_state = reader.int32();
                        break;
                    case 4:
                        message.user_agent = $root.mdc.proto.UserAgent.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.html_file_path = reader.string();
                        break;
                    case 6:
                        message.expected_html_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.actual_html_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 8:
                        message.expected_image_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 9:
                        message.actual_image_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 10:
                        message.diff_image_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 11:
                        message.diff_image_result = $root.mdc.proto.DiffImageResult.decode(reader, reader.uint32());
                        break;
                    case 12:
                        message.retry_count = reader.uint32();
                        break;
                    case 13:
                        message.max_retries = reader.uint32();
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
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.Screenshot} Screenshot
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
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Screenshot.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                    if (typeof message.is_runnable !== "boolean")
                        return "is_runnable: boolean expected";
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
                if (message.capture_state != null && message.hasOwnProperty("capture_state"))
                    switch (message.capture_state) {
                    default:
                        return "capture_state: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.user_agent != null && message.hasOwnProperty("user_agent")) {
                    var error = $root.mdc.proto.UserAgent.verify(message.user_agent);
                    if (error)
                        return "user_agent." + error;
                }
                if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                    if (!$util.isString(message.html_file_path))
                        return "html_file_path: string expected";
                if (message.expected_html_file != null && message.hasOwnProperty("expected_html_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.expected_html_file);
                    if (error)
                        return "expected_html_file." + error;
                }
                if (message.actual_html_file != null && message.hasOwnProperty("actual_html_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.actual_html_file);
                    if (error)
                        return "actual_html_file." + error;
                }
                if (message.expected_image_file != null && message.hasOwnProperty("expected_image_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.expected_image_file);
                    if (error)
                        return "expected_image_file." + error;
                }
                if (message.actual_image_file != null && message.hasOwnProperty("actual_image_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.actual_image_file);
                    if (error)
                        return "actual_image_file." + error;
                }
                if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.diff_image_file);
                    if (error)
                        return "diff_image_file." + error;
                }
                if (message.diff_image_result != null && message.hasOwnProperty("diff_image_result")) {
                    var error = $root.mdc.proto.DiffImageResult.verify(message.diff_image_result);
                    if (error)
                        return "diff_image_result." + error;
                }
                if (message.retry_count != null && message.hasOwnProperty("retry_count"))
                    if (!$util.isInteger(message.retry_count))
                        return "retry_count: integer expected";
                if (message.max_retries != null && message.hasOwnProperty("max_retries"))
                    if (!$util.isInteger(message.max_retries))
                        return "max_retries: integer expected";
                return null;
            };

            /**
             * Creates a Screenshot message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.Screenshot} Screenshot
             */
            Screenshot.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.Screenshot)
                    return object;
                var message = new $root.mdc.proto.Screenshot();
                if (object.is_runnable != null)
                    message.is_runnable = Boolean(object.is_runnable);
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
                case "DIFFED":
                case 4:
                    message.capture_state = 4;
                    break;
                }
                if (object.user_agent != null) {
                    if (typeof object.user_agent !== "object")
                        throw TypeError(".mdc.proto.Screenshot.user_agent: object expected");
                    message.user_agent = $root.mdc.proto.UserAgent.fromObject(object.user_agent);
                }
                if (object.html_file_path != null)
                    message.html_file_path = String(object.html_file_path);
                if (object.expected_html_file != null) {
                    if (typeof object.expected_html_file !== "object")
                        throw TypeError(".mdc.proto.Screenshot.expected_html_file: object expected");
                    message.expected_html_file = $root.mdc.proto.TestFile.fromObject(object.expected_html_file);
                }
                if (object.actual_html_file != null) {
                    if (typeof object.actual_html_file !== "object")
                        throw TypeError(".mdc.proto.Screenshot.actual_html_file: object expected");
                    message.actual_html_file = $root.mdc.proto.TestFile.fromObject(object.actual_html_file);
                }
                if (object.expected_image_file != null) {
                    if (typeof object.expected_image_file !== "object")
                        throw TypeError(".mdc.proto.Screenshot.expected_image_file: object expected");
                    message.expected_image_file = $root.mdc.proto.TestFile.fromObject(object.expected_image_file);
                }
                if (object.actual_image_file != null) {
                    if (typeof object.actual_image_file !== "object")
                        throw TypeError(".mdc.proto.Screenshot.actual_image_file: object expected");
                    message.actual_image_file = $root.mdc.proto.TestFile.fromObject(object.actual_image_file);
                }
                if (object.diff_image_file != null) {
                    if (typeof object.diff_image_file !== "object")
                        throw TypeError(".mdc.proto.Screenshot.diff_image_file: object expected");
                    message.diff_image_file = $root.mdc.proto.TestFile.fromObject(object.diff_image_file);
                }
                if (object.diff_image_result != null) {
                    if (typeof object.diff_image_result !== "object")
                        throw TypeError(".mdc.proto.Screenshot.diff_image_result: object expected");
                    message.diff_image_result = $root.mdc.proto.DiffImageResult.fromObject(object.diff_image_result);
                }
                if (object.retry_count != null)
                    message.retry_count = object.retry_count >>> 0;
                if (object.max_retries != null)
                    message.max_retries = object.max_retries >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a Screenshot message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.Screenshot
             * @static
             * @param {mdc.proto.Screenshot} message Screenshot
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Screenshot.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.is_runnable = false;
                    object.inclusion_type = options.enums === String ? "UNKNOWN" : 0;
                    object.capture_state = options.enums === String ? "UNKNOWN" : 0;
                    object.user_agent = null;
                    object.html_file_path = "";
                    object.expected_html_file = null;
                    object.actual_html_file = null;
                    object.expected_image_file = null;
                    object.actual_image_file = null;
                    object.diff_image_file = null;
                    object.diff_image_result = null;
                    object.retry_count = 0;
                    object.max_retries = 0;
                }
                if (message.is_runnable != null && message.hasOwnProperty("is_runnable"))
                    object.is_runnable = message.is_runnable;
                if (message.inclusion_type != null && message.hasOwnProperty("inclusion_type"))
                    object.inclusion_type = options.enums === String ? $root.mdc.proto.Screenshot.InclusionType[message.inclusion_type] : message.inclusion_type;
                if (message.capture_state != null && message.hasOwnProperty("capture_state"))
                    object.capture_state = options.enums === String ? $root.mdc.proto.Screenshot.CaptureState[message.capture_state] : message.capture_state;
                if (message.user_agent != null && message.hasOwnProperty("user_agent"))
                    object.user_agent = $root.mdc.proto.UserAgent.toObject(message.user_agent, options);
                if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                    object.html_file_path = message.html_file_path;
                if (message.expected_html_file != null && message.hasOwnProperty("expected_html_file"))
                    object.expected_html_file = $root.mdc.proto.TestFile.toObject(message.expected_html_file, options);
                if (message.actual_html_file != null && message.hasOwnProperty("actual_html_file"))
                    object.actual_html_file = $root.mdc.proto.TestFile.toObject(message.actual_html_file, options);
                if (message.expected_image_file != null && message.hasOwnProperty("expected_image_file"))
                    object.expected_image_file = $root.mdc.proto.TestFile.toObject(message.expected_image_file, options);
                if (message.actual_image_file != null && message.hasOwnProperty("actual_image_file"))
                    object.actual_image_file = $root.mdc.proto.TestFile.toObject(message.actual_image_file, options);
                if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file"))
                    object.diff_image_file = $root.mdc.proto.TestFile.toObject(message.diff_image_file, options);
                if (message.diff_image_result != null && message.hasOwnProperty("diff_image_result"))
                    object.diff_image_result = $root.mdc.proto.DiffImageResult.toObject(message.diff_image_result, options);
                if (message.retry_count != null && message.hasOwnProperty("retry_count"))
                    object.retry_count = message.retry_count;
                if (message.max_retries != null && message.hasOwnProperty("max_retries"))
                    object.max_retries = message.max_retries;
                return object;
            };

            /**
             * Converts this Screenshot to JSON.
             * @function toJSON
             * @memberof mdc.proto.Screenshot
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Screenshot.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * InclusionType enum.
             * @name mdc.proto.Screenshot.InclusionType
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
             * @name mdc.proto.Screenshot.CaptureState
             * @enum {string}
             * @property {number} UNKNOWN=0 UNKNOWN value
             * @property {number} QUEUED=1 QUEUED value
             * @property {number} SKIPPED=2 SKIPPED value
             * @property {number} RUNNING=3 RUNNING value
             * @property {number} DIFFED=4 DIFFED value
             */
            Screenshot.CaptureState = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "UNKNOWN"] = 0;
                values[valuesById[1] = "QUEUED"] = 1;
                values[valuesById[2] = "SKIPPED"] = 2;
                values[valuesById[3] = "RUNNING"] = 3;
                values[valuesById[4] = "DIFFED"] = 4;
                return values;
            })();

            return Screenshot;
        })();

        proto.Dimensions = (function() {

            /**
             * Properties of a Dimensions.
             * @memberof mdc.proto
             * @interface IDimensions
             * @property {number|Long|null} [width] Dimensions width
             * @property {number|Long|null} [height] Dimensions height
             */

            /**
             * Constructs a new Dimensions.
             * @memberof mdc.proto
             * @classdesc Represents a Dimensions.
             * @implements IDimensions
             * @constructor
             * @param {mdc.proto.IDimensions=} [properties] Properties to set
             */
            function Dimensions(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Dimensions width.
             * @member {number|Long} width
             * @memberof mdc.proto.Dimensions
             * @instance
             */
            Dimensions.prototype.width = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Dimensions height.
             * @member {number|Long} height
             * @memberof mdc.proto.Dimensions
             * @instance
             */
            Dimensions.prototype.height = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Dimensions instance using the specified properties.
             * @function create
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {mdc.proto.IDimensions=} [properties] Properties to set
             * @returns {mdc.proto.Dimensions} Dimensions instance
             */
            Dimensions.create = function create(properties) {
                return new Dimensions(properties);
            };

            /**
             * Encodes the specified Dimensions message. Does not implicitly {@link mdc.proto.Dimensions.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {mdc.proto.IDimensions} message Dimensions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Dimensions.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.width != null && message.hasOwnProperty("width"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.width);
                if (message.height != null && message.hasOwnProperty("height"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.height);
                return writer;
            };

            /**
             * Encodes the specified Dimensions message, length delimited. Does not implicitly {@link mdc.proto.Dimensions.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {mdc.proto.IDimensions} message Dimensions message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Dimensions.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Dimensions message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.Dimensions} Dimensions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Dimensions.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.Dimensions();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.width = reader.uint64();
                        break;
                    case 2:
                        message.height = reader.uint64();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Dimensions message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.Dimensions} Dimensions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Dimensions.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Dimensions message.
             * @function verify
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Dimensions.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.width != null && message.hasOwnProperty("width"))
                    if (!$util.isInteger(message.width) && !(message.width && $util.isInteger(message.width.low) && $util.isInteger(message.width.high)))
                        return "width: integer|Long expected";
                if (message.height != null && message.hasOwnProperty("height"))
                    if (!$util.isInteger(message.height) && !(message.height && $util.isInteger(message.height.low) && $util.isInteger(message.height.high)))
                        return "height: integer|Long expected";
                return null;
            };

            /**
             * Creates a Dimensions message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.Dimensions} Dimensions
             */
            Dimensions.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.Dimensions)
                    return object;
                var message = new $root.mdc.proto.Dimensions();
                if (object.width != null)
                    if ($util.Long)
                        (message.width = $util.Long.fromValue(object.width)).unsigned = true;
                    else if (typeof object.width === "string")
                        message.width = parseInt(object.width, 10);
                    else if (typeof object.width === "number")
                        message.width = object.width;
                    else if (typeof object.width === "object")
                        message.width = new $util.LongBits(object.width.low >>> 0, object.width.high >>> 0).toNumber(true);
                if (object.height != null)
                    if ($util.Long)
                        (message.height = $util.Long.fromValue(object.height)).unsigned = true;
                    else if (typeof object.height === "string")
                        message.height = parseInt(object.height, 10);
                    else if (typeof object.height === "number")
                        message.height = object.height;
                    else if (typeof object.height === "object")
                        message.height = new $util.LongBits(object.height.low >>> 0, object.height.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Dimensions message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.Dimensions
             * @static
             * @param {mdc.proto.Dimensions} message Dimensions
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Dimensions.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.width = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.width = options.longs === String ? "0" : 0;
                    if ($util.Long) {
                        var long = new $util.Long(0, 0, true);
                        object.height = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.height = options.longs === String ? "0" : 0;
                }
                if (message.width != null && message.hasOwnProperty("width"))
                    if (typeof message.width === "number")
                        object.width = options.longs === String ? String(message.width) : message.width;
                    else
                        object.width = options.longs === String ? $util.Long.prototype.toString.call(message.width) : options.longs === Number ? new $util.LongBits(message.width.low >>> 0, message.width.high >>> 0).toNumber(true) : message.width;
                if (message.height != null && message.hasOwnProperty("height"))
                    if (typeof message.height === "number")
                        object.height = options.longs === String ? String(message.height) : message.height;
                    else
                        object.height = options.longs === String ? $util.Long.prototype.toString.call(message.height) : options.longs === Number ? new $util.LongBits(message.height.low >>> 0, message.height.high >>> 0).toNumber(true) : message.height;
                return object;
            };

            /**
             * Converts this Dimensions to JSON.
             * @function toJSON
             * @memberof mdc.proto.Dimensions
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Dimensions.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Dimensions;
        })();

        proto.DiffImageResult = (function() {

            /**
             * Properties of a DiffImageResult.
             * @memberof mdc.proto
             * @interface IDiffImageResult
             * @property {mdc.proto.ITestFile|null} [diff_image_file] DiffImageResult diff_image_file
             * @property {mdc.proto.IDimensions|null} [expected_image_dimensions] DiffImageResult expected_image_dimensions
             * @property {mdc.proto.IDimensions|null} [actual_image_dimensions] DiffImageResult actual_image_dimensions
             * @property {mdc.proto.IDimensions|null} [diff_image_dimensions] DiffImageResult diff_image_dimensions
             * @property {number|null} [changed_pixel_count] DiffImageResult changed_pixel_count
             * @property {number|null} [changed_pixel_fraction] DiffImageResult changed_pixel_fraction
             * @property {number|null} [changed_pixel_percentage] DiffImageResult changed_pixel_percentage
             * @property {boolean|null} [has_changed] DiffImageResult has_changed
             */

            /**
             * Constructs a new DiffImageResult.
             * @memberof mdc.proto
             * @classdesc Represents a DiffImageResult.
             * @implements IDiffImageResult
             * @constructor
             * @param {mdc.proto.IDiffImageResult=} [properties] Properties to set
             */
            function DiffImageResult(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DiffImageResult diff_image_file.
             * @member {mdc.proto.ITestFile|null|undefined} diff_image_file
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.diff_image_file = null;

            /**
             * DiffImageResult expected_image_dimensions.
             * @member {mdc.proto.IDimensions|null|undefined} expected_image_dimensions
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.expected_image_dimensions = null;

            /**
             * DiffImageResult actual_image_dimensions.
             * @member {mdc.proto.IDimensions|null|undefined} actual_image_dimensions
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.actual_image_dimensions = null;

            /**
             * DiffImageResult diff_image_dimensions.
             * @member {mdc.proto.IDimensions|null|undefined} diff_image_dimensions
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.diff_image_dimensions = null;

            /**
             * DiffImageResult changed_pixel_count.
             * @member {number} changed_pixel_count
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.changed_pixel_count = 0;

            /**
             * DiffImageResult changed_pixel_fraction.
             * @member {number} changed_pixel_fraction
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.changed_pixel_fraction = 0;

            /**
             * DiffImageResult changed_pixel_percentage.
             * @member {number} changed_pixel_percentage
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.changed_pixel_percentage = 0;

            /**
             * DiffImageResult has_changed.
             * @member {boolean} has_changed
             * @memberof mdc.proto.DiffImageResult
             * @instance
             */
            DiffImageResult.prototype.has_changed = false;

            /**
             * Creates a new DiffImageResult instance using the specified properties.
             * @function create
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {mdc.proto.IDiffImageResult=} [properties] Properties to set
             * @returns {mdc.proto.DiffImageResult} DiffImageResult instance
             */
            DiffImageResult.create = function create(properties) {
                return new DiffImageResult(properties);
            };

            /**
             * Encodes the specified DiffImageResult message. Does not implicitly {@link mdc.proto.DiffImageResult.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {mdc.proto.IDiffImageResult} message DiffImageResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiffImageResult.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file"))
                    $root.mdc.proto.TestFile.encode(message.diff_image_file, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.expected_image_dimensions != null && message.hasOwnProperty("expected_image_dimensions"))
                    $root.mdc.proto.Dimensions.encode(message.expected_image_dimensions, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.actual_image_dimensions != null && message.hasOwnProperty("actual_image_dimensions"))
                    $root.mdc.proto.Dimensions.encode(message.actual_image_dimensions, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.diff_image_dimensions != null && message.hasOwnProperty("diff_image_dimensions"))
                    $root.mdc.proto.Dimensions.encode(message.diff_image_dimensions, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.changed_pixel_count != null && message.hasOwnProperty("changed_pixel_count"))
                    writer.uint32(/* id 5, wireType 1 =*/41).double(message.changed_pixel_count);
                if (message.changed_pixel_fraction != null && message.hasOwnProperty("changed_pixel_fraction"))
                    writer.uint32(/* id 6, wireType 1 =*/49).double(message.changed_pixel_fraction);
                if (message.changed_pixel_percentage != null && message.hasOwnProperty("changed_pixel_percentage"))
                    writer.uint32(/* id 7, wireType 1 =*/57).double(message.changed_pixel_percentage);
                if (message.has_changed != null && message.hasOwnProperty("has_changed"))
                    writer.uint32(/* id 8, wireType 0 =*/64).bool(message.has_changed);
                return writer;
            };

            /**
             * Encodes the specified DiffImageResult message, length delimited. Does not implicitly {@link mdc.proto.DiffImageResult.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {mdc.proto.IDiffImageResult} message DiffImageResult message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DiffImageResult.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DiffImageResult message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.DiffImageResult} DiffImageResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiffImageResult.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.DiffImageResult();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.diff_image_file = $root.mdc.proto.TestFile.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.expected_image_dimensions = $root.mdc.proto.Dimensions.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.actual_image_dimensions = $root.mdc.proto.Dimensions.decode(reader, reader.uint32());
                        break;
                    case 4:
                        message.diff_image_dimensions = $root.mdc.proto.Dimensions.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.changed_pixel_count = reader.double();
                        break;
                    case 6:
                        message.changed_pixel_fraction = reader.double();
                        break;
                    case 7:
                        message.changed_pixel_percentage = reader.double();
                        break;
                    case 8:
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
             * Decodes a DiffImageResult message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.DiffImageResult} DiffImageResult
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DiffImageResult.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DiffImageResult message.
             * @function verify
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DiffImageResult.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file")) {
                    var error = $root.mdc.proto.TestFile.verify(message.diff_image_file);
                    if (error)
                        return "diff_image_file." + error;
                }
                if (message.expected_image_dimensions != null && message.hasOwnProperty("expected_image_dimensions")) {
                    var error = $root.mdc.proto.Dimensions.verify(message.expected_image_dimensions);
                    if (error)
                        return "expected_image_dimensions." + error;
                }
                if (message.actual_image_dimensions != null && message.hasOwnProperty("actual_image_dimensions")) {
                    var error = $root.mdc.proto.Dimensions.verify(message.actual_image_dimensions);
                    if (error)
                        return "actual_image_dimensions." + error;
                }
                if (message.diff_image_dimensions != null && message.hasOwnProperty("diff_image_dimensions")) {
                    var error = $root.mdc.proto.Dimensions.verify(message.diff_image_dimensions);
                    if (error)
                        return "diff_image_dimensions." + error;
                }
                if (message.changed_pixel_count != null && message.hasOwnProperty("changed_pixel_count"))
                    if (typeof message.changed_pixel_count !== "number")
                        return "changed_pixel_count: number expected";
                if (message.changed_pixel_fraction != null && message.hasOwnProperty("changed_pixel_fraction"))
                    if (typeof message.changed_pixel_fraction !== "number")
                        return "changed_pixel_fraction: number expected";
                if (message.changed_pixel_percentage != null && message.hasOwnProperty("changed_pixel_percentage"))
                    if (typeof message.changed_pixel_percentage !== "number")
                        return "changed_pixel_percentage: number expected";
                if (message.has_changed != null && message.hasOwnProperty("has_changed"))
                    if (typeof message.has_changed !== "boolean")
                        return "has_changed: boolean expected";
                return null;
            };

            /**
             * Creates a DiffImageResult message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.DiffImageResult} DiffImageResult
             */
            DiffImageResult.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.DiffImageResult)
                    return object;
                var message = new $root.mdc.proto.DiffImageResult();
                if (object.diff_image_file != null) {
                    if (typeof object.diff_image_file !== "object")
                        throw TypeError(".mdc.proto.DiffImageResult.diff_image_file: object expected");
                    message.diff_image_file = $root.mdc.proto.TestFile.fromObject(object.diff_image_file);
                }
                if (object.expected_image_dimensions != null) {
                    if (typeof object.expected_image_dimensions !== "object")
                        throw TypeError(".mdc.proto.DiffImageResult.expected_image_dimensions: object expected");
                    message.expected_image_dimensions = $root.mdc.proto.Dimensions.fromObject(object.expected_image_dimensions);
                }
                if (object.actual_image_dimensions != null) {
                    if (typeof object.actual_image_dimensions !== "object")
                        throw TypeError(".mdc.proto.DiffImageResult.actual_image_dimensions: object expected");
                    message.actual_image_dimensions = $root.mdc.proto.Dimensions.fromObject(object.actual_image_dimensions);
                }
                if (object.diff_image_dimensions != null) {
                    if (typeof object.diff_image_dimensions !== "object")
                        throw TypeError(".mdc.proto.DiffImageResult.diff_image_dimensions: object expected");
                    message.diff_image_dimensions = $root.mdc.proto.Dimensions.fromObject(object.diff_image_dimensions);
                }
                if (object.changed_pixel_count != null)
                    message.changed_pixel_count = Number(object.changed_pixel_count);
                if (object.changed_pixel_fraction != null)
                    message.changed_pixel_fraction = Number(object.changed_pixel_fraction);
                if (object.changed_pixel_percentage != null)
                    message.changed_pixel_percentage = Number(object.changed_pixel_percentage);
                if (object.has_changed != null)
                    message.has_changed = Boolean(object.has_changed);
                return message;
            };

            /**
             * Creates a plain object from a DiffImageResult message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.DiffImageResult
             * @static
             * @param {mdc.proto.DiffImageResult} message DiffImageResult
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DiffImageResult.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.diff_image_file = null;
                    object.expected_image_dimensions = null;
                    object.actual_image_dimensions = null;
                    object.diff_image_dimensions = null;
                    object.changed_pixel_count = 0;
                    object.changed_pixel_fraction = 0;
                    object.changed_pixel_percentage = 0;
                    object.has_changed = false;
                }
                if (message.diff_image_file != null && message.hasOwnProperty("diff_image_file"))
                    object.diff_image_file = $root.mdc.proto.TestFile.toObject(message.diff_image_file, options);
                if (message.expected_image_dimensions != null && message.hasOwnProperty("expected_image_dimensions"))
                    object.expected_image_dimensions = $root.mdc.proto.Dimensions.toObject(message.expected_image_dimensions, options);
                if (message.actual_image_dimensions != null && message.hasOwnProperty("actual_image_dimensions"))
                    object.actual_image_dimensions = $root.mdc.proto.Dimensions.toObject(message.actual_image_dimensions, options);
                if (message.diff_image_dimensions != null && message.hasOwnProperty("diff_image_dimensions"))
                    object.diff_image_dimensions = $root.mdc.proto.Dimensions.toObject(message.diff_image_dimensions, options);
                if (message.changed_pixel_count != null && message.hasOwnProperty("changed_pixel_count"))
                    object.changed_pixel_count = options.json && !isFinite(message.changed_pixel_count) ? String(message.changed_pixel_count) : message.changed_pixel_count;
                if (message.changed_pixel_fraction != null && message.hasOwnProperty("changed_pixel_fraction"))
                    object.changed_pixel_fraction = options.json && !isFinite(message.changed_pixel_fraction) ? String(message.changed_pixel_fraction) : message.changed_pixel_fraction;
                if (message.changed_pixel_percentage != null && message.hasOwnProperty("changed_pixel_percentage"))
                    object.changed_pixel_percentage = options.json && !isFinite(message.changed_pixel_percentage) ? String(message.changed_pixel_percentage) : message.changed_pixel_percentage;
                if (message.has_changed != null && message.hasOwnProperty("has_changed"))
                    object.has_changed = message.has_changed;
                return object;
            };

            /**
             * Converts this DiffImageResult to JSON.
             * @function toJSON
             * @memberof mdc.proto.DiffImageResult
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DiffImageResult.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DiffImageResult;
        })();

        proto.TestFile = (function() {

            /**
             * Properties of a TestFile.
             * @memberof mdc.proto
             * @interface ITestFile
             * @property {string|null} [relative_path] TestFile relative_path
             * @property {string|null} [absolute_path] TestFile absolute_path
             * @property {string|null} [public_url] TestFile public_url
             */

            /**
             * Constructs a new TestFile.
             * @memberof mdc.proto
             * @classdesc Represents a TestFile.
             * @implements ITestFile
             * @constructor
             * @param {mdc.proto.ITestFile=} [properties] Properties to set
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
             * @memberof mdc.proto.TestFile
             * @instance
             */
            TestFile.prototype.relative_path = "";

            /**
             * TestFile absolute_path.
             * @member {string} absolute_path
             * @memberof mdc.proto.TestFile
             * @instance
             */
            TestFile.prototype.absolute_path = "";

            /**
             * TestFile public_url.
             * @member {string} public_url
             * @memberof mdc.proto.TestFile
             * @instance
             */
            TestFile.prototype.public_url = "";

            /**
             * Creates a new TestFile instance using the specified properties.
             * @function create
             * @memberof mdc.proto.TestFile
             * @static
             * @param {mdc.proto.ITestFile=} [properties] Properties to set
             * @returns {mdc.proto.TestFile} TestFile instance
             */
            TestFile.create = function create(properties) {
                return new TestFile(properties);
            };

            /**
             * Encodes the specified TestFile message. Does not implicitly {@link mdc.proto.TestFile.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.TestFile
             * @static
             * @param {mdc.proto.ITestFile} message TestFile message or plain object to encode
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
             * Encodes the specified TestFile message, length delimited. Does not implicitly {@link mdc.proto.TestFile.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.TestFile
             * @static
             * @param {mdc.proto.ITestFile} message TestFile message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TestFile.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TestFile message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.TestFile
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.TestFile} TestFile
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TestFile.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.TestFile();
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
             * @memberof mdc.proto.TestFile
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.TestFile} TestFile
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
             * @memberof mdc.proto.TestFile
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
             * @memberof mdc.proto.TestFile
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.TestFile} TestFile
             */
            TestFile.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.TestFile)
                    return object;
                var message = new $root.mdc.proto.TestFile();
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
             * @memberof mdc.proto.TestFile
             * @static
             * @param {mdc.proto.TestFile} message TestFile
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
             * @memberof mdc.proto.TestFile
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TestFile.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return TestFile;
        })();

        proto.Approvals = (function() {

            /**
             * Properties of an Approvals.
             * @memberof mdc.proto
             * @interface IApprovals
             * @property {Array.<mdc.proto.IApprovalId>|null} [added_ids] Approvals added_ids
             * @property {Array.<mdc.proto.IApprovalId>|null} [changed_ids] Approvals changed_ids
             * @property {Array.<mdc.proto.IApprovalId>|null} [removed_ids] Approvals removed_ids
             * @property {Array.<mdc.proto.IScreenshot>|null} [added_screenshot_list] Approvals added_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [changed_screenshot_list] Approvals changed_screenshot_list
             * @property {Array.<mdc.proto.IScreenshot>|null} [removed_screenshot_list] Approvals removed_screenshot_list
             */

            /**
             * Constructs a new Approvals.
             * @memberof mdc.proto
             * @classdesc Represents an Approvals.
             * @implements IApprovals
             * @constructor
             * @param {mdc.proto.IApprovals=} [properties] Properties to set
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
             * @member {Array.<mdc.proto.IApprovalId>} added_ids
             * @memberof mdc.proto.Approvals
             * @instance
             */
            Approvals.prototype.added_ids = $util.emptyArray;

            /**
             * Approvals changed_ids.
             * @member {Array.<mdc.proto.IApprovalId>} changed_ids
             * @memberof mdc.proto.Approvals
             * @instance
             */
            Approvals.prototype.changed_ids = $util.emptyArray;

            /**
             * Approvals removed_ids.
             * @member {Array.<mdc.proto.IApprovalId>} removed_ids
             * @memberof mdc.proto.Approvals
             * @instance
             */
            Approvals.prototype.removed_ids = $util.emptyArray;

            /**
             * Approvals added_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} added_screenshot_list
             * @memberof mdc.proto.Approvals
             * @instance
             */
            Approvals.prototype.added_screenshot_list = $util.emptyArray;

            /**
             * Approvals changed_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} changed_screenshot_list
             * @memberof mdc.proto.Approvals
             * @instance
             */
            Approvals.prototype.changed_screenshot_list = $util.emptyArray;

            /**
             * Approvals removed_screenshot_list.
             * @member {Array.<mdc.proto.IScreenshot>} removed_screenshot_list
             * @memberof mdc.proto.Approvals
             * @instance
             */
            Approvals.prototype.removed_screenshot_list = $util.emptyArray;

            /**
             * Creates a new Approvals instance using the specified properties.
             * @function create
             * @memberof mdc.proto.Approvals
             * @static
             * @param {mdc.proto.IApprovals=} [properties] Properties to set
             * @returns {mdc.proto.Approvals} Approvals instance
             */
            Approvals.create = function create(properties) {
                return new Approvals(properties);
            };

            /**
             * Encodes the specified Approvals message. Does not implicitly {@link mdc.proto.Approvals.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.Approvals
             * @static
             * @param {mdc.proto.IApprovals} message Approvals message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Approvals.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.added_ids != null && message.added_ids.length)
                    for (var i = 0; i < message.added_ids.length; ++i)
                        $root.mdc.proto.ApprovalId.encode(message.added_ids[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.changed_ids != null && message.changed_ids.length)
                    for (var i = 0; i < message.changed_ids.length; ++i)
                        $root.mdc.proto.ApprovalId.encode(message.changed_ids[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.removed_ids != null && message.removed_ids.length)
                    for (var i = 0; i < message.removed_ids.length; ++i)
                        $root.mdc.proto.ApprovalId.encode(message.removed_ids[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.added_screenshot_list != null && message.added_screenshot_list.length)
                    for (var i = 0; i < message.added_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.added_screenshot_list[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.changed_screenshot_list != null && message.changed_screenshot_list.length)
                    for (var i = 0; i < message.changed_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.changed_screenshot_list[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.removed_screenshot_list != null && message.removed_screenshot_list.length)
                    for (var i = 0; i < message.removed_screenshot_list.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.removed_screenshot_list[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified Approvals message, length delimited. Does not implicitly {@link mdc.proto.Approvals.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.Approvals
             * @static
             * @param {mdc.proto.IApprovals} message Approvals message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Approvals.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Approvals message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.Approvals
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.Approvals} Approvals
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Approvals.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.Approvals();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.added_ids && message.added_ids.length))
                            message.added_ids = [];
                        message.added_ids.push($root.mdc.proto.ApprovalId.decode(reader, reader.uint32()));
                        break;
                    case 2:
                        if (!(message.changed_ids && message.changed_ids.length))
                            message.changed_ids = [];
                        message.changed_ids.push($root.mdc.proto.ApprovalId.decode(reader, reader.uint32()));
                        break;
                    case 3:
                        if (!(message.removed_ids && message.removed_ids.length))
                            message.removed_ids = [];
                        message.removed_ids.push($root.mdc.proto.ApprovalId.decode(reader, reader.uint32()));
                        break;
                    case 4:
                        if (!(message.added_screenshot_list && message.added_screenshot_list.length))
                            message.added_screenshot_list = [];
                        message.added_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 5:
                        if (!(message.changed_screenshot_list && message.changed_screenshot_list.length))
                            message.changed_screenshot_list = [];
                        message.changed_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    case 6:
                        if (!(message.removed_screenshot_list && message.removed_screenshot_list.length))
                            message.removed_screenshot_list = [];
                        message.removed_screenshot_list.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
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
             * @memberof mdc.proto.Approvals
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.Approvals} Approvals
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
             * @memberof mdc.proto.Approvals
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
                        var error = $root.mdc.proto.ApprovalId.verify(message.added_ids[i]);
                        if (error)
                            return "added_ids." + error;
                    }
                }
                if (message.changed_ids != null && message.hasOwnProperty("changed_ids")) {
                    if (!Array.isArray(message.changed_ids))
                        return "changed_ids: array expected";
                    for (var i = 0; i < message.changed_ids.length; ++i) {
                        var error = $root.mdc.proto.ApprovalId.verify(message.changed_ids[i]);
                        if (error)
                            return "changed_ids." + error;
                    }
                }
                if (message.removed_ids != null && message.hasOwnProperty("removed_ids")) {
                    if (!Array.isArray(message.removed_ids))
                        return "removed_ids: array expected";
                    for (var i = 0; i < message.removed_ids.length; ++i) {
                        var error = $root.mdc.proto.ApprovalId.verify(message.removed_ids[i]);
                        if (error)
                            return "removed_ids." + error;
                    }
                }
                if (message.added_screenshot_list != null && message.hasOwnProperty("added_screenshot_list")) {
                    if (!Array.isArray(message.added_screenshot_list))
                        return "added_screenshot_list: array expected";
                    for (var i = 0; i < message.added_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.added_screenshot_list[i]);
                        if (error)
                            return "added_screenshot_list." + error;
                    }
                }
                if (message.changed_screenshot_list != null && message.hasOwnProperty("changed_screenshot_list")) {
                    if (!Array.isArray(message.changed_screenshot_list))
                        return "changed_screenshot_list: array expected";
                    for (var i = 0; i < message.changed_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.changed_screenshot_list[i]);
                        if (error)
                            return "changed_screenshot_list." + error;
                    }
                }
                if (message.removed_screenshot_list != null && message.hasOwnProperty("removed_screenshot_list")) {
                    if (!Array.isArray(message.removed_screenshot_list))
                        return "removed_screenshot_list: array expected";
                    for (var i = 0; i < message.removed_screenshot_list.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.removed_screenshot_list[i]);
                        if (error)
                            return "removed_screenshot_list." + error;
                    }
                }
                return null;
            };

            /**
             * Creates an Approvals message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.Approvals
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.Approvals} Approvals
             */
            Approvals.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.Approvals)
                    return object;
                var message = new $root.mdc.proto.Approvals();
                if (object.added_ids) {
                    if (!Array.isArray(object.added_ids))
                        throw TypeError(".mdc.proto.Approvals.added_ids: array expected");
                    message.added_ids = [];
                    for (var i = 0; i < object.added_ids.length; ++i) {
                        if (typeof object.added_ids[i] !== "object")
                            throw TypeError(".mdc.proto.Approvals.added_ids: object expected");
                        message.added_ids[i] = $root.mdc.proto.ApprovalId.fromObject(object.added_ids[i]);
                    }
                }
                if (object.changed_ids) {
                    if (!Array.isArray(object.changed_ids))
                        throw TypeError(".mdc.proto.Approvals.changed_ids: array expected");
                    message.changed_ids = [];
                    for (var i = 0; i < object.changed_ids.length; ++i) {
                        if (typeof object.changed_ids[i] !== "object")
                            throw TypeError(".mdc.proto.Approvals.changed_ids: object expected");
                        message.changed_ids[i] = $root.mdc.proto.ApprovalId.fromObject(object.changed_ids[i]);
                    }
                }
                if (object.removed_ids) {
                    if (!Array.isArray(object.removed_ids))
                        throw TypeError(".mdc.proto.Approvals.removed_ids: array expected");
                    message.removed_ids = [];
                    for (var i = 0; i < object.removed_ids.length; ++i) {
                        if (typeof object.removed_ids[i] !== "object")
                            throw TypeError(".mdc.proto.Approvals.removed_ids: object expected");
                        message.removed_ids[i] = $root.mdc.proto.ApprovalId.fromObject(object.removed_ids[i]);
                    }
                }
                if (object.added_screenshot_list) {
                    if (!Array.isArray(object.added_screenshot_list))
                        throw TypeError(".mdc.proto.Approvals.added_screenshot_list: array expected");
                    message.added_screenshot_list = [];
                    for (var i = 0; i < object.added_screenshot_list.length; ++i) {
                        if (typeof object.added_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Approvals.added_screenshot_list: object expected");
                        message.added_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.added_screenshot_list[i]);
                    }
                }
                if (object.changed_screenshot_list) {
                    if (!Array.isArray(object.changed_screenshot_list))
                        throw TypeError(".mdc.proto.Approvals.changed_screenshot_list: array expected");
                    message.changed_screenshot_list = [];
                    for (var i = 0; i < object.changed_screenshot_list.length; ++i) {
                        if (typeof object.changed_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Approvals.changed_screenshot_list: object expected");
                        message.changed_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.changed_screenshot_list[i]);
                    }
                }
                if (object.removed_screenshot_list) {
                    if (!Array.isArray(object.removed_screenshot_list))
                        throw TypeError(".mdc.proto.Approvals.removed_screenshot_list: array expected");
                    message.removed_screenshot_list = [];
                    for (var i = 0; i < object.removed_screenshot_list.length; ++i) {
                        if (typeof object.removed_screenshot_list[i] !== "object")
                            throw TypeError(".mdc.proto.Approvals.removed_screenshot_list: object expected");
                        message.removed_screenshot_list[i] = $root.mdc.proto.Screenshot.fromObject(object.removed_screenshot_list[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from an Approvals message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.Approvals
             * @static
             * @param {mdc.proto.Approvals} message Approvals
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
                        object.added_ids[j] = $root.mdc.proto.ApprovalId.toObject(message.added_ids[j], options);
                }
                if (message.changed_ids && message.changed_ids.length) {
                    object.changed_ids = [];
                    for (var j = 0; j < message.changed_ids.length; ++j)
                        object.changed_ids[j] = $root.mdc.proto.ApprovalId.toObject(message.changed_ids[j], options);
                }
                if (message.removed_ids && message.removed_ids.length) {
                    object.removed_ids = [];
                    for (var j = 0; j < message.removed_ids.length; ++j)
                        object.removed_ids[j] = $root.mdc.proto.ApprovalId.toObject(message.removed_ids[j], options);
                }
                if (message.added_screenshot_list && message.added_screenshot_list.length) {
                    object.added_screenshot_list = [];
                    for (var j = 0; j < message.added_screenshot_list.length; ++j)
                        object.added_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.added_screenshot_list[j], options);
                }
                if (message.changed_screenshot_list && message.changed_screenshot_list.length) {
                    object.changed_screenshot_list = [];
                    for (var j = 0; j < message.changed_screenshot_list.length; ++j)
                        object.changed_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.changed_screenshot_list[j], options);
                }
                if (message.removed_screenshot_list && message.removed_screenshot_list.length) {
                    object.removed_screenshot_list = [];
                    for (var j = 0; j < message.removed_screenshot_list.length; ++j)
                        object.removed_screenshot_list[j] = $root.mdc.proto.Screenshot.toObject(message.removed_screenshot_list[j], options);
                }
                return object;
            };

            /**
             * Converts this Approvals to JSON.
             * @function toJSON
             * @memberof mdc.proto.Approvals
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Approvals.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Approvals;
        })();

        proto.ApprovalId = (function() {

            /**
             * Properties of an ApprovalId.
             * @memberof mdc.proto
             * @interface IApprovalId
             * @property {string|null} [html_file_path] ApprovalId html_file_path
             * @property {string|null} [user_agent_alias] ApprovalId user_agent_alias
             */

            /**
             * Constructs a new ApprovalId.
             * @memberof mdc.proto
             * @classdesc Represents an ApprovalId.
             * @implements IApprovalId
             * @constructor
             * @param {mdc.proto.IApprovalId=} [properties] Properties to set
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
             * @memberof mdc.proto.ApprovalId
             * @instance
             */
            ApprovalId.prototype.html_file_path = "";

            /**
             * ApprovalId user_agent_alias.
             * @member {string} user_agent_alias
             * @memberof mdc.proto.ApprovalId
             * @instance
             */
            ApprovalId.prototype.user_agent_alias = "";

            /**
             * Creates a new ApprovalId instance using the specified properties.
             * @function create
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {mdc.proto.IApprovalId=} [properties] Properties to set
             * @returns {mdc.proto.ApprovalId} ApprovalId instance
             */
            ApprovalId.create = function create(properties) {
                return new ApprovalId(properties);
            };

            /**
             * Encodes the specified ApprovalId message. Does not implicitly {@link mdc.proto.ApprovalId.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {mdc.proto.IApprovalId} message ApprovalId message or plain object to encode
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
             * Encodes the specified ApprovalId message, length delimited. Does not implicitly {@link mdc.proto.ApprovalId.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {mdc.proto.IApprovalId} message ApprovalId message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ApprovalId.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an ApprovalId message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.ApprovalId} ApprovalId
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ApprovalId.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.ApprovalId();
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
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.ApprovalId} ApprovalId
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
             * @memberof mdc.proto.ApprovalId
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
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.ApprovalId} ApprovalId
             */
            ApprovalId.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.ApprovalId)
                    return object;
                var message = new $root.mdc.proto.ApprovalId();
                if (object.html_file_path != null)
                    message.html_file_path = String(object.html_file_path);
                if (object.user_agent_alias != null)
                    message.user_agent_alias = String(object.user_agent_alias);
                return message;
            };

            /**
             * Creates a plain object from an ApprovalId message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.ApprovalId
             * @static
             * @param {mdc.proto.ApprovalId} message ApprovalId
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
             * @memberof mdc.proto.ApprovalId
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ApprovalId.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return ApprovalId;
        })();

        proto.GoldenSuite = (function() {

            /**
             * Properties of a GoldenSuite.
             * @memberof mdc.proto
             * @interface IGoldenSuite
             * @property {Object.<string,mdc.proto.IGoldenPage>|null} [page_map] GoldenSuite page_map
             */

            /**
             * Constructs a new GoldenSuite.
             * @memberof mdc.proto
             * @classdesc Represents a GoldenSuite.
             * @implements IGoldenSuite
             * @constructor
             * @param {mdc.proto.IGoldenSuite=} [properties] Properties to set
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
             * @member {Object.<string,mdc.proto.IGoldenPage>} page_map
             * @memberof mdc.proto.GoldenSuite
             * @instance
             */
            GoldenSuite.prototype.page_map = $util.emptyObject;

            /**
             * Creates a new GoldenSuite instance using the specified properties.
             * @function create
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {mdc.proto.IGoldenSuite=} [properties] Properties to set
             * @returns {mdc.proto.GoldenSuite} GoldenSuite instance
             */
            GoldenSuite.create = function create(properties) {
                return new GoldenSuite(properties);
            };

            /**
             * Encodes the specified GoldenSuite message. Does not implicitly {@link mdc.proto.GoldenSuite.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {mdc.proto.IGoldenSuite} message GoldenSuite message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GoldenSuite.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.page_map != null && message.hasOwnProperty("page_map"))
                    for (var keys = Object.keys(message.page_map), i = 0; i < keys.length; ++i) {
                        writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]);
                        $root.mdc.proto.GoldenPage.encode(message.page_map[keys[i]], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim().ldelim();
                    }
                return writer;
            };

            /**
             * Encodes the specified GoldenSuite message, length delimited. Does not implicitly {@link mdc.proto.GoldenSuite.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {mdc.proto.IGoldenSuite} message GoldenSuite message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GoldenSuite.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GoldenSuite message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.GoldenSuite} GoldenSuite
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GoldenSuite.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.GoldenSuite(), key;
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        reader.skip().pos++;
                        if (message.page_map === $util.emptyObject)
                            message.page_map = {};
                        key = reader.string();
                        reader.pos++;
                        message.page_map[key] = $root.mdc.proto.GoldenPage.decode(reader, reader.uint32());
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
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.GoldenSuite} GoldenSuite
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
             * @memberof mdc.proto.GoldenSuite
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
                        var error = $root.mdc.proto.GoldenPage.verify(message.page_map[key[i]]);
                        if (error)
                            return "page_map." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a GoldenSuite message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.GoldenSuite} GoldenSuite
             */
            GoldenSuite.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.GoldenSuite)
                    return object;
                var message = new $root.mdc.proto.GoldenSuite();
                if (object.page_map) {
                    if (typeof object.page_map !== "object")
                        throw TypeError(".mdc.proto.GoldenSuite.page_map: object expected");
                    message.page_map = {};
                    for (var keys = Object.keys(object.page_map), i = 0; i < keys.length; ++i) {
                        if (typeof object.page_map[keys[i]] !== "object")
                            throw TypeError(".mdc.proto.GoldenSuite.page_map: object expected");
                        message.page_map[keys[i]] = $root.mdc.proto.GoldenPage.fromObject(object.page_map[keys[i]]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a GoldenSuite message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.GoldenSuite
             * @static
             * @param {mdc.proto.GoldenSuite} message GoldenSuite
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
                        object.page_map[keys2[j]] = $root.mdc.proto.GoldenPage.toObject(message.page_map[keys2[j]], options);
                }
                return object;
            };

            /**
             * Converts this GoldenSuite to JSON.
             * @function toJSON
             * @memberof mdc.proto.GoldenSuite
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GoldenSuite.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GoldenSuite;
        })();

        proto.GoldenPage = (function() {

            /**
             * Properties of a GoldenPage.
             * @memberof mdc.proto
             * @interface IGoldenPage
             * @property {string|null} [public_url] GoldenPage public_url
             * @property {Object.<string,string>|null} [screenshots] GoldenPage screenshots
             */

            /**
             * Constructs a new GoldenPage.
             * @memberof mdc.proto
             * @classdesc Represents a GoldenPage.
             * @implements IGoldenPage
             * @constructor
             * @param {mdc.proto.IGoldenPage=} [properties] Properties to set
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
             * @memberof mdc.proto.GoldenPage
             * @instance
             */
            GoldenPage.prototype.public_url = "";

            /**
             * GoldenPage screenshots.
             * @member {Object.<string,string>} screenshots
             * @memberof mdc.proto.GoldenPage
             * @instance
             */
            GoldenPage.prototype.screenshots = $util.emptyObject;

            /**
             * Creates a new GoldenPage instance using the specified properties.
             * @function create
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {mdc.proto.IGoldenPage=} [properties] Properties to set
             * @returns {mdc.proto.GoldenPage} GoldenPage instance
             */
            GoldenPage.create = function create(properties) {
                return new GoldenPage(properties);
            };

            /**
             * Encodes the specified GoldenPage message. Does not implicitly {@link mdc.proto.GoldenPage.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {mdc.proto.IGoldenPage} message GoldenPage message or plain object to encode
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
             * Encodes the specified GoldenPage message, length delimited. Does not implicitly {@link mdc.proto.GoldenPage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {mdc.proto.IGoldenPage} message GoldenPage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GoldenPage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GoldenPage message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.GoldenPage} GoldenPage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GoldenPage.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.GoldenPage(), key;
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
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.GoldenPage} GoldenPage
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
             * @memberof mdc.proto.GoldenPage
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
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.GoldenPage} GoldenPage
             */
            GoldenPage.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.GoldenPage)
                    return object;
                var message = new $root.mdc.proto.GoldenPage();
                if (object.public_url != null)
                    message.public_url = String(object.public_url);
                if (object.screenshots) {
                    if (typeof object.screenshots !== "object")
                        throw TypeError(".mdc.proto.GoldenPage.screenshots: object expected");
                    message.screenshots = {};
                    for (var keys = Object.keys(object.screenshots), i = 0; i < keys.length; ++i)
                        message.screenshots[keys[i]] = String(object.screenshots[keys[i]]);
                }
                return message;
            };

            /**
             * Creates a plain object from a GoldenPage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.GoldenPage
             * @static
             * @param {mdc.proto.GoldenPage} message GoldenPage
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
             * @memberof mdc.proto.GoldenPage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GoldenPage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GoldenPage;
        })();

        proto.GoldenScreenshot = (function() {

            /**
             * Properties of a GoldenScreenshot.
             * @memberof mdc.proto
             * @interface IGoldenScreenshot
             * @property {string|null} [html_file_path] GoldenScreenshot html_file_path
             * @property {string|null} [html_file_url] GoldenScreenshot html_file_url
             * @property {string|null} [user_agent_alias] GoldenScreenshot user_agent_alias
             * @property {string|null} [screenshot_image_path] GoldenScreenshot screenshot_image_path
             * @property {string|null} [screenshot_image_url] GoldenScreenshot screenshot_image_url
             */

            /**
             * Constructs a new GoldenScreenshot.
             * @memberof mdc.proto
             * @classdesc Represents a GoldenScreenshot.
             * @implements IGoldenScreenshot
             * @constructor
             * @param {mdc.proto.IGoldenScreenshot=} [properties] Properties to set
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
             * @memberof mdc.proto.GoldenScreenshot
             * @instance
             */
            GoldenScreenshot.prototype.html_file_path = "";

            /**
             * GoldenScreenshot html_file_url.
             * @member {string} html_file_url
             * @memberof mdc.proto.GoldenScreenshot
             * @instance
             */
            GoldenScreenshot.prototype.html_file_url = "";

            /**
             * GoldenScreenshot user_agent_alias.
             * @member {string} user_agent_alias
             * @memberof mdc.proto.GoldenScreenshot
             * @instance
             */
            GoldenScreenshot.prototype.user_agent_alias = "";

            /**
             * GoldenScreenshot screenshot_image_path.
             * @member {string} screenshot_image_path
             * @memberof mdc.proto.GoldenScreenshot
             * @instance
             */
            GoldenScreenshot.prototype.screenshot_image_path = "";

            /**
             * GoldenScreenshot screenshot_image_url.
             * @member {string} screenshot_image_url
             * @memberof mdc.proto.GoldenScreenshot
             * @instance
             */
            GoldenScreenshot.prototype.screenshot_image_url = "";

            /**
             * Creates a new GoldenScreenshot instance using the specified properties.
             * @function create
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {mdc.proto.IGoldenScreenshot=} [properties] Properties to set
             * @returns {mdc.proto.GoldenScreenshot} GoldenScreenshot instance
             */
            GoldenScreenshot.create = function create(properties) {
                return new GoldenScreenshot(properties);
            };

            /**
             * Encodes the specified GoldenScreenshot message. Does not implicitly {@link mdc.proto.GoldenScreenshot.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {mdc.proto.IGoldenScreenshot} message GoldenScreenshot message or plain object to encode
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
             * Encodes the specified GoldenScreenshot message, length delimited. Does not implicitly {@link mdc.proto.GoldenScreenshot.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {mdc.proto.IGoldenScreenshot} message GoldenScreenshot message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GoldenScreenshot.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GoldenScreenshot message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.GoldenScreenshot} GoldenScreenshot
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GoldenScreenshot.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.GoldenScreenshot();
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
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.GoldenScreenshot} GoldenScreenshot
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
             * @memberof mdc.proto.GoldenScreenshot
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
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.GoldenScreenshot} GoldenScreenshot
             */
            GoldenScreenshot.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.GoldenScreenshot)
                    return object;
                var message = new $root.mdc.proto.GoldenScreenshot();
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
             * @memberof mdc.proto.GoldenScreenshot
             * @static
             * @param {mdc.proto.GoldenScreenshot} message GoldenScreenshot
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
             * @memberof mdc.proto.GoldenScreenshot
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GoldenScreenshot.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GoldenScreenshot;
        })();

        proto.HbsTestPageData = (function() {

            /**
             * Properties of a HbsTestPageData.
             * @memberof mdc.proto
             * @interface IHbsTestPageData
             * @property {string|null} [html_file_path] HbsTestPageData html_file_path
             * @property {string|null} [expected_html_file_url] HbsTestPageData expected_html_file_url
             * @property {string|null} [actual_html_file_url] HbsTestPageData actual_html_file_url
             * @property {Array.<mdc.proto.IScreenshot>|null} [screenshot_array] HbsTestPageData screenshot_array
             */

            /**
             * Constructs a new HbsTestPageData.
             * @memberof mdc.proto
             * @classdesc Represents a HbsTestPageData.
             * @implements IHbsTestPageData
             * @constructor
             * @param {mdc.proto.IHbsTestPageData=} [properties] Properties to set
             */
            function HbsTestPageData(properties) {
                this.screenshot_array = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * HbsTestPageData html_file_path.
             * @member {string} html_file_path
             * @memberof mdc.proto.HbsTestPageData
             * @instance
             */
            HbsTestPageData.prototype.html_file_path = "";

            /**
             * HbsTestPageData expected_html_file_url.
             * @member {string} expected_html_file_url
             * @memberof mdc.proto.HbsTestPageData
             * @instance
             */
            HbsTestPageData.prototype.expected_html_file_url = "";

            /**
             * HbsTestPageData actual_html_file_url.
             * @member {string} actual_html_file_url
             * @memberof mdc.proto.HbsTestPageData
             * @instance
             */
            HbsTestPageData.prototype.actual_html_file_url = "";

            /**
             * HbsTestPageData screenshot_array.
             * @member {Array.<mdc.proto.IScreenshot>} screenshot_array
             * @memberof mdc.proto.HbsTestPageData
             * @instance
             */
            HbsTestPageData.prototype.screenshot_array = $util.emptyArray;

            /**
             * Creates a new HbsTestPageData instance using the specified properties.
             * @function create
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {mdc.proto.IHbsTestPageData=} [properties] Properties to set
             * @returns {mdc.proto.HbsTestPageData} HbsTestPageData instance
             */
            HbsTestPageData.create = function create(properties) {
                return new HbsTestPageData(properties);
            };

            /**
             * Encodes the specified HbsTestPageData message. Does not implicitly {@link mdc.proto.HbsTestPageData.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {mdc.proto.IHbsTestPageData} message HbsTestPageData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HbsTestPageData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.html_file_path);
                if (message.expected_html_file_url != null && message.hasOwnProperty("expected_html_file_url"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.expected_html_file_url);
                if (message.actual_html_file_url != null && message.hasOwnProperty("actual_html_file_url"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.actual_html_file_url);
                if (message.screenshot_array != null && message.screenshot_array.length)
                    for (var i = 0; i < message.screenshot_array.length; ++i)
                        $root.mdc.proto.Screenshot.encode(message.screenshot_array[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified HbsTestPageData message, length delimited. Does not implicitly {@link mdc.proto.HbsTestPageData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {mdc.proto.IHbsTestPageData} message HbsTestPageData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HbsTestPageData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a HbsTestPageData message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.HbsTestPageData} HbsTestPageData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HbsTestPageData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.HbsTestPageData();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.html_file_path = reader.string();
                        break;
                    case 2:
                        message.expected_html_file_url = reader.string();
                        break;
                    case 3:
                        message.actual_html_file_url = reader.string();
                        break;
                    case 4:
                        if (!(message.screenshot_array && message.screenshot_array.length))
                            message.screenshot_array = [];
                        message.screenshot_array.push($root.mdc.proto.Screenshot.decode(reader, reader.uint32()));
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a HbsTestPageData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.HbsTestPageData} HbsTestPageData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HbsTestPageData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a HbsTestPageData message.
             * @function verify
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HbsTestPageData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                    if (!$util.isString(message.html_file_path))
                        return "html_file_path: string expected";
                if (message.expected_html_file_url != null && message.hasOwnProperty("expected_html_file_url"))
                    if (!$util.isString(message.expected_html_file_url))
                        return "expected_html_file_url: string expected";
                if (message.actual_html_file_url != null && message.hasOwnProperty("actual_html_file_url"))
                    if (!$util.isString(message.actual_html_file_url))
                        return "actual_html_file_url: string expected";
                if (message.screenshot_array != null && message.hasOwnProperty("screenshot_array")) {
                    if (!Array.isArray(message.screenshot_array))
                        return "screenshot_array: array expected";
                    for (var i = 0; i < message.screenshot_array.length; ++i) {
                        var error = $root.mdc.proto.Screenshot.verify(message.screenshot_array[i]);
                        if (error)
                            return "screenshot_array." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a HbsTestPageData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.HbsTestPageData} HbsTestPageData
             */
            HbsTestPageData.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.HbsTestPageData)
                    return object;
                var message = new $root.mdc.proto.HbsTestPageData();
                if (object.html_file_path != null)
                    message.html_file_path = String(object.html_file_path);
                if (object.expected_html_file_url != null)
                    message.expected_html_file_url = String(object.expected_html_file_url);
                if (object.actual_html_file_url != null)
                    message.actual_html_file_url = String(object.actual_html_file_url);
                if (object.screenshot_array) {
                    if (!Array.isArray(object.screenshot_array))
                        throw TypeError(".mdc.proto.HbsTestPageData.screenshot_array: array expected");
                    message.screenshot_array = [];
                    for (var i = 0; i < object.screenshot_array.length; ++i) {
                        if (typeof object.screenshot_array[i] !== "object")
                            throw TypeError(".mdc.proto.HbsTestPageData.screenshot_array: object expected");
                        message.screenshot_array[i] = $root.mdc.proto.Screenshot.fromObject(object.screenshot_array[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a HbsTestPageData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.HbsTestPageData
             * @static
             * @param {mdc.proto.HbsTestPageData} message HbsTestPageData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HbsTestPageData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults)
                    object.screenshot_array = [];
                if (options.defaults) {
                    object.html_file_path = "";
                    object.expected_html_file_url = "";
                    object.actual_html_file_url = "";
                }
                if (message.html_file_path != null && message.hasOwnProperty("html_file_path"))
                    object.html_file_path = message.html_file_path;
                if (message.expected_html_file_url != null && message.hasOwnProperty("expected_html_file_url"))
                    object.expected_html_file_url = message.expected_html_file_url;
                if (message.actual_html_file_url != null && message.hasOwnProperty("actual_html_file_url"))
                    object.actual_html_file_url = message.actual_html_file_url;
                if (message.screenshot_array && message.screenshot_array.length) {
                    object.screenshot_array = [];
                    for (var j = 0; j < message.screenshot_array.length; ++j)
                        object.screenshot_array[j] = $root.mdc.proto.Screenshot.toObject(message.screenshot_array[j], options);
                }
                return object;
            };

            /**
             * Converts this HbsTestPageData to JSON.
             * @function toJSON
             * @memberof mdc.proto.HbsTestPageData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HbsTestPageData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return HbsTestPageData;
        })();

        proto.GitStatus = (function() {

            /**
             * Properties of a GitStatus.
             * @memberof mdc.proto
             * @interface IGitStatus
             * @property {Array.<string>|null} [not_added] GitStatus not_added
             * @property {Array.<string>|null} [conflicted] GitStatus conflicted
             * @property {Array.<string>|null} [created] GitStatus created
             * @property {Array.<string>|null} [deleted] GitStatus deleted
             * @property {Array.<string>|null} [modified] GitStatus modified
             * @property {Array.<string>|null} [renamed] GitStatus renamed
             * @property {Array.<string>|null} [files] GitStatus files
             */

            /**
             * Constructs a new GitStatus.
             * @memberof mdc.proto
             * @classdesc Represents a GitStatus.
             * @implements IGitStatus
             * @constructor
             * @param {mdc.proto.IGitStatus=} [properties] Properties to set
             */
            function GitStatus(properties) {
                this.not_added = [];
                this.conflicted = [];
                this.created = [];
                this.deleted = [];
                this.modified = [];
                this.renamed = [];
                this.files = [];
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * GitStatus not_added.
             * @member {Array.<string>} not_added
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.not_added = $util.emptyArray;

            /**
             * GitStatus conflicted.
             * @member {Array.<string>} conflicted
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.conflicted = $util.emptyArray;

            /**
             * GitStatus created.
             * @member {Array.<string>} created
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.created = $util.emptyArray;

            /**
             * GitStatus deleted.
             * @member {Array.<string>} deleted
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.deleted = $util.emptyArray;

            /**
             * GitStatus modified.
             * @member {Array.<string>} modified
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.modified = $util.emptyArray;

            /**
             * GitStatus renamed.
             * @member {Array.<string>} renamed
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.renamed = $util.emptyArray;

            /**
             * GitStatus files.
             * @member {Array.<string>} files
             * @memberof mdc.proto.GitStatus
             * @instance
             */
            GitStatus.prototype.files = $util.emptyArray;

            /**
             * Creates a new GitStatus instance using the specified properties.
             * @function create
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {mdc.proto.IGitStatus=} [properties] Properties to set
             * @returns {mdc.proto.GitStatus} GitStatus instance
             */
            GitStatus.create = function create(properties) {
                return new GitStatus(properties);
            };

            /**
             * Encodes the specified GitStatus message. Does not implicitly {@link mdc.proto.GitStatus.verify|verify} messages.
             * @function encode
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {mdc.proto.IGitStatus} message GitStatus message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GitStatus.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.not_added != null && message.not_added.length)
                    for (var i = 0; i < message.not_added.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.not_added[i]);
                if (message.conflicted != null && message.conflicted.length)
                    for (var i = 0; i < message.conflicted.length; ++i)
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.conflicted[i]);
                if (message.created != null && message.created.length)
                    for (var i = 0; i < message.created.length; ++i)
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.created[i]);
                if (message.deleted != null && message.deleted.length)
                    for (var i = 0; i < message.deleted.length; ++i)
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.deleted[i]);
                if (message.modified != null && message.modified.length)
                    for (var i = 0; i < message.modified.length; ++i)
                        writer.uint32(/* id 5, wireType 2 =*/42).string(message.modified[i]);
                if (message.renamed != null && message.renamed.length)
                    for (var i = 0; i < message.renamed.length; ++i)
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.renamed[i]);
                if (message.files != null && message.files.length)
                    for (var i = 0; i < message.files.length; ++i)
                        writer.uint32(/* id 7, wireType 2 =*/58).string(message.files[i]);
                return writer;
            };

            /**
             * Encodes the specified GitStatus message, length delimited. Does not implicitly {@link mdc.proto.GitStatus.verify|verify} messages.
             * @function encodeDelimited
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {mdc.proto.IGitStatus} message GitStatus message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GitStatus.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a GitStatus message from the specified reader or buffer.
             * @function decode
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {mdc.proto.GitStatus} GitStatus
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GitStatus.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.mdc.proto.GitStatus();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        if (!(message.not_added && message.not_added.length))
                            message.not_added = [];
                        message.not_added.push(reader.string());
                        break;
                    case 2:
                        if (!(message.conflicted && message.conflicted.length))
                            message.conflicted = [];
                        message.conflicted.push(reader.string());
                        break;
                    case 3:
                        if (!(message.created && message.created.length))
                            message.created = [];
                        message.created.push(reader.string());
                        break;
                    case 4:
                        if (!(message.deleted && message.deleted.length))
                            message.deleted = [];
                        message.deleted.push(reader.string());
                        break;
                    case 5:
                        if (!(message.modified && message.modified.length))
                            message.modified = [];
                        message.modified.push(reader.string());
                        break;
                    case 6:
                        if (!(message.renamed && message.renamed.length))
                            message.renamed = [];
                        message.renamed.push(reader.string());
                        break;
                    case 7:
                        if (!(message.files && message.files.length))
                            message.files = [];
                        message.files.push(reader.string());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a GitStatus message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {mdc.proto.GitStatus} GitStatus
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GitStatus.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a GitStatus message.
             * @function verify
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            GitStatus.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.not_added != null && message.hasOwnProperty("not_added")) {
                    if (!Array.isArray(message.not_added))
                        return "not_added: array expected";
                    for (var i = 0; i < message.not_added.length; ++i)
                        if (!$util.isString(message.not_added[i]))
                            return "not_added: string[] expected";
                }
                if (message.conflicted != null && message.hasOwnProperty("conflicted")) {
                    if (!Array.isArray(message.conflicted))
                        return "conflicted: array expected";
                    for (var i = 0; i < message.conflicted.length; ++i)
                        if (!$util.isString(message.conflicted[i]))
                            return "conflicted: string[] expected";
                }
                if (message.created != null && message.hasOwnProperty("created")) {
                    if (!Array.isArray(message.created))
                        return "created: array expected";
                    for (var i = 0; i < message.created.length; ++i)
                        if (!$util.isString(message.created[i]))
                            return "created: string[] expected";
                }
                if (message.deleted != null && message.hasOwnProperty("deleted")) {
                    if (!Array.isArray(message.deleted))
                        return "deleted: array expected";
                    for (var i = 0; i < message.deleted.length; ++i)
                        if (!$util.isString(message.deleted[i]))
                            return "deleted: string[] expected";
                }
                if (message.modified != null && message.hasOwnProperty("modified")) {
                    if (!Array.isArray(message.modified))
                        return "modified: array expected";
                    for (var i = 0; i < message.modified.length; ++i)
                        if (!$util.isString(message.modified[i]))
                            return "modified: string[] expected";
                }
                if (message.renamed != null && message.hasOwnProperty("renamed")) {
                    if (!Array.isArray(message.renamed))
                        return "renamed: array expected";
                    for (var i = 0; i < message.renamed.length; ++i)
                        if (!$util.isString(message.renamed[i]))
                            return "renamed: string[] expected";
                }
                if (message.files != null && message.hasOwnProperty("files")) {
                    if (!Array.isArray(message.files))
                        return "files: array expected";
                    for (var i = 0; i < message.files.length; ++i)
                        if (!$util.isString(message.files[i]))
                            return "files: string[] expected";
                }
                return null;
            };

            /**
             * Creates a GitStatus message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {mdc.proto.GitStatus} GitStatus
             */
            GitStatus.fromObject = function fromObject(object) {
                if (object instanceof $root.mdc.proto.GitStatus)
                    return object;
                var message = new $root.mdc.proto.GitStatus();
                if (object.not_added) {
                    if (!Array.isArray(object.not_added))
                        throw TypeError(".mdc.proto.GitStatus.not_added: array expected");
                    message.not_added = [];
                    for (var i = 0; i < object.not_added.length; ++i)
                        message.not_added[i] = String(object.not_added[i]);
                }
                if (object.conflicted) {
                    if (!Array.isArray(object.conflicted))
                        throw TypeError(".mdc.proto.GitStatus.conflicted: array expected");
                    message.conflicted = [];
                    for (var i = 0; i < object.conflicted.length; ++i)
                        message.conflicted[i] = String(object.conflicted[i]);
                }
                if (object.created) {
                    if (!Array.isArray(object.created))
                        throw TypeError(".mdc.proto.GitStatus.created: array expected");
                    message.created = [];
                    for (var i = 0; i < object.created.length; ++i)
                        message.created[i] = String(object.created[i]);
                }
                if (object.deleted) {
                    if (!Array.isArray(object.deleted))
                        throw TypeError(".mdc.proto.GitStatus.deleted: array expected");
                    message.deleted = [];
                    for (var i = 0; i < object.deleted.length; ++i)
                        message.deleted[i] = String(object.deleted[i]);
                }
                if (object.modified) {
                    if (!Array.isArray(object.modified))
                        throw TypeError(".mdc.proto.GitStatus.modified: array expected");
                    message.modified = [];
                    for (var i = 0; i < object.modified.length; ++i)
                        message.modified[i] = String(object.modified[i]);
                }
                if (object.renamed) {
                    if (!Array.isArray(object.renamed))
                        throw TypeError(".mdc.proto.GitStatus.renamed: array expected");
                    message.renamed = [];
                    for (var i = 0; i < object.renamed.length; ++i)
                        message.renamed[i] = String(object.renamed[i]);
                }
                if (object.files) {
                    if (!Array.isArray(object.files))
                        throw TypeError(".mdc.proto.GitStatus.files: array expected");
                    message.files = [];
                    for (var i = 0; i < object.files.length; ++i)
                        message.files[i] = String(object.files[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a GitStatus message. Also converts values to other types if specified.
             * @function toObject
             * @memberof mdc.proto.GitStatus
             * @static
             * @param {mdc.proto.GitStatus} message GitStatus
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            GitStatus.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.arrays || options.defaults) {
                    object.not_added = [];
                    object.conflicted = [];
                    object.created = [];
                    object.deleted = [];
                    object.modified = [];
                    object.renamed = [];
                    object.files = [];
                }
                if (message.not_added && message.not_added.length) {
                    object.not_added = [];
                    for (var j = 0; j < message.not_added.length; ++j)
                        object.not_added[j] = message.not_added[j];
                }
                if (message.conflicted && message.conflicted.length) {
                    object.conflicted = [];
                    for (var j = 0; j < message.conflicted.length; ++j)
                        object.conflicted[j] = message.conflicted[j];
                }
                if (message.created && message.created.length) {
                    object.created = [];
                    for (var j = 0; j < message.created.length; ++j)
                        object.created[j] = message.created[j];
                }
                if (message.deleted && message.deleted.length) {
                    object.deleted = [];
                    for (var j = 0; j < message.deleted.length; ++j)
                        object.deleted[j] = message.deleted[j];
                }
                if (message.modified && message.modified.length) {
                    object.modified = [];
                    for (var j = 0; j < message.modified.length; ++j)
                        object.modified[j] = message.modified[j];
                }
                if (message.renamed && message.renamed.length) {
                    object.renamed = [];
                    for (var j = 0; j < message.renamed.length; ++j)
                        object.renamed[j] = message.renamed[j];
                }
                if (message.files && message.files.length) {
                    object.files = [];
                    for (var j = 0; j < message.files.length; ++j)
                        object.files[j] = message.files[j];
                }
                return object;
            };

            /**
             * Converts this GitStatus to JSON.
             * @function toJSON
             * @memberof mdc.proto.GitStatus
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            GitStatus.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return GitStatus;
        })();

        return proto;
    })();

    return mdc;
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
