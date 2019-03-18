const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);
  return dd;
}

const dateList = date => {
  const month = date.getMonth() + 1
  const today = date.getDate()
  const day = date.getDay()
  let n = day;
  let list = [];
  let j = n;
  for(let i = 0; i < 21; i++) {
    if(j > 0) {
      list.push(getDateStr(-j));
      j--;
    }else {
      list.push(getDateStr(i-n))
    }
  }
  // console.log(list);
  return list;
}

module.exports = {
  formatTime: formatTime,
  dateList: dateList
}
