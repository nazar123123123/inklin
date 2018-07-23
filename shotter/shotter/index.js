
const fs = require('fs');
const GIFEncoder = require('gifencoder');
const path = require('path');
const pngFileStream = require('png-file-stream');
const puppeteer = require('puppeteer');
const tempdir = require('tempdir');
const storage = require('azure-storage');
const blobService = storage.createBlobService();
const containerName = '$web';


/* istanbul ignore next */
process.on('unhandledRejection', function (reason, p) {
    throw new Error(reason);
});

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function takeshot(block, context) {
    (async () => {
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            args: ['--allow-running-insecure-content', '--disable-setuid-sandbox', '--no-sandbox',],
        });
        const page = await browser.newPage();
        const workdir = await tempdir();

        page.setViewport({
            width: 1024,
            height: 768,
        });

        console.log(`Navigating to URL: ${block}`);
        await page.goto("http://inkl.in/" + block + "#share");

        await delay(2000);

        process.stdout.write('Taking screenshots: .');
        // const screenshotPromises = [];
        // for (let i = 1; i <= 20; ++i) {
        //     filename = `${workdir}/T${new Date().getTime()}.png`;
        //     process.stdout.write('.');
        //     screenshotPromises.push(page.screenshot({ path: filename, }));
        //     await delay(100);
        // }

        const filename = `./T${new Date().getTime()}.png`
        const shot = await page.screenshot()

         fs.writeFile(filename, new Uint8Array(shot), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(filename);
            console.log("The file was saved!");
            blobService.createBlockBlobFromLocalFile(containerName, `${block}.png`, filename, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Upload of '${block}.png' complete`);
                }
            });
    
        }); 
        

        await delay(2000);
        // await Promise.all(screenshotPromises);
        // console.log(`\nEncoding GIF`);
        // const encoder = new GIFEncoder(1024, 768);
        // await pngFileStream(`${workdir}/T*png`)
        //     .pipe(encoder.createWriteStream({ repeat: 0, delay: 200, quality: 20 }))
        //     .pipe(fs.createWriteStream(`${req.query.block}.gif`));
        await page.close();
        await browser.close();
        
    })();

}


module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.block) {


     blobService.getBlobProperties(
            containerName,
            `${req.query.block}.png`,
            function (err, properties, status) {
                if (status.isSuccessful) {
                    console.log("File exists");

                    context.res =  {
                        status: 302,
                        headers: {
                            Location: `https://inklin.z33.web.core.windows.net/${req.query.block}.png`
                        },
                        body : {}
                    }
                    context.done();
                

                } else {
                    console.log("File doesn't exist");
                    takeshot(req.query.block, context)
                    context.res =  {
                        status: 302,
                        headers: {
                            Location: `https://inklin.z33.web.core.windows.net/${req.query.block}.png`
                        },
                        body : {}
                    }
                    context.done();
                

                }
            });

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
        context.done();
    }
};