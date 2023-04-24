var express = require('express');
var router = express.Router();
const fs = require("fs");
const spawn = require("child_process").spawn;
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
    pythonProcess.on('exit', function() {
        console.log("EXITED")
        fs.readFile('./solver/solution.json', function read(err, data) {

            if (err) {
                throw err;
            }
            let content = JSON.parse(data);
            console.log(content)
            res.send(content)
        })
    })
})


module.exports = router;