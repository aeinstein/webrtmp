/*
 *
 * Copyright (C) 2023 itNOX. All Rights Reserved.
 *
 * @author Michael Balen <mb@itnox.de>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import Log from "./utils/logger";

export const loglevels = {
    "RTMPMessage": Log.ERROR,
    "RTMPMessageHandler": Log.WARN,
    "RTMPMediaMessageHandler": Log.ERROR,
    "ChunkParser": Log.WARN,
    "RTMPHandshake": Log.ERROR,
    "Chunk": Log.OFF,
    "MP4Remuxer": Log.ERROR,
    "Transmuxer": Log.WARN,
    "EventEmitter": Log.DEBUG,
    "MSEController": Log.INFO,
    "WebRTMP": Log.DEBUG,
    "WebRTMP_Controller": Log.WARN,
    "WebRTMP Worker": Log.WARN,
    "AMF": Log.WARN
}
