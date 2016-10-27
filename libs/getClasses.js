'use strict';
let request = require('superagent-bluebird-promise');
let moment = require('moment');

let getTime

let groupClasses = (classList) => {
  let res = {};
  classList.forEach(section => {
    res[section.classNumber] = res[section.classNumber] || []
    res[section.classNumber].push(section)
  })
  return res;
}
let getDaysOfWeek = input => {
  let res = []
  if (input.startsWith('M')){
    res.push('M')
    input = input.slice(1)
  }
  if (input.startsWith('T') && !input.startsWith('Th')){
    res.push('T')
    input = input.slice(1)
  }
  if (input.startsWith('W')){
    res.push('W');
    input = input.slice(1)
  }
  if (input.startsWith('Th')){
    res.push('Th');
    input = input.slice(2)
  }
  if (input.startsWith('F')){
    res.push('F');
    input = input.slice(1);
  }
  if (input != ''){
    res.push(input);
  }
  return res;
}
let getMeetings = (infoArray) => {
  infoArray = infoArray.map(node => {
    node = node.split('<br>');
    node.pop();
    return node;
  })
  let res = [];
  for (var i = 0; i < infoArray[0].length; i++) {
    res.push({
      daysOfWeek: getDaysOfWeek(infoArray[0][i]),
      startTime: infoArray[1][i],
      endTime: infoArray[2][i],
      location: infoArray[3][i]
    })
  }
  return res;
}
let splitIntoClasses = (rawText) => {
  let classes = [];
  let resp = rawText.split('#');
  for (var i = 0; i + 18 < resp.length; i += 19) {
    var node = resp.slice(i, i + 19);

    classes.push({
      department: node[2],
      classNumber: node[4],
      title: node[9],
      instructor: node[10],
      credits: node[11],
      seatsAvail: node[17],
      waitlist: node[18],
      meeting: getMeetings(node.slice(12, 16))
    })
  }
  return classes;
}
let getClasses = (department) => {
  return request.post('http://saasta.byu.edu/noauth/classSchedule/ajax/searchXML.php')
    // .set('Content-Type', 'application/json')
    .send(
    `SEMESTER=20171&CREDIT_TYPE=A&DEPT=${department || ''}&INST=&DESCRIPTION=&DAYFILTER=&BEGINTIME=&ENDTIME=&SECTION_TYPE=&CREDITS=&CREDITCOMP=&CATFILTER=&BLDG=`
    )
    .then(res => {
      return groupClasses(splitIntoClasses(res.text));
    })
    // .catch(err => {
    //   console.log(err);
    // })
}
// SEMESTER=20171&CREDIT_TYPE=A&DEPT=C+S&INST=&DESCRIPTION=&DAYFILTER=&BEGINTIME=&ENDTIME=&SECTION_TYPE=&CREDITS=&CREDITCOMP=&CATFILTER=&BLDG=
// getClasses('C S')
//   .then(res => {
//     console.log(res)
//   })
module.exports = getClasses;