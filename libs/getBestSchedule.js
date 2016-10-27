'use strict';

function allPossibleCases(arr) {
  if (arr.length === 0) {
    return [];
  }
  else if (arr.length === 1) {
    return arr[0];
  }
  else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
    for (var c in allCasesOfRest) {
      for (var i = 0; i < arr[0].length; i++) {
        result.push([arr[0][i]].concat(allCasesOfRest[c]));
      }
    }
    return result;
  }

}
let getAllSchedules = classes => {
  let alls = allPossibleCases(classes);
  return alls;
}

let getClassesWanted = (desiredClasses, schedule) => {
  let res = [];
  desiredClasses.forEach(desiredClass => {
    if (schedule[desiredClass.department]
      && schedule[desiredClass.department][desiredClass.classNumber]) {
      res.push(schedule[desiredClass.department][desiredClass.classNumber]);
    }
  })
  return res;
}
let daysOverlap = (m1, m2) => {
  for (let d1 in m1.daysOfWeek) {
    for (let d2 in m2.daysOfWeek) {
      if(m1.daysOfWeek[d1] == m2.daysOfWeek[d2])
        return true;
    }
  }
  return false;
};

let overlap = (a, b) => {
  for (let m1 in a.meeting) {
    for (let m2 in b.meeting) {
      if (daysOverlap(a.meeting[m1], b.meeting[m2])) {
        let m1s = a.meeting[m1].calcTime;
        let m2s = b.meeting[m2].calcTime;
        // check if the start of either time is inbetween the other. If so then they overlap
        if(m1s.end >= m2s.start && m2s.start >= m1s.start || 
           m2s.end >= m1s.start && m1s.start >= m2s.start)
           return true;
      }
    }
  }

  return false;
}
let notConflict = (classes, section) => {
  for (let c in classes) {
    if (overlap(classes[c], section)) {
      return false;
    }
  }
  return true;
}

let convertTimeToNum = (time) => {
  let res;
  if (time.endsWith('am')){
    res = time.replace('am','').replace(':','.') * 1;
  } else {
    res = (time.replace('pm','').replace(':','.') * 1 + 12);
  }
  return res || 0;
}

let getSchedule = (schedule) => {
  let classes = [];
  schedule.forEach(section => {
    if (notConflict(classes, section)) {
      classes.push(section);
    }
  })
  return classes;
}

/**
 * desiredClasses [
 *  {
 *    department
 *    classNumber
 *  }
 * ]
 *  schedule {
 *  department : {classNumber:[sections]}
 * }
 */
let getBestSchedule = (desiredClasses, schedule) => {
  let classes = getClassesWanted(desiredClasses, schedule);
  for (let c in classes) {
    for (let sec in classes[c]){
      for (let m in classes[c][sec].meeting){
        classes[c][sec].meeting[m].calcTime = {
          start: convertTimeToNum(classes[c][sec].meeting[m].startTime),
          end: convertTimeToNum(classes[c][sec].meeting[m].endTime)
        }
      }
    }
  }
  let options = getAllSchedules(classes);
  if(options.length == 0 || !options[0][0]){
    return options.map(o => [o]);
  }
  options = options.map(potentialSchedule => {
    return getSchedule(potentialSchedule);
  })
  options.sort( (a,b) => b.length-a.length);
  return options;
}
module.exports = getBestSchedule;