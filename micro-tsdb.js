/****************************************************************************
 ███╗   ███╗██╗ ██████╗██████╗  ██████╗     ████████╗███████╗██████╗ ██████╗ 
 ████╗ ████║██║██╔════╝██╔══██╗██╔═══██╗    ╚══██╔══╝██╔════╝██╔══██╗██╔══██╗
 ██╔████╔██║██║██║     ██████╔╝██║   ██║       ██║   ███████╗██║  ██║██████╔╝
 ██║╚██╔╝██║██║██║     ██╔══██╗██║   ██║       ██║   ╚════██║██║  ██║██╔══██╗
 ██║ ╚═╝ ██║██║╚██████╗██║  ██║╚██████╔╝       ██║   ███████║██████╔╝██████╔╝
 ╚═╝     ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝        ╚═╝   ╚══════╝╚═════╝ ╚═════╝ 
                                                                             
*****************************************************************************/
const path  = require('path');
const fs    = require('fs');

// Intl.DateTimeFormat default option
const dateTimeFormatOption = Object.freeze({
    'timeZone' : 'Asia/Seoul',
    'hour12'   : false,
    'year'     : 'numeric',
    'month'    : '2-digit',
    'day'      : '2-digit',
    'hour'     : '2-digit',
    'minute'   : '2-digit',
    'second'   : '2-digit',
    'fractionalSecondDigits': 3,
});

// Micro TSDB, Time Series Database
module.exports = (() => {
    const tagMap        = new Map();
    let dtfo            = { ...dateTimeFormatOption };
    // Intl.DateTimeFormat, Timezone
    let dateTimeFormat  = new Intl.DateTimeFormat('ko-KR', dtfo);
    const setTimezone   = (timezone = 'Asia/Seoul') => {
        dtfo.timeZone   = timezone;
        dateTimeFormat  = new Intl.DateTimeFormat('ko-KR', dtfo);
    };
    // datetime
    const getDateTime   = (now = new Date()) => dateTimeFormat.format(now);
    const getExtDate    = (dt = getDateTime()) => dt.substring(0, 12).replace(/\.| /gi, '');
    const getExtTime    = (dt = getDateTime()) => dt.substring(14).replace(/:|\./gi, '');
    // path
    const getDataPath   = (dataName) => path.join(__dirname, dataName);
    const getTagPath    = (dataPath, tagName) => path.join(dataPath, tagName);
    const getDatePath   = (tagPath, extDate) => path.join(tagPath, extDate);
    // file list and directory
    const getFileList   = (dirPath) => fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
    const mkDir         = (dirPath) => fs.existsSync(dirPath) || fs.mkdirSync(dirPath);
    // /Desktop/works/src/tsdb/.data
    const dataPath      = getDataPath('.data');
    mkDir(dataPath);

    // tag selector
    const getTagByName  = (tagName) => {
        // /Desktop/works/src/tsdb/.data/tagA
        const tagPath   = getTagPath(dataPath, tagName);
        mkDir(tagPath);

        // 20221030
        let extDate     = getExtDate();
        let infd        = fs.openSync(getDatePath(tagPath, extDate), 'a');
        // /Desktop/works/src/tsdb/.data/tagA/20221030
        const dataIn    = (val) => {
            if(extDate != getExtDate()) {
                fs.closeSync(infd);
                extDate = getExtDate();
                infd    = fs.openSync(getDatePath(tagPath, extDate), 'a');
            }
            // 181813157
						const extTime   = getExtTime();
            const obj       = { 't' : `${extDate}${extTime}`, 'v' : val };
            const data      = JSON.stringify(obj);
            fs.writeSync(infd, `${data}\n`);
        };

        // /Desktop/works/src/tsdb/.data/tagA/begin ~ end
        const dataOut   = (begin = getExtDate(), end = getExtDate()) => {
            const objs      = [];
            const dateFiles = getFileList(tagPath);
            const targets   = dateFiles.filter((val) => begin <= val && end >= val);
            targets.forEach((date) => {
                const datePath  = getDatePath(tagPath, date);
                const lines     = fs.readFileSync(datePath).toString().split('\n');
                lines.pop();    // last item empty
                lines.forEach((line) => objs.push(JSON.parse(line)));
            });

            return objs;
        };

        return {
            'in'  : (val) => dataIn(val),
            'out' : (begin, end) => dataOut(begin, end),
            'name': tagName,
            'path': tagPath
        };
    };

    // init tag list
    getFileList(dataPath).forEach((nm) => tagMap.get(nm) || tagMap.set(nm, getTagByName(nm)));

    return {
        'get' : (name) => tagMap.get(name) || tagMap.set(name, getTagByName(name)).get(name),
        'tz'  : (timeZone) => setTimezone(timeZone),
        'path': dataPath,
        'tags': tagMap,
    };
})();
