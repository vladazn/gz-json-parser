import fs from 'fs';
import zlib from 'zlib';
import http from 'http';

function downloadAndParseGzJson () {
    return new Promise((res) => {
        try {
            const out = fs.createWriteStream(`${DOWNLOAD_PATH}/feed.json`);
            const gzip = zlib.createGunzip();
            const chunkData = [];
            gzip.on("error", (e) => {
                console.error("gzip.on err => ", e);
                res(null);
            });
            gzip.on("data", (chunk) => {
                chunkData.push(chunk);
            });
            out.on("error", (e) => {
                console.error("out.on err => ", e);
                res(null);
            });
            out.on("finish", () => {
                try {
                    const rawData = JSON.parse(Buffer.concat(chunkData));
                    res(rawData);
                    // console.table(rawData.S[0].C[0].L[0].E);
                } catch (e) {
                    console.error("finishErr");
                    res(null);
                }
            });

            http.get(
                SOURCE_URL,
                (response) => {
                    response.pipe(gzip).pipe(out);
                }
            );
        } catch (e) {
            console.error("downloadFeedData err => ", e);
            res(null);
        }
    })
}


