'use strict';
let getClasses = require('./libs/getClasses');
let getBestSchedule = require('./libs/getBestSchedule');
let fs = require('fs');
let Promise = require('bluebird');

var express = require('express');
var app = express()
// getClasses('C S')
//   .then(res => {

//     console.log(res)
  // })
  // {
  //    department
  //    classNumber
  // }

  let getSchedules = (desiredClasses) => {
    let res = {};
    desiredClasses.forEach(c => {
      if (!res[c.department]){
        res[c.department] = getClasses(c.department);
      }
    })
    return Promise.props(res)
      .then(res => {
        return getBestSchedule(desiredClasses, res);
      })
  }

app.use(express.static(__dirname + '/public'));

app.get('/', (req,res)=> {
  res.sendfile('public/index.html')
})

/**
 * query needs to have a classes array 
 */
app.get('/api/desiredclasses', (req, res) => {
  return getSchedules(JSON.parse(req.query.classes))
    .then(response => {
      res.send(response);
    })
})

app.listen(8080, () => {
  console.log("listening")
})

// let desiredClasses = [
//   {
//     department: 'C S',
//     classNumber: '14k2'
//   },
//   {
//     department: 'C S',
//     classNumber: '22k4'
//   },
//   // {
//   //   department: 'C S',
//   //   classNumber: '2363'
//   // },
//   // {
//   //   department: 'C S',
//   //   classNumber: '235'
//   // },
//   // {
//   //   department: 'C S',
//   //   classNumber: '240'
//   // },
//   // {
//   //   department: 'C S',
//   //   classNumber: '340'
//   // },
//   // {
//   //   department: 'CL CV',
//   //   classNumber: '110'
//   // },
// ]
// getSchedules(desiredClasses)
//   .then(res => {
//    console.log(res) 
//   });
// let classes = { 'C S': JSON.parse(fs.readFileSync('./csclasses.txt'))}
// let j = getBestSchedule(desiredClasses, classes);
// console.log(j)

