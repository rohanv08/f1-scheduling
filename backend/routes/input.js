var express = require('express');
var router = express.Router();
const fs = require("fs");
const {spawn} = require("child_process");
router.post('/submit', function (req, res, next) {
    for (const [key, value] of Object.entries(req.body)) {
        if (key != "start_week" && key != "number_of_races") {
            const data = JSON.stringify(value);
            fs.writeFile(`./solver/${key}.json`, data, (error) => {
                if (error) {
                  console.error(error);
                  throw error;
                }
            });
      }
    }
    const pythonProcess = spawn('python',['./solver/solver.py', req.body.start_week, req.body.number_of_races]);

    pythonProcess.stdout.on('data', function(data) {
        fs.readFile('./solver/solution.json', function read(err, data) {

            if (err) {
                throw err;
            }

            let content = JSON.parse(data);
            res.send(content)
        })
    })
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
      pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
      });
})


module.exports = router;