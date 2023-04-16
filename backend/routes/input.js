var express = require('express');
var router = express.Router();
const spawn = require("child_process").spawn;
router.post('/submit', function (req, res, next) {
    const {test} = req.body;
    console.log(req.body);
    console.log("Here " + test);
    const pythonProcess = spawn('python',['./solver/solver.py', test]);
    pythonProcess.stdout.on('data', function(data) {
        res.send(data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
     });
    
})


module.exports = router;